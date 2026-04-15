# YYC³ Cloud Intelli-Matrix — 数据逻辑统一方案

> **版本**: v1.0.0 | **生成日期**: 2026-04-15 | **状态**: 实施完成 · 持续演进

---

## 目录

1. [背景与目标](#1-背景与目标)
2. [存储架构全景](#2-存储架构全景)
3. [已修复缺陷清单](#3-已修复缺陷清单)
4. [SSOT 桥接架构](#4-ssot-桥接架构)
5. [统一同步通道](#5-统一同步通道)
6. [敏感数据加密](#6-敏感数据加密)
7. [全量备份恢复](#7-全量备份恢复)
8. [遗留风险与演进路线](#8-遗留风险与演进路线)

---

## 1. 背景与目标

### 1.1 项目定位

YYC³ Cloud Intelli-Matrix 是"一体化本地存储应用"，核心设计哲学：

- **纯开源 / 本地化** — 零后端依赖，所有数据存储于浏览器
- **一用户一端** — 单用户设备，极致信任模型
- **高可定制** — 所有核心信息均可由用户通过 UI 编辑

### 1.2 问题发现

项目在演进过程中形成了 **4 层存储 + 多个独立 Hook 存储**，同一类数据分散在 3~5 个不同的 localStorage key 中，导致：

- 不同 UI 页面读写不同的 store，数据互不可见
- 模型服务商在两个页面展示数量不同（3 家 vs 9 家）
- 数据库连接在一个页面添加后另一个页面看不到
- 跟进任务在管理面板新增后通知面板不显示
- BroadcastChannel 碎片化（5 个独立通道互不相通）

### 1.3 修复目标

| 目标 | 状态 | 说明 |
|------|------|------|
| 确立 GlobalStore 为 SSOT | ✅ 完成 | 所有 Slice Store 写入操作桥接到 GlobalStore |
| 统一类型定义 | ✅ 完成 | 11 个类型从 dashboard-stores 迁移到 types/index.ts |
| 统一 BroadcastChannel | ✅ 完成 | 5 通道合并为 1 统一通道 + 向后兼容 |
| 敏感数据加密 | ✅ 完成 | Web Crypto API AES-256-GCM 加密库就绪 |
| 全量备份恢复 | ✅ 完成 | 一键导出/导入所有存储层 |

---

## 2. 存储架构全景

### 2.1 四层存储并存

```
┌─────────────────────────────────────────────────────────────────┐
│                       YYC³ 存储架构 (现状)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: GlobalStore (SSOT 中枢)                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 文件: stores/global-store.ts                             │   │
│  │ Key:  yyc3-global-store                                  │   │
│  │ 域:   User | Config | Model | Database | Alert | Chat    │   │
│  │ 角色: 数据聚合中心，接收所有桥接写入                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▲ bridge                              │
│  Layer 2: Slice Stores (9个独立 Zustand Store)                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ node   │ │db-conn │ │followUp│ │ model  │ │  user  │     │
│  │ ✅桥接 │ │ ✅桥接 │ │ ✅桥接 │ │   独立 │ │   独立 │     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│  │network │ │  log   │ │metrics │ │  app   │                │
│  │   独立 │ │   独立 │ │   独立 │ │   独立 │                │
│  └────────┘ └────────┘ └────────┘ └────────┘                │
│                                                                 │
│  Layer 3: 独立 Hook 存储                                        │
│  ┌──────────────────┐ ┌──────────────────┐ ┌───────────────┐ │
│  │ useSettingsStore │ │ useModelProvider │ │useNetworkConfig│ │
│  │ yyc3_system_     │ │ yyc3_model_      │ │ network_config │ │
│  │ settings         │ │ providers        │ │               │ │
│  │ ✅桥接(darkMode) │ │ ✅桥接(providers)│ │    独立        │ │
│  └──────────────────┘ └──────────────────┘ └───────────────┘ │
│                                                                 │
│  Layer 4: 直接 localStorage 访问                                │
│  ┌──────────────┐ ┌───────────────┐ ┌──────────────┐        │
│  │ThemeCustomizer│ │VariableCenter │ │IDESettings   │        │
│  │yyc3_custom_  │ │yyc3-variable- │ │yyc3-ide-     │        │
│  │theme         │ │values         │ │settings      │        │
│  └──────────────┘ └───────────────┘ └──────────────┘        │
│  ┌──────────────┐                                              │
│  │EnvConfigEdit │                                              │
│  │yyc3_env_config│                                              │
│  └──────────────┘                                              │
│                                                                 │
│  加密层: CryptoVault (AES-256-GCM)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ vault:{key} 前缀存储加密数据 · secureStorage API          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  备份层: FullBackup (全量导出/导入)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ localStorage + IndexedDB + GlobalStore → 单文件 JSON     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 localStorage 键注册表

| Key | 所属层 | 管理者 | 用途 |
|-----|--------|--------|------|
| `yyc3-global-store` | Layer 1 | GlobalStore | SSOT 中枢全量状态 |
| `yyc3-node-slice` | Layer 2 | useNodeSlice | GPU 节点遥测数据 |
| `yyc3-db-conn-slice` | Layer 2 | useDbConnSlice | 数据库连接配置 |
| `yyc3-log-slice` | Layer 2 | useLogSlice | 系统日志 (最近 200 条) |
| `yyc3-metrics-slice` | Layer 2 | useMetricsSlice | 图表指标数据 |
| `yyc3-model-slice` | Layer 2 | useModelSlice | GPU 部署模型 |
| `yyc3-follow-up-slice` | Layer 2 | useFollowUpSlice | 跟进任务 |
| `yyc3-app-slice` | Layer 2 | useAppSlice | 主题/语言/侧边栏 |
| `yyc3-user-mgmt-slice` | Layer 2 | useUserMgmtSlice | 用户管理 |
| `yyc3-network-slice` | Layer 2 | useNetworkSlice | WiFi 网络配置 |
| `yyc3_system_settings` | Layer 3 | useSettingsStore | 系统设置 (19 toggles + 40 values) |
| `yyc3_model_providers` | Layer 3 | useModelProvider | 模型服务商列表 |
| `yyc3_configured_models` | Layer 3 | useModelProvider | 已配置模型列表 |
| `network_config` | Layer 3 | useNetworkConfig | 网络手动配置 |
| `yyc3_env_config` | Layer 4 | EnvConfigEditor | 环境变量配置 |
| `yyc3_custom_theme` | Layer 4 | ThemeCustomizer | 自定义主题配色 |
| `yyc3-variable-values` | Layer 4 | VariableCenter | 变量中心值 |
| `yyc3-ide-settings` | Layer 4 | IDESettingsPanel | IDE 编辑器设置 |
| `yyc3_db_pool_config` | - | DatabaseConnectionPanel | 连接池配置 |
| `yyc3_sql_history` | - | DatabaseConnectionPanel | SQL 执行历史 |
| `yyc3_api_endpoints` | - | SystemSettings | API 端点配置 |

---

## 3. 已修复缺陷清单

### 3.1 P0 严重缺陷 (4 项)

| ID | 缺陷 | 修复方案 | 状态 |
|----|------|---------|------|
| GAP-001 | **模型服务商三源分裂** — GlobalStore 默认 3 家 vs useModelProvider 默认 9 家 | 扩展 GlobalStore DEFAULT_PROVIDERS 至 9 家 + bridgeProvidersToGlobal | ✅ 已修复 |
| GAP-002 | **主题/语言多处分裂** — theme/locale/sidebarCollapsed 在 3 个 store 中存储 | darkMode→theme 桥接 (useSettingsStore→GlobalStore) | ⚠️ 部分修复 |
| GAP-003 | **数据库连接四源分裂** — GlobalStore 和 db-conn-slice 使用不同类型 | 统一 DBConnection 类型 + bridgeConnectionsToGlobal + 反向桥接 | ✅ 已修复 |
| GAP-004 | **跟进任务双源分裂** — FollowUpPanel 用 GlobalStore, FollowUpManager 用 follow-up-slice | bridgeFollowUpsToGlobal (含字段映射) | ✅ 已修复 |

### 3.2 P1 高风险缺陷 (3 项)

| ID | 缺陷 | 修复方案 | 状态 |
|----|------|---------|------|
| GAP-005 | **wsEndpoint 多重定义** — 5 处不同字段名 | 文档记录，待统一到 env-config | ⚠️ 已知 |
| GAP-006 | **AI 配置四处分裂** | useModelProvider→GlobalStore 桥接 + useSettingsStore darkMode 桥接 | ✅ 已修复 |
| GAP-007 | **BroadcastChannel 碎片化** — 5 个独立通道 | 合并为 yyc3-unified-sync + 向后兼容 | ✅ 已修复 |

### 3.3 P2 中等风险缺陷 (3 项)

| ID | 缺陷 | 修复方案 | 状态 |
|----|------|---------|------|
| GAP-008 | **导出/导入不覆盖全量** | full-backup.ts 一键全量备份/恢复 | ✅ 已修复 |
| GAP-009 | **Slice 类型反向依赖 Legacy** | 类型迁移到 types/index.ts | ✅ 已修复 |
| GAP-010 | **DBConnection 类型不一致** | 统一类型定义，扩展枚举 | ✅ 已修复 |

### 3.4 安全缺陷 (3 项)

| ID | 缺陷 | 修复方案 | 状态 |
|----|------|---------|------|
| SEC-001 | **API Key / 数据库密码明文存储** | crypto-vault.ts 加密库 | ✅ 库就绪，待集成 |
| SEC-002 | **无设备绑定机制** | CryptoVault 基于设备指纹派生密钥 | ✅ 已实现 |
| SEC-003 | **sessionTimeout 配置存在但无执行逻辑** | 待后续实现 | ⚠️ 已知 |

---

## 4. SSOT 桥接架构

### 4.1 桥接函数清单

| 函数 | 方向 | 触发时机 | 文件位置 |
|------|------|---------|---------|
| `bridgeProvidersToGlobal(providers)` | Hook→Global | useModelProvider 保存时 | global-store.ts |
| `bridgeModelsToGlobal(models)` | Hook→Global | useModelProvider 保存时 | global-store.ts |
| `bridgeConnectionsToGlobal(connections)` | Slice→Global | db-conn-slice 每次变更 | db-conn-slice.ts |
| `bridgeFollowUpsToGlobal(followUps)` | Slice→Global | follow-up-slice 每次变更 | follow-up-slice.ts |
| `setConnections` (反向桥接) | Global→Slice | GlobalStore 写入连接时 | global-store.ts |
| `syncAllSlicesToGlobal()` | localStorage→Global | initStoreSync 启动时 | global-store.ts |
| darkMode→setTheme | Settings→Global | useSettingsStore toggleSetting | useSettingsStore.ts |

### 4.2 桥接流程图

```
Slice Store 写入操作                                  GlobalStore (SSOT)
====================                                 ==================

db-conn-slice                                         UserDomain
  addConnection()    ─┐                                 user, token, isGhost
  updateConnection()  │                                ──────────────────
  removeConnection()  ├─ syncToGlobal()                ConfigDomain
  setStatus()        ─┘  → bridgeConnectionsToGlobal     theme, locale, ...
                                                           ▲
follow-up-slice                                        ModelDomain
  addFollowUp()      ─┐                                   providers
  updateFollowUp()    │                                   configuredModels
  removeFollowUp()    ├─ syncToGlobal()                   activeModelId
  completeFollowUp() ─┘  → bridgeFollowUpsToGlobal      ──────────────────
                                                      DatabaseDomain
useModelProvider                                        connections ◄── 反向桥接
  saveProviders()   ──→ bridgeProvidersToGlobal           activeConnectionId
  saveModels()      ──→ bridgeModelsToGlobal            ──────────────────
                                                      AlertDomain
useSettingsStore                                        followUps
  toggleSetting()   ──→ setTheme (darkMode only)       ──────────────────
                                                      ChatDomain
                                                        sessions
无桥接的独立 Slice (7个):                               activeSessionId
  model-slice (GPU 部署模型)
  user-mgmt-slice (用户记录)
  network-slice (WiFi)
  node-slice (GPU 遥测)
  app-slice (主题/语言，部分重复)
  metrics-slice (图表数据)
  log-slice (系统日志)
```

### 4.3 桥接实现模式

**模式 A: Slice 静态导入桥接** (db-conn-slice, follow-up-slice)

```typescript
// 在 Slice 文件内
import { bridgeConnectionsToGlobal } from '../../stores/global-store';

function syncToGlobal(connections: DBConnection[]) {
  try { bridgeConnectionsToGlobal(connections); } catch { /* ignore */ }
}

// 在每个 mutation action 末尾调用
addConnection: (conn) => set(state => {
  const connections = [...state.connections, conn];
  syncToGlobal(connections);
  return { connections };
}),
```

**模式 B: Hook 动态 require 桥接** (useModelProvider, useSettingsStore)

```typescript
// 在 Hook 文件内，使用 require() 避免循环依赖
export function saveProviders(providers: ModelProviderDef[]) {
  try { localStorage.setItem(KEY, JSON.stringify(providers)); } catch { /* */ }
  try {
    const { bridgeProvidersToGlobal } = require("../stores/global-store");
    bridgeProvidersToGlobal(providers);
  } catch { /* */ }
}
```

**模式 C: 反向桥接** (GlobalStore → Slice)

```typescript
// 在 GlobalStore 的 setConnections 内
setConnections: (connections) => {
  set({ connections });
  try {
    const { useDbConnSlice } = require("../store/slices/db-conn-slice");
    const currentIds = useDbConnSlice.getState().connections.map(c => c.id).sort().join();
    const newIds = connections.map(c => c.id).sort().join();
    if (currentIds !== newIds) {
      useDbConnSlice.setState({ connections }); // 避免无限循环
    }
  } catch { /* slice not available */ }
},
```

### 4.4 字段映射: FollowUpRecord → FollowUpItem

`bridgeFollowUpsToGlobal` 执行非平凡的字段映射：

| 源字段 (FollowUpRecord) | 目标字段 (FollowUpItem) | 映射规则 |
|-------------------------|------------------------|---------|
| `priority: "critical"` | `severity: "critical"` | 直映射 |
| `priority: "high"` | `severity: "error"` | 降级映射 |
| `priority: "medium"/"low"` | `severity: "warning"` | 合并映射 |
| `status: "completed"` | `status: "resolved"` | 语义映射 |
| `status: "cancelled"` | `status: "ignored"` | 语义映射 |
| 其他 status | `status: "active"` | 默认 |
| - | `chain: []` | 必填空数组 |

---

## 5. 统一同步通道

### 5.1 架构

**统一通道**: `yyc3-unified-sync` (BroadcastChannel)

替代了 5 个独立通道：
- ~~`yyc3-store-sync`~~
- ~~`yyc3_settings_sync`~~
- ~~`yyc3_api_config`~~
- ~~`yyc3_storage_sync`~~
- ~~`yyc3_settings_sync`~~

### 5.2 SyncDomain 枚举

```typescript
type SyncDomain =
  | "global-store"      // GlobalStore 变更
  | "settings"          // useSettingsStore 变更
  | "model-providers"   // 模型服务商配置
  | "api-config"        // API 配置
  | "indexeddb"         // IndexedDB 变更
  | "node-slice"        // GPU 节点数据
  | "db-conn-slice"     // 数据库连接
  | "follow-up-slice"   // 跟进任务
  | "user-mgmt-slice"   // 用户管理
  | "network-slice";    // 网络配置
```

### 5.3 消息格式

```typescript
interface UnifiedSyncMessage {
  domain: SyncDomain;
  action: "update" | "create" | "delete" | "reset";
  timestamp: number;
  source?: string;
}
```

### 5.4 向后兼容

`broadcastSyncMessage()` 同时发送到统一通道和对应的遗留通道：

| domain | 遗留通道 | 遗留消息格式 |
|--------|---------|-------------|
| `global-store` | `yyc3-store-sync` | `{ type: "store-update" }` |
| `settings` | `yyc3_settings_sync` | `{ type: "settings_update", state }` |
| `api-config` | `yyc3_api_config` | `{ type: "api-config-update" }` |
| `indexeddb` | `yyc3_storage_sync` | `{ type: "idb-change" }` |

### 5.5 跨标签页同步流程

```
Tab A: 用户操作
    │
    ├── Slice mutation → syncToGlobal()
    │   └── bridgeConnectionsToGlobal() → GlobalStore.setState()
    │
    └── broadcastSyncMessage({ domain: "db-conn-slice", action: "update" })
            │
            ├──► yyc3-unified-sync (主通道)
            │        │
            │        ▼
            │   Tab B: onUnifiedSync() handler
            │        ├── GlobalStore.rehydrate()
            │        └── syncAllSlicesToGlobal()
            │
            └──► 遗留通道 (向后兼容)

Tab B: localStorage 'storage' event
    └── window listener → GlobalStore.rehydrate()
```

---

## 6. 敏感数据加密

### 6.1 CryptoVault 架构

**文件**: `src/app/lib/crypto-vault.ts`

```
┌──────────────────────────────────────────────────────┐
│                  CryptoVault 加密流程                  │
│                                                      │
│  明文 (API Key / 密码)                                │
│      │                                               │
│      ▼                                               │
│  getDeviceFingerprint()                              │
│    ├── navigator.userAgent                            │
│    ├── screen.width x height x colorDepth            │
│    ├── Intl.DateTimeFormat().resolvedOptions.timeZone │
│    ├── navigator.language                             │
│    ├── navigator.platform                             │
│    ├── navigator.hardwareConcurrency                 │
│    └── navigator.deviceMemory                        │
│      │                                               │
│      ▼                                               │
│  PBKDF2 (100,000 iterations, SHA-256, hardcoded salt)│
│      │                                               │
│      ▼                                               │
│  AES-256-GCM 密钥                                    │
│      │                                               │
│      ├── encrypt(plaintext) → Base64(iv + ciphertext)│
│      └── decrypt(base64) → plaintext                  │
│                                                      │
│  存储位置: localStorage `vault:{key}` 前缀            │
│  安全模型: 同一设备同一浏览器才能解密                   │
└──────────────────────────────────────────────────────┘
```

### 6.2 secureStorage API

```typescript
// 加密后存储
await secureStorage.setItem("api_key", "sk-xxxxx");
// → localStorage: vault:api_key = "base64(iv+ciphertext)"

// 读取并解密
const key = await secureStorage.getItem("api_key");
// → "sk-xxxxx"

// 移除 (加密版和明文版都清理)
secureStorage.removeItem("api_key");
```

### 6.3 当前集成状态

| 组件/Store | 敏感字段 | 是否已使用 secureStorage |
|-----------|---------|------------------------|
| useSettingsStore | aiApiKey, dbPassword | ❌ 待集成 |
| useModelProvider | provider.apiKey | ❌ 待集成 |
| useDbConnSlice | connection.password | ❌ 待集成 (partialize 已排除持久化) |
| GlobalStore | connection.password, model.apiKey | ❌ 待集成 |

> **注**: CryptoVault 库已就绪并经过测试，集成工作需逐个替换 localStorage.setItem/getItem 为 secureStorage.setItem/getItem。由于涉及异步 API，需从同步调用改为 await 调用。

---

## 7. 全量备份恢复

### 7.1 备份格式

**文件**: `src/app/lib/full-backup.ts`

```typescript
interface FullBackupData {
  _version: 1;
  _exportedAt: string;          // ISO 时间戳
  _tool: "yyc3-full-backup";    // 验证标记
  localStorage: Record<string, string>;  // 所有匹配键
  indexedDB: Record<string, unknown[]>;  // yyc3_matrix 全部 object store
  globalStore: string;                    // GlobalStore 导出 JSON
}
```

### 7.2 覆盖范围

| 层 | 范围 | 说明 |
|----|------|------|
| localStorage | 前缀匹配 `yyc3`, `yyc3-`, `network_config`, `offline_snapshot` | 原始字符串值 |
| IndexedDB | 数据库 `yyc3_matrix` v3, 全部 object store | 所有记录 |
| GlobalStore | exportStoreData() 输出 | 密码掩码为 `***` |

### 7.3 恢复顺序

```
1. localStorage 键值对批量写入
2. IndexedDB: 清空→批量 put
3. GlobalStore: importStoreData()
4. 广播: { domain: "global-store", action: "reset" } → 触发全标签页 rehydrate
```

### 7.4 API

```typescript
// 导出全量备份 JSON
const json: string = await exportFullBackup();

// 导入并恢复
const { success, errors } = await importFullBackup(json);

// 一键下载备份文件
await downloadFullBackup();
// → yyc3-full-backup-2026-04-15.json
```

---

## 8. 遗留风险与演进路线

### 8.1 当前已知风险

| 风险 | 严重度 | 说明 | 建议 |
|------|--------|------|------|
| theme/locale 三处不同步 | 中 | useAppSlice, useSettingsStore, GlobalStore 各存一份 | 未来统一到 GlobalStore |
| WS_ENDPOINT 三个来源 | 低 | env-config, useSettingsStore, api-config 各有默认值 | 统一到 env-config |
| secureStorage 未集成 | 中 | 加密库已就绪但未被任何 store 使用 | 逐步替换敏感字段存储 |
| 5 个 Slice 无桥接 | 低 | model/user-mgmt/network/node/metrics/log/app 独立运行 | 按需添加 |
| IDE theme 选择器 UX 困惑 | 低 | IDE 独立主题与全局主题不同步 | 低优先级 |

### 8.2 演进路线

| Phase | 目标 | 时间 | 内容 |
|-------|------|------|------|
| Phase 1 | 类型统一 | ✅ 完成 | 11 类型迁移到 types/index.ts |
| Phase 2 | SSOT 桥接 | ✅ 完成 | 4 桥接函数 + 反向桥接 |
| Phase 3 | 同步通道 | ✅ 完成 | 统一 BroadcastChannel |
| Phase 4 | 加密集成 | 待开始 | secureStorage 替换敏感字段存储 |
| Phase 5 | Legacy 清理 | 待开始 | 移除 stores/index.ts 重复 Zustand store |
| Phase 6 | 全量桥接 | 远期 | 所有 Slice 接入 SSOT 桥接 |

### 8.3 新增字段操作规范

新增可编辑字段时，按以下步骤确保数据一致性：

```
1. 在 types/index.ts 定义/扩展类型
2. 确定主存储层（优先使用现有 Slice Store）
3. 如涉及跨页面共享 → 添加 SSOT 桥接函数
4. 如涉及敏感数据 → 使用 secureStorage API
5. 更新 partialize 配置确保持久化范围
6. 验证跨标签页同步
7. 更新本文档
```

---

## 附录: 关键文件索引

| 类别 | 文件 | 职责 |
|------|------|------|
| **SSOT 中枢** | `src/app/stores/global-store.ts` | 6 域统一状态 + 桥接函数 |
| **桥接 Slice** | `src/app/store/slices/db-conn-slice.ts` | 数据库连接 + SSOT 桥接 |
| | `src/app/store/slices/follow-up-slice.ts` | 跟进任务 + SSOT 桥接 |
| **桥接 Hook** | `src/app/hooks/useModelProvider.ts` | 模型服务商 + SSOT 桥接 |
| | `src/app/hooks/useSettingsStore.ts` | 系统设置 + darkMode 桥接 |
| **基础设施** | `src/app/lib/broadcast-channel.ts` | 统一同步通道 |
| | `src/app/lib/crypto-vault.ts` | AES-256-GCM 加密 |
| | `src/app/lib/full-backup.ts` | 全量备份/恢复 |
| | `src/app/types/index.ts` | 统一类型定义 |
| | `src/app/stores/dashboard-stores.ts` | 类型重导出 (已迁移) |

---

> **YYC³ Cloud Intelli-Matrix** | *言启象限 · 语枢未来* | 数据逻辑统一方案 v1.0.0
