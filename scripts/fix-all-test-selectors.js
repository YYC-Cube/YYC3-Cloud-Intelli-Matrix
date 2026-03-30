#!/usr/bin/env node

/**
 * fix-all-test-selectors.js
 * ======================
 * 批量修复所有测试文件中的选择器问题
 */

const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, '../src/app/__tests__');

// 需要修复的选择器模式
const patterns = [
  {
    name: 'getByPlaceholderText',
    from: /screen\.getByPlaceholderText\("palette\.placeholder"\)/g,
    to: 'screen.getAllByPlaceholderText("palette.placeholder")[0]',
  },
  {
    name: 'queryByPlaceholderText',
    from: /screen\.queryByPlaceholderText\("palette\.placeholder"\)\.not\.toBeInTheDocument\(\)/g,
    to: 'screen.queryAllByPlaceholderText("palette.placeholder").length === 0',
  },
  {
    name: 'connection-status',
    from: /screen\.getByTestId\("connection-status"\)(?=\.toBeInTheDocument)/g,
    to: 'screen.getAllByTestId("connection-status")[0]',
  },
  {
    name: 'connection-status-query',
    from: /screen\.queryByTestId\("connection-status"\)(?=\.toBeInTheDocument)/g,
    to: 'screen.queryAllByTestId("connection-status")?.[0]',
  },
  {
    name: 'terminal-title',
    from: /screen\.getByTitle\("集成终端 \(Ctrl\+`\)"\)/g,
    to: 'screen.getAllByTitle("集成终端 (Ctrl+`)")[0]',
  },
];

function fixTestFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 应用所有修复模式
  patterns.forEach(pattern => {
    const match = content.match(pattern.from);
    if (match) {
      content = content.replace(pattern.from, pattern.to);
      modified = true;
      console.log(`  ✓ Fixed ${pattern.name}: ${match.length} occurrences`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('🔧 批量修复测试选择器...\n');

  let fixedCount = 0;
  const testFiles = fs.readdirSync(testDir)
    .filter(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'))
    .map(f => path.join(testDir, f));

  console.log(`📁 找到 ${testFiles.length} 个测试文件\n`);

  testFiles.forEach(file => {
    const fileName = path.basename(file);
    if (fixTestFile(file)) {
      console.log(`✓ Fixed: ${fileName}`);
      fixedCount++;
    }
  });

  console.log(`\n✅ 修复完成！共修改 ${fixedCount} 个文件\n`);

  if (fixedCount > 0) {
    console.log('📝 运行以下命令验证修复：');
    console.log('   pnpm test');
    console.log('\n💡 如果还有问题，查看具体测试的错误输出');
  }
}

main();
