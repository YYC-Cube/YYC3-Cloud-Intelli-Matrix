---
file: YYC3-团队文档-命名规范.md
description: YYC³项目文档
author: YanYuCloudCube Team
version: v3.0.0
created: 2026-03-27
updated: 2026-03-27
status: published
tags: YYC³,文档
checksum: e6941ce4e12cbcb4
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

## 核心理念

**五高架构**：高可用 | 高性能 | 高安全 | 高扩展 | 高智能
**五标体系**：标准化 | 规范化 | 自动化 | 可视化 | 智能化
**五化转型**：流程化 | 数字化 | 生态化 | 工具化 | 服务化
**五维评估**：时间维 | 空间维 | 属性维 | 事件维 | 关联维

---

# YYC³ CloudPivot Intelli-Matrix - 文档命名规范

## 📋 命名规范

### 项目级文档 (`/docs/`)

#### 目录命名规范

**格式**: `{序号}-{阶段}-{功能}-{子功能}`

**示例**:
```
00-YYC3-CP-IM-项目总览-目录索引/
01-YYC3-CP-IM-项目规划-启动阶段/
02-YYC3-CP-IM-项目规划-设计阶段/
03-YYC3-CP-IM-项目开发-实施阶段/
04-YYC3-CP-IM-项目测试-审核阶段/
05-YYC3-CP-IM-项目部署-文档闭环/
06-YYC3-CP-IM-项目运营-维护阶段/
07-YYC3-CP-IM-项目合规-安全保障/
08-YYC3-CP-IM-项目整合-实施阶段/
09-YYC3-CP-IM-项目资产-知识管理/
10-YYC3-CP-IM-项目模版-标准规范/
11-YYC3-CP-IM-智能演进-优化阶段/
12-YYC3-CP-IM-用户指南-操作手册/
13-YYC3-CP-IM-智能演进-优化阶段/
```

**规则**:
- 序号: 2 位数字（00-99）
- 阶段: 项目规划、项目开发、项目测试、项目部署、项目运营、项目合规、项目整合、项目资产、项目模版、智能演进、用户指南
- 功能: 简短描述（中文）
- 子功能: 可选，进一步细分

#### 文件命名规范

**格式**: `{序号}-{项目}-{功能}-{描述}.md`

**示例**:
```
001-CP-IM-项目总览索引-项目总览手册.md
002-CP-IM-项目总览索引-快速开始指南.md
003-CP-IM-代码标头规范标准.md
004-CP-IM-项目多维检测审查报告.md
```

**规则**:
- 序号: 3 位数字（001-999）
- 项目: CP-IM（CloudPivot Intelli-Matrix）
- 功能: 简短描述（中文）
- 描述: 详细描述（中文）

#### 标准规范文档命名

**格式**: `YYC3-CP-IM-{功能}-{描述}.md`

**示例**:
```
YYC3-CP-IM-代码标头规范标准.md
YYC3-CP-IM-代码标头规范化最终总结报告.md
YYC3-CP-IM-项目多维检测审查报告.md
YYC3-CP-IM-文档架构整理报告.md
YYC3-CP-IM-封装文档更新指南.md
```

---

### 应用级文档 (`/src/app/docs/`)

#### 文件命名规范

**格式**: `{功能}-{类型}.ts`

**示例**:
```
API-REFERENCE.ts
COMPONENT-REFERENCE.ts
DEVELOPER-HANDOFF.ts
TESTING-GUIDE.ts
ALIGNMENT-PLAN.ts
FINAL-AUDIT-REPORT.ts
HA-ARCHITECTURE-TEST.ts
LOCAL-DESIGN-GUIDE.ts
STORAGE-AUDIT.ts
```

**规则**:
- 功能: 大写字母，单词用连字符分隔
- 类型: REFERENCE, GUIDE, HANDOFF, REPORT, TEST, PLAN, AUDIT

---

## 📊 文档类型分类

### 项目级文档类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 项目总览 | 项目介绍、快速开始 | 00-YYC3-CP-IM-项目总览-目录索引/ |
| 项目规划 | 启动、设计 | 01-YYC3-CP-IM-项目规划-启动阶段/ |
| 项目开发 | 实施阶段 | 03-YYC3-CP-IM-项目开发-实施阶段/ |
| 项目测试 | 审核阶段 | 04-YYC3-CP-IM-项目测试-审核阶段/ |
| 项目部署 | 文档闭环 | 05-YYC3-CP-IM-项目部署-文档闭环/ |
| 项目运营 | 维护阶段 | 06-YYC3-CP-IM-项目运营-维护阶段/ |
| 项目合规 | 安全保障 | 07-YYC3-CP-IM-项目合规-安全保障/ |
| 项目整合 | 实施阶段 | 08-YYC3-CP-IM-项目整合-实施阶段/ |
| 项目资产 | 知识管理 | 09-YYC3-CP-IM-项目资产-知识管理/ |
| 项目模版 | 标准规范 | 10-YYC3-CP-IM-项目模版-标准规范/ |
| 智能演进 | 优化阶段 | 11-YYC3-CP-IM-智能演进-优化阶段/ |
| 用户指南 | 操作手册 | 12-YYC3-CP-IM-用户指南-操作手册/ |
| 标准规范 | 代码规范、审查报告 | YYC3-CP-IM-*.md |

### 应用级文档类型

| 类型 | 说明 | 示例 |
|------|------|------|
| API 参考 | API 接口文档 | API-REFERENCE.ts |
| 组件参考 | 组件使用文档 | COMPONENT-REFERENCE.ts |
| 开发者交接 | 开发协作规范 | DEVELOPER-HANDOFF.ts |
| 测试指南 | 测试规范和最佳实践 | TESTING-GUIDE.ts |
| 对齐计划 | 项目对齐计划 | ALIGNMENT-PLAN.ts |
| 审核报告 | 最终审核报告 | FINAL-AUDIT-REPORT.ts |
| 架构测试 | 高可用架构测试 | HA-ARCHITECTURE-TEST.ts |
| 设计指南 | 本地设计指南 | LOCAL-DESIGN-GUIDE.ts |
| 存储审计 | 存储审计报告 | STORAGE-AUDIT.ts |

---

## 🎯 命名原则

### 1. 一致性

- 所有文档使用统一的命名格式
- 相同类型的文档使用相同的后缀
- 序号保持连续性

### 2. 可读性

- 使用中文描述，便于理解
- 使用连字符分隔，便于解析
- 避免使用特殊字符

### 3. 可扩展性

- 预留足够的序号空间
- 支持多层子目录
- 支持新类型的文档

### 4. 标准化

- 遵循行业最佳实践
- 符合 YYC³ 标准化要求
- 便于自动化处理

---

## 📝 文档模板

### 项目级文档模板

```markdown
# {序号}-{项目}-{功能}-{描述}

## 📋 文档说明

{文档说明}

## 📄 文档内容

{文档内容}

---

**最后更新**: {日期}
**维护者**: {姓名}
```

### 应用级文档模板

```typescript
/**
 * {功能}-{类型}
 * ================
 * {描述}
 */

// 文档内容
```

---

## 🔗 相关文档

- [项目文档 README](./README.md)
- [应用文档 README](../src/app/docs/README.md)
- [项目根目录 README](../README.md)

---

**最后更新**: 2026-03-26
**维护者**: YYC³ 团队
