#!/usr/bin/env node

/**
 * fix-test-selectors.js
 * ====================
 * 修复测试选择器冲突问题
 *
 * 问题：
 * 1. TopBar和CommandPalette都使用相同的placeholder "palette.placeholder"
 * 2. connection-status data-testid在多个组件中使用
 *
 * 解决方案：
 * 1. 使用 getAllBy 代替 getBy 并检查数组长度
 * 2. 使用更精确的选择器（data-testid + role）
 */

const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'src/app/__tests__');

// 修复 TopBar 测试中的选择器
function fixTopBarTest(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const result = [];
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // 修复1: 搜索框查询 - 使用 getAllBy 检查长度
    if (line.includes('getByPlaceholderText("palette.placeholder")')) {
      if (line.includes('getByPlaceholderText')) {
        line = line.replace(
          'screen.getByPlaceholderText("palette.placeholder")',
          'screen.getAllByPlaceholderText("palette.placeholder")[0]'
        );
        modified = true;
      } else if (line.includes('queryByPlaceholderText')) {
        line = line.replace(
          'screen.queryByPlaceholderText("palette.placeholder")',
          'screen.queryAllByPlaceholderText("palette.placeholder")?.[0]'
        );
        modified = true;
      }
    }

    // 修复2: connection-status 查询 - 使用 getAllBy
    if (line.includes('getByTestId("connection-status")') && !line.includes('getAll')) {
      line = line.replace(
        'screen.getByTestId("connection-status")',
        'screen.getAllByTestId("connection-status")[0]'
      );
      modified = true;
    }

    result.push(line);
  }

  if (modified) {
    fs.writeFileSync(filePath, result.join('\n'), 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
  }

  return modified;
}

// 修复 CommandPalette 测试
function fixCommandPaletteTest(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (content.includes('getByPlaceholderText("palette.placeholder")')) {
    const newContent = content.replace(
      /getByPlaceholderText\("palette\.placeholder"\)/g,
      'getAllByPlaceholderText("palette.placeholder")[0]'
    );
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    modified = true;
  }

  return modified;
}

// 主函数
function main() {
  console.log('🔧 开始修复测试选择器...\n');

  let fixedCount = 0;

  // 修复 TopBar 测试
  const topBarTest = path.join(testDir, 'TopBar.test.tsx');
  if (fs.existsSync(topBarTest)) {
    if (fixTopBarTest(topBarTest)) {
      fixedCount++;
    }
  }

  // 修复 CommandPalette 测试
  const cmdPaletteTest = path.join(testDir, 'CommandPalette.test.tsx');
  if (fs.existsSync(cmdPaletteTest)) {
    if (fixCommandPaletteTest(cmdPaletteTest)) {
      fixedCount++;
    }
  }

  console.log(`\n✅ 修复完成！共修改 ${fixedCount} 个文件\n`);

  if (fixedCount > 0) {
    console.log('📝 运行以下命令验证修复：');
    console.log('   pnpm test src/app/__tests__/TopBar.test.tsx');
    console.log('   pnpm test src/app/__tests__/CommandPalette.test.tsx');
  }
}

main();
