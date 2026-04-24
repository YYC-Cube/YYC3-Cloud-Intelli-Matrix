# YYC³ Cloud Intelli-Matrix — 上下文衔接文档

> **用途**: AI工具协作的上下文基准文档
> **路径**: `/Volumes/Development/yyc3-77/YYC3-AI-PAI/YYC3-CloudIntelli-Matrix`
> **AI工具**: 智谱大模型 (自有API KEY)
> **封装状态**: YYC³ CloudPivot.app 已封装测试 (可忽略)

---

## 一、项目基本信息

| 项目 | 值 |
|------|-----|
| **名称** | yyc3-cloudpivot-intelli-matrix |
| **版本** | v3.4.1 |
| **描述** | YYC³ Family 本地闭环多端推理矩阵数据看盘系统 |
| **端口** | 3218 |
| **Electron端口** | 1400x900 (最小1200x700) |
| **包管理器** | pnpm |
| **License** | MIT |

---

## 二、技术栈

| 技术 | 版本 |
|------|------|
| React | 19.2.5 |
| TypeScript | 5.9.3 (strict) |
| Vite | 7+ |
| React Router | 7.13.1 (hash路由) |
| TailwindCSS | 4.2.1 |
| Electron | 28 |
| Zustand | 5.0.12 (状态管理) |
| Recharts | 3.8.1 (图表) |
| Supabase | 2.98.0 (认证, Ghost Mode兜底) |
| Radix UI | 1.x (无头组件) |
| MUI Material | 9.0.0 |
| Motion | 12.34.5 (动画) |
| CodeMirror | 6.x (代码编辑) |
| xterm | 6.0.0 (终端) |
| WebLLM | 0.2.82 (本地模型) |
| Lucide | 0.576+ (图标) |

---

## 三、完整路由表 (42条路由)

```
/                           → DataMonitoring (首页/数据监控)
/follow-up                  → FollowUpPanel (跟进面板)
/follow-up-manager          → FollowUpManager (跟进管理器)
/patrol                     → PatrolDashboard (巡查仪表盘)
/operations                 → OperationCenter (操作中心)
/files                      → LocalFileManager (本地文件管理)
/ai                         → AISuggestionPanel (AI建议)
/loop                       → ServiceLoopPanel (服务环路)
/pwa                        → PWAStatusPanel (PWA状态)
/design-system              → DesignSystemPage (设计系统)
/dev-guide                  → DevGuidePage (开发指南)
/models                     → ModelProviderPanel (模型服务商)
/theme                      → ThemeCustomizer (主题定制)
/terminal                   → CLITerminal (命令行终端)
/ide                        → IDEPanel (IDE面板)
/audit                      → OperationAudit (操作审计)
/users                      → UserManagement (用户管理)
/settings                   → SystemSettings (系统设置)
/security                   → SecurityMonitor (安全监控)
/alerts                     → AlertRulesPanel (告警规则)
/reports                    → ReportExporter (报告导出)
/ai-diagnosis               → AIDiagnostics (AI诊断)
/host-files                 → HostFileManager (主机文件)
/database                   → DatabaseManager (数据库管理)
/refactoring                → RefactoringReport (重构报告)
/data-editor                → DataEditorPanel (数据编辑器)
/performance                → PerformanceMonitor (性能监控)
/env-config                 → EnvConfigEditor (环境变量)
/db-connections             → DatabaseConnectionPanel (数据库连接)
/connection-monitor          → ConnectionMonitorPanel (连接监控)
/architecture               → ArchitectureAudit (架构审计)
/ai-family                  → AIFamilyPage (AI Family页面)
/ai-family/:subpage         → AIFamilyRouter (AI Family子路由)
/connection-test            → ServiceConnectionTest (连接测试)
/storage                    → StorageManager (存储管理)
/config-center              → ConfigCenter (配置中心)
/variables                  → VariableCenter (变量中心)
/unified-settings           → UnifiedSettingsPanel (统一设置)
/hotel-dashboard            → HotelDashboard (酒店仪表盘)
/sdk-chat                   → SDKChatPanel (SDK对话)
/export-center              → ConfigExportCenter (导出中心)
/*                          → NotFound (404)
```

**关键发现**: 酒店仪表盘路由 `/hotel-dashboard` 和 AI Family 路由 `/ai-family` 已存在。

---

## 四、状态管理 (Zustand Slices)

统一入口: `src/app/store/index.ts`

| Slice | 文件 | 功能 |
|-------|------|------|
| useNodeSlice | node-slice.ts | 节点数据管理 |
| useMetricsSlice | metrics-slice.ts | 性能指标 |
| useAppSlice | app-slice.ts | 应用全局状态 |
| useLogSlice | log-slice.ts | 日志管理 |
| useDbConnSlice | db-conn-slice.ts | 数据库连接 |
| useUserMgmtSlice | user-mgmt-slice.ts | 用户管理 |
| useNetworkSlice | network-slice.ts | 网络状态 |
| useFollowUpSlice | follow-up-slice.ts | 跟进事项 |
| useModelSlice | model-slice.ts | AI模型管理 |
| useFamilyMemberSlice | family-member-slice.ts | AI Family成员 |
| useFamilyMessageSlice | family-message-slice.ts | AI Family消息 |
| useProviderSlice | provider-slice.ts | 服务商管理 |
| useFamilySettingsSlice | family-settings-slice.ts | Family设置 |
| useAISuggestionSlice | ai-suggestion-slice.ts | AI建议 |
| useIDESettingsSlice | ide-settings-slice.ts | IDE设置 |
| useUIPrefsSlice | ui-prefs-slice.ts | UI偏好 |
| useOfflineSlice | offline-slice.ts | 离线状态 |
| useFSSlice | fs-slice.ts | 文件系统 |
| useSDKSessionSlice | sdk-session-slice.ts | SDK会话 |

**组合Hook**: `useUnifiedStore()` — 一次性获取多Slice状态

---

## 五、Hooks清单 (40个)

| Hook | 功能 |
|------|------|
| useI18n | 国际化 (中/英) |
| useWebSocketData | 实时WebSocket数据 |
| useMobileView | 响应式断点检测 |
| usePatrol | 巡查系统 |
| useOperationCenter | 操作中心 |
| useModelProvider | 模型服务商 |
| useAIDiagnostics | AI诊断 |
| useAISuggestion | AI建议 |
| useAlertRules | 告警规则 |
| useAudioEngine | 音频引擎 |
| useMusicPlayer | 音乐播放器 |
| useEmotionMusic | 情感音乐 |
| useBigModelSDK | 大模型SDK |
| useMCP | MCP协议 |
| useInference | 推理引擎 |
| useAgentOrchestrator | Agent编排 |
| useLocalDatabase | 本地数据库 |
| useLocalFileSystem | 本地文件系统 |
| useHostFileSystem | 主机文件系统 |
| useKeyboardShortcuts | 快捷键 |
| useOfflineMode | 离线模式 |
| usePWAManager | PWA管理 |
| useNetworkConfig | 网络配置 |
| usePerformanceMonitor | 性能监控 |
| useSecurityMonitor | 安全监控 |
| useTerminal | 终端 |
| useVariables | 变量管理 |
| useValidation | 表单验证 |
| useDesignSystem | 设计系统 |
| useSettingsStore | 设置存储 |
| usePageConfig | 页面配置 |
| useReportExporter | 报告导出 |
| useServiceLoop | 服务环路 |
| useResponsive | 响应式 |
| usePersistedState | 持久化状态 |
| usePushNotifications | 推送通知 |
| useCopyFeedback | 复制反馈 |
| useClock | 时钟 |
| useYYC3Head | 头部信息 |
| useInstallPrompt | 安装提示 |

---

## 六、认证系统

- **Supabase Auth**: 正式认证
- **Ghost Mode**: 开发兜底模式 (无需登录)
- **角色**: `admin` | `developer`
- **Session**: localStorage `yyc3_session`

---

## 七、Electron封装

| 配置 | 值 |
|------|-----|
| 窗口尺寸 | 1400x900 (最小1200x700) |
| 安全策略 | contextIsolation: true, nodeIntegration: false |
| CSP | 开发/生产两套策略 |
| 自动更新 | electron-updater (GitHub Releases) |
| 托盘 | 系统托盘集成 |
| 标题栏 | macOS: hiddenInset |
| IPC | preload.ts安全通信 |
| 数据库 | electron/database-handlers.ts |

---

## 八、部署方式

| 方式 | 命令 |
|------|------|
| Web开发 | `pnpm dev` (localhost:3218) |
| Electron开发 | `pnpm electron:dev` |
| Web构建 | `pnpm build` |
| Mac构建 | `pnpm build:mac` |
| Win构建 | `pnpm build:win` |
| Linux构建 | `pnpm build:linux` |
| Docker构建 | `docker build -t yyc3-cloudpivot .` |
| Docker运行 | `docker run -p 3118:8080 yyc3-cloudpivot` |

---

## 九、上下文衔接机制

### 工作原则
1. **安全第一**: 所有修改前先备份
2. **智谱模型**: 使用自有API KEY
3. **Git隔离**: 已断开远程跟踪
4. **本地闭环**: 本机M4 Max 128G开发

### 文件约定
- 上下文文档: `/Volumes/Development/yyc3-77/YYC3-AI-PAI/YYC3-上下文专用/`
- 项目代码: `/Volumes/Development/yyc3-77/YYC3-AI-PAI/YYC3-CloudIntelli-Matrix/`

---

*本文档为AI工具协作的基准上下文，每次会话开始时应以此为参考*
