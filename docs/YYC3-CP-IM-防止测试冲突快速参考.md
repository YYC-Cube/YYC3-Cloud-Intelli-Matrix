# 🛡️ 防止测试冲突"再次感染" - 快速参考卡

> **记住这3个命令，永绝后患！**

---

## 🚀 三个核心命令

### 1. 检查命令 🔍

```bash
pnpm check:testid [组件路径]
```

**作用**: 自动检测测试选择器冲突

**使用时机**:
- ✅ 提交代码前（必选）
- ✅ 开发新组件后
- ✅ 修复测试失败前

**示例**:
```bash
# 检查所有组件
pnpm check:testid

# 检查单个组件
pnpm check:testid src/app/components/MyComponent.tsx

# 检查特定目录
pnpm check:testid src/app/components
```

---

### 2. 修复命令 🔧

```bash
pnpm fix:testid <组件名> <文件路径>
```

**作用**: 自动为组件添加唯一前缀

**使用时机**:
- ✅ 检测到冲突时
- ✅ 发现测试失败时
- ✅ 复制组件代码后

**示例**:
```bash
# 修复TopBar组件
pnpm fix:testid TopBar src/app/components/TopBar.tsx

# 修复CommandPalette组件
pnpm fix:testid CommandPalette src/app/components/CommandPalette.tsx
```

---

### 3. 批量修复命令 🚀

```bash
pnpm fix:all-testids [目录路径]
```

**作用**: 一键修复所有组件

**使用时机**:
- ✅ 大规模代码清理
- ✅ 项目启动时
- ✅ 发现大量冲突时

**示例**:
```bash
# 修复所有组件
pnpm fix:all-testids

# 修复特定目录
pnpm fix:all-testids src/app/components/ai-family
```

---

## 📋 日常工作流

### 开发新组件 ✨

```bash
# 1. 编写组件（使用正确前缀）
# data-testid="mycomponent-element"
# placeholder="mycomponent.search.placeholder"

# 2. 提交前检查
pnpm check:testid

# 3. 如有问题，自动修复
pnpm fix:testid MyComponent src/app/components/MyComponent.tsx

# 4. 运行测试
pnpm test

# 5. 提交代码
git add . && git commit -m "feat: new component"
```

### 修复测试失败 🐛

```bash
# 1. 运行测试，发现失败
pnpm test

# 2. 检查问题组件
pnpm check:testid src/app/components/FailComponent.tsx

# 3. 自动修复
pnpm fix:testid FailComponent src/app/components/FailComponent.tsx

# 4. 更新测试文件选择器
# getByPlaceholderText("old.placeholder")
# ↓
# getByPlaceholderText("failcomponent.search.placeholder")

# 5. 验证修复
pnpm test src/app/__tests__/FailComponent.test.tsx

# 6. 提交修复
git add . && git commit -m "fix: resolve test selector conflicts"
```

### 大规模代码清理 🧹

```bash
# 1. 检查所有组件
pnpm check:testid

# 2. 批量修复
pnpm fix:all-testids

# 3. 更新测试文件（可能需要批量替换）

# 4. 运行所有测试
pnpm test

# 5. 提交更改
git add . && git commit -m "refactor: add unique testid prefixes"
```

---

## 💡 记住这个规则

### ✅ 命名规范

```typescript
// 组件前缀 + 区域 + 元素 + 描述
<组件>-<区域>-<元素>-<描述>

// 示例
topbar-search-input          // TopBar-搜索区-输入框
palette-overlay             // CommandPalette-遮罩层
dashboard-stat-card-cpu     // Dashboard-统计卡片-CPU
```

### ❌ 禁止模式

```typescript
// ❌ 不要使用通用placeholder
placeholder="搜索"
placeholder="输入"

// ❌ 不要使用通用testID
data-testid="search-input"
data-testid="status"

// ❌ 不要复制粘贴忘记改
// 从CommandPalette复制到TopBar时
placeholder="palette.search.placeholder" // ← 忘记改！
```

---

## 🎯 预防清单

### 开发新组件时

- [ ] 组件名使用PascalCase（如`UserProfile`）
- [ ] TestID前缀使用小写+连字符（如`userprofile-`）
- [ ] 所有data-testid包含组件前缀
- [ ] 所有placeholder包含组件前缀
- [ ] 提交前运行`pnpm check:testid`

### 修复冲突时

- [ ] 运行`pnpm check:testid`定位问题
- [ ] 使用`pnpm fix:testid`自动修复
- [ ] 同步更新测试文件中的选择器
- [ ] 运行测试验证修复
- [ ] 确保没有破坏其他测试

### 日常维护

- [ ] 每周运行一次`pnpm check:testid`
- [ ] 发现冲突立即修复，不要拖延
- [ ] 新人入职时培训命名规范
- [ ] 代码审查时检查testID命名

---

## 🔧 自动化配置

### Pre-commit钩子

在`.husky/pre-commit`中添加：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm check:testid || {
  echo "❌ 测试选择器命名检查失败"
  echo "💡 请运行: pnpm fix:testid <组件名> <文件路径>"
  exit 1
}

pnpm lint:fix || {
  echo "❌ 代码检查失败"
  exit 1
}

pnpm type-check || {
  echo "❌ 类型检查失败"
  exit 1
}
```

### CI/CD集成

在`.github/workflows/ci.yml`中添加：

```yaml
- name: Check TestID Naming
  run: pnpm check:testid

- name: Run Tests
  run: pnpm test:ci
```

---

## 📖 文档索引

| 文档 | 用途 |
|------|------|
| [测试选择器冲突预防方案](./测试选择器冲突预防方案.md) | 完整的规范和最佳实践 |
| [测试选择器预防工具使用指南](./测试选择器预防工具使用指南.md) | 工具详细使用说明 |
| [测试失败诊断报告](./测试失败诊断报告.md) | 测试问题诊断 |
| [项目现状分析报告](./项目现状分析报告.md) | 项目整体分析 |

---

## 🆘 常见问题

### Q: 为什么会重复出现这个问题？

**A**: 因为：
1. 新组件复制现有代码，忘记修改前缀
2. 没有统一的命名规范
3. 缺少自动化检查工具
4. 代码审查未检查testID

**解决方案**: 使用本工具包，自动化检测和修复。

---

### Q: 已经有冲突了，怎么快速修复？

**A**:
```bash
# 1. 检查所有组件
pnpm check:testid

# 2. 批量修复
pnpm fix:all-testids

# 3. 更新测试文件（可能需要手动调整）

# 4. 验证
pnpm test
```

---

### Q: 如何避免再次"感染"？

**A**:
1. ✅ 始终在开发新组件时使用正确前缀
2. ✅ 提交前运行`pnpm check:testid`
3. ✅ 配置pre-commit钩子自动检查
4. ✅ 代码审查时检查testID命名
5. ✅ 定期运行`pnpm check:testid`

---

## 🎉 总结

### 三步防"感染"

1. **检查**: `pnpm check:testid` ← 开发后必做
2. **修复**: `pnpm fix:testid` ← 发现问题立即修复
3. **验证**: `pnpm test` ← 确保测试通过

### 记住这个

> **"每个组件都要有唯一的前缀"**
>
> - TopBar → `topbar-`
> - CommandPalette → `palette-`
> - Dashboard → `dashboard-`
> - MyComponent → `mycomponent-`

### 自动化是最好的防护

```bash
# 配置pre-commit钩子
pnpm setup-git-hooks

# 每次提交前自动检查
git commit -m "..."
# → 自动运行: pnpm check:testid
```

---

*持续改进，永绝后患！* 🚀
