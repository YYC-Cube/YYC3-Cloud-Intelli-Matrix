# YYC³ Cloud Intelli-Matrix — API架构 & 功能模块文档

> **版本**: v3.4.0
> **文档日期**: 2026-04-20
> **架构模式**: React 19 + TypeScript + Zustand + Vite + Electron
> **部署模式**: Web (PWA) / Electron Desktop / Docker

---

## 一、系统架构总览

### 1.1 技术栈

| 层级 | 技术 | 用途 |
|---|---|---|
| UI 框架 | React 19.2.4 | 组件化界面 |
| 类型系统 | TypeScript 5.9.3 | 类型安全 |
| 状态管理 | Zustand 5.0.12 + Immer | 模块化 Store |
| 构建工具 | Vite 8.0.5 | 开发 & 构建 |
| 桌面端 | Electron 41.1.1 | 原生桌面应用 |
| AI 推理 | @mlc-ai/web-llm 0.2.82 | WebGPU 本地推理 |
| 数据可视化 | Recharts 3.7.0 | 图表 |
| 终端 | @xterm/xterm 6.0.0 | 内嵌终端 |
| 代码编辑 | @uiw/react-codemirror 4.25.8 | IDE 编辑器 |
| 验证 | Zod 4.3.6 | 数据校验 |
| 样式 | Tailwind CSS 4.2.1 | 原子化 CSS |
| 动画 | Motion 12.34.5 | 交互动画 |
| UI 组件 | Radix UI + MUI 7.3.8 | 基础组件库 |
| 测试 | Vitest 4.1.2 + Playwright 1.59 | 单元 + E2E |
| 后端 | Supabase (可选) | 认证 & 数据 |

### 1.2 分层架构

```
┌─────────────────────────────────────────────────┐
│                   Electron Shell                │
├─────────────────────────────────────────────────┤
│  Presentation Layer (React Components)          │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Pages   │ │  UI Kit  │ │  AI-Family       │ │
│  │ (40)    │ │ (49)     │ │  Components (36) │ │
│  └────┬────┘ └────┬─────┘ └────────┬─────────┘ │
├───────┼───────────┼────────────────┼───────────┤
│  Hook Layer (40 Custom Hooks)                   │
│  useWebSocketData · useBigModelSDK · useMCP     │
│  useInference · useAgentOrchestrator · ...      │
├─────────────────────────────────────────────────┤
│  State Layer (Zustand 19 Slices)                │
│  node · metrics · app · family-member · ...     │
│  log · model · network · provider · fs · ...    │
├─────────────────────────────────────────────────┤
│  Service Layer (68 Lib Modules)                 │
│  DataBus · WebSocket · InferenceEngine          │
│  CryptoVault · ClusterManager · EventBus        │
├─────────────────────────────────────────────────┤
│  Storage Layer                                  │
│  IndexedDB v4 · localStorage · CRDT Sync        │
├─────────────────────────────────────────────────┤
│  External Services                              │
│  Ollama · Z.ai/Zhipu · DeepSeek · OpenAI        │
│  Supabase · WebSocket Server · BroadcastChannel │
└─────────────────────────────────────────────────┘
```

---

## 二、路由架构

### 2.1 路由系统

使用 `createHashRouter` (React Router v7)，全部 40 条路由通过 `React.lazy()` 代码分割。

| 分类 | 路径 | 组件 | 说明 |
|---|---|---|---|
| **监控中心** | `/` | DataMonitoring | 实时数据监控看板 |
| | `/follow-up` | FollowUpPanel | 任务跟踪面板 |
| | `/follow-up-manager` | FollowUpManager | 跟单管理器 |
| | `/patrol` | PatrolDashboard | 巡检模式 |
| | `/loop` | ServiceLoopPanel | 服务闭环 |
| | `/pwa` | PWAStatusPanel | PWA 状态 |
| **运维管理** | `/operations` | OperationCenter | 运维操作中心 |
| | `/files` | LocalFileManager | 文件管理 |
| | `/host-files` | HostFileManager | 宿主文件系统 |
| | `/database` | DatabaseManager | 数据库管理 |
| | `/db-connections` | DatabaseConnectionPanel | 数据库连接 |
| | `/data-editor` | DataEditorPanel | 数据编辑器 |
| | `/storage` | StorageManager | 存储管理 |
| | `/connection-monitor` | ConnectionMonitorPanel | 连接监控 |
| | `/connection-test` | ServiceConnectionTest | 链路测试 |
| **AI 智能体** | `/ai` | AISuggestionPanel | AI 决策建议 |
| | `/ai-diagnosis` | AIDiagnostics | AI 诊断 |
| | `/models` | ModelProviderPanel | 模型提供商 |
| | `/sdk-chat` | SDKChatPanel | SDK 对话 |
| | `/ai-family` | AIFamilyPage | AI Family 主页 |
| | `/ai-family/:subpage` | AIFamilyRouter | AI Family 18 子页面 |
| | `/hotel-dashboard` | HotelDashboard | 智慧酒店 |
| **开发者工具** | `/terminal` | CLITerminal | CLI 终端 |
| | `/ide` | IDEPanel | 集成开发环境 |
| | `/design-system` | DesignSystemPage | 设计系统 |
| | `/dev-guide` | DevGuidePage | 开发指南 |
| | `/theme` | ThemeCustomizer | 主题定制 |
| **系统管理** | `/settings` | SystemSettings | 系统设置 (83KB) |
| | `/unified-settings` | UnifiedSettingsPanel | 统一设置 |
| | `/users` | UserManagement | 用户管理 |
| | `/security` | SecurityMonitor | 安全监控 |
| | `/audit` | OperationAudit | 操作审计 |
| | `/alerts` | AlertRulesPanel | 告警规则 |
| | `/performance` | PerformanceMonitor | 性能监控 |
| | `/architecture` | ArchitectureAudit | 架构审计 |
| **配置中心** | `/config-center` | ConfigCenter | 配置中心 |
| | `/variables` | VariableCenter | 变量中心 |
| | `/env-config` | EnvConfigEditor | 环境变量 |
| | `/reports` | ReportExporter | 报告导出 |
| | `/export-center` | ConfigExportCenter | 配置导出 |
| | `/refactoring` | RefactoringReport | 重构报告 |

### 2.2 AI Family 子路由 (18 个)

| 路径参数 | 组件 | 说明 |
|---|---|---|
| `home` | FamilyHome | 家园主页 |
| `center` | AIFamilyCenterPage | Family 中心 |
| `chat` | FamilyChat | 家人对话 |
| `comm` | FamilyCommCenter | 通信中心 |
| `phone` | FamilyPhone | 家人热线 |
| `music` | FamilyMusic | 音乐空间 |
| `fun` | FamilyEntertainment | 文娱中心 |
| `activities` | FamilyActivityCenter | 全家活动 |
| `growth` | FamilyGrowth | 成长轨迹 |
| `data` | FamilyDataHub | 数据中心 |
| `voice` | FamilyVoiceSystem | 语音系统 |
| `learn` | FamilyLearn | 学习成长 |
| `models` | FamilyModelSettings | 模型控制 |
| `settings` | FamilyUISettings | 生态控制 |
| `hotel` | FamilyHotel | 智慧酒店 |
| `cluster` | FamilyCluster | 集群管理 |
| `share` | FamilyShare | 内容分享 |
| `design-doc` | AIFamilyDesignDoc | 设计文档 |

---

## 三、状态管理架构

### 3.1 Store 设计原则

- **SSOT (Single Source of Truth)**: 每个数据域只有一个权威来源
- **Slice 模式**: 按领域拆分，独立 hook 暴露
- **Persist 中间件**: 关键数据自动持久化到 localStorage
- **Immer 中间件**: 不可变更新
- **DevTools 中间件**: Redux DevTools 集成
- **DataBus 集成**: WebSocket/用户编辑/初始化数据统一合并

### 3.2 19 个 Store Slices

| Slice | Hook | 持久化 | 数据域 |
|---|---|---|---|
| `node-slice` | `useNodeSlice` | ✅ localStorage | GPU 集群节点 (9 节点 A100/H100) |
| `metrics-slice` | `useMetricsSlice` | ✅ | 图表指标 (模型性能/分布/雷达) |
| `app-slice` | `useAppSlice` | ❌ 内存 | 运行时 UI 状态 (告警/FPS/内存) |
| `log-slice` | `useLogSlice` | ✅ 200条 | 系统日志 (级别过滤/搜索) |
| `model-slice` | `useModelSlice` | ✅ | 部署模型 CRUD |
| `network-slice` | `useNetworkSlice` | ✅ | WiFi 网络 + 自动重连 |
| `family-member` | `useFamilyMemberSlice` | ✅ | 8 位 AI 家人 (性格/状态/模型绑定) |
| `family-message` | `useFamilyMessageSlice` | ✅ | 统一消息 (Chat/Comm/Hotel) |
| `family-settings` | `useFamilySettingsSlice` | ✅ 7域 | 语音/对话/UI/模型/音乐 |
| `provider-slice` | `useProviderSlice` | ✅ | 9 内置提供商 + Ollama 发现 |
| `follow-up-slice` | `useFollowUpSlice` | ✅ | 任务跟踪 (优先级/状态) |
| `user-mgmt-slice` | `useUserMgmtSlice` | ✅ | 用户 CRUD + 锁定 |
| `fs-slice` | `useFSSlice` | ✅ 3键合并 | 文件树/内容/最近文件 |
| `sdk-session-slice` | `useSDKSessionSlice` | ✅ 2键合并 | SDK 会话 + 用量统计 |
| `ai-suggestion-slice` | `useAISuggestionSlice` | ✅ 2键合并 | 异常检测 + AI 建议 |
| `ide-settings-slice` | `useIDESettingsSlice` | ✅ 3键合并 | IDE 设置/布局 |
| `db-conn-slice` | `useDbConnSlice` | ✅ 2键合并 | 数据库连接/池/SQL 历史 |
| `ui-prefs-slice` | `useUIPrefsSlice` | ✅ 6键合并 | UI 偏好 (AI 浮窗/终端/告警) |
| `offline-slice` | `useOfflineSlice` | ✅ | 离线快照缓存 |

### 3.3 组合 Hook

```typescript
useUnifiedStore() → 合并 node + metrics + app + family-member + family-message
```

---

## 四、核心服务模块

### 4.1 数据总线 (DataBus)

**文件**: `lib/data-bus.ts`

核心事件/合并枢纽，实现 SSOT 数据流:
- **三种数据源**: WebSocket 推送 / 用户编辑 / DataService 初始化
- **合并策略**: `ws_priority` / `user_priority` / `timestamp_win`
- **双向 WebSocket**: 自动重连 + 心跳 + 离线队列 + 推送节流
- **跨标签同步**: BroadcastChannel API

### 4.2 推理引擎 (InferenceEngine)

**文件**: `lib/inference-engine.ts`

双后端推理抽象:
- **Ollama HTTP**: 本地 Ollama 服务 HTTP API 调用
- **WebGPU**: @mlc-ai/web-llm 浏览器端推理
- **模型预设**: SmolLM2 / Phi-3.5 / Qwen / 等
- **GPU 检测**: 自动检测 WebGPU 可用性
- **热切换**: 运行时切换模型
- **单例模式**: 全局唯一引擎实例

### 4.3 AI 服务管理器 (AIServiceManager)

**文件**: `lib/ai-service-manager.ts`

AI 请求调度:
- **请求队列**: 并发限制 + 优先级
- **流式响应**: `onChunk` 逐步回调
- **缓存**: 响应结果缓存
- **延迟统计**: 百分位延迟追踪

### 4.4 WebSocket 管理器

**文件**: `lib/websocket-manager.ts`

WebSocket 生命周期:
- **连接状态管理**: connecting / open / closing / closed
- **心跳保活**: 可配置间隔
- **指数退避重连**: 自动重连策略
- **消息队列**: 离线时缓存消息
- **统计追踪**: 发送/接收/错误计数

### 4.5 加密保险库 (CryptoVault)

**文件**: `lib/crypto-vault.ts`

基于 Web Crypto API:
- **AES-GCM**: 256-bit 加密
- **密钥派生**: PBKDF2
- **自动 IV**: 每次加密随机 IV
- **双存储**: IndexedDB + localStorage

### 4.6 集群管理器 (ClusterManager)

**文件**: `lib/yyc3-cluster-manager.ts`

分布式集群:
- **SSH 多机互联**: 远程节点管理
- **设备自动发现**: 局域网设备扫描
- **分布式任务调度**: 跨节点任务分配
- **NAS 存档同步**: 数据归档
- **预配置**: Apple Silicon (M4) 设备

### 4.7 CRDT 同步引擎

**文件**: `lib/crdt.ts`

冲突自由数据类型:
- **G-Counter**: 增长计数器
- **LWW-Register**: 最后写入胜出寄存器
- **OR-Set**: 可观察集合
- **跨标签同步**: BroadcastChannel + CRDT 合并

---

## 五、AI Family 架构

### 5.1 八位 AI 家人

| 代号 | 名称 | 角色定位 | 色值 | 技能域 |
|---|---|---|---|---|
| Navigator | 元启·天枢 | "耳"与"译" | #00FF88 | NLU / 意图识别 |
| Brain | 语枢·万物 | "脑"与"思" | #FF69B4 | 推理 / 规划 |
| Eye | 预见·先知 | "眼"与"察" | #00BFFF | 视觉分析 / 趋势预测 |
| Star | 创想·灵韵 | "星"与"创" | #FF7043 | 内容创作 / 设计 |
| Network | 智联·无界 | "网"与"联" | #FFD700 | 集群管理 / 通信 |
| Shield | 智云·守护 | "盾"与"卫" | #BF00FF | 安全监控 / 防御 |
| Scale | 均衡·天平 | "秤"与"衡" | #a855f7 | 负载均衡 / 优化 |
| Lightbulb | 灵光·星火 | "灯"与"新" | #f59e0b | 创新 / 建议 |

### 5.2 家人数据模型

```typescript
interface UnifiedFamilyMember {
  id: string;                    // 唯一标识
  name: string;                  // 中文名
  enTitle: string;               // 英文标题
  icon: LucideIcon;              // 图标组件
  color: string;                 // 主题色
  status: 'online' | 'busy' | 'idle' | 'offline';
  personality: string[];         // 性格特征
  expertise: string[];           // 专业领域
  hobbies: string[];             // 兴趣爱好
  greeting: string;              // 问候语
  careMessages: string[];        // 关怀消息
  modelBinding?: {               // 模型绑定
    provider: string;
    model: string;
  };
  voiceProfile?: VoiceProfile;   // 语音配置
  stats: MemberStats;            // 协作统计
  medals: Medal[];               // 成就勋章
}
```

### 5.3 子系统交互

```
FamilyMemberSlice (SSOT)
    ├── FamilyChat          ← 消息收发
    ├── FamilyCommCenter    ← 通信中心
    ├── FamilyHotel         ← 智慧酒店
    ├── FamilyMusic         ← 音乐空间
    ├── FamilyVoiceSystem   ← 语音系统
    ├── FamilyGrowth        ← 成长追踪
    ├── FamilyEntertainment ← 文娱活动
    └── FamilyCluster       ← 集群管理
         ↕
    FamilyMessageSlice (统一消息)
    FamilySettingsSlice (7 域设置)
    ProviderSlice (模型绑定)
```

---

## 六、Hook API 参考

### 6.1 核心 Hooks

| Hook | 签名 | 用途 |
|---|---|---|
| `useWebSocketData` | `() => WebSocketState` | WebSocket 生命周期 + 消息路由 |
| `useBigModelSDK` | `() => SDKActions` | 多提供商 AI 对话 (流式/会话) |
| `useAgentOrchestrator` | `() => AgentActions` | Agent 编排 (think→act→report) |
| `useMCP` | `() => MCPActions` | MCP 工具调用 + Agent 注册 |
| `useInference` | `() => InferenceState` | 双后端推理 (Ollama/WebGPU) |
| `useModelProvider` | `() => ProviderActions` | 模型提供商管理 |
| `useAISuggestion` | `() => SuggestionState` | AI 建议 (健康评分/模式/统计) |

### 6.2 基础设施 Hooks

| Hook | 签名 | 用途 |
|---|---|---|
| `useClock` | `() => Date` | 实时时钟 (每秒) |
| `useCopyFeedback` | `<T>() => [T\|null, fn]` | 复制反馈动画 |
| `useI18n` | `() => I18nContext` | 国际化 (zh-CN/en-US) |
| `useResponsive` | `() => Breakpoints` | 响应式断点 |
| `useMobileView` | `() => MobileState` | 移动端适配 |
| `usePerformanceMonitor` | `() => PerfMetrics` | FPS/内存/长任务 |
| `useOfflineMode` | `() => OfflineState` | 在线/离线检测 |
| `useKeyboardShortcuts` | `() => void` | 全局快捷键 |
| `usePersistedState` | `<T>(key) => [T, setter]` | 持久化状态 |

### 6.3 功能 Hooks

| Hook | 用途 |
|---|---|
| `useAlertRules` | 告警规则 CRUD |
| `usePatrol` | 巡检调度 (自动/手动) |
| `useServiceLoop` | 六阶段服务闭环 |
| `useOperationCenter` | 运维操作中心 |
| `useNetworkConfig` | WiFi 网络管理 |
| `useTerminal` | xterm.js 终端集成 |
| `useLocalFileSystem` | 虚拟文件树 CRUD |
| `useLocalDatabase` | IndexedDB 数据库操作 |
| `useHostFileSystem` | Electron 宿主文件系统 |
| `useSecurityMonitor` | 安全事件监控 |
| `useAIDiagnostics` | AI 系统诊断 |
| `useMusicPlayer` | 音乐播放控制 |
| `useEmotionMusic` | 情绪→音乐映射 |
| `useAudioEngine` | Web Audio API |
| `useReportExporter` | 报告导出 |
| `useVariables` | 变量中心 |
| `usePWAManager` | PWA 生命周期 |
| `useInstallPrompt` | PWA 安装提示 |
| `usePageConfig` | 页面配置 |
| `useYYC3Head` | HTML Head 元数据 |

---

## 七、类型系统

### 7.1 领域类型文件 (31 个)

| 文件 | 核心导出 |
|---|---|
| `common-types` | BaseSeverity |
| `auth-types` | UserRole, AppUser, AppSession, AuthContextValue |
| `node-types` | NodeStatusType, NodeData, NodeStatusRecord, toNodeData |
| `websocket-types` | ConnectionState, AlertLevel, WSMessage |
| `network-types` | NetworkInterface, APIEndpoints |
| `model-agent-types` | ModelTier, Model, Agent, InferenceStatus |
| `model-provider-types` | ModelProviderDef, ConfiguredModel, OllamaModel |
| `sdk-types` | ChatSession, SDKUsageStats, ChatMessage |
| `inference-types` | InferenceConfig, InferenceResult |
| `database-types` | DBConnection, SQLTemplate, EditableCellChange |
| `filesystem-types` | FileItem, RecentFile |
| `security-types` | SecurityAuditEntry, VulnerabilityReport (18 exports) |
| `diagnostic-types` | DiagnosticResult, SystemHealthCheck (13 exports) |
| `alert-rules-types` | AlertRule, AlertCondition |
| `patrol-types` | PatrolSchedule, PatrolReport |
| `followup-types` | FollowUpRecord, FollowUpPriority |
| `operation-types` | OperationAction, OperationCategory |
| `service-loop-types` | StageMeta, DataFlowNode |
| `design-system-types` | DesignToken, ColorToken |
| `dashboard-types` | DashboardWidget, LogLevel |
| `i18n-types` | I18nContextValue, Locale |
| `storage` | StoreName (22 values), StorageChangeEvent |
| `family-member` | UnifiedFamilyMember, MemberPresenceStatus |
| `family-message` | UnifiedFamilyMessage, FamilyConversation |

### 7.2 导入方式

```typescript
// 所有类型通过 barrel 统一导入，路径不变
import type { NodeData, AlertRule, ChatSession } from "../types";
// 值导出
import { toNodeData } from "../types";
```

---

## 八、配置系统

### 8.1 设计令牌 (`config/design-system.ts`)

| 令牌 | 值 | CSS 变量 |
|---|---|---|
| Background | `#060e1f` | `--bg` |
| Foreground | `#e0f0ff` | `--fg` |
| Primary | `#00d4ff` | `--primary` |
| Success | `#00ff88` | `--success` |
| Destructive | `#ff3366` | `--destructive` |
| Warning | `#ffaa00` | `--warning` |
| Border | `rgba(0,180,255,0.2)` | `--border` |
| Card | `rgba(10,30,60,0.7)` | `--card` |

### 8.2 快捷颜色 (`config/colors.ts`)

```typescript
import { C } from "../../config/colors";

C.primary       // "#00d4ff"
C.success       // "#00ff88"
C.destructive   // "#ff3366"
C.alpha("#00d4ff", 0.5)  // "rgba(0,212,255,0.5)"
```

### 8.3 页面配置 (`config/page-config.ts`)

`PageConfig` 接口定义每页的: id / path / title(CN+EN) / icon / category / layout / permissions / storageKeys。

### 8.4 变量中心 (`config/variable-center.ts`)

6 大变量分类: device / user / secret / model / system / env，支持 string / number / boolean / url / json / password / select 类型。

---

## 九、部署架构

### 9.1 多端部署

| 平台 | 方式 | 配置 |
|---|---|---|
| Web | Vite dev server | `pnpm dev` |
| PWA | Service Worker + Manifest | `vite-plugin-pwa` |
| Electron Mac | electron-builder | `pnpm build:electron/mac` |
| Electron Win | electron-builder | `pnpm build:electron/win` |
| Electron Linux | electron-builder | `pnpm build:electron/linux` |
| Docker | Dockerfile + nginx | `docker-compose up` |

### 9.2 Docker 架构

```dockerfile
# 多阶段构建
Stage 1: Bun install + build
Stage 2: nginx:alpine 静态服务
```

### 9.3 CI/CD

- **GitHub Actions**: 自动测试 + 构建 + 发布
- **Lighthouse CI**: 性能审计
- **ESLint**: 代码质量门禁
- **TypeScript**: 类型检查门禁

---

## 十、外部服务集成

### 10.1 AI 服务提供商 (9 内置)

| 提供商 | API | 模型示例 |
|---|---|---|
| Z.ai (智谱) | `zhipu-ai-service.ts` | GLM-4 / ChatGLM |
| Z.ai Plan | 同上 | 计费版 |
| DeepSeek | OpenAI 兼容 | DeepSeek-V2 |
| Moonshot (月之暗面) | OpenAI 兼容 | moonshot-v1 |
| OpenAI | OpenAI API | GPT-4o |
| Ollama (本地) | HTTP API | LLaMA 3 / Qwen |
| 百度文心 | ERNIE API | ERNIE-Bot |
| 阿里通义 | DashScope | Qwen-Max |
| 讯飞星火 | Spark API | Spark-V3 |

### 10.2 数据存储

| 存储 | 用途 | 容量 |
|---|---|---|
| localStorage | Zustand persist | ~5MB |
| IndexedDB v4 | 大容量离线数据 | 无限 |
| Electron fs | 宿主文件系统 | 无限 |
| Supabase (可选) | 云端认证/数据 | 配额制 |

---

*文档生成时间: 2026-04-20*
*架构版本: v3.4.0*
