# YYC³ 运维管理 — 数据架构分布图

> **模块**: 运维管理 (Sidebar: catOps)
> **页面数**: 9
> **生成日期**: 2026-04-26

---

## 模块数据架构总图

```
┌─────────────────────────────────────────────────────────────────┐
│                      运维管理 · 9 页面                            │
│                    文件/数据库/连接/闭环/备份                      │
└─────────────────────────────────────────────────────────────────┘

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ /files      │  │ /host-files │  │ /database   │
  │ 文件管理    │  │ 宿主机文件  │  │ 数据库管理  │
  ├─────────────┤  ├─────────────┤  ├─────────────┤
  │ fs-slice    │  │ Electron IPC│  │ db-conn     │
  │ (persist)   │  │ bridge      │  │ -slice      │
  │             │  │ -client     │  │ (persist)   │
  │ IDB:        │  │             │  │             │
  │ fileVersions│  │ 宿主机文件  │  │ IDB:        │
  │ (CRUD)      │  │ 系统访问    │  │ queryHistory│
  └─────────────┘  └─────────────┘  └─────────────┘

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │/db-connections│ │/connection  │  │ /loop       │
  │ 连接配置    │  │-test        │  │ 服务闭环    │
  ├─────────────┤  ├─────────────┤  ├─────────────┤
  │ db-conn     │  │ Service     │  │ useService  │
  │ -slice      │  │ Connection  │  │ Loop hook   │
  │ (persist)   │  │ Test组件    │  │             │
  │             │  │             │  │ IDB:        │
  │ IDB:        │  │ 连接测试    │  │ loopHistory │
  │ dbConnections│  │ 实时执行   │  │ (CRUD)      │
  │ (CRUD)      │  │             │  │             │
  └─────────────┘  └─────────────┘  └─────────────┘

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ /reports    │  │ /export     │  │ /self-heal  │
  │ 报表导出    │  │ -center     │  │ 自愈引擎    │
  ├─────────────┤  ├─────────────┤  ├─────────────┤
  │ useReport   │  │ Config      │  │ SelfHeal    │
  │ hook        │  │ ExportCenter│  │ Panel       │
  │             │  │             │  │             │
  │ IDB:        │  │ IndexedDB   │  │ HTTP fetch  │
  │ reports     │  │ 全量导出    │  │ :3114 API   │
  │ (CRUD)      │  │ /导入       │  │ (可选)      │
  └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 页面数据源详解

### 1. 文件管理 `/files` — LocalFileManager.tsx
- **Slice**: `fs-slice` → `yyc3-fs` (persist)
- **IDB**: `fileVersions` — 文件版本历史
- **CRUD**: ✅ 完整

### 2. 宿主机文件 `/host-files` — HostFileManager.tsx
- **数据源**: Electron IPC `bridge-client.ts` → `window.yyc3.readFile/writeFile/list`
- **降级**: 非 Electron 环境下使用模拟文件树

### 3. 数据库管理 `/database` — DatabaseManager.tsx
- **Slice**: `db-conn-slice` → `yyc3-db-conn-slice` (persist)
- **IDB**: `queryHistory` — 查询历史
- **CRUD**: ✅ 完整

### 4. 连接配置 `/db-connections` — DatabaseConnectionPanel.tsx
- **Slice**: `db-conn-slice` → `yyc3-db-conn-slice` (persist)
- **IDB**: `dbConnections` — 连接配置
- **CRUD**: ✅ 完整

### 5. 连接测试 `/connection-test` — ServiceConnectionTest.tsx
- **数据源**: 实时执行连接测试（HTTP/TCP/Ping）
- **存储**: 无持久化，测试结果仅在内存

### 6. 服务闭环 `/loop` — ServiceLoopPanel.tsx
- **Hook**: `useServiceLoop()` → `usePersistedList("loopHistory")`
- **IDB**: `loopHistory` — 闭环历史
- **CRUD**: ✅ 完整

### 7. 报表导出 `/reports` — ReportExporter.tsx
- **Hook**: `useReportGenerator()` → `usePersistedList("reports")`
- **IDB**: `reports` — 报表数据
- **CRUD**: ✅ 完整

### 8. 数据备份 `/export-center` — ConfigExportCenter.tsx
- **数据源**: `yyc3-storage.ts` — IndexedDB 全量导出/导入
- **覆盖**: 24 个 IDB Stores + 所有 Zustand Slice 数据

### 9. 自愈引擎 `/self-heal` — SelfHealPanel.tsx
- **数据源**: HTTP fetch `localhost:3114` (可选后端服务)
- **降级**: 后端不可用时显示离线状态

---

*YYC³ 数据架构文档 · 运维管理 · 2026-04-26*
