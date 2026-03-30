# YYC³ 测试选择器冲突预防方案

> **目标**: 彻底避免测试选择器冲突重复发生
> **适用范围**: 所有新开发和现有代码
> **生效时间**: 立即执行

---

## 🎯 核心原则

### 1. 组件ID前缀规范（强制）

**规则**:
- 每个组件使用唯一前缀：`<组件名>-<功能>-<描述>`
- 示例：`topbar-search-input`, `palette-search-input`, `status-badge-connected`

**反例**（禁止）:
```typescript
// ❌ 错误：过于通用
<input data-testid="search-input" placeholder="palette.placeholder" />

// ❌ 错误：与其他组件重复
<div data-testid="connection-status">connected</div>
```

**正例**（推荐）:
```typescript
// ✅ 正确：组件前缀
<input data-testid="topbar-search-input" placeholder="topbar.search.placeholder" />
<input data-testid="palette-search-input" placeholder="palette.search.placeholder" />

// ✅ 正确：组件前缀
<div data-testid="topbar-connection-status">connected</div>
<div data-testid="monitor-connection-status">connected</div>
```

---

### 2. Placeholder文本规范

**规则**:
- Placeholder必须包含组件前缀：`<组件名>.placeholder`
- 避免使用"搜索"、"输入"等通用词

**反例**（禁止）:
```typescript
// ❌ 错误：通用placeholder，容易冲突
<input placeholder="搜索..." />
<input placeholder="palette.placeholder" /> // 容易与CommandPalette冲突
```

**正例**（推荐）:
```typescript
// ✅ 正确：组件前缀
<input placeholder="topbar.search.placeholder" />
<input placeholder="palette.search.placeholder" />
<input placeholder="dashboard.filter.placeholder" />
```

---

### 3. TestID命名规范

**规则**:
- 格式：`<组件>-<区域>-<元素>-<描述>`
- 使用小写字母和连字符
- 必须具备唯一性

**示例**:
```typescript
// TopBar组件
"topbar-left-logo"           // 左侧Logo
"topbar-search-input"        // 搜索框
"topbar-search-icon"        // 搜索图标
"topbar-right-user-menu"     // 用户菜单
"topbar-right-notify-btn"    // 通知按钮

// CommandPalette组件
"palette-overlay"           // 遮罩层
"palette-container"          // 容器
"palette-search-input"       // 搜索输入框
"palette-results-list"       // 结果列表
"palette-item-nav-home"      // 导航项-首页

// Dashboard组件
"dashboard-alert-banner"     // 告警横幅
"dashboard-stat-card-cpu"   // 统计卡片-CPU
"dashboard-chart-trend"      // 趋势图表
```

---

## 🛡️ 预防措施

### 措施1: ESLint规则（自动化检测）

创建 `.eslintrc.test.js`:
```javascript
module.exports = {
  rules: {
    // 禁止使用通用的placeholder
    'no-restricted-globals': ['error', {
      name: 'placeholder',
      message: '请使用组件前缀的placeholder，如 "topbar.search.placeholder"'
    }],

    // 强制data-testid格式
    'react/prop-types': ['error', {
      forbid: ['data-testid'],
      message: 'data-testid必须包含组件前缀，格式：component-area-element-desc'
    }],
  }
};
```

### 措施2: 命名检查脚本

创建 `scripts/check-testid-naming.js`:
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 检测冲突的模式
const patterns = {
  '通用placeholder': /placeholder="(?:搜索|输入|Search|Input)"/g,
  '缺少前缀的data-testid': /data-testid="(?!topbar-|palette-|dashboard-|monitor-|sidebar-)/g,
};

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  Object.entries(patterns).forEach(([name, pattern]) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({ name, count: matches.length });
    }
  });

  return issues;
}

function main() {
  const srcDir = path.join(__dirname, '../src/app/components');
  const files = [];

  // 查找所有tsx文件
  function findFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findFiles(filePath);
      } else if (file.endsWith('.tsx')) {
        files.push(filePath);
      }
    });
  }

  findFiles(srcDir);

  console.log('🔍 检查组件文件...\n');

  let totalIssues = 0;
  files.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
      console.log(`❌ ${path.relative(srcDir, file)}`);
      issues.forEach(issue => {
        console.log(`   - ${issue.name}: ${issue.count}处`);
        totalIssues += issue.count;
      });
    }
  });

  if (totalIssues === 0) {
    console.log('✅ 未发现命名问题！');
  } else {
    console.log(`\n⚠️  共发现 ${totalIssues} 处问题，请修复后提交代码`);
    process.exit(1);
  }
}

main();
```

**添加到package.json**:
```json
{
  "scripts": {
    "check:testid": "node scripts/check-testid-naming.js",
    "precommit": "pnpm check:testid && pnpm lint:fix"
  }
}
```

### 措施3: 代码审查清单

创建 `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## 测试检查清单

- [ ] 新组件使用了正确的testID前缀
- [ ] placeholder文本包含组件前缀
- [ ] 运行 `pnpm check:testid` 无报错
- [ ] 新增的测试全部通过
- [ ] 没有破坏现有测试

## 常见错误

### ❌ 禁止
```typescript
<input placeholder="搜索" data-testid="search" />
<div data-testid="status">connected</div>
```

### ✅ 推荐
```typescript
<input placeholder="mycomponent.search.placeholder" data-testid="mycomponent-search-input" />
<div data-testid="mycomponent-status-badge">connected</div>
```
```

---

## 🚀 开发工作流

### 新组件开发流程

1. **组件命名**: 使用 PascalCase，如 `UserProfile`

2. **TestID前缀**: 全部小写 + 连字符，如 `userprofile-`

3. **编写组件时**:
```typescript
// UserProfile.tsx
const UserProfile = ({ user }) => {
  return (
    <div data-testid="userprofile-container">
      <img
        src={user.avatar}
        data-testid="userprofile-avatar"
        alt={user.name}
      />
      <input
        placeholder="userprofile.search.placeholder"
        data-testid="userprofile-search-input"
      />
      <div data-testid="userprofile-status-badge">
        {user.status}
      </div>
    </div>
  );
};
```

4. **编写测试时**:
```typescript
// UserProfile.test.tsx
it('should render search input', () => {
  render(<UserProfile user={mockUser} />);
  // 使用唯一的前缀，不会冲突
  expect(screen.getByPlaceholderText('userprofile.search.placeholder')).toBeInTheDocument();
  expect(screen.getByTestId('userprofile-search-input')).toBeInTheDocument();
});
```

---

## 📋 快速参考

### 组件前缀清单

| 组件 | 前缀 | 示例 |
|------|------|------|
| TopBar | `topbar-` | `topbar-search-input`, `topbar-logo` |
| CommandPalette | `palette-` | `palette-overlay`, `palette-search-input` |
| Dashboard | `dashboard-` | `dashboard-stat-card`, `dashboard-chart` |
| Sidebar | `sidebar-` | `sidebar-nav-item`, `sidebar-logo` |
| ConnectionStatus | `status-` | `status-badge-connected`, `status-dot` |
| UserProfile | `userprofile-` | `userprofile-avatar`, `userprofile-menu` |
| Notification | `notify-` | `notify-badge`, `notify-panel` |
| FollowUpCard | `followup-` | `followup-card`, `followup-expand-btn` |

### 命名模板

```bash
# 生成新的TestID
<组件>-<区域>-<元素>-<描述>

# 示例
topbar-left-logo
topbar-right-notify-btn
dashboard-header-alert-banner
dashboard-stats-cpu-card
palette-overlay
palette-search-input
palette-results-list-item-1
```

---

## 🔄 迁移现有代码

### 自动重命名脚本

创建 `scripts/fix-testid-prefix.js`:
```javascript
#!/usr/bin/env node

/**
 * 自动为组件添加前缀
 * 用法: node scripts/fix-testid-prefix.js <组件名> <文件路径>
 */

const fs = require('fs');
const componentName = process.argv[2];
const filePath = process.argv[3];

if (!componentName || !filePath) {
  console.log('用法: node scripts/fix-testid-prefix.js <组件名> <文件路径>');
  console.log('示例: node scripts/fix-testid-prefix.js TopBar src/app/components/TopBar.tsx');
  process.exit(1);
}

const prefix = componentName.toLowerCase();

function fixTestIds(content) {
  // 修复data-testid
  content = content.replace(
    /data-testid="([^"]*)"/g,
    (match, testid) => {
      // 如果已经有前缀，跳过
      if (testid.startsWith(prefix + '-')) return match;
      return `data-testid="${prefix}-${testid}"`;
    }
  );

  // 修复placeholder
  content = content.replace(
    /placeholder="([^"]*)"/g,
    (match, placeholder) => {
      // 如果已经有前缀，跳过
      if (placeholder.includes('.placeholder') || placeholder.includes('.search')) return match;
      return `placeholder="${prefix}.search.placeholder"`;
    }
  );

  return content;
}

const content = fs.readFileSync(filePath, 'utf8');
const newContent = fixTestIds(content);

if (content !== newContent) {
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ 已修复: ${filePath}`);
  console.log(`   前缀: ${prefix}-`);
} else {
  console.log(`✓ 无需修复: ${filePath}`);
}
```

**使用方法**:
```bash
# 修复TopBar组件
node scripts/fix-testid-prefix.js TopBar src/app/components/TopBar.tsx

# 修复CommandPalette组件
node scripts/fix-testid-prefix.js CommandPalette src/app/components/CommandPalette.tsx
```

---

## 🎓 最佳实践

### DO ✅

1. **使用组件前缀**
```typescript
data-testid="mycomponent-element"
placeholder="mycomponent.search.placeholder"
```

2. **使用具体的选择器**
```typescript
// ✅ 具体且唯一
screen.getByTestId('topbar-search-input')
screen.getByPlaceholderText('topbar.search.placeholder')

// ✅ 使用getAllBy当可能有多个时
screen.getAllByTestId('connection-status')[0]
```

3. **在测试前检查**
```bash
pnpm check:testid
```

### DON'T ❌

1. **不要使用通用的选择器**
```typescript
// ❌ 太通用，容易冲突
data-testid="search-input"
placeholder="搜索"
```

2. **不要复制粘贴忘记修改**
```typescript
// ❌ 复制CommandPalette代码到TopBar，忘记改前缀
<input placeholder="palette.search.placeholder" /> // 应该是 topbar
```

3. **不要跳过代码审查**
```bash
# ❌ 直接提交，未运行检查
git push origin main

# ✅ 先运行检查
pnpm check:testid
pnpm test
git add .
git commit -m "fix: add testid prefixes"
git push origin main
```

---

## 📊 效果对比

### 修复前（易冲突）

```typescript
// TopBar.tsx
<input placeholder="palette.placeholder" />
<div data-testid="connection-status">connected</div>

// CommandPalette.tsx
<input placeholder="palette.placeholder" /> // 冲突！
<div data-testid="connection-status">connected</div> // 冲突！

// 测试失败
screen.getByPlaceholderText("palette.placeholder") // 找到2个！
screen.getByTestId("connection-status") // 找到多个！
```

### 修复后（无冲突）

```typescript
// TopBar.tsx
<input placeholder="topbar.search.placeholder" />
<div data-testid="topbar-connection-status">connected</div>

// CommandPalette.tsx
<input placeholder="palette.search.placeholder" /> // 唯一！
<div data-testid="palette-connection-status">connected</div> // 唯一！

// 测试通过
screen.getByPlaceholderText("topbar.search.placeholder") // 只找到1个
screen.getByTestId("palette-search-input") // 只找到1个
```

---

## 🚦 实施计划

### 第1周：建立规范（已开始）

- [x] 编写命名规范文档
- [x] 创建检查脚本
- [ ] 添加到package.json
- [ ] 更新PR模板

### 第2周：修复现有代码

- [ ] 运行重命名脚本修复所有组件
- [ ] 更新所有测试文件
- [ ] 运行测试验证

### 第3周：强制执行

- [ ] 添加pre-commit钩子
- [ ] 配置CI/CD检查
- [ ] 团队培训

### 第4周：长期维护

- [ ] 定期代码审查
- [ ] 持续优化工具
- [ ] 文档更新

---

## 📞 支持资源

### 快速命令

```bash
# 检查组件命名
pnpm check:testid

# 修复单个组件
node scripts/fix-testid-prefix.js <组件名> <文件路径>

# 批量检查
find src/app/components -name "*.tsx" -exec grep -l 'data-testid=' {} \;
```

### 故障排查

如果测试仍然失败，按以下步骤排查：

1. **检查是否有重复的testID**
   ```bash
   grep -r 'data-testid="search-input"' src/app/components/
   ```

2. **检查是否有重复的placeholder**
   ```bash
   grep -r 'placeholder="palette.placeholder"' src/app/components/
   ```

3. **使用更具体的选择器**
   ```typescript
   // 改用data-testid而不是placeholder
   screen.getByTestId('topbar-search-input')
   ```

---

*本文档由OpenCode生成，遵循YYC³开发规范*
