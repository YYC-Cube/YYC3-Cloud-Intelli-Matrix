# YYC³ Cloud Intelli-Matrix v3.3.0 — 五维全量审计报告

> 审计范围: `src/` 全目录 | 676 文件 | ~206K 行源码
> 审计日期: 2026-04-20
> 审计框架: 代码质量 · 功能正确性 · 性能效率 · 可维护性 · 安全性
>
> **威胁模型声明**: 本项目为 **单用户本地优先** 架构——无多用户认证、无共享数据、无跨用户交互。
> 用户自行编辑管理所有密钥与数据，宿主机本地存储，一人一端，不交叉不影响。
> 安全维度的评估已基于此实际威胁模型校准，而非多用户 Web 应用标准。

---

## 一、项目概况

| 指标 | 数值 |
|---|---|
| 总文件数 | 676 |
| 源码总行数 | ~206,036 |
| `.ts` 文件 | 324 (107,541 行) |
| `.tsx` 文件 | 322 (88,672 行) |
| 测试文件 | 247 (63,042 行) |
| 组件层 | 213 文件 / 65,564 行 (32%) |
| 业务逻辑层 | 88 文件 / 34,630 行 (18%) |
| Hook 层 | 38 文件 / 10,854 行 (6%) |
| 状态管理层 | 21 slices + 2 stores / 3,619 行 (2%) |
| 架构模式 | React 19 + TypeScript + Zustand + Vite + Electron |

---

## 二、五维审计结果汇总

### 总览

| 维度 | CRITICAL | HIGH | MEDIUM | LOW | 合计 |
|---|---|---|---|---|---|
| ① 代码质量 | 1 | 2 | 5 | 3 | **11** |
| ② 功能正确性 | 0 | 1 | 4 | 3 | **8** |
| ③ 性能效率 | 0 | 4 | 8 | 2 | **14** |
| ④ 可维护性 | 0 | 1 | 5 | 3 | **9** |
| ⑤ 安全性 | 0 | 2 | 6 | 8 | **16** |
| **合计** | **1** | **10** | **28** | **19** | **58** |

---

## 三、① 代码质量 — 分级问题清单

### CRITICAL

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| Q-01 | `app/types/index.ts` | 全文 1999 行 | **巨型类型文件**：1999 行全量类型定义，混合了 node/family/metrics/ui/agent 等 6+ 个领域，应拆分为领域独立类型文件 |

### HIGH

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| Q-02 | `app/components/*.tsx` (30+) | — | **错误边界缺失**：仅 `App.tsx` 一处 ErrorBoundary，30+ 页面级组件无独立错误边界，任何子组件崩溃导致整页白屏 |
| Q-03 | 79 个文件 | — | **`any` 类型滥用**：278 处显式 `any`，其中 `yyc3-cluster-manager.ts:1008` 导出函数返回 `Promise<any>`，`QueryCache.ts` 4 处 `any` + eslint-disable |

### MEDIUM

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| Q-04 | 70+ 文件超过 300 行 | — | **巨型组件**：`SystemSettings.tsx`(1521L), `ServiceConnectionTest.tsx`(1252L), `DataEditorPanel.tsx`(1235L), `HotelDashboard.tsx`(1002L) 等 |
| Q-05 | 40+ 组件文件 | — | **魔法颜色值**：`#00d4ff`/`#00ff88`/`#ff3366` 等 100+ 处硬编码，未引用 `design-system.ts` 已定义的常量 |
| Q-06 | 21 个 Zustand slice | 迁移函数 | **重复迁移模式**：21 处 `try { JSON.parse(localStorage.getItem(key)) } catch {}` 完全相同的迁移逻辑，应提取为 `migrateFromStorage()` 工具函数 |
| Q-07 | 7 个组件文件 | — | **重复复制反馈模式**：7 处 `setTimeout(() => setCopied(null), 2000)` 应提取为 `useCopyFeedback()` Hook |
| Q-08 | 多处组件 | — | **魔法数字**：`2000`/`5000`/`3000` 等超时值、`40`/`100`/`500` 等默认值未定义为命名常量 |

### LOW

| ID | 文件 | 问题 |
|---|---|---|
| Q-09 | `routes.tsx:12` | 死代码：注释掉的 Playwright import |
| Q-10 | `app/lib/xss-protection.ts:12,33` | `@ts-ignore` 抑制可选依赖类型错误 |
| Q-11 | 28 处 | `eslint-disable` 指令散布，应通过类型收窄消除 |

---

## 四、② 功能正确性 — 分级问题清单

### HIGH

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| F-01 | `lib/deployment-manager.ts` | 98 | **CORS 默认 `*`**：代码注释应明确标注"仅限本地开发"，开源后用户可能误用于公网部署 |

### MEDIUM

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| F-04 | `components/ui/chart.tsx` | 96 | **`dangerouslySetInnerHTML`**：若内容来自不可信数据源则构成 XSS |
| F-05 | `hooks/useReportExporter.ts` | 217 | **`document.write()`**：动态 HTML 写入新窗口，含未转义模板变量 |
| F-06 | `lib/crypto-vault.ts` | 183-188 | **加密失败明文降级**：`secureStorage.setItem` 加密失败时降级为 `localStorage.setItem` 明文存储 |
| F-07 | `hooks/useLocalDatabase.ts` | 356, 371 | **密码编码降级**：AES-GCM 失败时降级为 Base64 编码（非加密） |

### LOW

| ID | 文件 | 问题 |
|---|---|---|
| F-08 | `lib/xss-protection.ts:179` | `innerHTML` 赋值（已用 DOMPurify 但模式本身有风险） |
| F-09 | `hooks/useAIDiagnostics.ts` | 大量 `Math.random()` 生成模拟数据，非安全场景但模式不优 |

---

## 五、③ 性能效率 — 分级问题清单

### HIGH

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| P-01 | 所有 Zustand slice 消费组件 | — | **Store 全量订阅**：15+ slice 均未使用 `useShallow` 选择器，每个消费者订阅整个 store，任一字段变更触发重渲染 |
| P-02 | `components/Dashboard.tsx` | 609-665 | **列表项未 Memo 化**：`NodeCard` 在 `.map()` 中渲染，每次 WebSocket 更新（2s）触发 9 个节点全部重渲染 |
| P-03 | `components/HotelDashboard.tsx` | 全文 1002 行 | **零 Memo 化**：1000 行组件，7 个子 tab，多个 `.map()` 渲染，无 `useMemo`/`useCallback`/`React.memo` |
| P-04 | `components/Layout.tsx` | 47, 71 | **WebSocket Context 全树重渲染**：每 2s 模拟更新创建新对象引用，通过 Context 传播导致所有消费者重渲染 |

### MEDIUM

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| P-05 | `components/UserManagement.tsx` | 61-63, 142-144, 288-289 | **未 Memo 化过滤链**：每帧执行 4 次 `.filter()` + roles 循环中嵌套 `.filter()` |
| P-06 | 20+ 组件文件 | — | **内联 style={{}} 对象**：每次渲染创建新对象，Dashboard 40+ 处、SecurityMonitor 50+ 处 |
| P-07 | `store/slices/node-slice.ts` | 64-92 | **急切派生计算**：`computeDerived()` 在每次 `set()` 时执行多个 `.filter()`/`.reduce()`，2s 更新周期下持续运行 |
| P-08 | `components/SDKChatPanel.tsx` | 54-108 | `MessageBubble` 未 Memo 化，`t` 函数引用每次渲染变化 |
| P-09 | `components/ui/chart.tsx:15` | 15 | `import * as RechartsPrimitive` 通配符导入，可能阻止 tree-shaking |
| P-10 | `stores/global-store.ts` | 173 | `useAlerts()` 每次调用创建新数组，无 Memo 化 |
| P-11 | `components/Dashboard.tsx` | 129-143 | `setTimeout` 无清理，组件卸载时在已卸载组件上 setState |
| P-12 | `components/Layout.tsx` + `hooks/useKeyboardShortcuts.ts` | 59-68 | 不稳定回调依赖：`onEscape`/`onSearch` 箭头函数每次渲染新建，导致 keydown 监听器频繁挂/卸载 |

### LOW

| ID | 文件 | 问题 |
|---|---|---|
| P-13 | `components/Layout.tsx:15-22` | `IntegratedTerminal`/`CommandPalette` 静态导入，可懒加载 |
| P-14 | 多处组件 | 内联 `<style>` 标签（Layout scanline 动画、HotelDashboard 样式块）应提取为 CSS 文件 |

---

## 六、④ 可维护性 — 分级问题清单

### HIGH

| ID | 文件 | 行 | 问题 |
|---|---|---|---|
| M-01 | `app/types/index.ts` | 1999 行 | **单一类型巨石**：6+ 领域混合，修改任一领域需在 1999 行中定位，变更影响不可控 |

### MEDIUM

| ID | 文件 | 问题 |
|---|---|---|
| M-02 | 21 个 slice 迁移函数 | 相同的 localStorage 迁移逻辑重复 21 次，新增迁移需改 21 处 |
| M-03 | 40+ 组件硬编码颜色 | `design-system.ts` 已定义常量但未使用，改主题需逐文件搜索替换 |
| M-04 | `i18n/zh-CN.ts`(1318L) / `en-US.ts`(1298L) | 翻译文件未按功能域拆分，新增翻译需在 1300 行中定位 |
| M-05 | `lib/yyc3-cluster-manager.ts`(1309L) | 集群管理器含健康检查/拓扑/部署逻辑混合，应拆分 |
| M-06 | `config/page-config.ts`(999L) | 页面定义与配置逻辑混合 |

### LOW

| ID | 文件 | 问题 |
|---|---|---|
| M-07 | 测试文件 19 处 `@ts-ignore` | 应创建 `env.d.ts` 声明 Vite 环境变量类型 |
| M-08 | `imports/` 目录 19 文件 | 设计文档混入源码树，应移至 `docs/` |
| M-09 | `app/docs/` 12 文件 | 运行时文档（DEVELOPER-HANDOFF.ts 等）应是 `.md` 而非 `.ts` |

---

## 七、⑤ 安全性 — 分级问题清单

> **威胁模型**: 单用户本地优先。无多用户认证，无共享数据，无跨用户交互。
> 用户自行管理密钥与数据，宿主机本地存储，一人一端。
> 以下评级基于此模型——而非多用户 Web 应用标准。

### HIGH (本地应用仍需关注)

| ID | 文件 | 行 | 问题 | 校准说明 |
|---|---|---|---|---|
| S-01 | `components/ui/chart.tsx` | 96 | **`dangerouslySetInnerHTML`**：AI 返回的图表数据若含恶意脚本，本地渲染仍可执行 | 本地应用也有 XSS 风险——恶意 AI 响应可窃取 localStorage 中的用户 API Key |
| S-02 | `hooks/useReportExporter.ts` | 217 | **`document.write()`**：报告导出含动态数据模板拼接 | 同上，AI 生成的 recommendations 若含 `<script>` 可在导出窗口执行 |

### MEDIUM (本地场景降级)

| ID | 文件 | 行 | 问题 | 校准说明 |
|---|---|---|---|---|
| S-03 | `lib/crypto-vault.ts` | 183-188 | 加密失败降级明文存储 | 单用户场景影响有限，但加密库不应静默降级，应明确通知用户 |
| S-04 | `lib/xss-protection.ts` | 179 | `innerHTML` + DOMPurify | DOMPurify 已兜底，`<a href="javascript:">` 绕过风险低但存在 |
| S-05 | `hooks/useLocalDatabase.ts` | 389 | SQL 输入无危险语句过滤 | 本地 SQLite 用户自己操作，降级为"建议加确认提示" |
| S-06 | `lib/deployment-manager.ts` | 98 | CORS 默认 `*` | 本地 Electron 应用实际不暴露端口，但代码注释应标明仅限开发 |
| S-07 | `store/slices/provider-slice.ts` | 119,310 | Ollama HTTP + Bearer | 本地回环通信，威胁极低，但作为开源示例代码应注释说明 |
| S-08 | `services/storageManager.ts` | 469-579 | `as unknown as` 类型转换 | 运行时类型安全问题（非安全威胁），应使用类型守卫 |

### LOW (单用户场景可接受)

| ID | 文件 | 问题 | 校准说明 |
|---|---|---|---|
| S-09 | `hooks/useLocalDatabase.ts:321` | 硬编码加密密钥 | 降级：用户自己的数据在自己机器上，加密仅为防窥非防攻 |
| S-10 | `provider-slice.ts:133` / `family-settings-slice.ts:232` | API Key 明文 localStorage | 降级：用户自己输入的 Key 存在自己的浏览器，属预期行为 |
| S-11 | `lib/supabaseClient.ts:60` | Session Token 明文 | 降级：无多用户认证模块，Token 为本地状态标识 |
| S-12 | `lib/full-backup.ts:75` | 导出含敏感数据 | 降级：用户导出自己的数据，含自己的 Key 属预期行为 |
| S-13 | `hooks/useLocalDatabase.ts:450` | `Math.random()` 生成 ID | 降级：本地 ID 非安全场景 |
| S-14 | `hooks/useLocalDatabase.ts:356` | 密码 Base64 降级 | 降级：本地存储自己的数据库密码 |
| S-15 | `config/env.ts:38` | 默认 HTTP URL | 降级：本地开发/Electron，无远程通信 |
| S-16 | `__tests__/` 多文件 | Mock 密码/`as any` | 降级：测试代码 |

---

## 八、开源就绪评估

> 威胁模型校准后：项目安全基线满足"一人一端本地优先"定位。
> 真正的开源阻断项在代码质量和性能维度。

### 当前阻断项 (Must-Fix Before Open Source)

1. **Q-02** — 错误边界缺失 (HIGH) — 任何子组件崩溃导致整页白屏，用户体验灾难
2. **P-01** — Zustand 全量订阅 (HIGH) — 2s WebSocket 更新触发全组件树重渲染，性能不可接受
3. **P-02/P-03** — 核心组件零 Memo 化 (HIGH) — Dashboard / HotelDashboard 持续无效渲染
4. **S-01/S-02** — `dangerouslySetInnerHTML` / `document.write()` (HIGH) — AI 响应中的恶意内容可执行

### 推荐修复路径

```
Phase 1 (体验层 — 开源门面):  Q-02 → P-01 → P-02/P-03 → S-01 → S-02
Phase 2 (质量层 — 工程底线):  Q-01 → Q-04 → M-02 → F-03 → P-05
Phase 3 (优化层 — 精品打磨):  P-04 → P-06~P-12 → Q-05~Q-08 → M-03~M-06
Phase 4 (完善层 — 开源标杆):  P-13~P-14 → M-07~M-09 → Q-09~Q-11 → S-03~S-08
```

---

> 此报告由 YYC³ 总工程师五维审计框架生成 · 威胁模型校准版
> 核心理念: 安全一人一端，用户轻松体验 | 不交叉不影响
