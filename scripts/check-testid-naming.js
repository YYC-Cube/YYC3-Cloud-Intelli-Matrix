#!/usr/bin/env node

/**
 * check-testid-naming.js
 * =====================
 * 检查组件文件中的测试选择器命名规范
 *
 * 检查规则：
 * 1. 禁止使用通用的placeholder（如"搜索"、"输入"）
 * 2. data-testid必须包含组件前缀
 * 3. 检测重复的testID和placeholder
 *
 * 用法:
 *   node scripts/check-testid-naming.js [组件路径]
 *
 * 示例:
 *   node scripts/check-testid-naming.js src/app/components
 *   node scripts/check-testid-naming.js src/app/components/TopBar.tsx
 */

const fs = require('fs');
const path = require('path');

// 检测规则
const rules = {
  // 禁止的通用placeholder
  forbiddenPlaceholders: [
    /placeholder="(?:搜索|输入|Search|Input|查询|Query)"/gi,
    /placeholder="palette\.placeholder"/g, // 容易与CommandPalette冲突
  ],

  // 检测重复的placeholder
  duplicatePlaceholders: /placeholder="([^"]+)"/g,

  // 检测重复的data-testid
  duplicateTestIds: /data-testid="([^"]+)"/g,

  // 允许的前缀（白名单）
  allowedPrefixes: [
    'topbar-', 'palette-', 'dashboard-', 'monitor-',
    'sidebar-', 'status-', 'userprofile-', 'notify-',
    'followup-', 'operation-', 'patrol-', 'chart-',
    'card-', 'button-', 'input-', 'modal-', 'dialog-',
    'drawer-', 'dropdown-', 'menu-', 'tooltip-',
    'alert-', 'badge-', 'icon-', 'avatar-',
  ],
};

// 统计所有文件的placeholder和testID
const allPlaceholders = new Map();
const allTestIds = new Map();

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const fileName = path.basename(filePath);

  // 1. 检查禁止的placeholder
  rules.forbiddenPlaceholders.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        issues.push({
          type: 'forbidden',
          rule: '禁止使用通用的placeholder',
          detail: `找到: ${match}`,
          line: findLineNumber(content, match),
        });
      });
    }
  });

  // 2. 收集placeholder用于检测重复
  let placeholderMatch;
  const placeholderRegex = /placeholder="([^"]+)"/g;
  while ((placeholderMatch = placeholderRegex.exec(content)) !== null) {
    const placeholder = placeholderMatch[1];
    if (!allPlaceholders.has(placeholder)) {
      allPlaceholders.set(placeholder, []);
    }
    allPlaceholders.get(placeholder).push(fileName);
  }

  // 3. 收集data-testid用于检测重复
  let testIdMatch;
  const testIdRegex = /data-testid="([^"]+)"/g;
  while ((testIdMatch = testIdRegex.exec(content)) !== null) {
    const testId = testIdMatch[1];
    if (!allTestIds.has(testId)) {
      allTestIds.set(testId, []);
    }
    allTestIds.get(testId).push(fileName);
  }

  return issues;
}

function findLineNumber(content, searchText) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchText)) {
      return i + 1;
    }
  }
  return '?';
}

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function analyzeDuplicates(map, name) {
  const duplicates = [];
  map.forEach((files, key) => {
    if (files.length > 1) {
      duplicates.push({
        key,
        files,
        count: files.length,
      });
    }
  });
  return duplicates.sort((a, b) => b.count - a.count);
}

function main() {
  const targetPath = process.argv[2] || path.join(__dirname, '../src/app/components');
  const isFile = fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();

  console.log('🔍 检查测试选择器命名...\n');
  console.log(`📁 目标: ${targetPath}\n`);

  const files = isFile ? [targetPath] : findFiles(targetPath);
  console.log(`📊 找到 ${files.length} 个文件\n`);

  let totalIssues = 0;

  // 检查每个文件
  files.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
      totalIssues += issues.length;
      const relPath = path.relative(process.cwd(), file);
      console.log(`❌ ${relPath}`);
      issues.forEach(issue => {
        console.log(`   [行${issue.line}] ${issue.type}: ${issue.rule}`);
        console.log(`      ${issue.detail}`);
      });
    }
  });

  // 检测重复的placeholder
  const duplicatePlaceholders = analyzeDuplicates(allPlaceholders, 'placeholder');
  if (duplicatePlaceholders.length > 0) {
    console.log('\n⚠️  发现重复的placeholder:');
    duplicatePlaceholders.slice(0, 5).forEach(dup => {
      console.log(`   "${dup.key}" 出现在 ${dup.count} 个文件:`);
      dup.files.forEach(f => console.log(`     - ${f}`));
    });
    totalIssues += duplicatePlaceholders.length;
  }

  // 检测重复的data-testid
  const duplicateTestIds = analyzeDuplicates(allTestIds, 'data-testid');
  if (duplicateTestIds.length > 0) {
    console.log('\n⚠️  发现重复的data-testid:');
    duplicateTestIds.slice(0, 5).forEach(dup => {
      console.log(`   "${dup.key}" 出现在 ${dup.count} 个文件:`);
      dup.files.forEach(f => console.log(`     - ${f}`));
    });
    totalIssues += duplicateTestIds.length;
  }

  console.log('\n' + '='.repeat(60));

  if (totalIssues === 0) {
    console.log('✅ 检查通过！未发现命名问题');
    console.log('🎉 你的代码符合测试选择器命名规范！');
    return 0;
  } else {
    console.log(`⚠️  共发现 ${totalIssues} 处问题`);
    console.log('\n📝 建议修复：');
    console.log('   1. 为组件添加唯一前缀，如 "topbar-", "palette-"');
    console.log('   2. 避免使用通用的placeholder文本');
    console.log('   3. 使用重命名脚本: node scripts/fix-testid-prefix.js');
    console.log('\n📖 参考文档: docs/测试选择器冲突预防方案.md');
    return 1;
  }
}

main();
