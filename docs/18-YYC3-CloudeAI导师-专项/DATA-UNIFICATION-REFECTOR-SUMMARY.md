# YYC³ 数据统一重构总结文档 (Data Unification Refactor Summary)

> **项目**: YYC³-CloudIntelli-Matrix
> **重构代号**: `yyc3-data-unification-refactor`
> **时间跨度**: 2026-04-15 ~ 2026-04-18
> **版本**: v3.3 → v3.4-pre
> **执行者**: YYC-Cube (项目创始人) + Claude Opus 4.6 (AI 协作导师)
> **状态**: Phase A~V 全部完成

---

## 1. 重构目标

将分散在 ~50 个生产文件中的 ~65 个独立 `localStorage` 键统一迁移到 **Zustand Store Slices**，实现：

- **SSOT (Single Source of Truth)**: 每个数据域一个权威数据源
- **自动持久化**: Zustand `persist` middleware 替代手动 `localStorage.getItem/setItem`
- **类型安全**: TypeScript 接口约束所有 state 和 action
- **组件解耦**: 组件只关心 selector + action，不关心持久化层
- **createLocalStore 归零**: 生产代码中 `createLocalStore` 引用从 N → 1 (仅 `dashboard-stores.ts` test-only)

---

## 2. Phase 总览

| Phase | 名称 | 目标文件 | 风险 | 状态 |
|-------|------|---------|------|------|
| **A** | Store 架构搭建 | `store/index.ts`, 15 slice 文件 | — | ✅ |
| **B** | Node Slice 迁移 | `useClusterManager.ts` | LOW | ✅ |
| **C** | Metrics Slice 迁移 | `useClusterManager.ts` (metrics 部分) | LOW | ✅ |
| **D** | App Slice 迁移 | `useClusterManager.ts` (app 部分) | LOW | ✅ |
| **E** | Log Slice 迁移 | `LogPanel.tsx` | LOW | ✅ |
| **F** | DB-Conn Slice 迁移 | `DatabaseConnectionPanel.tsx` | MEDIUM | ✅ |
| **G** | User-Mgmt Slice 迁移 | `UserManagement.tsx` | MEDIUM | ✅ |
| **H** | Network Slice 迁移 | 网络相关组件 | LOW | ✅ |
| **I** | Follow-Up Slice 迁移 | 跟进相关组件 | LOW | ✅ |
| **J** | Model Slice 迁移 | 模型管理组件 | LOW | ✅ |
| **K** | Provider Slice 迁移 | 提供商管理组件 | LOW | ✅ |
| **L** | Family-Member Slice 迁移 | AI-Family 成员组件 | MEDIUM | ✅ |
| **M** | Family-Message Slice 迁移 | AI-Family 消息组件 | MEDIUM | ✅ |
| **N** | Family-Settings Slice 创建 | `family-settings-slice.ts` (新建) | — | ✅ |
| **O** | FamilyHotel 迁移 | `FamilyHotel.tsx` | MEDIUM | ✅ |
| **P** | FamilyMusic 迁移 | `FamilyMusic.tsx` | MEDIUM | ✅ |
| **Q** | 主题/语言/侧边栏 三写修复 | 多个组件 | LOW | ✅ |
| **R** | CreationStudio + ModelSettings + VoiceSystem | 3 个 AI-Family 组件 | MEDIUM | ✅ |
| **S** | FamilyCommCenter 迁移 | `FamilyCommCenter.tsx` | MEDIUM | ✅ |
| **T** | FamilyUISettings 迁移 | `FamilyUISettings.tsx` | MEDIUM | ✅ |
| **U** | AISuggestion Slice + createLocalStore 归零 | `useAISuggestion.ts` → `ai-suggestion-slice.ts` | LOW | ✅ |
| **V** | IDE Settings Slice | `IDELayout.tsx`, `IDESettingsPanel.tsx`, `LayoutContext.tsx` | MEDIUM | ✅ |

---

## 3. Store Slices 总览

### 3.1 已有 Slice (Phase A~K 创建)

| Slice | 文件 | localStorage Key | 持久化策略 |
|-------|------|-------------------|-----------|
| `useNodeSlice` | `node-slice.ts` | `yyc3-nodes` | full |
| `useMetricsSlice` | `metrics-slice.ts` | `yyc3-metrics` | full |
| `useAppSlice` | `app-slice.ts` | `yyc3-app` | partial |
| `useLogSlice` | `log-slice.ts` | `yyc3-logs` | full |
| `useDbConnSlice` | `db-conn-slice.ts` | `yyc3-db-connections` | full |
| `useUserMgmtSlice` | `user-mgmt-slice.ts` | `yyc3-users` | full |
| `useNetworkSlice` | `network-slice.ts` | `yyc3-networks` | full |
| `useFollowUpSlice` | `follow-up-slice.ts` | `yyc3-followups` | full |
| `useModelSlice` | `model-slice.ts` | `yyc3-models` | full |
| `useProviderSlice` | `provider-slice.ts` | `yyc3-providers` | full |

### 3.2 Family 核心 Slice (Phase L~T 创建/增强)

| Slice | 文件 | localStorage Key | 持久化策略 | 数据域 |
|-------|------|-------------------|-----------|--------|
| `useFamilyMemberSlice` | `family-member-slice.ts` | `yyc3-family-members` | full | 8 位 AI 家人 SSOT |
| `useFamilyMessageSlice` | `family-message-slice.ts` | `yyc3-family-messages` | full | 家人消息流 |
| `useFamilySettingsSlice` | `family-settings-slice.ts` | `yyc3-family-settings` | full | voiceProfiles, voiceConversations, commMessages, uiConfig, modelAssignments, providerKeys, musicWorks (7 域) |
| `useAISuggestionSlice` | `ai-suggestion-slice.ts` | `yyc3-ai-suggestion` | partial (patterns + recommendations) | 异常模式 + 智能推荐 |

### 3.3 IDE Slice (Phase V 创建)

| Slice | 文件 | localStorage Key | 持久化策略 | 数据域 |
|-------|------|-------------------|-----------|--------|
| `useIDESettingsSlice` | `ide-settings-slice.ts` | `yyc3-ide` | full | layoutMode, settings (11 字段), layoutConfig |

---

## 4. AI-Family 组件迁移详情

AI-Family 目录 (`src/app/components/ai-family/`) 共 34 个 `.tsx` 文件，其中 6 个涉及 localStorage 状态管理的组件已全部迁移到 `useFamilySettingsSlice`：

| 组件 | Phase | 迁移前 localStorage 键 | 迁移后数据源 |
|------|-------|------------------------|-------------|
| `FamilyHotel.tsx` | O | `yyc3-family-hotel-data` | `useFamilyMemberSlice` |
| `FamilyMusic.tsx` | P | `d-music-player` | `useFamilySettingsSlice.musicWorks` |
| `CreationStudio.tsx` | R1 | `d-music-works` | `useFamilySettingsSlice.musicWorks` |
| `FamilyModelSettings.tsx` | R2 | `yyc3-family-provider-keys`, `yyc3-family-model-assignments`, `yyc3-family-voice-profiles` | `useFamilySettingsSlice` (providerKeys, modelAssignments, voiceProfiles) |
| `FamilyVoiceSystem.tsx` | R3 | `yyc3-family-voice-profiles`, `yyc3-family-voice-conversations` | `useFamilySettingsSlice` (voiceProfiles, voiceConversations) |
| `FamilyCommCenter.tsx` | S | `yyc3-family-comm-messages` | `useFamilySettingsSlice.commMessages` |
| `FamilyUISettings.tsx` | T | `yyc3-family-ui-config` + 7 个导出/导入键 | `useFamilySettingsSlice` (全部 7 域) |

**AI-Family 目录 localStorage 状态管理归零**（仅剩 `FamilyUISettings.tsx` 中 2 个诊断用只读调用）。

---

## 5. IDE 组件迁移详情 (Phase V)

| 组件 | 迁移前 localStorage 键 | 迁移后 |
|------|------------------------|--------|
| `IDELayout.tsx` | `yyc3-ide-layout-mode` | `useIDESettingsSlice.layoutMode` |
| `IDESettingsPanel.tsx` | `yyc3-ide-settings` (11 字段) | `useIDESettingsSlice.settings` |
| `LayoutContext.tsx` | `ide-layout` (LayoutConfig) | `useIDESettingsSlice.layoutConfig` |

**3 个 IDE 组件 localStorage 归零。**

---

## 6. createLocalStore 归零 (Phase U)

| 文件 | 状态 |
|------|------|
| `useAISuggestion.ts` | ✅ 从 createLocalStore 消费者 → Zustand slice 薄 wrapper |
| `dashboard-stores.ts` | ⚠️ test-only infrastructure (6 个测试文件依赖) |
| `create-local-store.ts` | 🏗️ 保留为 test-only utility |

**生产代码 createLocalStore 引用: 1 → 0** (dashboard-stores.ts 已标记 test-only)

---

## 7. Legacy 迁移工具

每个新 Slice 都提供了一次性 Legacy 迁移函数，自动将旧 localStorage 键数据迁移到新 Slice：

| 函数 | 旧键 | 新 Slice |
|------|------|---------|
| `migrateLegacyUIConfig()` | `yyc3-family-ui-config` | `useFamilySettingsSlice` |
| `migrateLegacyAISuggestion()` | `yyc3_ai_patterns`, `yyc3_ai_recommendations` | `useAISuggestionSlice` |
| `migrateLegacyIDESettings()` | `yyc3-ide-layout-mode`, `yyc3-ide-settings`, `ide-layout` | `useIDESettingsSlice` |

迁移函数的行为: 读取旧键 → 合并到 Slice → 删除旧键。幂等设计，重复调用安全。

---

## 8. 架构模式

### 8.1 Slice 结构模式

```typescript
// 标准 Slice 结构
interface XxxSlice {
  // 数据域
  data: DataType[];
  config: ConfigType;

  // CRUD 操作
  setData: (data: DataType[]) => void;
  addItem: (item: DataType) => void;
  updateItem: (id: string, updates: Partial<DataType>) => void;
  removeItem: (id: string) => void;

  // 批量操作
  clearAll: () => void;
  exportAll: () => string;
  importAll: (json: string) => boolean;
}

export const useXxxSlice = create<XxxSlice>()(
  persist(
    (set, get) => ({ /* 实现 */ }),
    { name: 'yyc3-xxx', storage: createJSONStorage(() => localStorage) }
  )
);
```

### 8.2 组件迁移模式

```
Before:                          After:
┌──────────────────────┐        ┌──────────────────────┐
│ useState + useEffect │  ──►   │ useXxxSlice(selector) │
│ localStorage I/O     │        │ slice.actions         │
│ 手动序列化/反序列化    │        │ 自动持久化             │
└──────────────────────┘        └──────────────────────┘
```

### 8.3 薄 Wrapper 模式 (useAISuggestion)

```typescript
// Hook 作为 Slice 的计算层
export function useAISuggestion() {
  const patterns = useAISuggestionSlice(s => s.patterns);
  const overallHealth = useMemo(() => computeHealth(patterns), [patterns]);
  const sortedPatterns = useMemo(() => sortPatterns(patterns), [patterns]);
  // Actions 委托 slice
  return { patterns: sortedPatterns, overallHealth, ... };
}
```

---

## 9. 遗留 localStorage 分布

重构完成后，`src/app/` 下仍有 **~48 个生产文件** 使用直接 localStorage 调用。这些属于以下类别：

| 类别 | 文件数 | 说明 |
|------|--------|------|
| **基础设施/服务层** | ~15 | `storageManager.ts`, `yyc3-storage.ts`, `full-backup.ts`, `crypto-vault.ts` 等 |
| **库/工具层** | ~12 | `error-handler.ts`, `network-utils.ts`, `api-config.ts`, `mcp-context.ts` 等 |
| **Hooks** | ~8 | `useI18n.ts`, `useBigModelSDK.ts`, `useOfflineMode.ts`, `useLocalFileSystem.ts` 等 |
| **配置中心** | 3 | `design-system.ts`, `variable-center.ts`, `page-config.ts` |
| **组件 (非 Family/IDE)** | ~8 | `AIAssistant.tsx`, `DatabaseConnectionPanel.tsx`, `ConfigCenter.tsx` 等 |
| **Slice 迁移函数** | 3 | `ai-suggestion-slice.ts`, `family-settings-slice.ts`, `ide-settings-slice.ts` (仅迁移用) |

**这些文件暂不纳入本轮重构范围**，原因：
1. 基础设施层有自己的持久化逻辑 (加密、备份、同步)
2. 部分 Hook 已使用 Zustand persist 内部存储
3. 配置中心有动态 key 模式，不适合静态 Slice
4. 组件层可在后续迭代中逐步迁移

---

## 10. 验证标准

每个 Phase 完成后均通过以下验证：

```bash
# TypeScript 编译
bunx tsc --noEmit  # → 0 errors

# AI-Family localStorage 归零 (Phase R~T)
grep -r 'localStorage\.\(get\|set\)Item' src/app/components/ai-family/*.tsx
# → 仅 FamilyUISettings.tsx 2 个诊断只读调用

# IDE localStorage 归零 (Phase V)
grep -r 'localStorage' src/app/components/ide/IDELayout.tsx  # → 0
grep -r 'localStorage' src/app/components/ide/IDESettingsPanel.tsx  # → 0
grep -r 'localStorage' src/app/components/ide/LayoutContext.tsx  # → 0

# createLocalStore 生产引用归零 (Phase U)
grep -r 'from.*create-local-store' src/app/ --include='*.ts' --include='*.tsx' -l | grep -v __tests__
# → 仅 dashboard-stores.ts (test-only)
```

---

## 11. 文件变更统计

| 类别 | 新建 | 修改 | 总计 |
|------|------|------|------|
| Store Slices | 4 (`family-settings`, `ai-suggestion`, `ide-settings`, + 1) | 12 | 16 |
| AI-Family 组件 | 0 | 7 | 7 |
| IDE 组件 | 0 | 3 | 3 |
| Hooks | 0 | 1 | 1 |
| Store Index | 0 | 1 | 1 |
| **总计** | **4** | **24** | **28** |

---

## 12. 关键决策记录

### 12.1 family-settings-slice 合并 7 域 (Phase N)

**决策**: 将 voiceProfiles, voiceConversations, commMessages, uiConfig, modelAssignments, providerKeys, musicWorks 合并为单一 Slice，而非创建 7 个独立 Slice。

**理由**: 7 个域的数据量小（总计 < 50KB），共享同一个 localStorage key 避免写入竞争，且组件经常跨域操作（如 FamilyUISettings 需要导出/导入全部数据）。

### 12.2 useAISuggestion 保留薄 Wrapper (Phase U)

**决策**: `useAISuggestion.ts` 不直接删除，而是重写为 Zustand Slice 的 React 计算层。

**理由**: AISuggestionPanel.tsx 已经依赖 `useAISuggestion` hook 的 API。保留薄 wrapper 确保 UI 层零改动，同时底层从 createLocalStore 迁移到 Zustand。

### 12.3 LayoutContext 保留 useReducer (Phase V)

**决策**: LayoutContext.tsx 的复杂 useReducer 逻辑不变，仅替换 localStorage I/O 为 Zustand slice。

**理由**: LayoutContext 有 17 种 action type (拖拽、调整、标签页管理等)，useReducer 是最合适的模式。Zustand slice 仅作为持久化层，不替代运行时状态管理。

### 12.4 dashboard-stores.ts 保留为 test-only (Phase U)

**决策**: 不迁移 dashboard-stores.ts 中的 12 个 createLocalStore 实例。

**理由**: 该文件仅供 6 个测试文件使用，不属于生产路径。迁移测试依赖的投入产出比不合理。

---

## 13. 后续建议

1. **渐进式迁移**: 剩余 ~48 个文件的 localStorage 可在后续迭代中逐步迁移到 Slice
2. **优先级建议**:
   - `useOfflineMode.ts` (13 个 localStorage 调用) → offline-slice
   - `DatabaseConnectionPanel.tsx` (SQL 历史 + 连接池) → db-slice 增强
   - `useLocalFileSystem.ts` → fs-slice
3. **dashboard-stores.ts 清理**: 当测试迁移到 Zustand mock 后，可删除 `create-local-store.ts` 和 `dashboard-stores.ts`
4. **IndexedDB 迁移**: 大数据量域 (commMessages, voiceConversations) 可考虑从 localStorage 迁移到 IndexedDB

---

## 14. 技术栈

- **状态管理**: Zustand v5 + persist middleware
- **持久化**: localStorage (createJSONStorage)
- **类型系统**: TypeScript strict mode
- **运行时**: Bun
- **框架**: React 19 + React Router 7

---

*文档生成时间: 2026-04-18*
*由 YYC-Cube + Claude Opus 4.6 协作完成*
