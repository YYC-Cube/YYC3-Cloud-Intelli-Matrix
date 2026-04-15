# YYC³ Cloud Intelli-Matrix — UI 可编辑内容指导手册

> **版本**: v3.0.0 | **生成日期**: 2026-04-15 | **状态**: 数据统一完成 · SSOT 桥接就绪

---

## 目录

1. [架构总览](#1-架构总览)
2. [存储层与 SSOT 桥接](#2-存储层与-ssot-桥接)
3. [UI 页面 ↔ 存储绑定矩阵](#3-ui-页面--存储绑定矩阵)
4. [各页面可编辑字段详解](#4-各页面可编辑字段详解)
5. [数据流与同步机制](#5-数据流与同步机制)
6. [持久化配置与 localStorage 注册表](#6-持久化配置与-localstorage-注册表)
7. [CRUD 操作速查表](#7-crud-操作速查表)
8. [开发规范与最佳实践](#8-开发规范与最佳实践)
9. [文件索引](#9-文件索引)

---

## 1. 架构总览

### 1.1 核心设计理念

```
┌───────────────────────────────────────────────────────────────────┐
│                   YYC³ 数据架构 (v3.0 SSOT 桥接版)                 │
│                                                                   │
│  数据入口层                                                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │ WebSocket │  │  UI 编辑   │  │ 初始化加载  │  │ 全量恢复   │    │
│  │ 遥测数据   │  │ 用户操作   │  │ 默认值回退  │  │ 备份导入   │    │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘    │
│        │              │              │              │             │
│        ▼              ▼              ▼              ▼             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │               DataBus (事件中枢 - 仅节点数据)              │    │
│  │  mergeFromWS() / updateUserEdit() / init()               │    │
│  └────────────────────┬─────────────────────────────────────┘    │
│                       │                                           │
│                       ▼                                           │
│  ╔════════════════════════════════════════════════════════════╗  │
│  ║             Slice Store 层 (9 个独立 Zustand Store)        ║  │
│  ║                                                            ║  │
│  ║  ┌─────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐       ║  │
│  ║  │  node   │ │ db-conn │ │followUp │  │  model  │       ║  │
│  ║  │  slice  │ │  slice  │ │  slice  │  │  slice  │       ║  │
│  ║  │ (DataBus)│ │ ✅桥接  │ │ ✅桥接  │  │  独立   │       ║  │
│  ║  └─────────┘ └─────────┘ └─────────┘  └─────────┘       ║  │
│  ║  ┌─────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐       ║  │
│  ║  │  user   │ │ network │ │   log   │  │  app    │       ║  │
│  ║  │  mgmt   │ │  slice  │ │  slice  │  │  slice  │       ║  │
│  ║  │  独立   │ │  独立   │ │  独立   │  │  独立   │       ║  │
│  ║  └─────────┘ └─────────┘ └─────────┘  └─────────┘       ║  │
│  ║  ┌─────────┐                                            ║  │
│  ║  │ metrics │  9/9 Slices · 100% 持久化                   ║  │
│  ║  │  slice  │                                            ║  │
│  ║  │  独立   │                                            ║  │
│  ║  └─────────┘                                            ║  │
│  ╚════════════════════════════════════════════════════════════╝  │
│                       │ SSOT 桥接                                │
│                       ▼                                           │
│  ╔════════════════════════════════════════════════════════════╗  │
│  ║               GlobalStore (SSOT 中枢)                      ║  │
│  ║                                                            ║  │
│  ║  User | Config | Model | Database | Alert | Chat           ║  │
│  ║  Key: yyc3-global-store                                    ║  │
│  ╚════════════════════════════════════════════════════════════╝  │
│                       │                                           │
│  ┌────────────────────┼────────────────────┐                    │
│  ▼                    ▼                    ▼                    │
│  React Components   BroadcastChannel     localStorage           │
│  (响应式渲染)      (跨标签页同步)      (跨会话恢复)              │
│                                              │                   │
│  ┌──────────────────────────────────────────┘                   │
│  │                                                              │
│  │  加密层: CryptoVault (AES-256-GCM)                           │
│  │  备份层: FullBackup (全量导出/导入)                           │
│  └──────────────────────────────────────────────────────────────│
└───────────────────────────────────────────────────────────────────┘
```

### 1.2 关键原则

| 原则 | 说明 | 实现方式 |
|------|------|----------|
| **单一数据源 (SSOT)** | GlobalStore 为聚合中枢 | Slice Store 写入桥接到 GlobalStore |
| **单向数据流** | 数据流向可追踪 | UI → Slice → Bridge → GlobalStore |
| **响应式更新** | 编辑即时生效 | `useXxxSlice()` / `useGlobalStore()` Hook 订阅 |
| **持久化保障** | 刷新不丢失 | Zustand `persist` middleware |
| **类型安全** | 编译期捕获错误 | TypeScript strict mode + 统一类型 |
| **跨标签同步** | 多标签页数据一致 | BroadcastChannel 统一通道 |

---

## 2. 存储层与 SSOT 桥接

### 2.1 四层存储架构

| 层级 | 文件/位置 | localStorage Key | 角色 |
|------|---------|------------------|------|
| **GlobalStore** | `stores/global-store.ts` | `yyc3-global-store` | SSOT 聚合中枢 (6 域) |
| **Slice Store** | `store/slices/` (9 个) | `yyc3-{name}-slice` | 独立领域状态管理 |
| **Hook 存储** | `hooks/` (3 个) | 各自独立 key | 配置类数据管理 |
| **直接存储** | 4 个组件直接读写 | 各自独立 key | 页面专属配置 |

### 2.2 SSOT 桥接状态

| 数据域 | Slice/Hook | 桥接方向 | 桥接函数 | 状态 |
|--------|-----------|---------|---------|------|
| 数据库连接 | db-conn-slice | Slice→Global + Global→Slice | `bridgeConnectionsToGlobal` + 反向 | ✅ 双向 |
| 跟进任务 | follow-up-slice | Slice→Global | `bridgeFollowUpsToGlobal` | ✅ 单向 |
| 模型服务商 | useModelProvider | Hook→Global | `bridgeProvidersToGlobal` | ✅ 单向 |
| 已配置模型 | useModelProvider | Hook→Global | `bridgeModelsToGlobal` | ✅ 单向 |
| 系统设置 darkMode | useSettingsStore | Settings→Global | toggleSetting 内 setTheme | ✅ 单向 |
| GPU 节点 | node-slice | DataBus→Slice | (通过 DataBus) | ✅ 独立 |
| GPU 部署模型 | model-slice | 无 | - | 独立 |
| 用户管理 | user-mgmt-slice | 无 | - | 独立 |
| 网络配置 | network-slice | 无 | - | 独立 |
| 日志 | log-slice | 无 | - | 独立 |
| 图表指标 | metrics-slice | 无 | - | 独立 |
| 全局偏好 | app-slice | 无 | - | 独立 (与 GlobalStore.ConfigDomain 部分重复) |

---

## 3. UI 页面 ↔ 存储绑定矩阵

### 3.1 完整映射表

| # | UI 页面 | 组件文件 | 数据源 | localStorage Key | SSOT 桥接 |
|---|---------|---------|--------|------------------|----------|
| 1 | **SystemSettings** | SystemSettings.tsx | useSettingsStore + useModelProvider | yyc3_system_settings + yyc3_model_providers | ✅ darkMode→theme, providers→Global |
| 2 | **UnifiedSettingsPanel** | UnifiedSettingsPanel.tsx | GlobalStore (6 域) | yyc3-global-store | 中枢本身 |
| 3 | **ModelProviderPanel** | ModelProviderPanel.tsx | useModelProvider | yyc3_model_providers + yyc3_configured_models | ✅ providers→Global |
| 4 | **EnvConfigEditor** | EnvConfigEditor.tsx | lib/env-config | yyc3_env_config | 独立 |
| 5 | **UserManagement** | UserManagement.tsx | useUserMgmtSlice | yyc3-user-mgmt-slice | 独立 |
| 6 | **DatabaseConnectionPanel** | DatabaseConnectionPanel.tsx | useDbConnSlice | yyc3-db-conn-slice | ✅ 双向桥接 |
| 7 | **DatabaseManager** | DatabaseManager.tsx | useLocalDatabase + IndexedDB | - | 独立 |
| 8 | **NetworkConfig** | NetworkConfig.tsx | useNetworkConfig + useNetworkSlice | network_config + yyc3-network-slice | 独立 |
| 9 | **DataEditorPanel** | DataEditorPanel.tsx | useNodeSlice + useMetricsSlice + IndexedDB | yyc3-node-slice + yyc3-metrics-slice | 独立 |
| 10 | **FollowUpManager** | FollowUpManager.tsx | useFollowUpSlice | yyc3-follow-up-slice | ✅→Global |
| 11 | **FollowUpPanel** | FollowUpPanel.tsx | useAlerts (GlobalStore) | yyc3-global-store | 读取 GlobalStore |
| 12 | **ThemeCustomizer** | ThemeCustomizer.tsx | 直接 localStorage | yyc3_custom_theme | 独立 |
| 13 | **VariableCenter** | VariableCenter.tsx | lib/variable-center | yyc3-variable-values | 独立 |
| 14 | **IDESettingsPanel** | ide/IDESettingsPanel.tsx | 直接 localStorage | yyc3-ide-settings | 独立 |

---

## 4. 各页面可编辑字段详解

### 4.1 SystemSettings — 系统设置

**文件**: `src/app/components/SystemSettings.tsx`
**数据源**: `useSettingsStore` (19 toggles + 40 values) + `useModelProvider` + `useModelSlice`
**模式**: **完整编辑 + SSOT 桥接**

#### Toggles (19 个开关)

| 字段 | 显示标签 | 默认值 | 影响范围 |
|------|---------|--------|---------|
| `autoScale` | 自动扩缩容 | true | 节点自动伸缩策略 |
| `healthCheck` | 健康检查 | true | 节点健康监测 |
| `alertEmail` | 邮件告警 | true | 告警通知渠道 |
| `alertSlack` | Slack 告警 | false | 告警通知渠道 |
| `darkMode` | 暗色模式 | true | 全局 UI 主题 → **自动桥接到 GlobalStore.theme** |
| `autoBackup` | 自动备份 | true | 定时数据备份 |
| `mfa` | 多因素认证 | true | 安全设置 |
| `auditLog` | 审计日志 | true | 安全设置 |
| `rateLimiting` | 速率限制 | true | API 安全 |
| `cacheEnabled` | 缓存启用 | true | 性能优化 |
| `wsAutoReconnect` | WS 自动重连 | true | WebSocket 连接管理 |
| `wsHeartbeat` | WS 心跳 | true | WebSocket 连接管理 |
| `aiStreamMode` | AI 流式模式 | true | AI 助手输出模式 |
| `aiContextMemory` | AI 上下文记忆 | true | AI 助手记忆功能 |
| `debugMode` | 调试模式 | false | 开发调试 |
| `performanceLog` | 性能日志 | true | 性能监控 |
| `autoUpdate` | 自动更新 | false | 版本更新策略 |
| `dataCompression` | 数据压缩 | true | 数据传输优化 |
| `corsEnabled` | CORS 启用 | true | 跨域配置 |

#### Values (40 个文本/数字配置)

| 分组 | 字段 | 默认值 | 说明 |
|------|------|--------|------|
| **品牌** | systemName | `YYC³ Cloud Intelli-Matrix v3.2` | 系统显示名称 |
| | clusterId | `CN-EAST-PROD-01` | 集群标识 |
| | brandName | `YanYuCloudCube` | 品牌名 |
| | brandSlogan1 | `言启象限 \| 语枢未来` | 品牌标语 1 |
| | brandSlogan2 | `言启千行代码 \| 语枢万物智能` | 品牌标语 2 |
| | brandSlogan3 | `万象归元于云枢 \| 深栈智启新纪元` | 品牌标语 3 |
| **运行时** | refreshInterval | `5` | 刷新间隔 (秒) |
| | language | `zh-CN` | 显示语言 |
| | timezone | `Asia/Shanghai` | 时区 |
| **节点** | maxNodes | `16` | 最大节点数 |
| | loadBalanceStrategy | `轮询 (Round Robin)` | 负载均衡策略 |
| | healthCheckInterval | `30` | 健康检查间隔 (秒) |
| | scaleUpThreshold | `85` | 扩容阈值 (%) |
| | scaleDownThreshold | `30` | 缩容阈值 (%) |
| **WebSocket** | wsEndpoint | `ws://localhost:3113/ws` | WS 服务器地址 |
| | wsReconnectInterval | `5000` | 重连间隔 (ms) |
| | wsMaxReconnect | `10` | 最大重连次数 |
| | wsHeartbeatInterval | `30000` | 心跳间隔 (ms) |
| | wsThrottleMs | `100` | 节流 (ms) |
| **AI** | aiApiKey | (空) | API 密钥 ⚠️ 敏感 |
| | aiBaseUrl | `https://api.openai.com/v1` | AI 服务地址 |
| | aiModel | (空) | 默认模型 |
| | aiTemperature | `0.7` | 温度参数 |
| | aiTopP | `0.9` | Top-P 参数 |
| | aiMaxTokens | `2048` | 最大 Token |
| | aiTimeout | `30000` | 超时 (ms) |
| **数据库** | dbHost | `localhost` | 数据库主机 |
| | dbPort | `5433` | 数据库端口 |
| | dbName | `cpim_matrix` | 数据库名 |
| | dbUser | `yyc_admin` | 数据库用户 |
| | dbPassword | (空) | 数据库密码 ⚠️ 敏感 |
| | dbPoolSize | `20` | 连接池大小 |
| **安全** | sessionTimeout | `30` | 会话超时 (分钟) |
| | ipWhitelist | `192.168.1.0/24\n10.0.0.0/16\n172.16.0.0/12` | IP 白名单 |
| **告警** | alertGpuThreshold | `90` | GPU 告警阈值 (%) |
| | alertTempThreshold | `80` | 温度告警阈值 (°C) |
| | alertEmailAddr | `admin@cloudpivot.ai` | 告警邮箱 |
| | webhookUrl | (空) | Webhook 地址 |
| **运维** | backupSchedule | `0 2 * * *` | 备份计划 (cron) |
| | logLevel | `info` | 日志级别 |
| | logRetention | `30` | 日志保留 (天) |
| | maxConcurrency | `100` | 最大并发 |
| **缓存** | cacheSize | `512` | 缓存大小 (MB) |
| | cacheTTL | `3600` | 缓存 TTL (秒) |

#### SSOT 桥接

```typescript
// useSettingsStore.ts — darkMode 变更自动同步到 GlobalStore
toggleSetting("darkMode")
  → setState(toggles: { darkMode: !prev })
  → useGlobalStore.getState().setTheme("dark" / "light")
```

---

### 4.2 UnifiedSettingsPanel — 统一设置面板

**文件**: `src/app/components/UnifiedSettingsPanel.tsx`
**数据源**: `useUser()`, `useConfig()`, `useModels()`, `useDatabase()`, `useAlerts()`, `useChat()` (均来自 GlobalStore)
**模式**: **管理操作 (导出/导入/清除)**

#### 展示的 6 个数据域

| 域 | Hook | 内容 | 可编辑字段 |
|----|------|------|-----------|
| UserDomain | `useUser()` | 用户信息、Token、Ghost 模式 | 只读展示 |
| ConfigDomain | `useConfig()` | 主题、语言、侧边栏、刷新间隔 | 只读展示 |
| ModelDomain | `useModels()` | 服务商列表、已配置模型 | 只读展示 |
| DatabaseDomain | `useDatabase()` | 数据库连接列表 | 只读展示 |
| AlertDomain | `useAlerts()` | 跟进任务/告警 | 只读展示 |
| ChatDomain | `useChat()` | AI 对话会话 | 只读展示 |

#### 管理操作

| 操作 | 方法 | 说明 |
|------|------|------|
| 导出 GlobalStore | `exportStoreData()` | 下载 JSON 文件 (密码掩码 `***`) |
| 导入 GlobalStore | `importStoreData(json)` | 上传 JSON 恢复 |
| 清除域数据 | `clearDomain()` | 按域清除 GlobalStore 数据 |
| 全量备份 | `downloadFullBackup()` | 一键导出所有存储层数据 |
| 全量恢复 | `importFullBackup(json)` | 一键恢复所有存储层数据 |

---

### 4.3 ModelProviderPanel — 模型服务商管理

**文件**: `src/app/components/ModelProviderPanel.tsx`
**数据源**: `useModelProvider` (Hook)
**localStorage**: `yyc3_model_providers` + `yyc3_configured_models`
**模式**: **完整 CRUD + SSOT 桥接**

#### 预置服务商 (9 家)

| # | 服务商 | authType | 预置模型 |
|---|--------|----------|---------|
| 1 | OpenAI | bearer | gpt-4o, gpt-4o-mini, o1-preview, o1-mini |
| 2 | Claude (Anthropic) | x-api-key | claude-sonnet-4-20250514, claude-haiku-4-20250414 |
| 3 | GLM (智谱) | bearer | glm-4, glm-4-flash |
| 4 | Kimi (月之暗面-CN) | bearer | moonshot-v1-8k, moonshot-v1-32k |
| 5 | Kimi (月之暗面-Global) | bearer | moonshot-v1-8k, moonshot-v1-32k |
| 6 | DeepSeek | bearer | deepseek-chat, deepseek-reasoner |
| 7 | 火山引擎 | bearer | doubao-pro-32k, doubao-lite-32k |
| 8 | 火山引擎(旗舰) | bearer | doubao-pro-128k, doubao-lite-128k |
| 9 | Ollama (本地) | none | auto-detect |

#### 可编辑字段 — 服务商

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | text | ✅ | 服务商名称 |
| `type` | select | ✅ | openai / anthropic / custom |
| `apiBase` | url | ❌ | API 基础 URL |
| `apiKey` | password | ❌ | API 密钥 ⚠️ 敏感 |
| `enabled` | toggle | ❌ | 是否启用 |

#### 可编辑字段 — 已配置模型

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `providerId` | select | ✅ | 所属服务商 |
| `modelId` | text | ✅ | 模型 ID |
| `displayName` | text | ❌ | 显示名称 |
| `contextLength` | number | ❌ | 上下文长度 |
| `capabilities` | text | ❌ | 能力描述 |

#### SSOT 桥接

```typescript
// useModelProvider.ts — 保存时自动同步到 GlobalStore
saveProviders(providers) → bridgeProvidersToGlobal(providers)
saveModels(models)       → bridgeModelsToGlobal(models)
```

---

### 4.4 EnvConfigEditor — 环境变量编辑器

**文件**: `src/app/components/EnvConfigEditor.tsx`
**数据源**: `lib/env-config` (模块)
**localStorage**: `yyc3_env_config`
**模式**: **分组编辑 (23 字段, 6 组)**

#### 字段分组

| 分组 | 字段 | 默认值 | 说明 |
|------|------|--------|------|
| **System** | SYSTEM_NAME | `YYC3 Cloud Intelli-Matrix` | 系统名称 |
| | SYSTEM_VERSION | `3.2.0` | 系统版本 |
| | SYSTEM_BUILD | `2026.04.15` | 构建日期 |
| | CLUSTER_ID | `CN-EAST-PROD-01` | 集群 ID |
| **Runtime** | NODE_ENV | `development` | 运行环境 |
| | API_BASE_URL | `http://localhost:3113` | API 地址 |
| | WS_ENDPOINT | `ws://localhost:3113/ws` | WS 地址 |
| | OLLAMA_BASE_URL | `http://localhost:11434` | Ollama 地址 |
| **Storage** | STORAGE_PREFIX | `yyc3` | 存储前缀 |
| | IDB_NAME | `yyc3_matrix` | IndexedDB 名称 |
| | IDB_VERSION | `3` | IndexedDB 版本 |
| **AI** | DEFAULT_AI_BASE_URL | `https://api.openai.com/v1` | AI 默认地址 |
| | DEFAULT_AI_MODEL | `gpt-4o` | AI 默认模型 |
| | DEFAULT_AI_TEMPERATURE | `0.7` | 默认温度 |
| | DEFAULT_AI_MAX_TOKENS | `2048` | 默认最大 Token |
| | DEFAULT_AI_TIMEOUT | `30000` | 默认超时 (ms) |
| **Security** | SESSION_TIMEOUT_MIN | `30` | 会话超时 (分钟) |
| | MAX_LOGIN_ATTEMPTS | `5` | 最大登录尝试 |
| | CORS_ORIGINS | `*` | CORS 来源 |
| **Features** | ENABLE_MOCK_MODE | `false` | 模拟模式 |
| | ENABLE_DEBUG | `false` | 调试模式 |
| | ENABLE_PWA | `true` | PWA 支持 |
| | ENABLE_ELECTRON_IPC | `false` | Electron IPC |

---

### 4.5 UserManagement — 用户管理

**文件**: `src/app/components/UserManagement.tsx`
**数据源**: `useUserMgmtSlice`
**localStorage**: `yyc3-user-mgmt-slice`
**模式**: **完整 CRUD + 锁定**

#### 可编辑字段

| 字段 | 显示标签 | 类型 | 必填 | 说明 |
|------|---------|------|------|------|
| `name` | 姓名 | text | ✅ | 中文显示名 |
| `username` | 用户名 | text | ✅ | 登录用，唯一标识 |
| `email` | 邮箱 | text | ✅ | 用于通知 |
| `role` | 角色 | select | ❌ | 见下方角色表 |

#### 预设角色

| 角色 | 权限范围 | 颜色标识 |
|------|---------|---------|
| 超级管理员 | 全部权限 | `#ff3366` (红) |
| 运维工程师 / 自动化运维 | 节点管理、部署、监控 | `#ff6600` (橙) |
| 开发者 / AI 研究员 / 测试工程师 | 模型调用、日志查看 | `#00d4ff` (青) |
| 数据分析师 | 数据查看、报表导出 | `#00ff88` (绿) |
| 系统服务 | API 调用、推理执行 | `#aa55ff` (紫) |

#### UserRecord 结构

```typescript
interface UserRecord {
  id: string;         // "usr-1"
  name: string;       // "张管理"
  username: string;   // "admin"
  email: string;      // "admin@cloudpivot.ai"
  role: string;       // "超级管理员"
  status: "online" | "offline";
  lastLogin: string;  // "2026-02-22 14:30"
  sessions: number;   // 当前会话数
  apiCalls: number;   // 累计 API 调用
  locked: boolean;    // 是否锁定
}
```

#### Store Actions

| Action | 说明 | 特殊逻辑 |
|--------|------|---------|
| `addUser(user)` | 添加用户 | 自动生成 `usr-{timestamp}` ID |
| `updateUser(id, updates)` | 更新用户信息 | - |
| `removeUser(id)` | 删除用户 | ⚠️ 超级管理员不可删除 |
| `toggleLock(id)` | 切换锁定状态 | 锁定后禁止登录 |

---

### 4.6 DatabaseConnectionPanel — 数据库连接管理

**文件**: `src/app/components/DatabaseConnectionPanel.tsx`
**数据源**: `useDbConnSlice`
**localStorage**: `yyc3-db-conn-slice` + `yyc3_db_pool_config` + `yyc3_sql_history`
**模式**: **完整 CRUD + 导入导出 + SSOT 双向桥接**

#### 可编辑字段 — 连接

| 字段 | 显示标签 | 类型 | 必填 | 选项/约束 |
|------|---------|------|------|----------|
| `name` | 连接名称 | text | ✅ | 如 "主数据库 (PostgreSQL)" |
| `type` | 数据库类型 | select | ✅ | postgresql / mysql / sqlite / redis / mongodb / custom |
| `host` | 主机地址 | text | ❌ | 默认 localhost |
| `port` | 端口 | number | ❌ | 类型相关默认值 |
| `database` | 数据库名 | text | ❌ | - |
| `username` | 用户名 | text | ❌ | - |
| `password` | 密码 | password | ❌ | ⚠️ 敏感, partialize 排除持久化 |
| `options` | 连接选项 | text | ❌ | 如 sslmode=disable |

#### DB 类型默认端口

| 类型 | 默认端口 |
|------|---------|
| postgresql | 5432 |
| mysql | 3306 |
| sqlite | 0 |
| redis | 6379 |
| mongodb | 27017 |
| custom | 0 |

#### 可编辑字段 — 连接池配置

| 字段 | 类型 | 默认值 |
|------|------|--------|
| `minConnections` | number | 2 |
| `maxConnections` | number | 20 |
| `idleTimeoutMs` | number | 30000 |
| `acquireTimeoutMs` | number | 5000 |
| `maxRetries` | number | 3 |
| `healthCheckIntervalMs` | number | 30000 |
| `enableAutoScale` | toggle | true |
| `enableHealthCheck` | toggle | true |

#### SSOT 双向桥接

```typescript
// db-conn-slice.ts — 每次变更同步到 GlobalStore
addConnection()    → syncToGlobal() → bridgeConnectionsToGlobal()
updateConnection() → syncToGlobal() → bridgeConnectionsToGlobal()
removeConnection() → syncToGlobal() → bridgeConnectionsToGlobal()
setStatus()        → syncToGlobal() → bridgeConnectionsToGlobal()

// global-store.ts — 反向桥接回 Slice
setConnections()   → useDbConnSlice.setState({ connections })  // 仅 ID 不同时
```

#### DBConnection 统一类型

```typescript
interface DBConnection {
  id: string;
  name: string;
  type: DatabaseType;       // "postgresql"|"mysql"|"sqlite"|"redis"|"mongodb"|"custom"
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;         // ⚠️ partialize 排除持久化
  status: DBConnectionStatus; // "disconnected"|"connecting"|"connected"|"error"|"testing"
  lastConnected?: number | null;
  lastTestAt?: number;
  createdAt?: number;
  color?: string;
  options?: string;
}
```

---

### 4.7 NetworkConfig — WiFi 网络管理

**文件**: `src/app/components/NetworkConfig.tsx`
**数据源**: `useNetworkConfig` (Hook) + `useNetworkSlice`
**localStorage**: `network_config` + `yyc3-network-slice`
**模式**: **扫描 + 连接 + 配置**

#### 手动配置 Tab

| 字段 | 类型 | 说明 |
|------|------|------|
| `serverAddress` | text | 服务器地址 |
| `port` | number | 端口号 |
| `nasAddress` | text | NAS 地址 |
| `wsUrl` | url | WebSocket URL |

#### WiFi 管理 Tab

| 字段 | 类型 | 说明 | 编辑性 |
|------|------|------|--------|
| `ssid` | string | 网络名称 | 只读 (扫描结果) |
| `signal` | number | 信号强度 0-100 | 只读 |
| `security` | string | 加密类型 WPA2/WPA3 | 只读 |
| `connected` | boolean | 是否已连接 | 通过 connect/disconnect 切换 |
| `password` | string | 密码 | 连接时输入 |

#### 自动重连配置 (WifiAutoReconnectSettings)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | true | 是否启用自动重连 |
| `preferStrongestSignal` | boolean | true | 优选最强信号 |
| `intervalSeconds` | number | 5 | 扫描间隔 (秒) |
| `maxRetries` | number | 10 | 最大重试次数 |
| `preferredSsid` | string | "" | 优先网络 SSID |

---

### 4.8 DataEditorPanel — 核心数据编辑器

**文件**: `src/app/components/DataEditorPanel.tsx`
**数据源**: `useNodeSlice` + `useMetricsSlice` + IndexedDB (db-queries)
**模式**: **完整 CRUD (节点/模型/Agent)**

#### Tab 1: Models（模型管理）

| 字段 | 显示标签 | 类型 | 必填 | 校验 |
|------|---------|------|------|------|
| `name` | 模型名称 | text | ✅ | 非空, modelName 格式 |
| `provider` | 提供商 | text | ❌ | - |
| `tier` | 等级 | select | ❌ | production/hot/warm/standby |
| `avg_latency_ms` | 延迟(ms) | number | ❌ | 0-99999 |
| `throughput` | 吞吐量 | number | ❌ | 0-999999 |

#### Tab 2: Nodes（节点管理）

| 字段 | 显示标签 | 类型 | 必填 | 校验范围 | Store Action |
|------|---------|------|------|----------|-------------|
| `hostname` | 主机名 | text | ✅ | 非空 | `updateNode(id, {...})` |
| `gpu_util` | GPU% | number | ❌ | 0-100 | 同上 |
| `mem_util` | 内存% | number | ❌ | 0-100 | 同上 |
| `temp_celsius` | 温度°C | number | ❌ | 0-150 | 同上 |
| `model_deployed` | 部署模型 | text | ❌ | - | 同上 |
| `active_tasks` | 任务数 | number | ❌ | ≥0 | 同上 |
| `status` | 状态 | select | ❌ | active/warning/inactive | 同上 |

**数据流链路**:
```
用户编辑 → editDraft 本地状态 → saveNode()
  → updateNode(id, updates)  [node-slice]
    → DataBus.publishChange('node', updatedNode)
      → Dashboard.useNodeSlice() 自动重渲染 ✅
```

#### Tab 3: Agents（智能体管理）

| 字段 | 显示标签 | 类型 | 必填 | 说明 |
|------|---------|------|------|------|
| `name` | 英文名 | text | ✅ | 标识符 |
| `name_cn` | 中文名 | text | ❌ | 显示名 |
| `role` | 角色 | text | ❌ | coding/analysis/... |
| `description` | 描述 | text | ❌ | 功能描述 |
| `is_active` | 启用 | select | ❌ | true/false |

---

### 4.9 FollowUpManager — 跟进任务管理

**文件**: `src/app/components/FollowUpManager.tsx`
**数据源**: `useFollowUpSlice` + `useUserMgmtSlice` (负责人选择)
**localStorage**: `yyc3-follow-up-slice`
**模式**: **完整 CRUD + SSOT 桥接**

#### 可编辑字段

| 字段 | 显示标签 | 类型 | 必填 | 选项/约束 |
|------|---------|------|------|----------|
| `taskName` | 任务名称 | text | ✅ | 如 "GPU-A100-03 温度告警处理" |
| `taskId` | 任务编号 | text | ❌ | 自动生成 `TASK-{timestamp}` |
| `assignee` | 负责人 | select | ✅ | 从 user-mgmt-slice.users 选择 |
| `assigneeName` | 负责人名称 | readonly | - | 根据 assignee 自动填充 |
| `priority` | 优先级 | select | ❌ | low/medium/high/critical |
| `status` | 状态 | select | ❌ | pending/in_progress/completed/cancelled |
| `dueDate` | 截止日期 | date | ❌ | 默认 +7 天 |
| `notes` | 备注 | textarea | ❌ | 自由文本 |
| `category` | 分类 | select | ❌ | maintenance/optimization/security/feature/bugfix |

#### 筛选与排序

| 控件 | 字段 | 选项 |
|------|------|------|
| 状态筛选 | `filterStatus` | all/pending/in_progress/completed/cancelled |
| 优先级筛选 | `filterPriority` | all/low/medium/high/critical |
| 负责人筛选 | `filterAssignee` | all + 用户列表 |
| 排序字段 | `sortBy` | dueDate/priority/createdAt/status |
| 排序方向 | `sortOrder` | asc/desc |

#### SSOT 桥接

```typescript
// follow-up-slice.ts — 每次变更同步到 GlobalStore (含字段映射)
addFollowUp()      → syncToGlobal() → bridgeFollowUpsToGlobal()
updateFollowUp()   → syncToGlobal() → bridgeFollowUpsToGlobal()
removeFollowUp()   → syncToGlobal() → bridgeFollowUpsToGlobal()
completeFollowUp() → syncToGlobal() → bridgeFollowUpsToGlobal()
```

**字段映射** (FollowUpRecord → FollowUpItem):

| 源 priority | 目标 severity | 说明 |
|------------|---------------|------|
| critical | critical | 直映射 |
| high | error | 降级映射 |
| medium/low | warning | 合并映射 |

---

### 4.10 FollowUpPanel — 跟进通知面板

**文件**: `src/app/components/FollowUpPanel.tsx`
**数据源**: `useAlerts()` (GlobalStore.AlertDomain 选择器)
**localStorage**: `yyc3-global-store`
**模式**: **只读 + 快捷操作**

#### 展示数据

来自 GlobalStore.AlertDomain.followUps (由 bridgeFollowUpsToGlobal 写入)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 告警 ID |
| `title` | string | 告警标题 |
| `message` | string | 告警内容 |
| `severity` | BaseSeverity | info/warning/error/critical |
| `status` | FollowUpStatus | active/investigating/resolved/ignored |
| `chain` | AlertChainItem[] | 关联链 |

#### 快捷操作

| 操作 | 效果 |
|------|------|
| `quickFix` | status → "investigating" |
| `markResolved` | status → "resolved" |
| 筛选 severity | `filterSeverity` |
| 筛选 status | `filterStatus` |

---

### 4.11 ThemeCustomizer — 自定义主题

**文件**: `src/app/components/ThemeCustomizer.tsx`
**数据源**: 直接 localStorage 读写
**localStorage**: `yyc3_custom_theme`
**模式**: **全面自定义 + 预设选择**

#### 颜色字段 (30 个)

| 分组 | 字段 |
|------|------|
| **主色** | primary, primaryForeground |
| **次色** | secondary, secondaryForeground |
| **强调色** | accent, accentForeground |
| **背景** | background, foreground |
| **卡片** | card, cardForeground |
| **弹出层** | popover, popoverForeground |
| **静音** | muted, mutedForeground |
| **危险** | destructive, destructiveForeground |
| **边框/输入** | border, input, ring |
| **图表** | chart1~chart6 |
| **侧边栏** | sidebar, sidebarForeground, sidebarPrimary, sidebarPrimaryForeground, sidebarAccent, sidebarAccentForeground, sidebarBorder, sidebarRing |

#### 字体字段

| 字段 | 说明 | 选项 |
|------|------|------|
| `sansSerif` | 无衬线字体 | 系统字体列表 |
| `serif` | 衬线字体 | 系统字体列表 |
| `mono` | 等宽字体 | 系统字体列表 |

#### 阴影/效果

| 字段 | 说明 | 类型 |
|------|------|------|
| `offsetX` | 阴影 X 偏移 | number |
| `offsetY` | 阴影 Y 偏移 | number |
| `blur` | 模糊半径 | number |
| `spread` | 扩展半径 | number |
| `color` | 阴影颜色 | color |
| `radius` | 圆角半径 | range |
| `lightness` | 亮度 | range |

#### 品牌字段

| 字段 | 说明 |
|------|------|
| `systemName` | 系统名称 |
| `tagline` | 标语 |
| `backgroundUrl` | 背景图片 URL |

---

### 4.12 VariableCenter — 变量中心

**文件**: `src/app/components/VariableCenter.tsx`
**数据源**: `lib/variable-center` (配置模块)
**localStorage**: `yyc3-variable-values`
**模式**: **分类编辑 (6 类)**

#### 变量分类

| 分类 | 输入类型 | 说明 |
|------|---------|------|
| **Device** | text/number/select | 设备相关变量 |
| **User** | text/select | 用户相关变量 |
| **Secret** | password | 凭证/密钥变量 (密码掩码) |
| **Model** | select/number | 模型配置变量 |
| **System** | select/text | 系统级变量 |
| **Env** | text/url/json | 环境变量 |

---

### 4.13 IDESettingsPanel — IDE 编辑器设置

**文件**: `src/app/components/ide/IDESettingsPanel.tsx`
**数据源**: 直接 localStorage 读写
**localStorage**: `yyc3-ide-settings`
**模式**: **编辑器偏好设置**

#### 可编辑字段

| 字段 | 类型 | 选项 | 默认值 |
|------|------|------|--------|
| `theme` | select | dark / light / cyberpunk | dark |
| `fontSize` | select | 10~24 (步进 1) | 14 |
| `fontFamily` | select | 6 种字体 | "JetBrains Mono" |
| `tabSize` | select | 2 / 4 / 6 / 8 | 2 |
| `wordWrap` | toggle | on / off | on |
| `minimap` | toggle | on / off | true |
| `lineNumbers` | toggle | on / off | true |
| `bracketPairColorization` | toggle | on / off | true |
| `autoSave` | toggle | on / off | true |
| `autoSaveDelay` | select | 500ms / 1s / 2s / 5s | 1000 |
| `formatOnSave` | toggle | on / off | false |

---

### 4.14 DatabaseManager — 数据库管理器

**文件**: `src/app/components/DatabaseManager.tsx`
**数据源**: `useLocalDatabase` (Hook) + IndexedDB
**模式**: **SQL 编辑器 + 内联编辑**

#### 可编辑字段 — 连接

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | text | 连接名称 |
| `type` | select | postgresql/mysql/sqlite/redis/mongodb/custom |
| `host` | text | 主机地址 |
| `port` | number | 端口 |
| `database` | text | 数据库名 |
| `username` | text | 用户名 |
| `password` | password | 密码 ⚠️ 敏感 |

#### SQL 编辑器

| 功能 | 说明 |
|------|------|
| SQL 文本区域 | 支持多行 SQL 输入 |
| 执行 | 发送到选中连接执行 |
| 结果表格 | InlineEditableTable 支持内联编辑单元格 |

---

## 5. 数据流与同步机制

### 5.1 SSOT 桥接数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                       SSOT 桥接数据流                             │
│                                                                 │
│  UI 操作           Slice/Hook               GlobalStore         │
│  ========          ===========              ============        │
│                                                                 │
│  添加数据库连接 → db-conn-slice.addConnection()                 │
│                     │                                           │
│                     ├─ syncToGlobal(connections)                │
│                     │   └─ bridgeConnectionsToGlobal() ──►      │
│                     │                              DatabaseDomain│
│                     │                              connections  │
│                     │                                    ▲       │
│  UnifiedSettings ◄───┘───── useDatabase() ──────────────┘       │
│  Panel 展示连接列表                                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  添加跟进任务 → follow-up-slice.addFollowUp()                   │
│                     │                                           │
│                     ├─ syncToGlobal(followUps)                  │
│                     │   └─ bridgeFollowUpsToGlobal() ──►        │
│                     │                          AlertDomain      │
│                     │                          followUps        │
│                     │                                ▲          │
│  FollowUpPanel ◄────┘─── useAlerts() ────────────────┘          │
│  展示通知列表                                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  配置模型服务商 → useModelProvider.saveProviders()               │
│                     │                                           │
│                     └─ bridgeProvidersToGlobal() ──►            │
│                                          ModelDomain            │
│                                          providers              │
│                                              ▲                  │
│  UnifiedSettings ─── useModels() ───────────┘                   │
│  Panel 展示服务商                                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  切换暗色模式 → useSettingsStore.toggleSetting("darkMode")      │
│                     │                                           │
│                     └─ useGlobalStore.setTheme("dark") ──►      │
│                                          ConfigDomain.theme     │
│                                              ▲                  │
│  Layout ──── 读取 GlobalStore.theme ────────────┘               │
│  全局主题切换                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 跨标签页同步流程

```
Tab A: 用户操作
    │
    ├── Slice mutation → syncToGlobal()
    │   └── bridgeXxxToGlobal() → GlobalStore.setState()
    │       └── broadcastGlobalStoreChange()
    │           └── broadcastSyncMessage({ domain: "xxx", action: "update" })
    │               │
    │               ├──► yyc3-unified-sync (主通道)
    │               │        │
    │               │        ▼
    │               │   Tab B: onUnifiedSync() handler
    │               │        ├── GlobalStore.rehydrate()
    │               │        └── syncAllSlicesToGlobal()
    │               │
    │               └──► 遗留通道 (向后兼容)
    │
    └── localStorage 写入 → window 'storage' event
                              │
                              ▼
                         Tab B: listener → GlobalStore.rehydrate()
```

### 5.3 DataBus 合并策略 (仅节点数据)

| 场景 | 策略 | 说明 |
|------|------|------|
| WebSocket 推送 vs 用户编辑 | `ws_priority` | 遥测数据覆盖手动编辑的遥测字段 |
| 用户编辑 vs 初始化 | `user_priority` | 用户编辑始终保留 |
| 并发写入冲突 | `timestamp_win` | 最新时间戳胜出 |
| 断线恢复 | `merge_shallow` | 浅合并，保留本地修改 |

---

## 6. 持久化配置与 localStorage 注册表

### 6.1 Slice Store 持久化详情

| Slice | Key | partialize 内容 | 排除字段 | 原因 |
|-------|-----|----------------|---------|------|
| **node-slice** | `yyc3-node-slice` | `nodes` 数组 | `lastSource`, `lastUpdateAt` | 运行时元数据 |
| **db-conn-slice** | `yyc3-db-conn-slice` | `connections` 数组 | `password` | 敏感字段 |
| **log-slice** | `yyc3-log-slice` | 最近 200 条日志 | - | 防膨胀 |
| **metrics-slice** | `yyc3-metrics-slice` | `modelPerf`, `modelDist`, `radarData` | - | 图表数据 |
| **model-slice** | `yyc3-model-slice` | `models` 数组 | - | 部署模型 |
| **follow-up-slice** | `yyc3-follow-up-slice` | `followUps` 数组 | - | 任务数据 |
| **app-slice** | `yyc3-app-slice` | `theme`, `locale`, `sidebarCollapsed` | `user`, `token`, `isGhost` | 认证信息 |
| **user-mgmt-slice** | `yyc3-user-mgmt-slice` | `users` 数组 | - | 用户名单 |
| **network-slice** | `yyc3-network-slice` | `networks`, `autoReconnect` | `password` | WiFi 密码 |

### 6.2 完整 localStorage 注册表

| Key | 所属层 | 管理者 | SSOT 桥接 | 敏感数据 |
|-----|--------|--------|----------|---------|
| `yyc3-global-store` | GlobalStore | useGlobalStore | 中枢 | 密码掩码 `***` |
| `yyc3-node-slice` | Slice | useNodeSlice | DataBus | - |
| `yyc3-db-conn-slice` | Slice | useDbConnSlice | ✅ 双向 | password 已排除 |
| `yyc3-log-slice` | Slice | useLogSlice | - | - |
| `yyc3-metrics-slice` | Slice | useMetricsSlice | - | - |
| `yyc3-model-slice` | Slice | useModelSlice | - | - |
| `yyc3-follow-up-slice` | Slice | useFollowUpSlice | ✅→Global | - |
| `yyc3-app-slice` | Slice | useAppSlice | - | - |
| `yyc3-user-mgmt-slice` | Slice | useUserMgmtSlice | - | - |
| `yyc3-network-slice` | Slice | useNetworkSlice | - | password 已排除 |
| `yyc3_system_settings` | Hook | useSettingsStore | ✅ darkMode | aiApiKey, dbPassword |
| `yyc3_model_providers` | Hook | useModelProvider | ✅ providers | apiKey |
| `yyc3_configured_models` | Hook | useModelProvider | ✅ models | apiKey |
| `network_config` | Hook | useNetworkConfig | - | - |
| `yyc3_env_config` | Direct | EnvConfigEditor | - | - |
| `yyc3_custom_theme` | Direct | ThemeCustomizer | - | - |
| `yyc3-variable-values` | Direct | VariableCenter | - | Secret 类变量 |
| `yyc3-ide-settings` | Direct | IDESettingsPanel | - | - |
| `yyc3_db_pool_config` | Direct | DatabaseConnectionPanel | - | - |
| `yyc3_sql_history` | Direct | DatabaseConnectionPanel | - | - |
| `yyc3_api_endpoints` | Direct | SystemSettings | - | - |

---

## 7. CRUD 操作速查表

### 7.1 db-conn-slice (SSOT 双向桥接)

| 操作 | 方法签名 | 使用位置 | 桥接 |
|------|---------|---------|------|
| 读取 | `connections: DBConnection[]` | DatabaseConnectionPanel | - |
| 创建 | `addConnection(conn)` | DatabaseConnectionPanel | ✅→Global |
| 更新 | `updateConnection(id, updates)` | DatabaseConnectionPanel | ✅→Global |
| 删除 | `removeConnection(id)` | DatabaseConnectionPanel | ✅→Global |
| 状态 | `setConnectionStatus(id, status)` | DatabaseConnectionPanel | ✅→Global |

### 7.2 follow-up-slice (SSOT 桥接)

| 操作 | 方法签名 | 使用位置 | 桥接 |
|------|---------|---------|------|
| 读取 | `followUps: FollowUpRecord[]` | FollowUpManager | - |
| 创建 | `addFollowUp(fu)` | FollowUpEditDialog | ✅→Global |
| 更新 | `updateFollowUp(id, updates)` | FollowUpEditDialog | ✅→Global |
| 删除 | `removeFollowUp(id)` | FollowUpManager | ✅→Global |
| 完成 | `completeFollowUp(id)` | FollowUpManager | ✅→Global |

### 7.3 node-slice (DataBus 集成)

| 操作 | 方法签名 | 使用位置 |
|------|---------|---------|
| 读取 | `nodes: NodeData[]` | Dashboard, DataEditorPanel |
| 派生 | `derived: {activeRatio, avgGpu, avgMem}` | Dashboard |
| 创建 | `addNode(node)` | DataEditorPanel |
| 更新 | `updateNode(id, updates)` | DataEditorPanel |
| 删除 | `removeNode(id)` | DataEditorPanel |
| 批量 | `setNodes(nodes, source?)` | DataBus, Init |
| 重置 | `resetNodes()` | DataEditorPanel |

### 7.4 user-mgmt-slice

| 操作 | 方法签名 | 使用位置 |
|------|---------|---------|
| 读取 | `users: UserRecord[]` | UserManagement, FollowUpManager |
| 创建 | `addUser(user)` | UserManagement |
| 更新 | `updateUser(id, updates)` | UserManagement |
| 删除 | `removeUser(id)` | UserManagement |
| 锁定 | `toggleLock(id)` | UserManagement |

### 7.5 network-slice

| 操作 | 方法签名 | 使用位置 |
|------|---------|---------|
| 读取 | `networks, autoReconnect` | NetworkConfig |
| 创建 | `addNetwork(net)` | NetworkConfig |
| 更新 | `updateNetwork(id, updates)` | NetworkConfig |
| 删除 | `removeNetwork(id)` | NetworkConfig |
| 连接 | `setConnected(id)` | NetworkConfig |
| 配置 | `updateAutoReconnect(updates)` | NetworkConfig |

### 7.6 model-slice / metrics-slice / log-slice / app-slice

| Slice | 读取 | 写入 Actions | 使用位置 |
|-------|------|-------------|---------|
| **model-slice** | `models: DeployedModel[]` | addModel, updateModel, removeModel | Dashboard, DataEditorPanel |
| **metrics-slice** | modelPerf, modelDist, radarData | setModelPerf, setModelDist, setRadarData | Dashboard, DataEditorPanel |
| **log-slice** | `logs: StoredLogEntry[]` | addLog, updateLog, removeLog, clearLogs | LogViewer |
| **app-slice** | theme, locale, sidebar, isGhost | setTheme, setLocale, toggleSidebar, setGhostMode | Layout, ConfigCenter |

---

## 8. 开发规范与最佳实践

### 8.1 新增可编辑字段标准步骤

```
1. 在 types/index.ts 定义/扩展类型
2. 确定主存储层 (优先使用现有 Slice Store)
3. 在 Slice 的 DEFAULT_XXX 中添加默认值
4. 在 Slice interface 中声明 state 字段和 action
5. 实现 setState 逻辑
6. 如需持久化 → 更新 partialize 函数
7. 如涉及跨页面共享 → 添加 SSOT 桥接函数 (参考 db-conn-slice 模式)
8. 如涉及敏感数据 → 使用 secureStorage API
9. UI 组件中调用 useXxxSlice() 获取数据和 actions
10. 验证跨标签页同步
11. 运行 bun run type-check && bun test
12. 更新本文档
```

### 8.2 添加 SSOT 桥接的模式

**Slice→Global (静态导入)**:
```typescript
// 1. 在 global-store.ts 添加桥接函数
export function bridgeXxxToGlobal(data: XxxType[]) {
  try {
    useGlobalStore.setState({ xxxField: data });
    broadcastGlobalStoreChange("update");
  } catch { /* ignore */ }
}

// 2. 在 Slice 文件中导入并调用
import { bridgeXxxToGlobal } from '../../stores/global-store';
function syncToGlobal(data: XxxType[]) {
  try { bridgeXxxToGlobal(data); } catch { /* ignore */ }
}
// 在每个 mutation action 末尾调用 syncToGlobal()
```

**Hook→Global (动态 require)**:
```typescript
// 在 Hook 文件中使用 require() 避免循环依赖
try {
  const { bridgeXxxToGlobal } = require("../stores/global-store");
  bridgeXxxToGlobal(data);
} catch { /* ignore */ }
```

### 8.3 敏感数据处理规范

```typescript
// 使用 CryptoVault 加密存储
import { secureStorage } from "../lib/crypto-vault";

// 存储 API Key (异步)
await secureStorage.setItem("api_key", "sk-xxxxx");

// 读取 API Key (异步)
const key = await secureStorage.getItem("api_key");

// partialize 中排除敏感字段不落盘 (现有做法)
partialize: (state) => ({
  connections: state.connections.map(c => ({
    ...c,
    password: undefined, // 不持久化密码
  })),
}),
```

### 8.4 数据绑定检查清单

- [ ] UI 组件使用 `useXxxSlice()` 获取数据（非直接引用 props）
- [ ] 编辑操作通过 slice action 提交（非直接 setState）
- [ ] 新增字段已在对应 slice 的 `partialize` 中配置
- [ ] 敏感字段已排除持久化或使用 `secureStorage`
- [ ] 跨页面共享数据已添加 SSOT 桥接
- [ ] 类型定义与实际使用一致（无 `any`）
- [ ] 跨标签页同步已验证

### 8.5 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 编辑后其他页面不刷新 | 缺少 SSOT 桥接 | 添加 bridgeXxxToGlobal |
| 刷新页面数据丢失 | 缺少 persist middleware | 为对应 slice 添加 |
| 跨标签页不同步 | 未使用统一 BroadcastChannel | 使用 broadcastSyncMessage() |
| 类型报错 | 枚举值不匹配 | 检查 types/index.ts 统一类型 |
| 备份恢复不完整 | 缺少 localStorage key | 检查 full-backup.ts 的 BACKUP_PREFIXES |
| 密码泄露 | partialize 未排除 | 添加到 partialize 排除列表 |

---

## 9. 文件索引

### 9.1 核心基础设施

| 类别 | 文件路径 | 职责 |
|------|---------|------|
| **SSOT 中枢** | `src/app/stores/global-store.ts` | 6 域统一状态 + 桥接函数 |
| **统一类型** | `src/app/types/index.ts` | 所有业务类型定义 |
| **类型重导出** | `src/app/stores/dashboard-stores.ts` | 从 types/index.ts 重导出 (已迁移) |
| **同步通道** | `src/app/lib/broadcast-channel.ts` | 统一 BroadcastChannel |
| **加密库** | `src/app/lib/crypto-vault.ts` | AES-256-GCM 加密 |
| **全量备份** | `src/app/lib/full-backup.ts` | 一键导出/导入 |
| **数据总线** | `src/app/lib/data-bus.ts` | 节点数据事件中枢 |
| **API 配置** | `src/app/lib/api-config.ts` | API/WS 端点配置 |
| **环境配置** | `src/app/lib/env-config.ts` | 环境变量管理 |

### 9.2 Slice Store 层

| Slice | 文件路径 | 职责 | SSOT 桥接 |
|-------|---------|------|----------|
| node-slice | `src/app/store/slices/node-slice.ts` | GPU 节点遥测 | DataBus |
| db-conn-slice | `src/app/store/slices/db-conn-slice.ts` | 数据库连接 | ✅ 双向 |
| follow-up-slice | `src/app/store/slices/follow-up-slice.ts` | 跟进任务 | ✅→Global |
| model-slice | `src/app/store/slices/model-slice.ts` | GPU 部署模型 | 独立 |
| user-mgmt-slice | `src/app/store/slices/user-mgmt-slice.ts` | 用户管理 | 独立 |
| network-slice | `src/app/store/slices/network-slice.ts` | WiFi 网络 | 独立 |
| log-slice | `src/app/store/slices/log-slice.ts` | 系统日志 | 独立 |
| metrics-slice | `src/app/store/slices/metrics-slice.ts` | 图表指标 | 独立 |
| app-slice | `src/app/store/slices/app-slice.ts` | 全局偏好 | 独立 |

### 9.3 Hook 存储层

| Hook | 文件路径 | localStorage Key | SSOT 桥接 |
|------|---------|------------------|----------|
| useSettingsStore | `src/app/hooks/useSettingsStore.ts` | yyc3_system_settings | ✅ darkMode→theme |
| useModelProvider | `src/app/hooks/useModelProvider.ts` | yyc3_model_providers + yyc3_configured_models | ✅ providers+models |
| useNetworkConfig | `src/app/hooks/useNetworkConfig.ts` | network_config | 独立 |

### 9.4 UI 组件层

| 页面 | 文件路径 | 数据源 | 编辑模式 |
|------|---------|--------|---------|
| SystemSettings | `src/app/components/SystemSettings.tsx` | useSettingsStore + useModelProvider | 完整编辑 |
| UnifiedSettingsPanel | `src/app/components/UnifiedSettingsPanel.tsx` | GlobalStore (6 域) | 导出/导入/清除 |
| ModelProviderPanel | `src/app/components/ModelProviderPanel.tsx` | useModelProvider | 完整 CRUD |
| EnvConfigEditor | `src/app/components/EnvConfigEditor.tsx` | lib/env-config | 分组编辑 |
| UserManagement | `src/app/components/UserManagement.tsx` | useUserMgmtSlice | 完整 CRUD + 锁定 |
| DatabaseConnectionPanel | `src/app/components/DatabaseConnectionPanel.tsx` | useDbConnSlice | 完整 CRUD + 池配置 |
| DatabaseManager | `src/app/components/DatabaseManager.tsx` | useLocalDatabase + IDB | SQL 编辑 + 内联编辑 |
| NetworkConfig | `src/app/components/NetworkConfig.tsx` | useNetworkConfig + useNetworkSlice | 扫描 + 连接 + 配置 |
| DataEditorPanel | `src/app/components/DataEditorPanel.tsx` | useNodeSlice + useMetricsSlice + IDB | 完整 CRUD |
| FollowUpManager | `src/app/components/FollowUpManager.tsx` | useFollowUpSlice + useUserMgmtSlice | 完整 CRUD + 筛选 |
| FollowUpPanel | `src/app/components/FollowUpPanel.tsx` | useAlerts (GlobalStore) | 只读 + 快捷操作 |
| ThemeCustomizer | `src/app/components/ThemeCustomizer.tsx` | 直接 localStorage | 全面自定义 |
| VariableCenter | `src/app/components/VariableCenter.tsx` | lib/variable-center | 分类编辑 |
| IDESettingsPanel | `src/app/components/ide/IDESettingsPanel.tsx` | 直接 localStorage | 编辑器偏好 |

---

## 附录: 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|---------|
| v3.0.0 | 2026-04-15 | SSOT 桥接完成：db-conn/followUp/model-provider 双向同步，统一 BroadcastChannel，CryptoVault 加密库，全量备份恢复，14 页面完整覆盖 |
| v2.0.0 | 2026-04-15 | 数据统一：Dashboard→useNodeSlice, LogViewer→useLogSlice, 持久化 100% |
| v1.0.0 | 2026-04-15 | 初版：9 Slice 架构, DataBus 中枢, 227 测试用例 |

---

> **YYC³ Cloud Intelli-Matrix** | *言启象限 · 语枢未来* | v3.0.0 · SSOT 桥接完成版
