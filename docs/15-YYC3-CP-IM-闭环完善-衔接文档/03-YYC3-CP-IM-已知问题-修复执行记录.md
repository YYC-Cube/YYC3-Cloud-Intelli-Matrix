# 03-YYC3-CP-IM-已知问题-修复执行记录

> **执行日期**: 2026-04-30
> **执行范围**: Phase 1 核心修复 (RC-1, RC-2, RC-3)
> **验证状态**: ✅ TypeScript 编译通过 (0 errors)

---

## Phase 1 执行记录

### Phase 1.1: 建立 Settings SSOT ✅

**问题根因**: 4套设置存储互不关联，无主从关系

| 旧存储 | 存储键 | 状态 |
|---|---|---|
| useSettingsStore | `yyc3_system_settings` | → 迁移到 SSOT |
| global-store | `yyc3-global-store` | → 迁移到 SSOT |
| api-config.ts | `yyc3_api_endpoints` | → 迁移到 SSOT |
| variable-center.ts | `yyc3-variable-values` | → 迁移到 SSOT |

**修复文件**:
- **新建**: `src/app/store/slices/settings-ssot-slice.ts` — 统一 Zustand Slice
  - 合并 toggles + values + runtime + apiEndpoints + variableValues
  - 自动从旧 localStorage 键迁移数据
  - Zod 校验集成
  - BroadcastChannel 多标签页同步
  - exportAll / importAll 统一导入导出
- **修改**: `src/app/store/index.ts` — 导出 `useSettingsSSOT`

**向后兼容**: ✅ 旧存储键自动迁移，旧组件无需立即修改

---

### Phase 1.2: WS/模拟状态机修复 ✅

**问题根因**: WS连接和模拟器同时启动（"启动即双跑"），导致模拟数据污染真实数据

**修复文件**:
- **修改**: `src/app/hooks/useWebSocketData.ts` (v2.0.0 → v3.0.0)
  - 删除旧的 `connectWS` useCallback（含重复的 WS 逻辑）
  - 重写 lifecycle useEffect — 状态机逻辑：
    1. 先尝试 WS 连接（8秒超时）
    2. WS 连接成功 → `connected` 状态，清除模拟器
    3. WS 连接失败 → `simulated` 状态，启动模拟器
    4. 重连时先断开模拟器再尝试 WS
  - 新增 `isSimulated: boolean` 返回值
- **修改**: `src/app/types/websocket-types.ts`
  - `WebSocketDataState` 新增 `isSimulated` 字段
- **修改**: `src/app/components/TopBar.tsx`
  - 新增 `isSimulated` prop
  - 当 `isSimulated=true` 时显示橙色"模拟数据"标识
- **修改**: `src/app/components/Layout.tsx`
  - 传递 `wsData.isSimulated` 到 TopBar
- **修改**: `src/app/__tests__/AIDiagnostics.test.tsx`
  - 补充 `isSimulated: false` mock

**核心改动对比**:

| 行为 | 修改前 | 修改后 |
|---|---|---|
| 启动时 | WS + 模拟器同时运行 | 先WS，失败后启动模拟 |
| WS握手期 | 模拟数据注入 node-slice | 无数据注入，等待WS |
| 状态切换 | 模糊（simulated不在类型中） | 明确状态机 |
| UI反馈 | 无标识 | 橙色"模拟数据"badge |

---

### Phase 1.3: 节点可编辑 ✅

**问题根因**: 节点数据硬编码在 DEFAULT_NODES，用户无法通过 UI 编辑

**修复文件**:
- **修改**: `src/app/components/Dashboard.tsx`
  - 节点网格新增"添加节点"虚线按钮
  - 调用 `useNodeSlice().addNode()` 添加新节点
  - 已有 NodeDetailModal 支持节点移除和重启

**node-slice 已有方法**:
- `addNode(node)` — 添加节点
- `updateNode(id, updates)` — 编辑节点（DataBus smartMerge 保护）
- `removeNode(id)` — 移除节点
- `resetNodes()` — 重置为默认

---

## 待执行项 (Phase 2 & 3)

### Phase 2.1: 统一模型管理入口 [pending]
- 4处模型管理统一到 useProviderSlice
- 删除 FamilyModelSettings 中的硬编码 DEFAULT_MODEL_ASSIGNMENTS

### Phase 2.2: Ollama 智能闭环 [pending]
- 扩展 connection-test-engine.ts 增加 Ollama 专项诊断
- 端口检查/进程检查/配置修复建议

### Phase 3.1: HotelDashboard 接入全局 [pending]
- AIFamilyHotelManager 从 useProviderSlice 读取 Provider
- HotelVoiceService 从 FamilyVoiceSystem 配置读取

---

## 验证结果

```
$ npx tsc --noEmit
# 0 errors — 全部通过
```

## 变更文件清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `src/app/store/slices/settings-ssot-slice.ts` | 新建 | Settings SSOT Slice |
| `src/app/store/index.ts` | 修改 | 导出 useSettingsSSOT |
| `src/app/hooks/useWebSocketData.ts` | 修改 | WS状态机修复 v3.0 |
| `src/app/types/websocket-types.ts` | 修改 | 新增 isSimulated |
| `src/app/components/TopBar.tsx` | 修改 | 模拟数据标识 |
| `src/app/components/Layout.tsx` | 修改 | 传递 isSimulated |
| `src/app/components/Dashboard.tsx` | 修改 | 添加节点按钮 |
| `src/app/__tests__/AIDiagnostics.test.tsx` | 修改 | mock 补充 |

---

## Phase 2 执行记录

### Phase 2.1: 统一模型管理入口 ✅

**问题根因**: 模型管理分散在4处，`family-settings-slice` 初始化 `modelAssignments` 为空数组，导致组件 fallback 到硬编码 `DEFAULT_MODEL_ASSIGNMENTS`

**修复文件**:
- **修改**: `src/app/store/slices/family-settings-slice.ts`
  - `modelAssignments` 初始值从 `[]` 改为完整的 8 位家人默认模型分配
  - 默认分配定义在 slice 内部，避免循环依赖
  - Store 持久化后用户自定义配置自动保留

**修复前**: Store 初始化空 → FamilyModelSettings fallback 到 shared.ts 硬编码
**修复后**: Store 初始化即包含完整分配 → 不再需要 fallback → 所有模型管理统一走 `useProviderSlice` + `useFamilySettingsSlice`

### Phase 2.2: Ollama 智能闭环 ✅

**问题根因**: Ollama 连接失败时仅显示 "请确认 Ollama 已启动"，无具体诊断分析

**修复文件**:
- **修改**: `src/app/lib/connection-test-engine.ts` (v1.0.0 → v1.1.0)
  - Ollama 端点检测失败后新增 **"智能诊断"** 步骤
  - 分析内容:
    - 目标地址和端口解析
    - 非 localhost 地址检测 → 提示 `OLLAMA_HOST=0.0.0.0`
    - 超时分析 → 提示 `curl` 命令验证
    - 网络错误 → 提示 `ollama serve` 启动命令
    - 非默认端口检测 → 提示端口配置方法
  - 输出格式化的 `result.suggestion` 包含多条具体修复建议

**Ollama 智能闭环完整度**:

| 闭环步骤 | 修复前 | 修复后 |
|---|---|---|
| 检测发现 | ✅ `fetchOllamaModels()` | ✅ 不变 |
| 测试连接 | ✅ `testAIConnection()` | ✅ 不变 |
| 结果可视 | ✅ UI显示状态 | ✅ 不变 |
| 失败智能分析 | ❌ 仅 "请确认已启动" | ✅ 端口/地址/CORS/超时分析 |
| 智能解决 | ❌ 无 | ✅ 具体环境变量和命令建议 |

---

## 变更文件清单 (Phase 1 + 2 合计)

| 文件 | 操作 | Phase | 说明 |
|---|---|---|---|
| `src/app/store/slices/settings-ssot-slice.ts` | 新建 | P1 | Settings SSOT Slice |
| `src/app/store/index.ts` | 修改 | P1 | 导出 useSettingsSSOT |
| `src/app/hooks/useWebSocketData.ts` | 修改 | P1 | WS状态机修复 v3.0 |
| `src/app/types/websocket-types.ts` | 修改 | P1 | 新增 isSimulated |
| `src/app/components/TopBar.tsx` | 修改 | P1 | 模拟数据标识 |
| `src/app/components/Layout.tsx` | 修改 | P1 | 传递 isSimulated |
| `src/app/components/Dashboard.tsx` | 修改 | P1 | 添加节点按钮 |
| `src/app/__tests__/AIDiagnostics.test.tsx` | 修改 | P1 | mock 补充 |
| `src/app/store/slices/family-settings-slice.ts` | 修改 | P2 | 默认模型分配初始化 |
| `src/app/lib/connection-test-engine.ts` | 修改 | P2 | Ollama 智能诊断 v1.1 |

## 验证结果

```
$ npx tsc --noEmit
# Phase 1: 0 errors
# Phase 2: 0 errors
```

## Phase 3 执行记录

### Phase 3.1: HotelDashboard 接入全局 Provider/Settings ✅

**问题根因**: `HotelDashboard` 使用独立的 `AIFamilyHotelManager`，引用硬编码 `ZHIPU_MODELS`，不与全局 `useProviderSlice` 关联

**修复文件**:
- **修改**: `src/app/lib/ai-family-hotel-manager.ts`
  - 新增 `syncFromGlobalProviders()` 方法
  - 接收全局 Provider 列表、API Keys、模型分配
  - 遍历员工成员，按 `memberId` 匹配分配，更新 `primaryModel` 配置
  - 支持 local/cloud 部署类型自动识别
- **修改**: `src/app/components/HotelDashboard.tsx`
  - 导入 `useProviderSlice` 和 `useFamilySettingsSlice`
  - 订阅 `globalProviders`、`providerKeys`、`modelAssignments`
  - useEffect 自动同步全局 Provider 数据到 `AIFamilyHotelManager`

**数据流修复前**: `ZHIPU_MODELS`(硬编码) → `HOTEL_TEAM_MEMBERS` → `AIFamilyHotelManager`
**数据流修复后**: `useProviderSlice` → `HotelDashboard` → `manager.syncFromGlobalProviders()`

### Phase 3.2: HotelDashboard VoiceService 接入全局配置 ✅

**问题根因**: `HotelVoiceService` 使用固定默认参数（rate=1.0, pitch=1.0, volume=1.0），不读取全局 voiceProfiles

**修复文件**:
- **修改**: `src/app/lib/hotel-voice-service.ts`
  - 新增 `updateVoiceConfig()` 方法
  - 支持动态更新 speechRate/speechPitch/speechVolume/language
- **修改**: `src/app/components/HotelDashboard.tsx`
  - 订阅 `voiceProfiles`，计算平均值
  - useEffect 自动同步到 `voiceService.updateVoiceConfig()`

---

## 变更文件清单 (Phase 1 + 2 + 3 合计)

| 文件 | 操作 | Phase | 说明 |
|---|---|---|---|
| `src/app/store/slices/settings-ssot-slice.ts` | 新建 | P1 | Settings SSOT Slice |
| `src/app/store/index.ts` | 修改 | P1 | 导出 useSettingsSSOT |
| `src/app/hooks/useWebSocketData.ts` | 修改 | P1 | WS状态机修复 v3.0 |
| `src/app/types/websocket-types.ts` | 修改 | P1 | 新增 isSimulated |
| `src/app/components/TopBar.tsx` | 修改 | P1 | 模拟数据标识 |
| `src/app/components/Layout.tsx` | 修改 | P1 | 传递 isSimulated |
| `src/app/components/Dashboard.tsx` | 修改 | P1 | 添加节点按钮 |
| `src/app/__tests__/AIDiagnostics.test.tsx` | 修改 | P1 | mock 补充 |
| `src/app/store/slices/family-settings-slice.ts` | 修改 | P2 | 默认模型分配初始化 |
| `src/app/lib/connection-test-engine.ts` | 修改 | P2 | Ollama 智能诊断 v1.1 |
| `src/app/lib/ai-family-hotel-manager.ts` | 修改 | P3 | syncFromGlobalProviders 方法 |
| `src/app/lib/hotel-voice-service.ts` | 修改 | P3 | updateVoiceConfig 方法 |
| `src/app/components/HotelDashboard.tsx` | 修改 | P3 | 接入全局 Store |

## 验证结果

```
$ npx tsc --noEmit    → 0 errors ✅
$ npx eslint (5 files) → 0 errors ✅
```

---

## 闭环总结

### 根因修复对照表

| 根因编号 | 问题描述 | 修复Phase | 修复状态 |
|---|---|---|---|
| RC-1 | 无 Settings SSOT | P1.1 | ✅ |
| RC-2 | WS/模拟双跑 | P1.2 | ✅ |
| RC-3 | 节点硬编码 | P1.3 | ✅ |
| RC-4 | 模型管理分散 | P2.1 | ✅ |
| RC-6 | Ollama诊断不足 | P2.2 | ✅ |
| RC-5 | HotelDashboard孤立 | P3.1+P3.2 | ✅ |

### 数据流统一度

| 子系统 | 修复前 | 修复后 |
|---|---|---|
| Settings | 4套独立存储 | SSOT → useSettingsSSOT |
| 模型管理 | 空初始化→fallback硬编码 | 完整默认分配→useProviderSlice |
| Ollama | 仅"请启动" | 智能诊断+修复建议 |
| HotelDashboard | 独立ZHIPU_MODELS | 全局Provider同步 |
| VoiceService | 固定默认参数 | 全局voiceProfiles同步 |
| WS数据源 | WS+模拟双跑 | 状态机(先WS后模拟) |

---

## Phase 4: 新一轮问题修复 (用户反馈驱动)

> **触发**: 用户审查 UI 截图后反馈监控中心 5 页面均无模拟模式标识，统一设置页面偏离全局

### Phase 4.1: 监控中心模拟模式标识统一 ✅

**问题**: FollowUpPanel、PatrolDashboard 无模拟模式标识，用户无法区分真实/模拟数据

**修复文件**:
- **修改**: `src/app/components/FollowUpPanel.tsx`
  - 导入 `useWebSocketData`
  - Header 区域添加橙色"模拟数据" badge（`wsData.isSimulated` 驱动）
- **修改**: `src/app/components/PatrolDashboard.tsx`
  - 导入 `useWebSocketData`
  - Header 按钮区添加橙色"模拟数据" badge

### Phase 4.2: 统一设置面板接入 SSOT ✅

**问题**: `UnifiedSettingsPanel` 仅监控旧存储键（`yyc3-global-store` 等），未接入 Phase 1 创建的 `useSettingsSSOT`

**修复文件**:
- **修改**: `src/app/components/UnifiedSettingsPanel.tsx`
  - 导入 `useSettingsSSOT`
  - 存储监控列表新增 `yyc3-settings-ssot` 和 `yyc3-family-settings`
  - 安全面板新增 "Settings SSOT" 状态行，展示开关数量

### 变更文件清单 (Phase 4)

| 文件 | 操作 | Phase | 说明 |
|---|---|---|---|
| `src/app/components/FollowUpPanel.tsx` | 修改 | P4 | 模拟模式标识 |
| `src/app/components/PatrolDashboard.tsx` | 修改 | P4 | 模拟模式标识 |
| `src/app/components/UnifiedSettingsPanel.tsx` | 修改 | P4 | 接入 SSOT + 存储监控 |

### 累计变更文件 (Phase 1-4)

共 **16 个文件**（1 新建 + 15 修改），TypeScript 编译 0 errors ✅
