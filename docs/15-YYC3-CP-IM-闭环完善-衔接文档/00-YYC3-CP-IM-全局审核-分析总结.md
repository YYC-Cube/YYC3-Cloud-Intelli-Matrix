# YYC³ Cloud Intelli-Matrix 全局架构可视化结构文档

## 一、项目概览

| 项目属性     | 值                                           |
| ------------ | -------------------------------------------- |
| **项目名称** | `yyc3-cloudpivot-intelli-matrix`             |
| **版本**     | v3.4.1                                       |
| **定位**     | YYC³ Family 本地闭环多端推理矩阵数据看盘系统 |
| **运行端口** | 3218（开发模式）                             |
| **支持平台** | Web (PWA) / Electron (macOS/Windows/Linux)   |
| **路由模式** | HashRouter (`createHashRouter`)              |

---

## 二、核心技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                     前端框架层 (UI Layer)                      │
│  React 19 + TypeScript 5.9 + Vite 8                        │
│  @radix-ui (30+组件) + MUI 9 + Tailwind CSS 4              │
│  motion (Framer Motion) + react-router 7                    │
├─────────────────────────────────────────────────────────────┤
│                     状态管理层 (State Layer)                   │
│  Zustand 5 (统一 Store, 20+ Slices)                         │
│  Immer + React Hook Form + Zod 4 (校验)                     │
├─────────────────────────────────────────────────────────────┤
│                     数据层 (Data Layer)                       │
│  DataBus 事件中枢 + WebSocket 双向同步                        │
│  IndexedDB (yyc3_matrix) + localStorage 双层缓存             │
│  BroadcastChannel 多标签页同步 + CRDT 冲突解决                │
│  Supabase (认证/远端) + 本地优先策略                          │
├─────────────────────────────────────────────────────────────┤
│                     AI/推理层 (AI Layer)                      │
│  @mlc-ai/web-llm (浏览器端推理)                               │
│  OpenAI / DeepSeek / 智谱AI / Ollama / Kimi / Anthropic     │
│  Agent 编排系统 (8个Agent) + MCP协议 + 技能系统               │
├─────────────────────────────────────────────────────────────┤
│                     桌面端层 (Electron Layer)                  │
│  Electron 41 + electron-store + electron-updater            │
│  IPC Handlers + 权限管理 + 本地数据库                         │
├─────────────────────────────────────────────────────────────┤
│                     工程化层 (DevOps Layer)                    │
│  Vitest + Playwright (E2E) + ESLint + Lighthouse CI         │
│  GitHub Actions (CI/CD) + Docker + Nginx                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、全局导航架构 — 按导航栏分类

### 3.1 侧边栏（桌面端） / 底部导航栏（移动端）完整结构

| 主导航                        | 二级导航         | 路由路径                | 组件                      |
| ----------------------------- | ---------------- | ----------------------- | ------------------------- |
| **📊 监控中心** (`monitor`)    | 数据监控 (首页)  | `/`                     | `DataMonitoring`          |
|                               | 跟进管理         | `/follow-up`            | `FollowUpPanel`           |
|                               | 跟进管理器       | `/follow-up-manager`    | `FollowUpManager`         |
|                               | 巡查仪表盘       | `/patrol`               | `PatrolDashboard`         |
|                               | 告警规则         | `/alerts`               | `AlertRulesPanel`         |
| **🔧 运维中心** (`ops`)        | 运维中心         | `/operations`           | `OperationCenter`         |
|                               | 文件管理         | `/files`                | `LocalFileManager`        |
|                               | 主机文件         | `/host-files`           | `HostFileManager`         |
|                               | 数据库管理       | `/database`             | `DatabaseManager`         |
|                               | 数据库连接       | `/db-connections`       | `DatabaseConnectionPanel` |
|                               | 连接测试         | `/connection-test`      | `ServiceConnectionTest`   |
|                               | 服务循环         | `/loop`                 | `ServiceLoopPanel`        |
|                               | 报表导出         | `/reports`              | `ReportExporter`          |
|                               | 导出中心         | `/export-center`        | `ConfigExportCenter`      |
| **🧠 AI智能** (`ai`)           | AI决策面板       | `/ai`                   | `AISuggestionPanel`       |
|                               | 模型提供商       | `/models`               | `ModelProviderPanel`      |
|                               | AI诊断           | `/ai-diagnosis`         | `AIDiagnostics`           |
|                               | SDK对话          | `/sdk-chat`             | `SDKChatPanel`            |
| **👨‍👩‍👧 AI Family** (`ai-family`) | 家族首页（时钟） | `/ai-family`            | `AIFamilyPage`            |
|                               | 家族首页 (子)    | `/ai-family/home`       | `FamilyHome`              |
|                               | 家族中心         | `/ai-family/center`     | `AIFamilyCenterPage`      |
|                               | 规划文档         | `/ai-family/planning`   | `AIFamilyDesignDoc`       |
|                               | 家人对话         | `/ai-family/chat`       | `FamilyChat`              |
|                               | 家族分享         | `/ai-family/share`      | `FamilyShare`             |
|                               | 学习空间         | `/ai-family/learn`      | `FamilyLearn`             |
|                               | 音乐空间         | `/ai-family/music`      | `FamilyMusic`             |
|                               | 成长轨迹         | `/ai-family/growth`     | `FamilyGrowth`            |
|                               | 电话通讯         | `/ai-family/phone`      | `FamilyPhone`             |
|                               | 娱乐空间         | `/ai-family/fun`        | `FamilyEntertainment`     |
|                               | 活动中心         | `/ai-family/activities` | `FamilyActivityCenter`    |
|                               | 模型控制         | `/ai-family/models`     | `FamilyModelSettings`     |
|                               | 语音系统         | `/ai-family/voice`      | `FamilyVoiceSystem`       |
|                               | 数据中心         | `/ai-family/data`       | `FamilyDataHub`           |
|                               | 通讯中心         | `/ai-family/comm`       | `FamilyCommCenter`        |
|                               | UI设置           | `/ai-family/settings`   | `FamilyUISettings`        |
|                               | 集群管理         | `/ai-family/cluster`    | `FamilyCluster`           |
| **🏨 酒店管理** (`hotel`)      | 酒店仪表盘       | `/hotel`                | `HotelDashboard`          |
| **📡 通讯站** (`comm-station`) | 通讯站面板       | `/comm-station`         | `CommStationPanel`        |
| **💻 开发工具** (`dev`)        | 设计系统         | `/design-system`        | `DesignSystemPage`        |
|                               | 开发指南         | `/dev-guide`            | `DevGuidePage`            |
|                               | 主题定制         | `/theme`                | `ThemeCustomizer`         |
|                               | CLI终端          | `/terminal`             | `CLITerminal`             |
|                               | IDE面板          | `/ide`                  | `IDEPanel`                |
|                               | 重构报告         | `/refactoring`          | `RefactoringReport`       |
|                               | 架构审计         | `/architecture`         | `ArchitectureAudit`       |
| **🛡️ 系统管理** (`admin`)      | 运维审计         | `/audit`                | `OperationAudit`          |
|                               | 用户管理         | `/users`                | `UserManagement`          |
|                               | **系统设置** ⬇️   | `/settings`             | `SystemSettings`          |
|                               | 统一设置         | `/unified-settings`     | `UnifiedSettingsPanel`    |
|                               | 安全监控         | `/security`             | `SecurityMonitor`         |
|                               | PWA状态          | `/pwa`                  | `PWAStatusPanel`          |
|                               | 数据编辑器       | `/data-editor`          | `DataEditorPanel`         |
|                               | 性能监控         | `/performance`          | `PerformanceMonitor`      |
|                               | 环境变量         | `/env-config`           | `EnvConfigEditor`         |

### 3.2 独立路由页面（不在主导航显示）

| 路由                  | 组件                     | 说明               |
| --------------------- | ------------------------ | ------------------ |
| `/config-center`      | `ConfigCenter`           | 配置中心           |
| `/variables`          | `VariableCenter`         | 变量中心           |
| `/connection-monitor` | `ConnectionMonitorPanel` | 连接监控           |
| `/storage`            | `StorageManager`         | 存储管理           |
| `/hotel-dashboard`    | `HotelDashboard`         | 酒店仪表盘（别名） |

---

## 四、系统设置 — 12个子面板详细结构

系统设置页面 (`/settings`) 内部通过 `settingsSections` 数组配置12个子面板：

```
系统设置 (/settings)
├── 1. 通用设置 (general)          — 系统名称、语言、主题、端口等基础配置
├── 2. 网络连接 (network)          — API端点、WebSocket地址、代理配置
│   └── NetworkConfig 子组件       — 内含 EditableField 可编辑字段
├── 3. 集群配置 (cluster)          — 集群节点、负载均衡、健康检查
├── 4. 模型管理 (model)            — UnifiedModelManager 统一模型管理
│   ├── 模型提供商列表              — OpenAI/DeepSeek/智谱/Ollama等
│   ├── API Key 管理               — 密钥增删改查、连接测试
│   └── 默认模型选择               — 全局默认模型配置
├── 5. 存储配置 (storage)          — 存储策略、缓存大小、清理规则
├── 6. WebSocket (websocket)       — WS连接配置、心跳间隔、重连策略
├── 7. AI / LLM (ai)              — 推理参数、温度、Token限制
├── 8. PWA / 离线 (pwa)           — 离线缓存、Service Worker、安装提示
├── 9. 安全设置 (security)         — 认证策略、XSS防护、CORS配置
├── 10. 通知配置 (notification)    — 告警通知渠道、阈值、静默规则
├── 11. 环境变量 (env)             — 环境变量编辑器 (EnvConfigEditor)
└── 12. 高级设置 (advanced)        — 实验性功能、调试开关、性能参数
```

每个子面板均使用 **`EditableField`** 组件实现行内编辑，通过 `useSettingsStore` hook 读写状态，变更实时持久化到 localStorage 并通过 BroadcastChannel 同步到其他标签页。

---

## 五、可编辑变量体系 — 变量中心 (`/variables`)

### 5.1 变量分类与分组

| 变量大类       | 分组       | 关键变量                                                                                             |
| -------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| **🔌 设备变量** | 节点配置   | `node.defaultHostname`, `node.defaultPort`                                                           |
|                | GPU配置    | `gpu.warningThreshold(80)`, `gpu.criticalThreshold(95)`, `gpu.tempWarning(85)`                       |
|                | 网络配置   | `network.apiBase`, `network.wsEndpoint`                                                              |
| **👤 人员变量** | 用户设置   | `user.defaultRole(admin/developer/guest)`                                                            |
|                | 认证设置   | `user.sessionTimeout(60min)`, `user.maxLoginAttempts(5)`                                             |
| **🔑 密钥变量** | API密钥    | `secret.openaiKey`, `secret.zhipuKey`, `secret.deepseekKey`, `secret.kimiKey`, `secret.anthropicKey` |
| **📦 模型配置** | 模型提供商 | `model.defaultProvider`, `model.defaultModel`, `model.ollamaBaseUrl`                                 |
|                | 模型参数   | `model.temperature(0.7)`, `model.maxTokens(2048)`, `model.topP(0.9)`, `model.timeout(30s)`           |
| **⚙️ 系统配置** | 系统通用   | `system.name`, `system.language(zh-CN/en-US)`, `system.theme`                                        |
|                | AI设置     | 系统级AI配置                                                                                         |
|                | 数据库设置 | 数据库连接配置                                                                                       |
| **🌐 环境变量** | 端点配置   | API端点配置                                                                                          |
|                | 存储配置   | 存储键和ID配置                                                                                       |

### 5.2 变量数据流

```
VariableCenter (UI) ←→ variable-center.ts (配置注册表)
       ↓                      ↓
  EditableField          getVariableValue() / setVariableValue()
       ↓                      ↓
  localStorage ←→ BroadcastChannel ←→ 其他标签页
       ↓
  validateVariable() (Zod校验)
       ↓
  exportVariables() / importVariables() (导入导出)
```

---

## 六、存储架构

```
┌─────────────────────────────────────────────────────────────┐
│                    存储架构 (yyc3-storage.ts)                 │
├──────────────────────────┬──────────────────────────────────┤
│   localStorage (轻量)     │   IndexedDB: yyc3_matrix (v5)    │
│   < 5KB 单项              │   大数据持久化                    │
│                           │                                  │
│   • 认证信息              │   24个 Object Store:              │
│   • 语言/主题偏好          │   • alertRules / alertEvents     │
│   • API端点配置            │   • patrolHistory / loopHistory   │
│   • 仪表盘布局             │   • operationTemplates/Logs      │
│   • 用户设置               │   • diagnosisHistory / reports    │
│   • 变量中心值             │   • errorLog / dashboardSnaps    │
│   • 模型提供商             │   • fileVersions / dbConnections  │
│   • 家族配置               │   • queryHistory / committedChgs  │
│                           │   • agent_memories / agent_tasks   │
│                           │   • mcp_contexts / inference_cache │
│                           │   • family_messages/activities     │
│                           │   • family_memories/broadcasts     │
│                           │   • music_library / comm_stations  │
├──────────────────────────┴──────────────────────────────────┤
│              BroadcastChannel (多标签页同步)                   │
│              yyc3_api_config / yyc3_storage_sync              │
├─────────────────────────────────────────────────────────────┤
│              Supabase (远端认证 + 可选云同步)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 七、全局数据统一机制

### 7.1 DataBus 事件中枢 (`data-bus.ts`)

```
                        ┌─────────────────┐
  WebSocket推送 ───────→│                 │
  UI用户编辑  ───────→│    DataBus       │──────→ Zustand Store
  DataService  ───────→│  (事件中枢)      │──────→ IndexedDB
  模拟数据     ───────→│                 │──────→ UI组件订阅
                        │  smartMerge     │──────→ WebSocket 回传
                        │  冲突解决        │
                        └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │  字段分类策略:       │
                    │  遥测字段 → WS优先   │
                    │  编辑字段 → 用户优先 │
                    │  (gpu/mem/temp/tasks)│
                    │  (status/model)     │
                    └────────────────────┘
```

### 7.2 Zustand 统一 Store 架构 (`store/index.ts`)

| Slice                      | 职责                             |
| -------------------------- | -------------------------------- |
| `useNodeSlice`             | 节点数据管理                     |
| `useMetricsSlice`          | 性能指标                         |
| `useAppSlice`              | 应用全局状态                     |
| `useLogSlice`              | 日志管理                         |
| `useDbConnSlice`           | 数据库连接                       |
| `useUserMgmtSlice`         | 用户管理                         |
| `useNetworkSlice`          | 网络状态                         |
| `useFollowUpSlice`         | 跟进管理                         |
| `useModelSlice`            | 模型配置                         |
| `useProviderSlice`         | 提供商管理                       |
| `useFamilyMemberSlice`     | 家族成员                         |
| `useFamilyMessageSlice`    | 家族消息                         |
| `useFamilySettingsSlice`   | 家族设置 (语音/音乐/UI/模型分配) |
| `useAISuggestionSlice`     | AI建议                           |
| `useIDESettingsSlice`      | IDE配置                          |
| `useUIPrefsSlice`          | UI偏好/告警阈值                  |
| `useOfflineSlice`          | 离线状态                         |
| `useFSSlice`               | 文件系统                         |
| `useSDKSessionSlice`       | SDK会话                          |
| `useFamilyPostsSlice`      | 家族动态                         |
| `useFamilyNewsSlice`       | 家族新闻                         |
| `useFamilyMomentsSlice`    | 家族时刻                         |
| `useFamilyMilestonesSlice` | 家族里程碑                       |
| `useFamilyMemoriesSlice`   | 家族记忆                         |
| `useFamilyMedalsSlice`     | 家族勋章                         |
| `useFamilyChatSlice`       | 家族聊天                         |
| `useFamilyCalllogSlice`    | 家族通话                         |
| `useFamilyActivitiesSlice` | 家族活动                         |
| `useFamilySkillsSlice`     | 家族技能                         |

**统一读取 Hook**: `useUnifiedStore()` — 一次性获取 node/metrics/app/members/messages 联合状态

---

## 八、API路由架构

### 8.1 统一API配置 (`api-config.ts`)

```
┌──────────────────────────────────────────────┐
│           APIEndpoints 统一配置                │
│                                              │
│  fsBase:      "/api/fs"        文件系统API    │
│  dbBase:      "/api/db"        数据库API      │
│  wsEndpoint:  "ws://localhost:3113/ws"  WS    │
│  aiBase:      "https://api.openai.com/v1"     │
│  clusterBase: "/api/cluster"   集群API        │
│  enableBackend: false          后端开关       │
│  timeout:     15000ms          超时           │
│  maxRetries:  2                重试次数        │
└──────────────────────────────────────────────┘
          │
    Zod 校验 (config-validator.ts)
          │
    localStorage 持久化
          │
    BroadcastChannel 跨标签页同步
```

### 8.2 核心服务层模块

| 模块          | 文件                                            | 职责                          |
| ------------- | ----------------------------------------------- | ----------------------------- |
| DataBus       | `data-bus.ts`                                   | 数据合并/校验/分发 + WS同步   |
| WebSocket管理 | `websocket-manager.ts`                          | WS连接/心跳/重连/消息队列     |
| 存储管理      | `yyc3-storage.ts`                               | IndexedDB + localStorage 双层 |
| API配置       | `api-config.ts`                                 | 端点集中管理 + Zod校验        |
| 变量中心      | `variable-center.ts`                            | 60+ 可编辑变量注册表          |
| 认证          | `supabaseClient.ts` + `authContext.ts`          | Supabase + Ghost模式          |
| AI服务        | `ai-service-manager.ts` + `inference-engine.ts` | 多模型统一调度                |
| 连接测试      | `connection-test-engine.ts`                     | AI连接诊断                    |
| Agent编排     | `agent/agent-orchestrator.ts`                   | 8个Agent协同                  |
| MCP协议       | `mcp/mcp-server.ts` + `mcp-bridge.ts`           | 工具调用协议                  |
| 跨标签同步    | `cross-tab-sync.ts` + `broadcast-channel.ts`    | 多窗口数据一致                |
| CRDT          | `crdt.ts`                                       | 冲突解决                      |
| 加密库        | `crypto-vault.ts`                               | 密钥加密存储                  |

---

## 九、AI Family 子系统架构

```
AIFamilyPage (/ai-family)
└── AIFamilyRouter (/ai-family/:subpage)
    ├── FamilyHome       ─ 首页入口 / 成员状态
    ├── AIFamilyCenterPage ─ 全景规划 / 信任公约
    ├── FamilyHotel       ─ 酒店场景 (智能客房/语音助手)
    ├── FamilyChat        ─ 多轮对话 / 群聊
    ├── FamilyMusic       ─ 音乐空间 (VinylPhotoPlayer/CoverFlow)
    ├── FamilyVoiceSystem ─ TTS/STT语音系统
    ├── FamilyModelSettings ─ 模型绑定/API Key
    ├── FamilyUISettings  ─ UI偏好 / 生态链路 / 测通
    ├── FamilyShare       ─ 分享中心
    ├── FamilyLearn       ─ 学习空间
    ├── FamilyGrowth      ─ 成长轨迹
    ├── FamilyPhone       ─ 电话通讯
    ├── FamilyEntertainment ─ 娱乐 (游戏/创作)
    ├── FamilyActivityCenter ─ 活动中心
    ├── FamilyDataHub     ─ 数据中心
    ├── FamilyCommCenter  ─ 通讯中心
    ├── FamilyCluster     ─ 集群管理
    └── AIFamilyDesignDoc ─ 规划文档
```

---

## 十、全局 UI 层组件架构

```
App.tsx (根组件)
├── ErrorBoundary (全局错误捕获)
├── AuthContext (认证上下文)
├── I18nContext (国际化上下文)
└── Layout.tsx (布局壳)
    ├── TopBar (顶部导航栏)
    │   ├── YYC3Logo (品牌标识)
    │   ├── ConnectionStatus (连接状态)
    │   ├── CommandPalette触发器 (⌘K)
    │   └── 用户菜单
    ├── Sidebar (侧边栏 · 桌面端)
    │   ├── 8大导航分类
    │   └── Flyout子菜单
    ├── Outlet (页面内容区)
    ├── BottomNav (底部导航 · 移动端)
    ├── AIAssistant (AI智能助理浮窗)
    ├── CommandPalette (命令面板 ⌘K)
    ├── IntegratedTerminal (集成终端 Ctrl+`)
    ├── PWAInstallPrompt (PWA安装提示)
    ├── OfflineIndicator (离线指示器)
    └── Toaster (Toast通知)
```

---

## 十一、逻辑互通测试体系

### 11.1 测试矩阵

| 测试类型   | 框架       | 文件位置                    | 覆盖范围       |
| ---------- | ---------- | --------------------------- | -------------- |
| 单元测试   | Vitest     | `__tests__/*.test.ts(x)`    | 100+ 组件/模块 |
| Store测试  | Vitest     | `__tests__/store/*.test.ts` | 9个Slice       |
| 库测试     | Vitest     | `__tests__/lib/*.test.ts`   | 25+ 核心模块   |
| 集成测试   | Vitest     | `__tests__/integration/`    | 模块间交互     |
| E2E测试    | Playwright | `__tests__/e2e/specs/`      | 跨页面数据流   |
| Lighthouse | LHCI       | `.github/workflows/`        | 性能/无障碍    |

### 11.2 关键E2E测试场景

| 测试文件                           | 测试内容       |
| ---------------------------------- | -------------- |
| `cross-page-data-flow.e2e.spec.ts` | 跨页面数据统一 |
| `dashboard.e2e.spec.ts`            | 仪表盘功能     |
| `navigation.e2e.spec.ts`           | 导航跳转       |
| `wifi-auto-reconnect.e2e.spec.ts`  | 网络重连       |
| `git-panel.e2e.spec.ts`            | Git面板        |

---

## 十二、数据统一关键分析

### 12.1 数据流向全景

```
用户操作 (UI EditableField)
    │
    ├→ useSettingsStore (React State)
    │      └→ localStorage 持久化
    │             └→ BroadcastChannel → 其他标签页
    │
    ├→ VariableCenter (变量中心)
    │      └→ variable-center.ts 注册表
    │             └→ Zod validateVariable() 校验
    │
    ├→ DataBus (数据中枢)
    │      ├→ smartMerge 智能合并
    │      ├→ Zustand Store 更新
    │      ├→ IndexedDB 写入
    │      └→ WebSocket 回传 (如启用)
    │
    └→ api-config.ts (API端点)
           └→ Zod validateAPIConfig() 校验
                  └→ localStorage + BroadcastChannel
```

### 12.2 数据统一策略总结

| 策略         | 实现机制                                | 涉及模块                       |
| ------------ | --------------------------------------- | ------------------------------ |
| **配置统一** | `api-config.ts` 集中管理所有端点        | SystemSettings → NetworkConfig |
| **变量统一** | `variable-center.ts` 60+变量注册表      | VariableCenter                 |
| **状态统一** | Zustand 20+ Slices +`useUnifiedStore()` | 全局组件                       |
| **存储统一** | `yyc3-storage.ts` 双层缓存 + 24个Store  | StorageManager                 |
| **事件统一** | `data-bus.ts` 事件中枢 + smartMerge     | DataMonitoring/Operations      |
| **同步统一** | BroadcastChannel + CRDT                 | 跨标签页                       |
| **校验统一** | Zod schema (config-validator.ts)        | 全局配置变更                   |
| **错误统一** | `error-handler.ts` + ErrorBoundary      | 全局错误捕获                   |

以上是完整的全局架构可视化结构文档，涵盖了：

1. **8大导航分类**（监控/运维/AI/AI Family/酒店/通讯站/开发/管理），共计 **50+ 路由页面**
2. **系统设置 12个子面板**的完整结构（通用→高级设置）
3. **60+ 可编辑变量**的6大分类体系
4. **DataBus 事件中枢** + **Zustand 20+ Slices** 的全局数据统一机制
5. **IndexedDB 24个Object Store** + localStorage 双层存储架构
6. **BroadcastChannel + CRDT** 的跨标签页同步策略
7. **Vitest + Playwright** 的逻辑互通测试体系
