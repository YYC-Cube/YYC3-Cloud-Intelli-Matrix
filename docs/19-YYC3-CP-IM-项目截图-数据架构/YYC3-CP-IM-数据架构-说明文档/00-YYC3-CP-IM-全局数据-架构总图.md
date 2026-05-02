# YYC³ Cloud Intelli-Matrix — 全局数据架构总图

> **用途**: 全局数据分流、汇总、存储的完整可视化架构图（实码验证版）
> **生成日期**: 2026-04-26 (v2 修正版)
> **数据来源**: Sidebar.tsx NAV_CATEGORIES + routes.tsx + 逐文件 grep 验证

---

## 一、全局导航结构（Sidebar.tsx 实码）

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  YYC³ 侧边栏 · 8 大导航分类 · 47 页面                    │
│              源文件: src/app/components/Sidebar.tsx                      │
└─────────────────────────────────────────────────────────────────────────┘

  📊 monitor (监控中心) ──────── 5 页
     ├── / (Dashboard)
     ├── /follow-up (FollowUpPanel)
     ├── /follow-up-manager (FollowUpManager)
     ├── /patrol (PatrolDashboard)
     └── /alerts (AlertRulesPanel)

  🔧 ops (运维管理) ──────────── 9 页
     ├── /operations (OperationCenter)
     ├── /files (LocalFileManager)
     ├── /host-files (HostFileManager)
     ├── /database (DatabaseManager)
     ├── /db-connections (DatabaseConnectionPanel)
     ├── /connection-test (ServiceConnectionTest)
     ├── /loop (ServiceLoopPanel)
     ├── /reports (ReportExporter)
     └── /export-center (ConfigExportCenter)

  🧠 ai (AI 智能中心) ────────── 4 页
     ├── /ai (AISuggestionPanel)
     ├── /models (ModelProviderPanel)
     ├── /ai-diagnosis (AIDiagnostics)
     └── /sdk-chat (SDKChatPanel)

  👨‍👩‍👧‍👦 ai-family (AI Family) ── 1 + 18 子页面
     ├── /ai-family (AIFamilyPage 时钟首页)
     └── /ai-family/:subpage (AIFamilyRouter → 18 lazy 组件)

  🏨 hotel (智慧酒店) ───────── 1 页 (独立主导航)
     └── /hotel (HotelDashboard)

  📡 comm-station (通讯基站) ── 1 页 (独立主导航)
     └── /comm-station (CommStationPanel)

  💻 dev (开发工具) ──────────── 7 页
     ├── /design-system (DesignSystemPage)
     ├── /dev-guide (DevGuidePage)
     ├── /theme (ThemeCustomizer)
     ├── /terminal (CLITerminal)
     ├── /ide (IDEPanel)
     ├── /refactoring (RefactoringReport)
     └── /architecture (ArchitectureAudit)

  🛡️ admin (管理后台) ────────── 9 页
     ├── /audit (OperationAudit)
     ├── /users (UserManagement)
     ├── /settings (SystemSettings)
     ├── /unified-settings (UnifiedSettingsPanel)
     ├── /security (SecurityMonitor)
     ├── /pwa (PWAStatusPanel)
     ├── /data-editor (DataEditorPanel)
     ├── /performance (PerformanceMonitor)
     └── /env-config (EnvConfigEditor)
```

---

## 二、全局数据流总图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        YYC³ Cloud Intelli-Matrix                        │
│                     全局数据架构 · 分流 · 汇总                           │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │  用户 UI  │
                              │ 47 路由   │
                              └────┬─────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │ Zustand    │ │ IndexedDB │ │ local-    │
              │ 29 Slices  │ │ 24 Stores │ │ Storage   │
              │ (persist+  │ │ (Dexie)   │ │ (轻量配置) │
              │  immer)    │ │           │ │           │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
                    └──────────────┼──────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │ Electron   │ │ 后端脚本  │ │ Supabase  │
              │ IPC Bridge │ │ (可选)    │ │ (可选)    │
              └───────────┘ └───────────┘ └───────────┘
```

---

## 三、存储层架构

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

## 四、管理后台 (admin) — 数据架构详细图

管理后台是全局系统设定的核心枢纽，涵盖 9 个页面。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        admin (管理后台) · 9 页面                         │
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
```

---

## 五、全局数据汇总图

```
  📊 monitor(5)       🔧 ops(9)         🧠 ai(4)
  ┌─────┐             ┌─────┐           ┌─────┐
  │node │             │fs   │           │model│
  │slice│             │slice│           │slice│
  │     │             │     │           │     │
  │metric│            │db   │           │provider
  │slice│             │conn │           │slice│
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
  🛡️ admin(9)          👨‍👩‍👧‍👦 ai-family(18+)  │
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
  └──┬──┘             └──┬──┘              │
     │                   │                  │
  💻 dev(7)                               │
  ┌─────┐                                  │
  │ide  │                                  │
  │slice│                                  │
  │     │                                  │
  │IDB: │                                  │
  │committed                               │
  │Changes│                                │
  └──┬──┘                                  │
     │                                      │
     └──────────┬───────────────────────────┘
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
