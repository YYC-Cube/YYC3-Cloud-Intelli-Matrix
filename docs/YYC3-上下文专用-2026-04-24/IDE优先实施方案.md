# YYC³ 一体化DevOps落地实施方案 — IDE优先

> **日期**: 2026-04-22
> **原则**: 整体框架不变 · 本地封装可用 · 安全第一
> **核心路径**: `/Volumes/Development/yyc3-77/YYC3-AI-PAI/YYC3-CloudIntelli-Matrix`
> **知识库**: `/Volumes/Knowledge/YYC3-AI-Skill-KB`

---

## 一、IDE模块现状分析

### 已有IDE组件 (28个文件)

```
src/app/components/ide/
├── IDELayout.tsx          ← 主布局 (SplitContainer可拖拽分割)
├── IDETopBar.tsx          ← 顶部工具栏
├── IDEViewSwitcher.tsx    ← 视图切换器
├── IDEStatusBar.tsx       ← 状态栏
├── IDESettingsPanel.tsx   ← IDE设置面板
├── IDETerminal.tsx        ← IDE内终端
├── AIChatPanel.tsx        ← AI对话面板
├── FileExplorer.tsx       ← 文件资源管理器
├── CodePreviewPanel.tsx   ← 代码预览面板
├── Workspace.tsx          ← 工作区管理
├── GitPanel.tsx           ← Git面板
├── GPUNodeCard.tsx        ← GPU节点卡片
├── DeployDialog.tsx       ← 部署对话框
├── ShareDialog.tsx        ← 分享对话框
├── NotificationPanel.tsx  ← 通知面板
├── TabBar.tsx             ← 标签栏
├── Panel.tsx              ← 面板基类
├── PanelContainer.tsx     ← 面板容器
├── PanelContent.tsx       ← 面板内容
├── PanelHeader.tsx        ← 面板头部
├── PanelToolbar.tsx       ← 面板工具栏
├── PanelResizeHandle.tsx  ← 面板拖拽手柄
├── LayoutContext.tsx       ← 布局上下文
├── XtermTerminal.tsx      ← Xterm终端实现
├── XtermIntegration.ts    ← Xterm集成逻辑
├── ide-types.ts           ← IDE类型定义
├── ide-layout-types.ts    ← 布局类型定义
└── ide-mock-data.ts       ← 模拟数据

独立IDE组件:
├── CodeEditor.tsx         ← CodeMirror代码编辑器 (10种语言)
├── IntegratedTerminal.tsx ← 独立集成终端 (多Tab)
├── FileBrowser.tsx        ← 文件浏览器
└── CLITerminal.tsx        ← CLI终端
```

### 已有能力清单

| 能力 | 组件 | 状态 |
|------|------|------|
| 代码编辑 | CodeEditor (CodeMirror, 10语言) | ✅ 可用 |
| 终端 | IDETerminal + XtermTerminal | ✅ 可用 |
| 文件管理 | FileExplorer + FileBrowser | ✅ 可用 |
| AI对话 | AIChatPanel | ✅ 可用 |
| Git面板 | GitPanel | ✅ 可用 |
| GPU监控 | GPUNodeCard | ✅ 可用 |
| 部署 | DeployDialog | ✅ 可用 |
| 多面板布局 | SplitContainer + Panel系统 | ✅ 可用 |
| 状态栏 | IDEStatusBar | ✅ 可用 |
| 视图切换 | IDEViewSwitcher | ✅ 可用 |
| 工作区 | Workspace | ✅ 可用 |
| 通知 | NotificationPanel | ✅ 可用 |
| 分享 | ShareDialog | ✅ 可用 |
| 设置 | IDESettingsPanel | ✅ 可用 |

### 缺失能力 (需补充)

| 能力 | 说明 | 优先级 |
|------|------|--------|
| AI代码补全 | 智谱API集成到CodeMirror | P0 |
| AI代码生成 | 对话→代码 | P0 |
| 智谱全栈模型 | GLM-4等模型接入 | P0 |
| MCP工具集成 | 智谱官方MCP | P1 |
| 本地Ollama推理 | DGX推理服务 | P1 |
| 文件保存 | 本地文件写入 (Electron IPC) | P0 |
| 项目管理 | 打开/创建项目 | P1 |

---

## 二、实施路径: 从IDE开始

### Phase 0: 基础启动 (今天)

**目标**: Matrix在本机跑起来, IDE面板可正常访问

```bash
cd /Volumes/Development/yyc3-77/YYC3-AI-PAI/YYC3-CloudIntelli-Matrix
pnpm install
pnpm dev
# 访问 http://localhost:3218
# 点击侧边栏进入 /ide 路由
```

**验证项**:
- [ ] 页面正常加载
- [ ] /ide 路由可访问
- [ ] CodeEditor显示正常
- [ ] Terminal显示正常
- [ ] FileExplorer显示正常

### Phase 1: 智谱AI集成 (核心突破)

**目标**: AIChatPanel接入智谱API, 实现对话和代码生成

**修改文件**: `src/app/components/ide/AIChatPanel.tsx`

**接入点**:
- 智谱API endpoint: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 模型: glm-4-plus / glm-4-flash
- 认证: 自有API KEY

**实现内容**:
1. AIChatPanel中添加API调用逻辑
2. 流式SSE响应渲染
3. 代码块高亮和复制
4. 对话上下文管理

### Phase 2: 代码编辑增强

**目标**: CodeEditor集成AI辅助

**修改文件**: `src/app/components/CodeEditor.tsx`

**实现内容**:
1. CodeMirror补全扩展 (AI驱动)
2. 快捷键触发AI补全 (Ctrl+Space)
3. 代码解释悬浮提示
4. 错误检测和建议

### Phase 3: 本地文件系统

**目标**: 真实读写本机文件 (通过Electron IPC)

**修改文件**:
- `electron/ipc-handlers.ts` — 添加文件读写IPC
- `src/app/components/ide/FileExplorer.tsx` — 真实文件树

**实现内容**:
1. Electron IPC文件读写
2. 文件树真实加载
3. 文件保存/另存为
4. 文件搜索

### Phase 4: 一体化DevOps集成

**目标**: IDE内集成Matrix的运维能力

**路由映射**:
```
/ide          → IDE主面板 (代码+终端+AI)
/ide/monitor  → 数据监控 (复用DataMonitoring)
/ide/deploy   → 部署面板 (复用DeployDialog)
/ide/patrol   → 巡查管理 (复用PatrolDashboard)
/ide/hotel    → 酒店仪表盘 (复用HotelDashboard)
```

---

## 三、知识库资源映射

| 知识库路径 | 可用资源 | 用途 |
|-----------|---------|------|
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/skills/glmocr/` | GLM OCR技能 | OCR能力 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/vscode-skills/` | VS Code技能 | IDE参考 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/插件系统/` | Agent/MCP/提示词 | AI集成 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/开发智库/` | 开发知识库 | 参考资料 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/autocomplete-specs/` | 自动补全规范 | CLI补全 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/mui-x/` | MUI X组件 | 高级UI组件 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/apollo/` | Apollo配置中心 | 配置管理参考 |
| `/Volumes/Knowledge/YYC3-AI-Skill-KB/redux/` | Redux状态管理 | 状态管理参考 |
| `/Volumes/Development/yyc3-77/F-350/` | BigModelSDK | 智谱SDK参考 |
| `/Volumes/Development/yyc3-77/YYC3-AI‑Code/` | AI Code项目 | IDE参考实现 |
| `/Volumes/Development/yyc3-77/hk-120/` | DevOps hooks | Git/Docker/Terminal hooks |

---

## 四、关键技术决策

### 1. AI接入方式

```
方案: 智谱API直接调用 (不用中间层)
原因: 自有API KEY, 本地闭环, 安全可控

AIChatPanel → fetch(智谱API) → SSE流式渲染
```

### 2. 终端实现

```
方案: 复用现有XtermTerminal (基于@xterm/xterm 6.0)
原因: 已集成, 功能完整

Web端: 模拟终端
Electron: 真实Shell (通过IPC)
```

### 3. 代码编辑器

```
方案: 复用现有CodeEditor (基于@uiw/react-codemirror)
原因: 已支持10种语言, 赛博朋克主题已就绪

增强: 添加AI补全扩展
```

### 4. 文件系统

```
方案: Electron IPC → Node.js fs
Web端: 浏览器File API (受限)
Electron: 完整本地文件访问
```

---

## 五、执行顺序 (从IDE开始)

```
Phase 0: 启动验证              ← 今天
    ↓
Phase 1: 智谱AI集成             ← 核心
    ↓
Phase 2: 代码编辑增强            ← 增值
    ↓
Phase 3: 本地文件系统            ← 实用
    ↓
Phase 4: DevOps一体化            ← 闭环
    ↓
Phase 5: Electron封装            ← 发布
    ↓
Phase 6: 酒店KPI仪表盘          ← 行业化
```

---

## 六、风险控制

| 风险 | 缓解措施 |
|------|---------|
| 智谱API不稳定 | 本地Ollama作为fallback |
| Electron构建失败 | Web版先行, Electron后封装 |
| 现有组件不兼容 | 先验证再修改, 不破坏现有功能 |
| 文件权限问题 | Electron沙箱隔离 |

---

*本文档为实施方案基准, 每个Phase完成后更新进度*
