# YYC³ Cloud Intelli-Matrix — 教科书式功能模块文档

> **版本**: v3.4.0
> **文档日期**: 2026-04-20
> **定位**: 从零理解 YYC³ 系统的功能模块、交互关系、数据流向
> **读者**: 新成员 / 技术评审 / 开源贡献者

---

## 第一章 项目定位与设计理念

### 1.1 YYC³ 是什么

YYC³ (Cloud Intelli-Matrix) 是一个 **"一人一端"的本地优先智能运维平台**:

- **本地优先**: 核心功能完全离线可用，无需服务器
- **AI 原生**: 8 位 AI 家人协同，多模型推理引擎
- **全栈集成**: 监控 / 运维 / 开发 / 安全 / 配置一体化
- **多端部署**: Web (PWA) / Electron 桌面 / Docker 容器

### 1.2 设计理念

```
以人为本 · AI为核 · 纯粹为心 · 智能为驱
```

- **SSOT (Single Source of Truth)**: 每个数据域只有唯一的权威来源
- **模块化**: 19 个独立 Store Slice + 40 个自定义 Hook + 68 个 Lib 模块
- **渐进增强**: 离线可用 → WebSocket 实时 → 多端同步
- **类型安全**: 31 个领域类型文件，TypeScript 严格模式

---

## 第二章 系统入口与导航

### 2.1 应用启动流程

```
App.tsx
  ├── AuthContext (Supabase 认证 / Ghost 模式)
  ├── I18nContext (zh-CN / en-US)
  ├── RouterProvider (HashRouter)
  │    └── Layout
  │         ├── TopBar (搜索/通知/用户)
  │         ├── Sidebar (导航菜单)
  │         ├── ErrorBoundary (页面级防护)
  │         └── <Outlet /> (路由内容)
  └── 全局错误处理 (Figma 错误抑制)
```

### 2.2 导航结构

系统分为 **6 大功能域**，40 条路由全部懒加载:

```
监控中心          运维管理          AI 智能体
├── 数据看板      ├── 运维中心      ├── AI 决策
├── 任务跟踪      ├── 文件管理      ├── AI 诊断
├── 巡检模式      ├── 数据库        ├── 模型管理
├── 服务闭环      ├── 存储管理      ├── SDK 对话
└── PWA 状态      └── 链路测试      └── AI Family

开发者工具        系统管理          配置中心
├── 终端          ├── 系统设置      ├── 配置中心
├── IDE           ├── 用户管理      ├── 变量中心
├── 设计系统      ├── 安全监控      ├── 环境变量
├── 主题定制      ├── 操作审计      ├── 报告导出
└── 开发指南      └── 性能监控      └── 配置导出
```

---

## 第三章 核心功能模块详解

### 3.1 数据监控中心

**路径**: `/` (首页)
**组件**: `Dashboard.tsx` + `DataMonitoring.tsx`

#### 功能清单

| 功能 | 说明 | 数据源 |
|---|---|---|
| GPU 集群看板 | 9 节点 A100/H100 实时状态 | `useNodeSlice` → DataBus → WebSocket |
| 模型性能图 | 推理延迟 / 吞吐量趋势 | `useMetricsSlice` |
| 模型分布饼图 | 各模型使用占比 | `useMetricsSlice` |
| 雷达图 | 系统六维健康度 | `useMetricsSlice` |
| 节点卡片 | GPU 温度/显存/利用率 | WebSocket 2s 轮询 |

#### 数据流

```
WebSocket Server (2s 推送)
    ↓
WebSocketManager (连接/心跳/重连)
    ↓
DataBus (合并策略: ws_priority)
    ↓
node-slice.mergeFromWS() → Zustand Store
    ↓
useNodeSlice() → React.memo(NodeCard)
```

### 3.2 任务跟踪系统

**路径**: `/follow-up`, `/follow-up-manager`
**Store**: `useFollowUpSlice`

#### 功能

- 任务创建: 标题 / 描述 / 优先级 (critical/high/medium/low) / 负责人
- 状态流转: pending → in_progress → completed
- 复制反馈: `useCopyFeedback` Hook 提供一键复制+动画
- AI 建议: `useAISuggestion` 自动分析异常模式

### 3.3 巡检系统

**路径**: `/patrol`
**Hook**: `usePatrol`

#### 巡检流程

```
创建巡检计划 → 设置检查项 → 执行 (自动/手动) → 生成报告 → 跟踪修复
```

- 支持定时巡检 (cron 表达式)
- 巡检项覆盖: CPU / 内存 / 磁盘 / 网络 / 安全 / 日志
- 报告导出: `useReportExporter` 支持 PDF / HTML / JSON

### 3.4 运维操作中心

**路径**: `/operations`
**Hook**: `useOperationCenter`

#### 六类操作

| 类别 | 操作 |
|---|---|
| 节点操作 | 启动/停止/重启/扩缩容 |
| 模型操作 | 部署/卸载/切换/回滚 |
| 任务操作 | 创建/取消/优先级调整 |
| 系统操作 | 配置变更/备份/恢复 |
| 安全操作 | 扫描/隔离/告警 |
| 网络操作 | 连接/断开/切换 |

### 3.5 服务闭环 (Service Loop)

**路径**: `/loop`
**Hook**: `useServiceLoop`

六阶段服务管理:

```
Monitor → Analyze → Decide → Execute → Verify → Optimize
  监控      分析      决策      执行      验证      优化
```

每个阶段定义了 `StageMeta` (名称/状态/指标/数据流节点)，通过 `DataFlowNode` 实现阶段间数据传递。

---

## 第四章 AI Family 系统

### 4.1 系统架构

AI Family 是 YYC³ 最独特的子系统——将 AI 能力拟人化为 8 位"家人"，每位家人有独立的性格、技能、模型绑定和语音配置。

#### 数据架构

```
family-member-slice.ts (SSOT — 8 位家人定义)
         ↕
family-message-slice.ts (统一消息系统)
         ↕
family-settings-slice.ts (7 域设置)
  ├── voiceProfiles      语音配置
  ├── voiceConversations  语音对话
  ├── commMessages       通信消息
  ├── uiConfig           UI 偏好
  ├── modelAssignments   模型绑定
  ├── providerKeys       提供商密钥
  └── musicWorks         创作作品
```

### 4.2 八位家人详解

#### 元启·天枢 (Navigator) — "系统之耳"

- **角色**: 自然语言理解、意图识别、用户交互
- **色值**: `#00FF88` (翠绿)
- **技能**: NLU / 意图识别 / 多语言理解 / 上下文追踪
- **性格**: 热情、敏锐、善于倾听
- **工作**: 解析用户指令，分配给对应家人执行

#### 语枢·万物 (Brain) — "系统之脑"

- **角色**: 推理规划、知识管理、决策支持
- **色值**: `#FF69B4` (粉红)
- **技能**: 推理 / 规划 / 知识图谱 / 多步推理
- **性格**: 理性、博学、善于分析
- **工作**: 处理复杂推理任务，生成决策建议

#### 预见·先知 (Eye) — "系统之眼"

- **角色**: 趋势预测、异常检测、视觉分析
- **色值**: `#00BFFF` (天蓝)
- **技能**: 趋势分析 / 异常检测 / 时序预测 / 可视化
- **性格**: 洞察力强、严谨、善于预测
- **工作**: 监控数据趋势，预测潜在问题

#### 创想·灵韵 (Star) — "系统之星"

- **角色**: 内容创作、设计、灵感生成
- **色值**: `#FF7043` (珊瑚橙)
- **技能**: 文案创作 / UI 设计 / 音乐生成 / 绘画
- **性格**: 创意丰富、感性、善于表达
- **工作**: 生成创意内容、设计建议、歌词创作

#### 智联·无界 (Network) — "系统之网"

- **角色**: 集群管理、设备互联、网络通信
- **色值**: `#FFD700` (金色)
- **技能**: SSH 管理 / 设备发现 / 拓扑管理 / 网络诊断
- **性格**: 活跃、社交、善于连接
- **工作**: 管理多设备互联、集群节点调度

#### 智云·守护 (Shield) — "系统之盾"

- **角色**: 安全监控、入侵检测、合规审计
- **色值**: `#BF00FF` (紫色)
- **技能**: 安全扫描 / 渗透测试 / 日志审计 / 加密管理
- **性格**: 严谨、警觉、可靠
- **工作**: 实时安全监控、漏洞扫描、加密管理

#### 均衡·天平 (Scale) — "系统之秤"

- **角色**: 负载均衡、资源优化、性能调优
- **色值**: `#a855f7` (薰衣草紫)
- **技能**: 负载分析 / 资源调度 / 性能优化 / 容量规划
- **性格**: 公正、冷静、善于平衡
- **工作**: 资源分配优化、性能瓶颈分析

#### 灵光·星火 (Lightbulb) — "系统之灯"

- **角色**: 创新建议、知识分享、学习引导
- **色值**: `#f59e0b` (琥珀)
- **技能**: 创新思维 / 知识管理 / 学习推荐 / 改进建议
- **性格**: 好奇、乐观、善于启发
- **工作**: 生成改进建议、知识分享、学习路径规划

### 4.3 家人交互模式

#### 对话系统 (`FamilyChat`)

```
用户消息 → FamilyMessageSlice.sendMessage()
         → ProviderSlice (路由到绑定模型)
         → AI 响应 → FamilyMessageSlice.addMessage()
         → UI 渲染 (MessageBubble with React.memo)
```

- 支持私聊和群聊
- 消息类型: text / system / notification
- 未读追踪: `conversations[].unreadCount`

#### 语音系统 (`FamilyVoiceSystem`)

```
用户语音 → VoiceCommandParser (指令解析)
         → 情绪检测 (MultimodalEmotionEngine)
         → 任务执行
         → TTS 合成 (Web Speech API, per-member voice profile)
```

每位家人有独立语音配置:
- `pitch`: 音调 (0.1 ~ 2.0)
- `rate`: 语速 (0.1 ~ 10)
- `volume`: 音量 (0 ~ 1)

#### 情绪系统 (`EmotionMusicBridge`)

```
用户交互 → MultimodalEmotionEngine (情绪检测)
         → EmotionMusicBridge (情绪→音乐映射)
         → SmartPlaylistGenerator (智能歌单)
         → MusicEventBus (播放控制)
```

### 4.4 音乐空间 (`FamilyMusic`)

音乐空间包含多个子模块:

| 模块 | 说明 |
|---|---|
| CoverFlow | 专辑封面 3D 浏览器 |
| VinylPhotoPlayer | 黑胶唱片 + 照片播放器 + MV 叠加 |
| CreationStudio | 音乐创作工作室 (快速/大师/混音/上传) |
| LyricsGenerator | AI 歌词生成面板 |
| EmotionVisualizer | 实时情绪可视化 |
| AudioVisualizer | 音频波形/频谱可视化 |
| VoiceMusicControlPanel | 语音 + 音乐联合控制 |

### 4.5 成长系统 (`FamilyGrowth`)

- **活跃热力图**: 每日协作活动记录
- **贡献图表**: 各家人贡献统计
- **连续打卡**: streak 追踪
- **成就系统**: `AchievementSystem` 管理勋章/徽章/连续记录
- **勋章**: 每位家人有专属成就勋章

---

## 第五章 开发者工具模块

### 5.1 IDE 面板

**路径**: `/ide`
**组件**: `IDEPanel` + `ide/` 目录 (30 文件)

```
IDEPanel
├── FileExplorer    文件浏览器
├── CodePreview     代码预览 (CodeMirror)
├── TerminalPanel   集成终端 (xterm.js)
├── GitPanel        Git 操作面板
├── Layout          IDE 布局管理
├── StatusBar       状态栏
└── Panel System    可拖拽面板系统
```

**Store**: `useIDESettingsSlice` — 管理主题/字体/Tab 大小/自动保存/括号着色

### 5.2 CLI 终端

**路径**: `/terminal`
**Hook**: `useTerminal`

支持命令:
- 系统命令: `help`, `clear`, `status`
- 文件命令: `ls`, `cat`, `pwd`
- 环境变量: `env get/set/list/export`
- 自定义命令注册

### 5.3 设计系统

**路径**: `/design-system`
**组件**: DesignSystemPage + DesignTokens + ComponentShowcase + StageReview

展示完整设计令牌体系:
- 颜色令牌 (18 种)
- 间距系统 (0 ~ 24)
- 字体系统 (4 级)
- 阴影系统 (5 级)
- 圆角系统 (4 级)
- 动画曲线 (3 种)

---

## 第六章 系统管理模块

### 6.1 系统设置

**路径**: `/settings`
**组件**: `SystemSettings.tsx` (83KB — 最大单组件)

12 个设置分类:
1. 常规设置 — 语言/主题/自动保存
2. 网络配置 — WiFi/代理/CORS
3. 存储管理 — IndexedDB/localStorage 容量
4. 安全设置 — CSP/加密策略
5. 通知设置 — 告警阈值/推送
6. 模型管理 — 默认模型/推理参数
7. 界面偏好 — 布局/密度/动画
8. 开发者选项 — 调试/日志级别
9. 数据管理 — 导入/导出/备份
10. 性能设置 — 缓存/预加载
11. 语音设置 — TTS/STT 参数
12. 高级设置 — 实验功能/标志位

### 6.2 安全监控

**路径**: `/security`
**Hook**: `useSecurityMonitor`

| 功能 | 实现 |
|---|---|
| CSP 检测 | Content-Security-Policy 策略检查 |
| Cookie 安全 | HttpOnly/Secure/SameSite 检查 |
| 敏感数据扫描 | localStorage 中 API Key 明文检测 |
| Web Vitals | LCP/FID/CLS 性能指标 |
| 渗透测试 | `penetration-tester.ts` 安全工具集 |
| 审计日志 | `security-audit.ts` 审计报告生成 |

### 6.3 告警系统

**路径**: `/alerts`
**Hook**: `useAlertRules`

告警规则引擎:
- 条件定义: 指标 / 运算符 / 阈值 / 持续时间
- 告警级别: info / warning / critical / emergency
- 通知方式: Toast / 声音 / 日志
- 评估引擎: `alerting-manager.ts` 实时评估

---

## 第七章 数据流与状态管理

### 7.1 单向数据流

```
用户操作 → Hook 调用 → Slice setState → Zustand Store → React 重渲染
                                                    ↓
                                              persist → localStorage
                                              DataBus → WebSocket 广播
```

### 7.2 跨组件通信

```
组件 A → FamilyMessageSlice.sendMessage() → Store 更新
                                           → 组件 B (useFamilyMessageSlice) 自动接收
                                           → DataBus 广播
                                           → BroadcastChannel → 其他标签页
```

### 7.3 离线数据流

```
在线: WebSocket → DataBus → Slice → UI
                   ↓
              offline-slice (快照保存)

离线: offline-slice (快照恢复) → UI
       ↑
   IndexedDB v4 (大容量持久化)
       ↑
   CRDT 合并 (多端冲突解决)
```

### 7.4 localStorage 迁移流程

```
旧 Key (分散)               →  新 Slice (统一)
─────────────────────────────────────────────
dashboard_state             →  offline-slice.dashboardSnapshot
offline_snapshot            →  offline-slice.offlineSnapshot
offline_snapshot_time       →  offline-slice.offlineSnapshotTime
yyc3_file_tree              →  fs-slice.fileTree
yyc3_file_contents          →  fs-slice.fileContents
yyc3_recent_files           →  fs-slice.recentFiles
... (65 个旧 Key → 19 Slices)
```

迁移工具: `lib/migrate-storage.ts` 提供 4 种迁移函数，Slice 初始化时自动执行。

---

## 第八章 测试体系

### 8.1 测试分层

| 层级 | 工具 | 文件数 | 覆盖 |
|---|---|---|---|
| 单元测试 | Vitest + Testing Library | 236 | Store / Hook / 工具函数 |
| 集成测试 | Vitest | 2 | 核心流程 / CreationStudio |
| E2E 测试 | Playwright | 5 | 导航 / Dashboard / WiFi / 数据流 / Git |
| 性能审计 | Lighthouse CI | 配置文件 | LCP / FID / CLS |

### 8.2 测试覆盖

- **总计**: 493+ 测试用例
- **通过率**: 100%
- **关键覆盖域**:
  - Store Slice (19 个) — CRUD + 持久化
  - Hook (40 个) — 状态/副作用
  - 组件 (核心页面) — 渲染/交互
  - 工具函数 — 边界/异常

### 8.3 运行测试

```bash
pnpm test              # 单元测试
pnpm test:coverage     # 覆盖率报告
pnpm test:e2e          # Playwright E2E
pnpm test:lighthouse   # Lighthouse 性能审计
pnpm type-check        # TypeScript 类型检查
pnpm lint              # ESLint 代码规范
```

---

## 第九章 设计系统

### 9.1 色彩体系

```typescript
import { C } from "../../config/colors";

// 语义色
C.primary       // "#00d4ff" — 主色调 (按钮/链接/焦点)
C.success       // "#00ff88" — 成功/健康
C.destructive   // "#ff3366" — 危险/错误
C.warning       // "#ffaa00" — 警告
C.gold          // "#ffd700" — 金色/高亮
C.purple        // "#7b2ff7" — 紫色

// 文本色
C.foreground    // "#e0f0ff" — 主文字
C.mutedFg       // "#6bb8d9" — 弱化文字
C.background    // "#060e1f" — 背景

// 透明度变体
C.border        // "rgba(0,180,255,0.2)"
C.card          // "rgba(10,30,60,0.7)"
C.ring          // "rgba(0,212,255,0.5)"

// 工具
C.alpha("#00d4ff", 0.5)  // → "rgba(0,212,255,0.5)"
```

### 9.2 图表色彩

```typescript
import { CHART_COLORS, FAMILY_COLORS } from "../../config/colors";

CHART_COLORS  // 图表配色 (8色)
FAMILY_COLORS // 家人主题色 (8色)
```

### 9.3 组件库

基于 Radix UI + shadcn/ui (49 组件):
- 布局: Card / Accordion / Tabs / Separator
- 表单: Button / Input / Select / Checkbox / Switch / Slider
- 反馈: Dialog / Alert / Toast (sonner) / Progress
- 数据: Table / Badge / Avatar / Tooltip
- 导航: DropdownMenu / Command / Breadcrumb

---

## 第十章 部署与运维

### 10.1 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式 (HMR)
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 运行测试
pnpm test
```

### 10.2 生产构建

```bash
# Web 构建
pnpm build

# Electron 构建 (按平台)
pnpm build:electron:mac
pnpm build:electron:win
pnpm build:electron:linux

# Docker 构建
docker-compose up --build
```

### 10.3 CI/CD 流水线

```
Push / PR
  ├── ESLint (0 errors)
  ├── TypeScript (0 errors)
  ├── Vitest (493+ tests)
  ├── Vite Build (< 1s)
  ├── Lighthouse CI
  └── Docker Build (可选)
```

---

## 附录 A: 关键文件索引

| 类别 | 路径 | 说明 |
|---|---|---|
| 入口 | `src/main.tsx` | 应用入口 |
| 路由 | `src/app/routes.tsx` | 路由表 (40 路由) |
| 根组件 | `src/app/App.tsx` | 认证 + I18n + Router |
| 布局 | `src/app/components/Layout.tsx` | TopBar + Sidebar + Outlet |
| Store | `src/app/store/index.ts` | 19 Slice barrel |
| 类型 | `src/app/types/index.ts` | 31 领域 barrel |
| 设计系统 | `src/app/config/design-system.ts` | 设计令牌 |
| 颜色 | `src/app/config/colors.ts` | 颜色快捷常量 |
| 页面配置 | `src/app/config/page-config.ts` | 页面注册表 |
| 国际化 | `src/app/i18n/` | zh-CN / en-US |
| Electron | `electron/` | 主进程代码 |
| 部署 | `deploy/` + `Dockerfile` | 部署配置 |

## 附录 B: 常用命令

```bash
# 开发
pnpm dev                    # 启动开发服务器
pnpm build                  # 生产构建

# 质量保障
pnpm type-check             # TypeScript 类型检查
pnpm lint                   # ESLint
pnpm lint:fix               # ESLint 自动修复
pnpm test                   # 单元测试
pnpm test:coverage          # 测试覆盖率
pnpm test:e2e               # E2E 测试

# Electron
pnpm build:electron:mac     # Mac 构建

# 工具
pnpm fix:all-testids        # 修复测试 ID
```

## 附录 C: 术语表

| 术语 | 全称 | 含义 |
|---|---|---|
| YYC³ | YanYuCloudCube | 研发团队/项目品牌 |
| SSOT | Single Source of Truth | 单一数据源 |
| CRDT | Conflict-free Replicated Data Type | 冲突自由数据类型 |
| MCP | Model Context Protocol | 模型上下文协议 |
| WebGPU | Web Graphics Processing Unit | 浏览器 GPU API |
| PWA | Progressive Web App | 渐进式 Web 应用 |
| DataBus | Data Bus | 跨组件数据同步总线 |
| Slice | Zustand Store Slice | Zustand 状态分片 |
| Family Member | AI Family Member | AI 家人 (8 位智能体) |
| Barrel | Barrel Re-export | 桶式重导出文件 |

---

*文档生成时间: 2026-04-20*
*项目版本: v3.4.0*
*文档类型: 教科书式功能模块参考*
