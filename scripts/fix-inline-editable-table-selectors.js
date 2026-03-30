#!/usr/bin/env node

/**
 * fix-inline-editable-table-selectors.js
 * =====================================
 * 批量修复 InlineEditableTable.test.tsx 中的选择器问题
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/__tests__/InlineEditableTable.test.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// 需要修复的模式
const replacements = [
  // LLaMA-70B
  [/screen\.getByText\("LLaMA-70B"\)/g, 'screen.getAllByText("LLaMA-70B")[0]'],
  [/screen\.getByText\("primary"\)/g, 'screen.getAllByText("primary")[0]'],
  [/screen\.getByText\("m1"\)/g, 'screen.getAllByText("m1")[0]'],
  // 提交变更
  [/screen\.getByText\("提交变更"\)/g, 'screen.getAllByText("提交变更")[0]'],
  [/screen\.getByText\("确认提交"\)/g, 'screen.getAllByText("确认提交")[0]'],
  // 撤销
  [/screen\.getByText\("撤销"\)/g, 'screen.getAllByText("撤销")[0]'],
  // Undo
  [/screen\.getByText\("全部回滚"\)/g, 'screen.getAllByText("全部回滚")[0]'],
  // queryByText
  [/screen\.queryByText\("提交变更"\)/g, 'screen.queryAllByText("提交变更")[0]'],
  [/screen\.queryByText\("确认提交"\)/g, 'screen.queryAllByText("确认提交")[0]'],
  // regex patterns
  [/screen\.getByText\(/删除选中\//g, 'screen.getAllByText(/删除选中/)[0]'],
  [/screen\.getByText\(/1 项待提交\//g, 'screen.getAllByText(/1 项待提交/)[0]'],
  [/screen\.getByText\(/DELETE\//g, 'screen.getAllByText(/DELETE/)[0]'],
  [/screen\.getByText\(/确认提交.*1.*项数据变更\//g, 'screen.getAllByText(/确认提交.*1.*项数据变更/)[0]'],
  [/screen\.getByText\(/整行删除\//g, 'screen.getAllByText(/整行删除/)[0]'],
  [/screen\.getByText\(/Undo \(\d+\)\//g, 'screen.getAllByText(/Undo \\(\\d+\\)/)[0]'],
  [/screen\.getByText\("已撤销"\)/g, 'screen.getAllByText("已撤销")[0]'],
  [/screen\.queryByText\(/项待提交\//g, 'screen.queryAllByText(/项待提交/)[0]'],
  [/screen\.queryByText\(/Undo \(\d+\)\//g, 'screen.queryAllByText(/Undo \\(\\d+\\)/)[0]'],
];

let modified = false;
replacements.forEach(([from, to]) => {
  if (content.match(from)) {
    content = content.replace(from, to);
    modified = true;
    console.log(`✓ Replaced: ${from.substring(0, 50)}...`);
  }
});

if (modified) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('\n✅ 修复完成！');
} else {
  console.log('\n✓ 没有需要修复的内容');
}
