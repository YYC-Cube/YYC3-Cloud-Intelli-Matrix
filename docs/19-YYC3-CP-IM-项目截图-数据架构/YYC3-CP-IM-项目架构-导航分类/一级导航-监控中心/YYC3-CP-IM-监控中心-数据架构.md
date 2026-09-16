# YYC³ 监控中心 — 数据架构分布图

> **模块**: 监控中心 (Sidebar: catMonitor)
> **页面数**: 5
> **生成日期**: 2026-04-26

---

## 模块数据架构总图

```
┌─────────────────────────────────────────────────────────────────┐
│                      监控中心 · 5 页面                            │
│                    数据驱动 · 实时监控                            │
└─────────────────────────────────────────────────────────────────┘

              ┌──────────────────────────────┐
              │    useWebSocketData Hook      │
              │    WS → SSE → 模拟 三级降级    │
              └──────┬──────────┬─────────────┘
                     │          │
              ┌──────▼──┐  ┌───▼───────┐
              │node-slice│  │metrics-slice│
              │8 节点    │  │QPS/延迟/吞吐│
              │persist   │  │persist     │
              └──────┬──┘  └───┬───────┘
                     │         │
     ┌───────────────┼─────────┼───────────────┐
     │               │         │               │
┌────▼────┐   ┌─────▼───┐ ┌──▼────────┐ ┌────▼─────┐
│ /       │   │/follow  │ │/patrol    │ │/alerts   │
│ 数据监控│   │一键跟进 │ │巡查模式   │ │告警规则  │
│         │   │         │ │           │ │          │
│Dashboard│   │FollowUp │ │Patrol     │ │AlertRules│
│ Panel   │   │Panel    │ │Dashboard  │ │Panel     │
└─────────┘   └─────────┘ └───────────┘ └──────────┘
     │               │         │               │
     └───────────────┼─────────┼───────────────┘
                     │         │
              ┌──────▼─────────▼──────┐
              │   follow-up-slice     │
              │   (跟进记录 persist)   │
              │   useAlerts adapter   │
              └───────────────────────┘

              ┌───────────────────────┐
              │   IndexedDB Stores    │
              │   alertRules (CRUD)   │
              │   alertEvents (CRUD)  │
              │   patrolHistory (CRUD)│
              │   dashboardSnapshots  │
              └───────────────────────┘

┌──────┐
│/oper │
│协同  │
│管理  │
│      │
│Oper  │
│Center│
└──────┘
     │
     └──→ usePersistedList
          operationTemplates
          operationLogs
```

---

## 页面数据源详解

### 1. 数据监控 `/` — Dashboard.tsx

| 数据 | 来源 | 存储 | 可编辑 |
|------|------|------|--------|
| 8 GPU/TPU 节点 | `useNodeSlice()` → `node-slice` | `yyc3-node-slice` (persist) | ✅ DataEditorPanel |
| QPS/延迟/吞吐量 | `useMetricsSlice()` → `metrics-slice` | `yyc3-metrics-slice` (persist) | ❌ 只读 |
| 实时推送 | `useWebSocketData()` → WS/SSE/模拟 | 内存 (定时刷新) | ❌ 只读 |
| 节点详情 | NodeDetailModal | 从 node-slice 读取 | ❌ |

**数据流**:
```
WS(:3113/ws) / SSE(:3113/sse) / setInterval
    → useWebSocketData()
    → DataBus.mergeNodeData() (遥测字段合并)
    → useNodeSlice.getState().upsertNode()
    → Dashboard 渲染
```

### 2. 一键跟进 `/follow-up` — FollowUpPanel.tsx

| 数据 | 来源 | 存储 | 可编辑 |
|------|------|------|--------|
| 跟进记录 | `useFollowUpSlice()` → `follow-up-slice` | `yyc3-follow-up-slice` (persist) | ✅ CRUD |
| 告警列表 | `useAlerts()` adapter → `useFollowUpSlice` | 同上 | ✅ |

### 3. 巡查模式 `/patrol` — PatrolDashboard.tsx

| 数据 | 来源 | 存储 | 可编辑 |
|------|------|------|--------|
| 巡查记录 | `usePatrol()` → `usePersistedList("patrolHistory")` | IndexedDB `patrolHistory` | ✅ CRUD |
| 检查项 | `generateChecks()` — 随机生成 | 内存 | ❌ |

### 4. 告警规则 `/alerts` — AlertRulesPanel.tsx

| 数据 | 来源 | 存储 | 可编辑 |
|------|------|------|--------|
| 告警规则 | `useAlertRules()` → `usePersistedList("alertRules")` | IndexedDB `alertRules` | ✅ CRUD |
| 告警事件 | `useAlertRules()` → `usePersistedList("alertEvents")` | IndexedDB `alertEvents` | ✅ CRUD |

### 5. 协同管理 `/operations` — OperationCenter.tsx

| 数据 | 来源 | 存储 | 可编辑 |
|------|------|------|--------|
| 操作模板 | `useOperationCenter()` → `usePersistedList("operationTemplates")` | IndexedDB `operationTemplates` | ✅ CRUD |
| 操作日志 | `useOperationCenter()` → `usePersistedList("operationLogs")` | IndexedDB `operationLogs` | ✅ CRUD |

---

*YYC³ 数据架构文档 · 监控中心 · 2026-04-26*
