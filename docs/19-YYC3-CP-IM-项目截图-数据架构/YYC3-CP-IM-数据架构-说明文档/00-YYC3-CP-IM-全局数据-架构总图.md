# YYC³ Cloud Intelli-Matrix — 全局数据架构总图

> **用途**: 全局数据分流、汇总、存储的完整可视化架构图（实码验证版）
> **生成日期**: 2026-04-26 (v2 修正版)
> **更新日期**: 2026-05-03 (v3 导航优化版)
> **数据来源**: Sidebar.tsx NAV_CATEGORIES + routes.tsx + 逐文件 grep 验证

---

## 〇、导航优化变更摘要（2026-05-03）

| 变更类型         | 原始                  | 优化后             | 说明                                           |
| ---------------- | --------------------- | ------------------ | ---------------------------------------------- |
| 一级分类         | 8 个                  | **7 个**           | hotel + comm-station → business（业务空间）    |
| AI Family 导航项 | 18 子页面             | **5 核心入口**     | 13 子页面改为 AIFamilyCenterPage 内部 Tab 导航 |
| 运维管理         | 9 页                  | **10 页**          | +connection-monitor（连接监控）                |
| 管理后台         | 9 页                  | **12 页**          | +storage / config-center / variables           |
| 搜索功能         | 装饰性                | **功能可用**       | TopBar 搜索框 → CommandPalette 联动            |
| API Keys 数据源  | family-settings-slice | **provider-slice** | 统一到 provider-slice.configuredModels         |

---

## 一、全局导航结构（Sidebar.tsx 实码 · 优化后）

```
┌─────────────────────────────────────────────────────────────────────────┐
│              YYC³ 侧边栏 · 7 大导航分类 · 49 页面（优化后）              │
│              源文件: src/app/components/Sidebar.tsx                      │
└─────────────────────────────────────────────────────────────────────────┘

  📊 monitor (监控中心) ──────── 5 页 [不变]
     ├── / (Dashboard)
     ├── /follow-up (FollowUpPanel)
     ├── /follow-up-manager (FollowUpManager)
     ├── /patrol (PatrolDashboard)
     └── /alerts (AlertRulesPanel)

  🔧 ops (运维管理) ──────────── 10 页 [+1]
     ├── /operations (OperationCenter)
     ├── /files (LocalFileManager)
     ├── /host-files (HostFileManager)
     ├── /database (DatabaseManager)
     ├── /db-connections (DatabaseConnectionPanel)
     ├── /connection-test (ServiceConnectionTest)
     ├── /loop (ServiceLoopPanel)
     ├── /reports (ReportExporter)
     ├── /export-center (ConfigExportCenter)
     └── /connection-monitor (ConnectionMonitorPanel)  ← [NEW] 从隐藏路由纳入

  🧠 ai (AI 智能中心) ────────── 4 页 [不变]
     ├── /ai (AISuggestionPanel)
     ├── /models (ModelProviderPanel)
     ├── /ai-diagnosis (AIDiagnostics)
     └── /sdk-chat (SDKChatPanel)

  👨‍👩‍👧‍👦 ai-family (AI Family) ── 5 导航入口 + 13 内部Tab页 [精简]
     ├── /ai-family (AIFamilyPage 时钟首页)
     ├── /ai-family/home (家族首页)
     ├── /ai-family/center (Family中心)           ← 内含13个子Tab
     ├── /ai-family/models (模型设置)
     └── /ai-family/settings (Family设置)
     ────────────────────────────────────────────────
     以下 13 页面改为 AIFamilyCenterPage 内部 Tab 导航（路由仍可访问）:
     ├── /ai-family/planning (家族规划)           [精简→Center内Tab]
     ├── /ai-family/chat (交流中心)               [精简→Center内Tab]
     ├── /ai-family/share (分享空间)              [精简→Center内Tab]
     ├── /ai-family/learn (学习成长)              [精简→Center内Tab]
     ├── /ai-family/music (音乐空间)              [精简→Center内Tab]
     ├── /ai-family/growth (成长轨迹)             [精简→Center内Tab]
     ├── /ai-family/phone (家人热线)              [精简→Center内Tab]
     ├── /ai-family/fun (文娱中心)                [精简→Center内Tab]
     ├── /ai-family/activities (活动中心)         [精简→Center内Tab]
     ├── /ai-family/voice (语音系统)              [精简→Center内Tab]
     ├── /ai-family/data (数据中心)               [精简→Center内Tab]
     ├── /ai-family/comm (通讯中心)               [精简→Center内Tab]
     └── /ai-family/cluster (通信基站)            [精简→Center内Tab]

  🏢 business (业务空间) ────── 2 页 [NEW 合并分类]
     ├── /hotel (HotelDashboard)                  ← 原"智慧酒店"独立分类
     └── /comm-station (CommStationPanel)         ← 原"通讯基站"独立分类
     ────────────────────────────────────────────────
     ❌ hotel 独立分类 → 合并入 business
     ❌ comm-station 独立分类 → 合并入 business

  💻 dev (开发工具) ──────────── 7 页 [不变]
     ├── /design-system (DesignSystemPage)
     ├── /dev-guide (DevGuidePage)
     ├── /theme (ThemeCustomizer)
     ├── /terminal (CLITerminal)
     ├── /ide (IDEPanel)
     ├── /refactoring (RefactoringReport)
     └── /architecture (ArchitectureAudit)

  🛡️ admin (管理后台) ────────── 12 页 [+3]
     ├── /audit (OperationAudit)
     ├── /users (UserManagement)
     ├── /settings (SystemSettings)
     ├── /unified-settings (UnifiedSettingsPanel)
     ├── /security (SecurityMonitor)
     ├── /pwa (PWAStatusPanel)
     ├── /data-editor (DataEditorPanel)
     ├── /performance (PerformanceMonitor)
     ├── /env-config (EnvConfigEditor)
     ├── /storage (StorageManager)                ← [NEW] 从隐藏路由纳入
     ├── /config-center (ConfigCenter)            ← [NEW] 从隐藏路由纳入
     └── /variables (VariableCenter)              ← [NEW] 从隐藏路由纳入
```

---

## 二、导航变更对比图（优化前 → 优化后）

```
  优化前 (8 分类 · 47 页)                    优化后 (7 分类 · 49 页)
  ─────────────────────────                  ─────────────────────────
  📊 monitor(5)                              📊 monitor(5)          [不变]
  🔧 ops(9)                                  🔧 ops(10)             [+1 connection-monitor]
  🧠 ai(4)                                   🧠 ai(4)               [不变]
  👨‍👩‍👧‍👦 ai-family(18子项)                ──→  👨‍👩‍👧‍👦 ai-family(5入口)    [精简 13→内Tab]
  🏨 hotel(1)                          ──┐
  📡 comm-station(1)                   ──┤──→  🏢 business(2)       [合并]
  💻 dev(7)                                  💻 dev(7)              [不变]
  🛡️ admin(9)                                🛡️ admin(12)           [+3 storage/config/vars]
```

---

## 二、存储层架构

### 3.1 三层存储体系

| 层级                  | 技术                            | 容量  | 用途            | 生命周期            |
| --------------------- | ------------------------------- | ----- | --------------- | ------------------- |
| **L1 — Zustand**      | `zustand` + `persist` + `immer` | ~5MB  | 核心状态 + SSOT | localStorage 持久化 |
| **L2 — IndexedDB**    | `Dexie.js` + `usePersistedList` | ~50MB | 大数据集        | 永久持久化          |
| **L3 — localStorage** | 直接读写                        | ~5MB  | 轻量配置        | 永久持久化          |

### 3.2 Zustand 29 Slices（逐文件 grep 验证）

| #   | Slice 文件              | 存储名                   | 核心数据        | 消费者                         |
| --- | ----------------------- | ------------------------ | --------------- | ------------------------------ |
| 1   | node-slice              | `yyc3-node-slice`        | 8 GPU/TPU 节点  | Dashboard, Performance         |
| 2   | metrics-slice           | `yyc3-metrics-slice`     | QPS/延迟/吞吐量 | Dashboard, Performance         |
| 3   | follow-up-slice         | `yyc3-follow-up-slice`   | 跟进记录        | FollowUpPanel, FollowUpManager |
| 4   | log-slice               | `yyc3-log-slice`         | 系统日志        | OperationAudit                 |
| 5   | app-slice               | `yyc3-app-slice`         | 应用全局状态    | 全局                           |
| 6   | ui-prefs-slice          | `yyc3-ui-prefs`          | UI 偏好         | ThemeCustomizer                |
| 7   | user-mgmt-slice         | `yyc3-user-mgmt-slice`   | 用户管理        | UserManagement                 |
| 8   | model-slice             | `yyc3-model-slice`       | 模型状态        | SystemSettings, ModelProvider  |
| 9   | provider-slice          | `yyc3-provider-slice`    | 3 提供商        | ModelProvider, SDKChat         |
| 10  | ai-suggestion-slice     | `yyc3-ai-suggestion`     | AI 建议         | AISuggestionPanel              |
| 11  | sdk-session-slice       | `yyc3-sdk-session`       | SDK 会话        | SDKChatPanel                   |
| 12  | db-conn-slice           | `yyc3-db-conn-slice`     | 数据库连接      | DatabaseConnection, Database   |
| 13  | network-slice           | `yyc3-network-slice`     | 网络配置        | 全局                           |
| 14  | fs-slice                | `yyc3-fs`                | 文件系统        | LocalFileManager               |
| 15  | offline-slice           | `yyc3-offline`           | 离线队列        | 全局                           |
| 16  | ide-settings-slice      | `yyc3-ide`               | IDE 设置        | IDEPanel                       |
| 17  | family-member-slice     | `yyc3-family-members`    | 8 AI 成员       | AI Family 全部页面             |
| 18  | family-settings-slice   | `yyc3-family-settings`   | Family 配置     | models/voice/comm/settings     |
| 19  | family-chat-slice       | `yyc3-family-chat`       | 聊天频道        | FamilyChat                     |
| 20  | family-message-slice    | `yyc3-family-messages`   | 消息记录        | FamilyChat                     |
| 21  | family-calllog-slice    | `yyc3-family-calllog`    | 通话记录        | FamilyPhone                    |
| 22  | family-activities-slice | `yyc3-family-activities` | 活动数据        | FamilyActivityCenter           |
| 23  | family-moments-slice    | `yyc3-family-moments`    | 动态            | FamilyShare                    |
| 24  | family-medals-slice     | `yyc3-family-medals`     | 勋章            | FamilyActivityCenter           |
| 25  | family-memories-slice   | `yyc3-family-memories`   | 记忆            | FamilyGrowth                   |
| 26  | family-milestones-slice | `yyc3-family-milestones` | 里程碑          | FamilyGrowth                   |
| 27  | family-posts-slice      | `yyc3-family-posts`      | 帖子            | FamilyShare                    |
| 28  | family-news-slice       | `yyc3-family-news`       | 新闻            | FamilyMusic                    |
| 29  | family-skills-slice     | `yyc3-family-skills`     | 课程/技能       | FamilyLearn                    |

### 3.3 IndexedDB 24 Stores（yyc3-storage.ts 实码验证）

| #   | Store Name         | 消费者                  |
| --- | ------------------ | ----------------------- |
| 1   | alertRules         | AlertRulesPanel         |
| 2   | alertEvents        | AlertRulesPanel         |
| 3   | patrolHistory      | PatrolDashboard         |
| 4   | loopHistory        | ServiceLoopPanel        |
| 5   | operationTemplates | OperationCenter         |
| 6   | operationLogs      | OperationCenter         |
| 7   | diagnosisHistory   | AIDiagnostics           |
| 8   | reports            | ReportExporter          |
| 9   | errorLog           | ErrorBoundary           |
| 10  | dashboardSnapshots | Dashboard               |
| 11  | fileVersions       | LocalFileManager        |
| 12  | dbConnections      | DatabaseConnectionPanel |
| 13  | queryHistory       | DatabaseManager         |
| 14  | committedChanges   | IDE GitPanel            |
| 15  | agent_memories     | AI Family               |
| 16  | agent_tasks        | AI Family               |
| 17  | mcp_contexts       | AI Family               |
| 18  | inference_cache    | AI Family               |
| 19  | family_messages    | FamilyChat              |
| 20  | family_activities  | FamilyActivityCenter    |
| 21  | family_memories    | FamilyGrowth            |
| 22  | family_broadcasts  | FamilyCommCenter        |
| 23  | music_library      | FamilyMusic             |
| 24  | comm_stations      | CommStationPanel        |

---

## 三、管理后台 (admin) — 数据架构详细图

管理后台是全局系统设定的核心枢纽，涵盖 **12** 个页面（优化后 +3）。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       admin (管理后台) · 12 页面                         │
│                  Sidebar id: "admin" · icon: ShieldCheck               │
└─────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /audit       │  │ /users       │  │ /settings    │
  │ 操作审计     │  │ 用户管理     │  │ 统一设置     │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ log-slice    │  │ user-mgmt    │  │ model-slice  │
  │ (persist)    │  │ -slice       │  │ (persist)    │
  │              │  │ (persist)    │  │              │
  │ logs → map   │  │              │  │ useModel     │
  │ LogToAudit() │  │ users[]      │  │ Provider()   │
  │              │  │ roles[]      │  │ useSettings  │
  │ 筛选+分页    │  │              │  │ Store()      │
  │ +详情查看    │  │ CRUD: ✅     │  │              │
  │              │  │              │  │ AI 连接测试  │
  │ CRUD: ✅     │  │              │  │ CRUD: ✅     │
  └──────────────┘  └──────────────┘  └──────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /unified     │  │ /security    │  │ /pwa         │
  │ -settings    │  │ 安全监控     │  │ PWA 管理     │
  │ 统一设置     │  │              │  │              │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ Unified      │  │ useSecurity  │  │ usePWA       │
  │ Settings     │  │ Monitor()    │  │ Manager()    │
  │ Panel        │  │ Hook         │  │ Hook         │
  │              │  │              │  │              │
  │ 全局配置     │  │ 网络扫描     │  │ SW 状态      │
  │ 汇总面板     │  │ 端口检测     │  │ 缓存管理     │
  │              │  │ 漏洞扫描     │  │ 安装提示     │
  │ 多 Slice     │  │              │  │              │
  │ 聚合读取     │  │ 运行时计算   │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /data-editor │  │ /performance │  │ /env-config  │
  │ 数据编辑器   │  │ 性能监控     │  │ 环境变量     │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ DataEditor   │  │ Performance  │  │ EnvConfig    │
  │ Panel        │  │ Monitor      │  │ Editor       │
  │              │  │              │  │              │
  │ node-slice   │  │ useWebSocket │  │ api-config   │
  │ 直接编辑     │  │ Data()       │  │ .ts          │
  │              │  │              │  │              │
  │ 节点数据     │  │ node-slice   │  │ API 端点     │
  │ CRUD: ✅     │  │ metrics-slice│  │ WS/SSE/AI    │
  │              │  │              │  │ CRUD: ✅     │
  └──────────────┘  └──────────────┘  └──────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /storage     │  │ /config-center│ │ /variables   │
  │ 存储管理     │  │ 配置中心     │  │ 变量中心     │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ Storage      │  │ Config       │  │ Variable     │
  │ Manager      │  │ Center       │  │ Center       │
  │              │  │              │  │              │
  │ [NEW]        │  │ [NEW]        │  │ [NEW]        │
  │ 从隐藏路由   │  │ 从隐藏路由   │  │ 从隐藏路由   │
  │ 纳入导航     │  │ 纳入导航     │  │ 纳入导航     │
  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 四、全局数据汇总图（优化后）

```
  📊 monitor(5)       🔧 ops(10)        🧠 ai(4)
  ┌─────┐             ┌─────┐           ┌─────┐
  │node │             │fs   │           │model│
  │slice│             │slice│           │slice│
  │     │             │     │           │     │
  │metric│            │db   │           │provider
  │slice│             │conn │           │slice│ ← [优化] API Keys SSOT
  │     │             │slice│           │     │
  │follow│            │IDB: │           │ai   │
  │up   │             │loop │           │sugg │
  │slice│             │oper │           │slice│
  │     │             │diag │           │     │
  │IDB: │             │     │           │sdk  │
  │patrol│            │     │           │session
  │alertE│            │     │           │slice│
  └──┬──┘             └──┬──┘           └──┬──┘
     │                   │                 │
     └───────┬───────────┘                 │
             │                             │
  🛡️ admin(12)        👨‍👩‍👧‍👦 ai-family(5+13)  │
  ┌─────┐             ┌─────┐              │
  │log  │             │family│              │
  │slice│             │member│              │
  │     │             │slice │              │
  │user │             │      │              │
  │mgmt │             │family│              │
  │slice│             │settings              │
  │     │             │slice │              │
  │ui   │             │      │              │
  │prefs│             │12 个 │              │
  │slice│             │家族  │              │
  │     │             │Slices│              │
  │app  │             │      │              │
  │slice│             │IDB:  │              │
  │     │             │8 个  │              │
  │network            │IDB   │              │
  │slice│             │Stores│              │
  │     │             └──┬──┘              │
  │[+3] │                                │
  │storage                            │
  │config│                                │
  │vars  │                                │
  └──┬──┘                                │
     │                                    │
  💻 dev(7)          🏢 business(2)      │
  ┌─────┐            ┌─────┐             │
  │ide  │            │hotel│             │
  │slice│            │     │             │
  │     │            │comm │             │
  │IDB: │            │station│            │
  │committed         │     │             │
  │Changes│          └──┬──┘             │
  └──┬──┘               │                 │
     │                   │                 │
     └──────────┬────────┴─────────────────┘
                │
                ▼
     ┌─────────────────────────────┐
     │     Zustand 29 Slices       │
     │     (persist + immer)       │
     │     SSOT 唯一数据源         │
     ├─────────────────────────────┤
     │     IndexedDB 24 Stores     │
     │     (Dexie.js)              │
     ├─────────────────────────────┤
     │     localStorage            │
     │     (轻量配置)               │
     ├─────────────────────────────┤
     │     Electron IPC (可选)     │
     │     Supabase (可选)         │
     │     后端脚本 (可选)         │
     └─────────────────────────────┘
```

---

*本文档由 YYC³ Standardization Audit Expert 生成 · 基于 Sidebar.tsx + routes.tsx 实码验证 · 2026-04-26*
*导航优化版更新 · 2026-05-03 · 8→7分类 · AI Family 18→5入口 · hotel+comm→business*
