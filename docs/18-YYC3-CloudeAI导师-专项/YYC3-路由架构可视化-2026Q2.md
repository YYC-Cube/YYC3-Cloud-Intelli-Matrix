# YYC³ API 路由架构可视化 — 现状对齐文档

> **文档编号**: YYC3-ROUTE-2026Q2
> **生成日期**: 2026-04-18
> **基准版本**: Phase X3 路由拓展完成 (41 功能路由 + 18 子路由)
> **路由模式**: HashRouter (createHashRouter)
> **懒加载率**: 41/43 (95.3%)

---

## 一、路由架构总览

```
                              ┌──────────────────┐
                              │   #/ (HashRouter)  │
                              │   Layout (静态导入) │
                              └────────┬─────────┘
                                       │
              ┌────────────────────────┼────────────────────────────┐
              │                        │                            │
     ┌────────▼────────┐    ┌─────────▼─────────┐    ┌────────────▼──────────┐
     │  首页 + 监控 (5)  │    │  运维操作 (8)       │    │  AI 智能 (4)           │
     │  /               │    │  /operations       │    │  /ai                   │
     │  /follow-up      │    │  /files            │    │  /models               │
     │  /follow-up-mgr  │    │  /host-files       │    │  /ai-diagnosis         │
     │  /patrol         │    │  /database         │    │  /sdk-chat    [NEW]    │
     │  /alerts         │    │  /db-connections   │    └────────────────────────┘
     └─────────────────┘    │  /connection-test  │
                            │  /loop             │              │
                            │  /reports          │              │
                            │  /export-center[NW]│              │
                            └────────────────────┘              │
                                                              │
     ┌─────────────────┐    ┌────────────────────┐    ┌───────▼──────────────┐
     │  系统管理 (9)     │    │  开发工具 (7)        │    │  AI Family (1+18)     │
     │  /audit          │    │  /design-system    │    │  /ai-family           │
     │  /users          │    │  /dev-guide        │    │  ├─ /home             │
     │  /settings       │    │  /theme            │    │  ├─ /center           │
     │  /security       │    │  /terminal         │    │  ├─ /planning         │
     │  /pwa            │    │  /ide              │    │  ├─ /chat             │
     │  /data-editor    │    │  /refactoring      │    │  ├─ /share            │
     │  /performance    │    │  /architecture     │    │  ├─ /learn            │
     │  /env-config     │    └────────────────────┘    │  ├─ /music            │
     │  /unified-set    │                              │  ├─ /growth           │
     └─────────────────┘    ┌────────────────────┐    │  ├─ /phone            │
                            │  配置管理 (4)        │    │  ├─ /fun             │
                            │  /config-center    │    │  ├─ /activities      │
                            │  /variables        │    │  ├─ /models          │
                            │  /storage          │    │  ├─ /voice           │
                            │  /hotel-dashboard  │    │  ├─ /data            │
                            └────────────────────┘    │  ├─ /comm            │
                                                      │  ├─ /settings        │
                                                      │  ├─ /hotel           │
                                                      │  └─ /cluster         │
                                                      └──────────────────────┘
     ┌─────────────────┐
     │  404 兜底        │
     │  * → NotFound   │
     └─────────────────┘

     [NEW] = Phase X3 新增路由
     NW = New Write
```

---

## 二、路由加载策略

```
┌─────────────────────────────────────────────────────────────────────┐
│                      路由加载架构                                    │
│                                                                     │
│  ┌──────────────┐     ┌──────────────────────────────────────┐     │
│  │ 静态导入 (2)   │     │  React.lazy() 懒加载 (41)           │     │
│  │              │     │                                      │     │
│  │ · Layout     │     │  每个路由模块独立 chunk:              │     │
│  │ · NotFound   │     │                                      │     │
│  │              │     │  const X = lazy(() =>                │     │
│  │ 首屏立即需要  │     │    import("./X").then(               │     │
│  │ 无需网络请求  │     │      m => ({ default: m.X })        │     │
│  └──────────────┘     │    )                                  │     │
│                       │  )                                    │     │
│                       │                                      │     │
│                       │  withSuspense(Lazy) →                │     │
│                       │  <Suspense fallback={                │     │
│                       │    <RouteLoadingFallback />          │     │
│                       │  }>                                  │     │
│                       └──────────────────────────────────────┘     │
│                                                                     │
│  AI-Family 子路由: AIFamilyRouter lazyMap                          │
│  ├─ lazyCache 确保每个 lazy() 只创建一次                           │
│  └─ LazyErrorBoundary 捕获动态导入失败                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 三、完整路由表

### 3.1 顶级路由 (41 条)

| # | 路径 | 组件 | 分类 | 数据源 | 懒加载 |
|---|------|------|------|--------|:------:|
| 1 | `/` | DataMonitoring | 监控 | node + metrics | ✅ |
| 2 | `/follow-up` | FollowUpPanel | 监控 | follow-up | ✅ |
| 3 | `/follow-up-manager` | FollowUpManager | 监控 | follow-up | ✅ |
| 4 | `/patrol` | PatrolDashboard | 监控 | 内部 | ✅ |
| 5 | `/alerts` | AlertRulesPanel | 监控 | follow-up | ✅ |
| 6 | `/operations` | OperationCenter | 运维 | 内部 | ✅ |
| 7 | `/files` | LocalFileManager | 运维 | fs-slice | ✅ |
| 8 | `/host-files` | HostFileManager | 运维 | useHostFileSystem | ✅ |
| 9 | `/database` | DatabaseManager | 运维 | 内部 | ✅ |
| 10 | `/db-connections` | DatabaseConnectionPanel | 运维 | db-conn | ✅ |
| 11 | `/connection-test` | ServiceConnectionTest | 运维 | ui-prefs | ✅ |
| 12 | `/loop` | ServiceLoopPanel | 运维 | 内部 | ✅ |
| 13 | `/reports` | ReportExporter | 运维 | 内部 | ✅ |
| 14 | `/export-center` | ConfigExportCenter | 运维 | provider+settings | ✅ |
| 15 | `/ai` | AISuggestionPanel | AI | ai-suggestion | ✅ |
| 16 | `/models` | ModelProviderPanel | AI | provider + model | ✅ |
| 17 | `/ai-diagnosis` | AIDiagnostics | AI | 内部 | ✅ |
| 18 | `/sdk-chat` | SDKChatPanel | AI | sdk-session | ✅ |
| 19 | `/ai-family` | AIFamilyPage | Family | family-member | ✅ |
| 20 | `/ai-family/:subpage` | AIFamilyRouter | Family | (见 3.2) | ✅ |
| 21 | `/design-system` | DesignSystemPage | 开发 | design-system | ✅ |
| 22 | `/dev-guide` | DevGuidePage | 开发 | 静态 | ✅ |
| 23 | `/theme` | ThemeCustomizer | 开发 | ui-prefs | ✅ |
| 24 | `/terminal` | CLITerminal | 开发 | 内部 | ✅ |
| 25 | `/ide` | IDEPanel | 开发 | ide-settings | ✅ |
| 26 | `/refactoring` | RefactoringReport | 开发 | 内部 | ✅ |
| 27 | `/architecture` | ArchitectureAudit | 开发 | 内部 | ✅ |
| 28 | `/audit` | OperationAudit | 管理 | 内部 | ✅ |
| 29 | `/users` | UserManagement | 管理 | user-mgmt | ✅ |
| 30 | `/settings` | SystemSettings | 管理 | 内部 | ✅ |
| 31 | `/security` | SecurityMonitor | 管理 | 内部 | ✅ |
| 32 | `/pwa` | PWAStatusPanel | 管理 | 内部 | ✅ |
| 33 | `/data-editor` | DataEditorPanel | 管理 | 内部 | ✅ |
| 34 | `/performance` | PerformanceMonitor | 管理 | ui-prefs | ✅ |
| 35 | `/env-config` | EnvConfigEditor | 管理 | env-config | ✅ |
| 36 | `/unified-settings` | UnifiedSettingsPanel | 管理 | global-store | ✅ |
| 37 | `/config-center` | ConfigCenter | 配置 | 内部 | ✅ |
| 38 | `/variables` | VariableCenter | 配置 | 内部 | ✅ |
| 39 | `/storage` | StorageManager | 配置 | yyc3-storage | ✅ |
| 40 | `/hotel-dashboard` | HotelDashboard | 配置 | family-member | ✅ |
| 41 | `/connection-monitor` | ConnectionMonitorPanel | 运维 | 内部 | ✅ |
| — | `*` | NotFound | 兜底 | — | ❌ 静态 |

### 3.2 AI-Family 子路由 (18 条)

| # | Key | 路径 | 组件 | 功能 | 数据源 |
|---|-----|------|------|------|--------|
| 1 | home | `/ai-family/home` | FamilyHome | 家人首页 | family-member |
| 2 | center | `/ai-family/center` | AIFamilyCenterPage | 家人中心 | family-member |
| 3 | planning | `/ai-family/planning` | AIFamilyDesignDoc | 规划文档 | family-member |
| 4 | chat | `/ai-family/chat` | FamilyChat | 家人聊天 | family-message |
| 5 | share | `/ai-family/share` | FamilyShare | 分享 | family-member |
| 6 | learn | `/ai-family/learn` | FamilyLearn | 学习 | family-member |
| 7 | music | `/ai-family/music` | FamilyMusic | 音乐工坊 | useMusicPlayer |
| 8 | growth | `/ai-family/growth` | FamilyGrowth | 成长轨迹 | family-member |
| 9 | phone | `/ai-family/phone` | FamilyPhone | 家人通话 | family-member |
| 10 | fun | `/ai-family/fun` | FamilyEntertainment | 娱乐互动 | family-member |
| 11 | activities | `/ai-family/activities` | FamilyActivityCenter | 活动中心 | family-member |
| 12 | models | `/ai-family/models` | FamilyModelSettings | 模型设置 | family-settings |
| 13 | voice | `/ai-family/voice` | FamilyVoiceSystem | 语音系统 | family-settings |
| 14 | data | `/ai-family/data` | FamilyDataHub | 数据中心 | family-settings |
| 15 | comm | `/ai-family/comm` | FamilyCommCenter | 通信中心 | family-settings |
| 16 | settings | `/ai-family/settings` | FamilyUISettings | UI 设置 | family-settings |
| 17 | hotel | `/ai-family/hotel` | FamilyHotel | 家人酒店 | family-member |
| 18 | cluster | `/ai-family/cluster` | FamilyCluster | 集群管理 | family-member |

---

## 四、导航架构

```
┌────────────────────────────────────────────────────────────────────┐
│                        导航入口 (3+1)                              │
│                                                                    │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────────────┐  │
│  │  Sidebar      │  │  BottomNav    │  │  CommandPalette (⌘K)  │  │
│  │  (Desktop)    │  │  (Mobile/     │  │  全局快捷搜索          │  │
│  │              │  │   Tablet)     │  │                       │  │
│  │  6 分类       │  │  4 核心 Tab   │  │  ~45 个可搜索项        │  │
│  │  39+2 子项    │  │  + 展开菜单   │  │  模糊匹配 + 键盘导航   │  │
│  │  Flyout 浮层  │  │              │  │                       │  │
│  └──────────────┘  └───────────────┘  └───────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  TopBar                                                      │  │
│  │  Logo · 搜索触发 · 连接状态 · 终端开关 · 用户菜单 · 登出      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘

Sidebar 6 分类结构:
├── 📊 监控 (monitor)     → /, /follow-up, /follow-up-mgr, /patrol, /alerts
├── 🔧 运维 (ops)         → /operations, /files, /host-files, /database, /db-connections,
│                          /connection-test, /loop, /reports, /export-center
├── 🧠 AI (ai)            → /ai, /models, /ai-diagnosis, /sdk-chat
├── 👤 AI Family           → /ai-family, /ai-family/{18 sub-routes}
├── 💻 开发 (dev)          → /design-system, /dev-guide, /theme, /terminal,
│                          /ide, /refactoring, /architecture
└── 🛡 管理 (admin)        → /audit, /users, /settings, /unified-settings,
                              /security, /pwa, /data-editor, /performance, /env-config
```

---

## 五、路由与数据源映射

```
路由                          Slice 依赖链
──────────────────────────────────────────────────────────
/                             useNodeSlice → useMetricsSlice → useAppSlice
/follow-up                    useFollowUpSlice
/models                       useProviderSlice → useModelSlice
/ai                           useAISuggestionSlice
/sdk-chat                     useSDKSessionSlice → useProviderSlice
/db-connections               useDbConnSlice
/ai-family/*                  useFamilyMemberSlice → useFamilyMessageSlice
                              → useFamilySettingsSlice
/ide                          useIDESettingsSlice
/theme                        useUIPrefsSlice
/performance                  useUIPrefsSlice
/files                        useFSSlice
/hotel-dashboard              useFamilyMemberSlice
/export-center                useProviderSlice + global-store
/unified-settings             global-store (Config + Chat)
/settings                     (内部 localStorage — 系统设置)
/config-center                (存储管理工具 — 直接操作 localStorage)
```

---

## 六、新增路由说明 (Phase X3)

### 6.1 `/sdk-chat` — SDK 对话面板

```
┌────────────────────────────────────────────┐
│  /sdk-chat                                 │
│                                            │
│  功能: BigModel SDK 驱动的完整 AI 对话       │
│  数据源: useSDKSessionSlice (会话+统计)     │
│  依赖: useBigModelSDK · useModelProvider    │
│  分类: AI 智能                              │
│  导航: Sidebar(AI) · CommandPalette         │
│  i18n: nav.sdkChat / SDK Chat              │
│                                            │
│  能力:                                      │
│  ├─ 多服务商切换 (9 providers)              │
│  ├─ 流式/非流式对话                         │
│  ├─ 连接状态实时监控                        │
│  ├─ 会话历史持久化                          │
│  └─ 使用统计追踪                            │
└────────────────────────────────────────────┘
```

### 6.2 `/export-center` — 数据备份中心

```
┌────────────────────────────────────────────┐
│  /export-center                            │
│                                            │
│  功能: 4 模块数据备份/导出/重置              │
│  数据源: useProviderSlice + global-store   │
│  分类: 运维操作                             │
│  导航: Sidebar(运维) · CommandPalette       │
│  i18n: nav.exportCenter / Data Backup      │
│                                            │
│  模块:                                      │
│  ├─ providers — 服务商 + 模型配置           │
│  ├─ settings — 系统设置                     │
│  ├─ database — 业务数据 (IndexedDB)         │
│  └─ envConfig — 环境变量                    │
└────────────────────────────────────────────┘
```

---

## 七、路由拓展建议

### 7.1 建议新增路由

| 路径 | 组件 | 功能 | 优先级 |
|------|------|------|--------|
| `/dashboard` | Dashboard | 备用仪表盘 (recharts 丰富图表) | 🟢 低 |
| `/design-editor` | DesignSystemEditor | 设计系统 Token 编辑器 | 🟢 低 |
| `/notifications` | 新建 | 通知中心 (toast + 浏览器通知) | 🟡 中 |

### 7.2 建议路由优化

| 优化项 | 当前 | 建议 | 说明 |
|--------|------|------|------|
| AI-Family 深层路由 | `/ai-family/:subpage` | 保持 | 18 子路由 lazyMap 性能优 |
| 连接测试/监控合并 | 2 独立路由 | 保持 | 功能差异足够大 |
| 设置页整合 | `/settings` + `/unified-settings` | 评估合并 | 减少用户困惑 |
| 404 增强 | 简单 NotFound | 添加搜索建议 | 引导用户到正确页面 |

---

## 八、路由性能指标

| 指标 | 值 |
|------|-----|
| 总路由数 | 43 (41 功能 + 1 布局 + 1 404) |
| AI-Family 子路由 | 18 |
| 总可寻址页面 | 59 |
| 懒加载率 | 41/43 = 95.3% |
| 静态导入 | 2 (Layout + NotFound) |
| 首屏加载 | 仅 DataMonitoring chunk |
| Suspense fallback | 统一 RouteLoadingFallback |
| 错误边界 | Layout 级 ErrorBoundary |

---

## 九、URL 访问映射速查

```
监控域:
  #/                    集群仪表盘
  #/follow-up           跟进面板
  #/follow-up-manager   跟进管理
  #/patrol              巡查面板
  #/alerts              告警规则

运维域:
  #/operations          操作中心
  #/files               本地文件
  #/host-files          宿主文件
  #/database            数据库管理
  #/db-connections      连接配置
  #/connection-test     连接测试
  #/connection-monitor  连接监控
  #/loop                服务循环
  #/reports             报表导出
  #/export-center       数据备份

AI 域:
  #/ai                  AI 建议
  #/models              模型管理
  #/ai-diagnosis        AI 诊断
  #/sdk-chat            SDK 对话

AI Family 域:
  #/ai-family           家人首页
  #/ai-family/home      家人首页
  #/ai-family/center    家人中心
  #/ai-family/planning  规划文档
  #/ai-family/chat      家人聊天
  #/ai-family/share     分享
  #/ai-family/learn     学习
  #/ai-family/music     音乐工坊
  #/ai-family/growth    成长轨迹
  #/ai-family/phone     家人通话
  #/ai-family/fun       娱乐互动
  #/ai-family/activities 活动中心
  #/ai-family/models    模型设置
  #/ai-family/voice     语音系统
  #/ai-family/data      数据中心
  #/ai-family/comm      通信中心
  #/ai-family/settings  UI 设置
  #/ai-family/hotel     家人酒店
  #/ai-family/cluster   集群管理

开发域:
  #/design-system       设计系统
  #/dev-guide           开发指南
  #/theme               主题定制
  #/terminal            CLI 终端
  #/ide                 IDE 编辑器
  #/refactoring         重构分析
  #/architecture        架构审计

管理域:
  #/audit               操作审计
  #/users               用户管理
  #/settings            系统设置
  #/security            安全监控
  #/pwa                 PWA 管理
  #/data-editor         数据编辑
  #/performance         性能监控
  #/env-config          环境变量
  #/unified-settings    统一设置

配置域:
  #/config-center       配置中心
  #/variables           变量中心
  #/storage             存储管理
  #/hotel-dashboard     酒店仪表盘
```

---

*文档生成时间: 2026-04-18*
*审查者: Claude Opus 4.6 (AI 协作导师) + YYC-Cube (项目创始人)*
