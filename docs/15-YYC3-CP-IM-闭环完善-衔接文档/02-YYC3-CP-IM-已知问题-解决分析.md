
# 🔴 YYC³ 已知问题 — 深度根因分析报告

> **状态**: 持续一个月未解决的核心问题
> **分析范围**: 监控中心数据来源 / 全局设置统一 / 模型管理统一 / 智慧酒店对齐

---

## 问题一：🚨 监控中心 — 模拟模式 vs 连接模式无法区分

### 问题现象

所有5个监控页面（数据监控、跟进、巡查、告警、协同）的数据全部来自模拟，用户无法区分当前是「真实连接」还是「模拟数据」。

### 代码根因追踪

**核心文件**: [useWebSocketData.ts](file:///Users/yanyu/YYC3-CloudIntelli-Matrix/src/app/hooks/useWebSocketData.ts)

```
第224行: useEffect 初始化时
    ↓
第226行: connectWS() — 尝试WebSocket连接
第228行: ★ 同时启动模拟定时器 simulateTimerRef ★
    ↓
    WS连接失败 → onclose 回调
    ↓
第190行: setConnectionState("simulated") ← 状态设为 "simulated"
第192行: 模拟定时器继续运行
```

**根因 #1 — 启动即双跑**:

```typescript
// useWebSocketData.ts 第222-230行
useEffect(() => {
    const timer = setTimeout(() => {
      connectWS();  // ← 尝试WS连接
    }, 0);
    // ★ 问题：无论WS是否成功，模拟器始终启动 ★
    simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);
    ...
}, [connectWS, runSimulation]);
```

WS连接成功后（`onopen`）会清除模拟器，但存在 **竞争窗口** — 在WS握手期间，模拟数据已经注入了 `node-slice`。

**根因 #2 — 降级状态不透明**:

- `connectionState` 有6种值: `"connecting" | "connected" | "disconnecting" | "disconnected" | "reconnecting" | "error"`
- 但实际 `onclose` 中设置为 `"simulated"`（不在类型定义中！）
- [TopBar](file:///Users/yanyu/YYC3-CloudIntelli-Matrix/src/app/components/TopBar.tsx) 接收 `connectionState`，但只显示连接/断连状态，**没有明确告知用户"当前是模拟数据"**

**根因 #3 — 节点数据硬编码**:

```typescript
// node-slice.ts 第24-33行
const DEFAULT_NODES: NodeData[] = [
  { id: "GPU-A100-01", status: "active", gpu: 87, mem: 72, ... },
  // ... 9个硬编码GPU节点
];
```

这些节点在 Store 初始化时就存在，即使没有任何真实后端，Dashboard 也会显示完整的"GPU集群"。**用户无法编辑这些节点信息来指向真实设备**。

### 📋 涉及页面影响链

| 页面                   | 组件              | 数据来源                                    | 问题                   |
| ---------------------- | ----------------- | ------------------------------------------- | ---------------------- |
| 数据监控 `/`           | `DataMonitoring`  | `useWebSocketData().nodes` → `useNodeSlice` | 模拟数据混入，无法区分 |
| 一键跟进 `/follow-up`  | `FollowUpPanel`   | `useNodeSlice.nodes`                        | 节点全部模拟           |
| 巡查模式 `/patrol`     | `PatrolDashboard` | `useNodeSlice.nodes` + IndexedDB            | 节点全部模拟           |
| 告警规则 `/alerts`     | `AlertRulesPanel` | IndexedDB `alertRules`                      | 节点关联为模拟         |
| 协同管理 `/operations` | `OperationCenter` | `usePersistedList`                          | 节点关联为模拟         |

---

## 问题二：🚨 全局设置 vs 统一设置 — 数据分裂

### 问题现象

`/settings`（SystemSettings）和 `/unified-settings`（UnifiedSettingsPanel）是两个独立页面，各自管理不同的数据域，用户不知道该用哪个。

### 代码根因追踪

**两套完全不同的数据源**:

| 维度         | SystemSettings (`/settings`) | UnifiedSettingsPanel (`/unified-settings`)        |
| ------------ | ---------------------------- | ------------------------------------------------- |
| **数据源**   | `useSettingsStore` hook      | `useGlobalStore` (Zustand) + `useProviderSlice`   |
| **存储键**   | `yyc3_system_settings`       | `yyc3-global-store`                               |
| **管理内容** | 19个Toggle + 40+个Value字段  | 安全/存储/备份/加密                               |
| **导入导出** | 通过 `useSettingsStore`      | 通过 `exportStoreData()` / `downloadFullBackup()` |
| **组件**     | 自定义 `EditableField`       | Radix `AlertDialog` + `Tabs`                      |

**文件对照**:

- [useSettingsStore.ts](file:///Users/yanyu/YYC3-CloudIntelli-Matrix/src/app/hooks/useSettingsStore.ts) — SystemSettings 的数据层
- [global-store.ts](file:///Users/yanyu/YYC3-CloudIntelli-Matrix/src/app/stores/global-store.ts) — UnifiedSettings 的数据层

**根因**: 两套 Store **互不通信**。在 SystemSettings 修改的 `wsEndpoint` 不会同步到 UnifiedSettingsPanel 的存储信息中，反之亦然。没有统一的"设置核心"概念落地。

### 数据分裂全景

```
┌───────────────────────────────────────────────────────────────┐
│                   当前状态：4 套设置存储                         │
│                                                               │
│  ① useSettingsStore        → localStorage "yyc3_system_settings"│
│     (SystemSettings 12面板)  19 toggles + 40 values              │
│                                                               │
│  ② useGlobalStore          → localStorage "yyc3-global-store"   │
│     (UnifiedSettings)       autoRefresh/sessions/compact         │
│                                                               │
│  ③ api-config.ts           → localStorage "yyc3_api_endpoints"  │
│     (API端点配置)            fsBase/dbBase/wsEndpoint/aiBase     │
│                                                               │
│  ④ variable-center.ts      → localStorage "yyc3_var_*"          │
│     (VariableCenter)        60+ 变量定义                        │
│                                                               │
│  ⚠️ 4套存储互不关联，无主从关系，无同步机制                       │
└───────────────────────────────────────────────────────────────┘
```

---

## 问题三：🚨 模型设置多页面不统一

### 问题现象

模型管理分散在至少 **4 个独立页面**，每个页面有自己的模型配置逻辑：

| 页面               | 路由                        | 组件                  | 数据源                                        |
| ------------------ | --------------------------- | --------------------- | --------------------------------------------- |
| 模型提供商         | `/models`                   | `ModelProviderPanel`  | `useProviderSlice`                            |
| 系统设置-模型管理  | `/settings` (model section) | `UnifiedModelManager` | `useModelProvider` hook → `useProviderSlice`  |
| AI Family-模型控制 | `/ai-family/models`         | `FamilyModelSettings` | `useProviderSlice` + `useFamilySettingsSlice` |
| AI Family-UI设置   | `/ai-family/settings`       | `FamilyUISettings`    | `useFamilySettingsSlice`                      |

**根因分析**:

1. **`ModelProviderPanel`** 和 **`UnifiedModelManager`** 都使用 `useModelProvider` hook（底层是 `useProviderSlice`），但 UI 完全不同：

   - `ModelProviderPanel`: 完整的 Provider CRUD + 模型添加/删除/测试
   - `UnifiedModelManager`: 精简的选择→测试→使用闭环
2. **`FamilyModelSettings`** 读取 `useProviderSlice` 但还有自己的 `DEFAULT_MODEL_ASSIGNMENTS`（在 `shared.ts` 中硬编码），与全局 Provider 配置 **不完全一致**
3. **缺少 Ollama 智能检测闭环**:

   ```typescript
   // provider-slice.ts 中的 fetchOllamaModels
   // 仅尝试 fetch http://localhost:11434/api/tags
   // 失败后 ollamaError 设为错误信息，没有进一步智能分析
   ```

   文档要求的 "Ollama智能检测发现 → 测试连接 → 结果可视 → 失败检测 → 智能分析 → 智能解决" **仅部分实现**：

   - ✅ 检测发现: `fetchOllamaModels()`
   - ✅ 测试连接: `testAIConnection()` in `connection-test-engine.ts`
   - ✅ 结果可视: `testingIds` 状态 + UI显示
   - ❌ 失败智能分析: 无 Ollama 诊断步骤（端口检查/进程检查/配置修复建议）
   - ❌ 智能解决: 无自动修复能力

---

## 问题四：🚨 智慧酒店 — 与全局数据未对齐

### 问题现象

HotelDashboard 有自己独立的 AI 管理系统，不读取全局 Provider 配置。

### 代码根因

**文件**: [HotelDashboard.tsx](file:///Users/yanyu/YYC3-CloudIntelli-Matrix/src/app/components/HotelDashboard.tsx)

```typescript
// 第64-66行
const [manager] = useState(() => new AIFamilyHotelManager());
const [voiceService] = useState(() => getHotelVoiceService());
const [knowledgeBase] = useState(() => getHotelKnowledgeBase());
```

- `AIFamilyHotelManager` — 独立初始化，有自己的 `HOTEL_ROLES` 定义
- 不从 `useProviderSlice` 读取全局 Provider 配置
- 不从 `useSettingsStore` 读取 WS/API 端点
- `HotelVoiceService` 有自己的语音配置，不从 `FamilyVoiceSystem` 的配置读取

**数据孤岛**:

```
HotelDashboard
├── AIFamilyHotelManager   → 自有 staff/model 管理
├── HotelVoiceService      → 自有语音配置
├── HotelKnowledgeBase     → 自有知识库
└── AILearningEngine       → 自有学习引擎
    ↓
    不连接 → useProviderSlice / useSettingsStore / useFamilySettingsSlice
```

---

## 🎯 根因总结 — 为什么一个月没解决

### 架构层面根因

| 根因编号 | 根因描述                                                     | 影响范围           | 严重度     |
| -------- | ------------------------------------------------------------ | ------------------ | ---------- |
| **RC-1** | **缺少统一数据源层（SSOT）** — 4套设置存储无主从关系         | 全局设置/模型/变量 | 🔴 Critical |
| **RC-2** | **模拟/连接双模式无状态机** — WS和模拟器同时启动，无明确切换 | 监控中心全部页面   | 🔴 Critical |
| **RC-3** | **节点数据硬编码不可编辑** — DEFAULT_NODES 无法通过UI修改    | 数据监控/巡查/告警 | 🔴 Critical |
| **RC-4** | **模型管理分散4处** — 各页面各自读取/管理，无统一入口        | 模型设置/家族模型  | 🟡 Warning  |
| **RC-5** | **酒店模块独立初始化** — 不接入全局 Provider/Settings        | 智慧酒店           | 🟡 Warning  |
| **RC-6** | **Ollama智能闭环不完整** — 缺少诊断分析和智能修复            | 模型检测           | 🟡 Warning  |

### 解决方案优先级排序

**Phase 1 — 核心修复（解决 RC-1, RC-2, RC-3）**

1. **建立 Settings SSOT**: 将 `useSettingsStore` + `api-config.ts` + `variable-center.ts` 三者合并为统一的 `useSettingsSSOT`，SystemSettings 和 UnifiedSettings 都从同一数据源读取
2. **WS/模拟状态机**: 重写 `useWebSocketData` 的初始化逻辑 — 先尝试WS，失败后明确切换到模拟模式，UI显示醒目的"模拟数据"标识
3. **节点可编辑**: 在 `node-slice` 增加 `editNodeConfig()` 方法，在 SystemSettings 或 Dashboard 提供节点编辑入口，允许用户添加/修改真实设备节点

**Phase 2 — 模型统一（解决 RC-4, RC-6）**

4. **统一模型管理入口**: `ModelProviderPanel`、`UnifiedModelManager`、`FamilyModelSettings` 全部委托给 `useProviderSlice`，删除各处硬编码的模型定义
5. **Ollama 智能闭环**: 扩展 `connection-test-engine.ts` 增加 Ollama 专项诊断（端口/进程/配置检测），失败时给出具体修复步骤

**Phase 3 — 酒店对齐（解决 RC-5）**

6. **HotelDashboard 接入全局**: `AIFamilyHotelManager` 从 `useProviderSlice` 读取 Provider，不再独立管理模型配置

---

toolName: todo_write

status: success

Todos updated: 7 items

以上是完整的深度根因分析报告。总结一下 **一个月没解决的核心原因**：

### 为什么卡住？

1. **架构债务而非简单Bug** — 这6个问题不是修几行代码能解决的，它们涉及数据架构层面的重构（4套存储合并、WS状态机重写、模块接入全局）
2. **相互耦合** — 监控中心依赖节点数据，节点数据依赖设置，设置本身又分裂了。修一个需要先修另一个，形成环形依赖
3. **缺少"数据核心"落地** — 文档明确写了"全局设置为数据核心"，但代码中从未真正实现这个SSOT（Single Source of Truth），4套存储各自为政
