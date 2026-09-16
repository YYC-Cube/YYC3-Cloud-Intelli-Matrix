# YYC³ 开发工具 + 管理后台 — 数据架构分布图

> **模块**: dev (开发工具 7 页) + admin (管理后台 9 页)
> **数据来源**: Sidebar.tsx NAV_CATEGORIES 实码验证
> **生成日期**: 2026-04-26 (v2 修正版)

---

## 一、开发工具 (dev) · 7 页面

```
┌─────────────────────────────────────────────────────────────────┐
│                    开发工具 · 7 页面                              │
│              Sidebar id: "dev" · icon: Code2                    │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │/design-system│  │ /dev-guide   │  │ /theme       │  │ /terminal    │
  │ 设计系统     │  │ 开发指南     │  │ 主题定制     │  │ 终端         │
  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ Design       │  │ DevGuide     │  │ Theme        │  │ CLI          │
  │ SystemPage   │  │ Page         │  │ Customizer   │  │ Terminal     │
  │              │  │              │  │              │  │              │
  │ CSS 变量展示 │  │ 静态文档     │  │ ui-prefs     │  │ 内存命令     │
  │ 组件库展示   │  │ 无数据存储   │  │ -slice       │  │ 历史         │
  │              │  │              │  │ (persist)    │  │ 无持久化     │
  │ 静态        │  │              │  │              │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /ide         │  │ /refactoring │  │ /architecture│
  │ IDE 面板     │  │ 重构分析     │  │ 架构审计     │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ IDEPanel     │  │ Refactoring  │  │ Architecture │
  │ → IDELayout  │  │ Report       │  │ Audit        │
  │              │  │              │  │              │
  │ ide-settings │  │ 代码分析     │  │ 架构扫描     │
  │ -slice       │  │ (运行时)     │  │ (运行时)     │
  │ (persist)    │  │              │  │              │
  │              │  │ 无持久化     │  │ 无持久化     │
  │ IDB:         │  │              │  │              │
  │ committed    │  │              │  │              │
  │ Changes      │  │              │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘
```

### IDE 模块内部架构

```
IDELayout.tsx
├── IDEFileExplorer    → Electron IPC / 模拟文件树
├── IDEEditorArea
│   ├── CodeEditor.tsx → CodeMirror 6 (8 语言)
│   └── IDETabs        → 文件标签管理
├── AICodeChatPanel    → useBigModelSDK() (智谱/DS/Ollama)
├── IDETerminal.tsx    → xterm.js
├── GitPanel.tsx       → IDB: committedChanges
└── IDESettingsPanel   → ide-settings-slice
```

---

## 二、管理后台 (admin) · 9 页面

```
┌─────────────────────────────────────────────────────────────────┐
│                    管理后台 · 9 页面                              │
│              Sidebar id: "admin" · icon: ShieldCheck            │
│              全局系统设定 · 核心枢纽                              │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /audit       │  │ /users       │  │ /settings    │
  │ 操作审计     │  │ 用户管理     │  │ 系统设置     │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ log-slice    │  │ user-mgmt    │  │ model-slice  │
  │ (persist)    │  │ -slice       │  │ (persist)    │
  │              │  │ (persist)    │  │              │
  │ useLogSlice()│  │              │  │ useModel     │
  │ → logs       │  │ users[]      │  │ Provider()   │
  │ → mapLogTo   │  │ roles[]      │  │ useSettings  │
  │ Audit()      │  │              │  │ Store()      │
  │              │  │ 完整 CRUD    │  │              │
  │ 筛选/分页    │  │              │  │ AI 连接测试  │
  │ 详情查看     │  │              │  │ 提供商管理   │
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
  │ 多 Slice     │  │ 网络扫描     │  │ SW 状态      │
  │ 聚合面板     │  │ 端口检测     │  │ 缓存管理     │
  │              │  │ 漏洞扫描     │  │ 安装提示     │
  │ 读取多个     │  │              │  │              │
  │ Slice 状态   │  │ 运行时计算   │  │              │
  │ 无独立存储   │  │ 无持久化     │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ /data-editor │  │ /performance │  │ /env-config  │
  │ 数据编辑器   │  │ 性能监控     │  │ 环境变量     │
  ├──────────────┤  ├──────────────┤  ├──────────────┤
  │ DataEditor   │  │ Performance  │  │ EnvConfig    │
  │ Panel        │  │ Monitor      │  │ Editor       │
  │              │  │              │  │              │
  │ node-slice   │  │ useWebSocket │  │ api-config   │
  │ 直接编辑     │  │ Data() Hook  │  │ .ts          │
  │              │  │              │  │              │
  │ 节点数据     │  │ node-slice   │  │ get/set      │
  │ 表格化编辑   │  │ metrics-slice│  │ APIConfig()  │
  │ CRUD: ✅     │  │              │  │ → localStorage│
  │              │  │ 实时监控     │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 三、admin 数据流汇总

```
管理后台 9 页面数据源:

  有 Zustand Slice (persist):
  ├── /audit        → log-slice (yyc3-log-slice)
  ├── /users        → user-mgmt-slice (yyc3-user-mgmt-slice)
  ├── /settings     → model-slice (yyc3-model-slice) + provider-slice
  ├── /data-editor  → node-slice (yyc3-node-slice)
  └── /performance  → node-slice + metrics-slice (实时)

  有 Hook (无持久化):
  ├── /security     → useSecurityMonitor() (运行时扫描)
  └── /pwa          → usePWAManager() (SW 状态)

  有 localStorage 配置:
  ├── /env-config   → api-config.ts → localStorage
  └── /settings     → useSettingsStore() → localStorage

  聚合面板:
  └── /unified-settings → 读取多个 Slice 状态
```

---

*YYC³ 数据架构文档 · 开发工具 + 管理后台 · 2026-04-26 (v2 修正版)*
