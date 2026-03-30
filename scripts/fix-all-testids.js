#!/usr/bin/env node

/**
 * fix-all-testids.js
 * ==================
 * 批量修复所有组件的测试选择器前缀
 *
 * 功能:
 * 1. 自动识别组件名
 * 2. 为每个组件添加唯一前缀
 * 3. 生成总报告
 *
 * 用法:
 *   node scripts/fix-all-testids.js [组件目录]
 *
 * 示例:
 *   node scripts/fix-all-testids.js
 *   node scripts/fix-all-testids.js src/app/components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = process.argv[2] || path.join(__dirname, '../src/app/components');

function findComponentFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findComponentFiles(fullPath));
    } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.spec.')) {
      files.push(fullPath);
    }
  });

  return files;
}

function getComponentName(filePath) {
  const fileName = path.basename(filePath, '.tsx');
  return fileName;
}

function main() {
  console.log('🚀 批量修复测试选择器前缀\n');
  console.log(`📁 目标目录: ${targetDir}\n`);

  const files = findComponentFiles(targetDir);
  console.log(`📊 找到 ${files.length} 个组件文件\n`);

  if (files.length === 0) {
    console.log('⚠️  未找到组件文件\n');
    process.exit(0);
  }

  console.log('开始处理...\n');

  let fixedCount = 0;
  let skippedCount = 0;
  const failedFiles = [];

  files.forEach(file => {
    const componentName = getComponentName(file);
    const relPath = path.relative(process.cwd(), file);

    try {
      // 调用fix-testid-prefix.js修复单个文件
      execSync(
        `node scripts/fix-testid-prefix.js ${componentName} ${file}`,
        { stdio: 'pipe', encoding: 'utf-8' }
      );

      const output = execSync(
        `node scripts/fix-testid-prefix.js ${componentName} ${file}`,
        { stdio: 'pipe', encoding: 'utf-8' }
      );

      if (output.includes('无需修改')) {
        skippedCount++;
      } else {
        fixedCount++;
        console.log(`✅ ${relPath}`);
      }
    } catch (error) {
      failedFiles.push({ file: relPath, error: error.message });
      console.log(`❌ ${relPath}`);
      console.log(`   ${error.message}\n`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 修复完成统计:\n');
  console.log(`   ✅ 已修复: ${fixedCount} 个文件`);
  console.log(`   ⏭️  已跳过: ${skippedCount} 个文件`);
  console.log(`   ❌ 失败: ${failedFiles.length} 个文件`);

  if (failedFiles.length > 0) {
    console.log('\n❌ 失败的文件:');
    failedFiles.forEach(f => {
      console.log(`   - ${f.file}`);
      console.log(`     ${f.error}`);
    });
  }

  console.log('\n📝 下一步操作:');
  console.log('   1. 检查修复后的文件，确认修改正确');
  console.log('   2. 更新相关测试文件');
  console.log('   3. 运行测试: pnpm test');
  console.log('   4. 运行检查: pnpm check:testid\n');

  console.log('💡 提示:');
  console.log('   - 某些组件可能手动调整前缀');
  console.log('   - 测试文件需要同步更新选择器');
  console.log('   - 参考: docs/测试选择器冲突预防方案.md\n');

  if (fixedCount > 0) {
    console.log('🎉 已成功修复 ' + fixedCount + ' 个组件！');
  }
}

main();
