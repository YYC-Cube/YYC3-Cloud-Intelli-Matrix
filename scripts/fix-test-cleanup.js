#!/usr/bin/env node
/**
 * fix-test-cleanup.js
 * ===================
 * 批量修复测试文件，添加 afterEach cleanup
 *
 * 问题：很多测试文件没有 afterEach(cleanup())，导致 DOM 污染
 * 解决：自动添加 afterEach(cleanup()) 到所有测试文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.dirname(__dirname);
const TEST_DIR = path.join(PROJECT_ROOT, 'src/app/__tests__');

// 需要跳过的文件（已经有 cleanup 或不需要）
const SKIP_FILES = new Set([
  'setup.ts',
  'test-utils.ts',
  'integration.test.ts',  // 集成测试特殊处理
]);

// 检查文件是否需要修复
function needsFix(content) {
  // 已经有 afterEach(cleanup) 或 afterEach(() => { cleanup()
  if (/afterEach\s*\(\s*cleanup\s*\)/.test(content) ||
      /afterEach\s*\(\s*\(\)\s*=>\s*\{\s*cleanup\s*\(\)/.test(content)) {
    return false;
  }

  // 有 describe 或 it，但没有 afterEach cleanup
  return (/\bdescribe\s*\(/.test(content) || /\bit\s*\(/.test(content));
}

// 修复文件内容
function fixFile(content) {
  // 1. 确保导入了 cleanup
  let newContent = content;

  // 检查是否导入了 cleanup
  if (!/@testing-library\/react/.test(newContent)) {
    // 如果没有导入 @testing-library/react，不需要处理
    return content;
  }

  if (newContent.includes('cleanup') &&
      /import.*cleanup.*from.*@testing-library\/react/.test(newContent)) {
    // 已经导入了 cleanup
  } else {
    // 需要添加 cleanup 导入
    // 找到 render, screen, fireEvent 的导入行
    const importMatch = newContent.match(
      /import\s+{\s*([^}]+)\s*}\s+from\s+["']@testing-library\/react["']/
    );

    if (importMatch) {
      const imports = importMatch[1];
      if (!imports.includes('cleanup')) {
        const newImports = imports.trim() + ', cleanup';
        newContent = newContent.replace(
          /import\s+{\s*([^}]+)\s*}\s+from\s+["']@testing-library\/react["']/,
          `import { ${newImports} } from "@testing-library/react"`
        );
      }
    }
  }

  // 2. 添加 afterEach(cleanup())
  // 查找 beforeEach 块，在其后添加 afterEach
  const describeMatch = newContent.match(
    /describe\s*\([^)]+\)\s*,\s*\(\s*\(\)\s*=>\s*\{([\s\S]*?)\n\s*\}\s*\)/
  );

  if (describeMatch) {
    const describeBody = describeMatch[1];

    // 检查是否已经有 beforeEach
    const hasBeforeEach = /beforeEach\s*\(/.test(describeBody);

    if (hasBeforeEach) {
      // 在 beforeEach 后添加 afterEach
      const newDescribeBody = describeBody.replace(
        /(\}\s*;\s*\n)\s*(\/\/)/,
        '\n\n  afterEach(() => {\n    cleanup();\n  });\n\n  $2'
      );

      // 如果没有找到注释位置，在 describe body 结束前添加
      if (newDescribeBody === describeBody) {
        const newBody = describeBody.replace(
          /(\}\s*;\s*)$/,
          '\n\n  afterEach(() => {\n    cleanup();\n  });$1'
        );
        newContent = newContent.replace(
          describeMatch[0],
          newContent.replace(describeBody, newBody)
        );
      } else {
        newContent = newContent.replace(
          describeMatch[0],
          newContent.replace(describeBody, newDescribeBody)
        );
      }
    } else {
      // 没有 beforeEach，在 describe body 开始处添加 afterEach
      const newBody = describeBody.replace(
        /^(\s*)/,
        '$1afterEach(() => {\n    cleanup();\n  });\n\n  '
      );
      newContent = newContent.replace(
        describeMatch[0],
        newContent.replace(describeBody, newBody)
      );
    }
  }

  return newContent;
}

// 主函数
function main() {
  const files = fs.readdirSync(TEST_DIR)
    .filter(f => f.endsWith('.test.ts') || f.endsWith('.test.tsx'))
    .filter(f => !SKIP_FILES.has(f));

  let fixedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const filePath = path.join(TEST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    if (needsFix(content)) {
      const fixedContent = fixFile(content);

      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8');
        console.log(`✅ 修复: ${file}`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    } else {
      skippedCount++;
    }
  }

  console.log(`\n总结:`);
  console.log(`  修复文件: ${fixedCount}`);
  console.log(`  跳过文件: ${skippedCount}`);
}

main();
