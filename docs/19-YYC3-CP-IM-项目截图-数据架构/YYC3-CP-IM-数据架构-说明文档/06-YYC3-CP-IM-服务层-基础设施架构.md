# YYC³ 服务层与基础设施 — 数据架构分布图

> **模块**: 服务层 + 基础设施 + 全局支撑
> **涵盖**: 后端脚本 / Electron / PWA / 认证 / 全局 Hooks
> **生成日期**: 2026-04-26

---

## 服务层架构总图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    服务层 · 基础设施 · 全局支撑                           │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌──────────┐
                        │ 浏览器    │
                        │ React App│
                        └────┬─────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐    │    ┌─────────▼─────────┐
     │ Vite Dev Server  │    │    │ Electron Desktop   │
     │ :3218            │    │    │ (main + preload)   │
     │                  │    │    │                    │
     │ Proxy Rules:     │    │    │ IPC Bridge:        │
     │ /api/v1/db/*     │    │    │ window.yyc3.*      │
     │   → :3299        │    │    │  readFile          │
     │ /api/v1/heal/*   │    │    │  writeFile         │
     │   → :3114        │    │    │  list              │
     │ /api/v1/improve/*│    │    │  db:execute        │
     │   → :3115        │    │    │  db:query          │
     │ /api/v1/llm/*    │    │    │  systemMonitor     │
     │   → :11434       │    │    │  shell.execute     │
     └─────────────────┘    │    └────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──┐  ┌───────▼──────┐  ┌───▼────────┐
     │ DB Proxy  │  │ SSE Bridge   │  │ Ollama     │
     │ :3299     │  │ :3113        │  │ :11434     │
     │           │  │              │  │ (本地)     │
     │ PostgreSQL│  │ PostgreSQL   │  │            │
     │ :5433     │  │ :5433        │  │ 本地模型   │
     │ yyc3_aify │  │ → SSE 推送   │  │ 推理服务   │
     └───────────┘  └──────────────┘  └────────────┘

     ┌───────────┐  ┌──────────────┐
     │ Self-Heal │  │ Self-Improve │
     │ Engine    │  │ Engine       │
     │ :3114     │  │ :3115        │
     │           │  │              │
     │ 30s 探针  │  │ 每小时审计   │
     │ L1/L2 恢复│  │ 依赖/构建/   │
     │ 6 设备    │  │ 质量分析     │
     └───────────┘  └──────────────┘
```

---

## 后端脚本服务矩阵

| 服务 | 脚本 | 端口 | 数据源 | 协议 | 必需性 |
|------|------|------|--------|------|--------|
| DB Proxy | `scripts/db-proxy-server.js` | :3299 | PostgreSQL :5433 | HTTP REST | ⚠️ 可选 |
| SSE Bridge | `scripts/sse-data-bridge.js` | :3113 | PostgreSQL :5433 | SSE + WS | ⚠️ 可选 |
| Metrics Ingestor | `scripts/metrics-ingestor.js` | — | PostgreSQL :5433 | 写入 | ⚠️ 可选 |
| Self-Heal Engine | `scripts/self-heal-engine.js` | :3114 | ping + SSH | HTTP REST | ⚠️ 可选 |
| Self-Improve Engine | `scripts/self-improve-engine.js` | :3115 | 项目文件 | HTTP REST | ⚠️ 可选 |

> **关键**: 所有后端脚本均为**零依赖** Node.js 脚本，使用 `child_process.execSync` + `psql` CLI。前端**不依赖**这些服务运行，降级到模拟模式。

---

## 全局支撑 Hooks

### 数据层 Hooks

| Hook | 文件 | 功能 | 降级 |
|------|------|------|------|
| `useWebSocketData()` | hooks/useWebSocketData.ts | WS→SSE→模拟 三级降级 | ✅ 模拟 |
| `useSSEData()` | hooks/useSSEData.ts | SSE 数据接收 | ✅ 不连接 |
| `useClock()` | hooks/useClock.ts | 真实时钟 (1s 更新) | — |
| `useI18n()` | hooks/useI18n.ts | 国际化 (zh-CN/en-US) | — |
| `usePersistedList()` | hooks/usePersistedState.ts | IndexedDB CRUD | ✅ 内存 |
| `usePersistedState()` | hooks/usePersistedState.ts | 单值持久化 | ✅ 内存 |

### AI 层 Hooks

| Hook | 文件 | 功能 |
|------|------|------|
| `useBigModelSDK()` | hooks/useBigModelSDK.ts | 3 提供商 AI SDK |
| `useModelProvider()` | hooks/useModelProvider.ts | 提供商状态管理 |
| `useEmotionMusic()` | hooks/useEmotionMusic.ts | 情感音乐分析 |
| `useAudioEngine()` | hooks/useAudioEngine.ts | Web Audio API 播放 |

### 系统 Hooks

| Hook | 文件 | 功能 |
|------|------|------|
| `useSecurityMonitor()` | hooks/useSecurityMonitor.ts | 网络安全扫描 |
| `usePWAManager()` | hooks/usePWAManager.ts | PWA 状态管理 |
| `useMobileView()` | hooks/useMobileView.ts | 响应式检测 |
| `usePageConfig()` | hooks/usePageConfig.ts | 页面配置 |

---

## 数据库实例

| 实例 | 主机 | 端口 | 数据库 | 用途 |
|------|------|------|--------|------|
| 本机 PostgreSQL | localhost | 5433 | yyc3_aify | AI Family / GPU 集群 |
| 本机 PostgreSQL | localhost | 5433 | yyc3_music | 音乐项目 |
| 本机 PostgreSQL | localhost | 5433 | yyc3_core | 核心共享 |
| 本机 PostgreSQL | localhost | 5433 | yyc3_my | 用户数据 |
| 本机 PostgreSQL | localhost | 5433 | yyc3_mcp | MCP 工具 |
| NAS PostgreSQL | 192.168.3.45 | 5432 | yyc3_kb | 知识库 |
| iMac PostgreSQL | 192.168.3.77 | 5434 | — | 辅助运维 |

---

## 设备集群

| 设备 | IP | 状态 | 角色 |
|------|-----|------|------|
| yyc3-22 | 192.168.3.22 | ✅ | MacBook M4 Max · 开发中枢 · 128GB |
| yyc3-77 | 192.168.3.77 | ✅ | iMac M4 · 辅助运维 · 32GB |
| yyc3-66 | 192.168.3.66 | ✅ | MateBook Pro · 环境补充 · 32GB |
| yyc3-45 | 192.168.3.45 | ✅ | NAS F4-423 · 存储服务 · yyc3_kb |
| yyc3-33 | 39.97.53.176 | ✅ | ECS 北京 · API 服务 · 8GB |
| yyc3-202 | 47.94.135.202 | ✅ | ECS 备用 · 8GB |
| yyc3-101 | 192.168.3.101 | ⏳ | DGX Spark Blackwell · 算力 N1 |
| yyc3-102 | 192.168.3.102 | ⏳ | DGX Spark Blackwell · 算力 N2 |

---

## 认证系统

```
┌─────────────────────────────────────────────────────┐
│                   认证流程                            │
│                                                     │
│  VITE_SUPABASE_URL 已配置?                          │
│       │         │                                   │
│      YES       NO                                   │
│       │         │                                   │
│  Supabase    MockSupabaseClient                     │
│  真实认证     ├─ admin@cloudpivot.local (admin)      │
│              ├─ dev@cloudpivot.local (developer)     │
│              └─ GHOST MODE 按钮跳过认证              │
│                                                     │
│  Session: localStorage 'yyc3_session'               │
│  Context: AuthContext → useAuth() Hook               │
└─────────────────────────────────────────────────────┘
```

---

## PWA 架构

```
┌─────────────────────────────────────────────────────┐
│                   PWA 离线架构                        │
│                                                     │
│  Service Worker                                      │
│  ├── 缓存策略: Cache First + Network Fallback       │
│  ├── 离线回退: /offline.html                        │
│  └── 更新: skipWaiting + 刷新提示                    │
│                                                     │
│  usePWAManager() Hook                                │
│  ├── installPrompt → 安装提示                        │
│  ├── swStatus → Service Worker 状态                  │
│  └── isOnline / isOffline → 网络状态                 │
│                                                     │
│  离线队列                                             │
│  ├── offline-slice → yyc3-offline (persist)          │
│  └── backgroundSync.ts → 后台同步队列                 │
│                                                     │
│  图标                                                │
│  ├── yyc3-icons/Web App/ (favicon, PWA)             │
│  ├── yyc3-icons/macOS/ (16-1024px)                  │
│  ├── yyc3-icons/Android/ (mdpi-xxxhdpi)             │
│  ├── yyc3-icons/iOS/ (所有尺寸)                      │
│  └── yyc3-icons/watchOS/ (所有尺寸)                  │
└─────────────────────────────────────────────────────┘
```

---

*YYC³ 数据架构文档 · 服务层与基础设施 · 2026-04-26*
