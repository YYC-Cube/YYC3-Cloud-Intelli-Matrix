#!/usr/bin/env node

/**
 * fix-testid-prefix.js
 * ===================
 * 自动为组件添加唯一前缀
 *
 * 功能:
 * 1. 自动为data-testid添加组件前缀
 * 2. 自动为placeholder添加组件前缀
 * 3. 生成修改报告
 *
 * 用法:
 *   node scripts/fix-testid-prefix.js <组件名> <文件路径>
 *
 * 示例:
 *   node scripts/fix-testid-prefix.js TopBar src/app/components/TopBar.tsx
 *   node scripts/fix-testid-prefix.js CommandPalette src/app/components/CommandPalette.tsx
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const componentName = process.argv[2];
const filePath = process.argv[3];

if (!componentName || !filePath) {
  console.log('❌ 缺少参数\n');
  console.log('用法: node scripts/fix-testid-prefix.js <组件名> <文件路径>\n');
  console.log('示例:');
  console.log('  node scripts/fix-testid-prefix.js TopBar src/app/components/TopBar.tsx');
  console.log('  node scripts/fix-testid-prefix.js CommandPalette src/app/components/CommandPalette.tsx\n');
  process.exit(1);
}

// 生成前缀（组件名转小写）
const prefix = componentName.toLowerCase();

// 不需要添加前缀的模式（已经有前缀的）
const alreadyPrefixedPatterns = [
  /^topbar-/,
  /^palette-/,
  /^dashboard-/,
  /^monitor-/,
  /^sidebar-/,
  /^status-/,
  /^userprofile-/,
  /^notify-/,
  /^followup-/,
  /^operation-/,
  /^patrol-/,
  /^chart-/,
  /^card-/,
  /^button-/,
  /^input-/,
  /^modal-/,
  /^dialog-/,
  /^drawer-/,
  /^dropdown-/,
  /^menu-/,
  /^tooltip-/,
  /^alert-/,
  /^badge-/,
  /^icon-/,
  /^avatar-/,
  /^connection-/,
];

// 已经有组件前缀的placeholder（跳过）
const alreadyPrefixedPlaceholders = [
  /\.search\.placeholder$/,
  /\.filter\.placeholder$/,
  /\.input\.placeholder$/,
  /^topbar\./,
  /^palette\./,
  /^dashboard\./,
  /^monitor\./,
  /^sidebar\./,
  /^userprofile\./,
];

function fixTestIds(content) {
  const changes = [];

  // 修复 data-testid
  const testIdPattern = /data-testid="([^"]*)"/g;
  content = content.replace(testIdPattern, (match, testid) => {
    // 如果已经有前缀，跳过
    if (alreadyPrefixedPatterns.some(pattern => pattern.test(testid))) {
      return match;
    }

    // 添加前缀
    const newTestId = `${prefix}-${testid}`;
    changes.push({
      type: 'data-testid',
      old: testid,
      new: newTestId,
    });
    return `data-testid="${newTestId}"`;
  });

  // 修复 placeholder
  const placeholderPattern = /placeholder="([^"]*)"/g;
  content = content.replace(placeholderPattern, (match, placeholder) => {
    // 如果已经有前缀，跳过
    if (alreadyPrefixedPlaceholders.some(pattern => pattern.test(placeholder))) {
      return match;
    }

    // 添加前缀
    const newPlaceholder = `${prefix}.search.placeholder`;
    changes.push({
      type: 'placeholder',
      old: placeholder,
      new: newPlaceholder,
    });
    return `placeholder="${newPlaceholder}"`;
  });

  return { content, changes };
}

function generateReport(componentName, prefix, changes) {
  console.log('\n📋 修改报告:');
  console.log(`   组件名: ${componentName}`);
  console.log(`   前缀: ${prefix}-\n`);

  if (changes.length === 0) {
    console.log('   ✅ 无需修改，文件已符合规范\n');
    return;
  }

  console.log(`   📝 共修改 ${changes.length} 处:\n`);

  // 按类型分组
  const byType = changes.reduce((acc, change) => {
    if (!acc[change.type]) {
      acc[change.type] = [];
    }
    acc[change.type].push(change);
    return acc;
  }, {});

  Object.entries(byType).forEach(([type, items]) => {
    console.log(`   ${type}:`);
    items.slice(0, 10).forEach(item => {
      console.log(`      "${item.old}" → "${item.new}"`);
    });
    if (items.length > 10) {
      console.log(`      ... 还有 ${items.length - 10} 处`);
    }
  });

  console.log(`\n   💡 提示:`);
  console.log(`      记得同步更新测试文件中的选择器！`);
  console.log(`      例如: screen.getByPlaceholderText("${prefix}.search.placeholder")\n`);
}

function main() {
  console.log('🔧 开始修复测试选择器前缀...\n');

  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filePath}\n`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const { content: newContent, changes } = fixTestIds(content);

  if (content === newContent) {
    console.log('✅ 无需修改: 文件已符合规范\n');
    console.log(`   文件: ${filePath}`);
    console.log(`   组件: ${componentName}\n`);
    process.exit(0);
  }

  // 写入修改后的内容
  fs.writeFileSync(filePath, newContent, 'utf8');

  // 生成报告
  generateReport(componentName, prefix, changes);

  console.log(`✅ 已修复: ${path.relative(process.cwd(), filePath)}\n`);

  // 提示下一步操作
  console.log('📝 下一步操作:');
  console.log('   1. 检查组件文件，确认修改正确');
  console.log('   2. 更新相关测试文件');
  console.log(`   3. 运行测试: pnpm test\n`);

  console.log('💡 常用命令:');
  console.log(`   - 检查所有组件: node scripts/check-testid-naming.js`);
  console.log(`   - 批量修复: for file in src/app/components/*.tsx; do node scripts/fix-testid-prefix.js $(basename $file .tsx) $file; done\n`);
}

main();
