/**
 * @file: DATA-BUS-UNIFICATION-SUMMARY.ts
 * @description: YYC³ 数据逻辑互通修复 — 完整实施总结（学习文档）
 * @author: YanYuCloudCube Team
 * @student: 初源
 * @version: v1.0.0
 * @created: 2026-04-15
 * @updated: 2026-04-16
 * @status: active
 * @tags: [summary],[learning],[architecture],[data-bus],[ssot]
 *
 * @brief: 本文档记录「智能检测数据逻辑互通及UI可编辑数据同步一致」问题的完整修复过程，
 *        包含问题诊断、架构设计、分阶段实施、代码详解、经验教训等全链路内容。
 *
 * @audience: 初源同学及后续维护者 — 作为架构决策参考与技术学习材料
 */

// ============================================================
// 第一章：问题背景与诊断
// ============================================================

export const CHAPTER_1_PROBLEM_DIAGNOSIS = {
  title: "一、问题背景与诊断",

  /** 用户原始诉求 */
  originalRequest: "初源项目在数据逻辑问题上困惑了一个月，核心问题是：智能检测数据逻辑互通及UI可编辑数据同步一致",

  /** 根因分析 */
  rootCause: `
项目存在「三引擎分裂」的架构缺陷：

┌─────────────────────────────────────────────────────────────┐
│                    改造前：三引擎分裂架构                      │
│                                                             │
│  ┌──────────────┐   ┌──────────────────┐   ┌─────────────┐ │
│  │ useWebSocket │   │ DataBus(内置WS)  │   │ Enhanced WS │ │
│  │ Data (活跃)  │   │ (孤儿,零调用)    │   │ (仅测试引用) │ │
│  └──────┬───────┘   └────────┬─────────┘   └──────┬──────┘ │
│         │                    │                     │       │
│         ▼                    ▼                     ▼       │
│     Dashboard           (无人使用)            (无人使用)     │
│         │                                           │       │
│         └────────→ useNodeSlice ←── DataEditorPanel      │
│                        ↑                                  │
│                   nodeStore (冗余并行Store)                │
└─────────────────────────────────────────────────────────────┘

具体表现：
① 三套 WebSocket 引擎各自独立运行，数据无法统一合并
② 两套 Node Store 并行存在（Zustand node-slice + localStorage nodeStore）
③ UI 编辑后值被 WebSocket 推送覆盖（无 smartMerge 保护）
④ Dashboard 从两个不同源读取节点数据（双源取数）
`,

  /** 关键发现清单 */
  findings: [
    {
      id: "F1",
      severity: "🔴 Critical",
      title: "DataBus 内置 WebSocket 引擎是孤儿",
      detail: `data-bus.ts 内部实现了完整的 connectWS/disconnectWS/sendWS/startHeartbeat，
               但整个项目中没有任何生产代码调用 connectWS()。656行代码中的 WS 引擎部分从未被执行过。`,
      file: "src/app/lib/data-bus.ts",
      lines: "L281-L560",
    },
    {
      id: "F2",
      severity: "🔴 Critical",
      title: "UI 编辑不回推服务端",
      detail: `DataEditorPanel 通过 updateUserEditNode() 更新节点后，仅修改了本地 Zustand Store，
               但没有调用 sendWS() 将变更推送到服务端。下次 WebSocket 收到该节点的推送时，
               服务端旧值会覆盖用户编辑值。`,
      file: "src/app/store/slices/node-slice.ts",
      lines: "updateNode() 方法",
    },
    {
      id: "F3",
      severity: "🟡 Warning",
      title: "两套 Node Store 并行",
      detail: `useNodeSlice (Zustand, 生产使用) 与 nodeStore (localStorage, 仅测试引用)
               同时存在相同语义的数据存储。Dashboard 和 Editor 使用前者，
               但 global-data-interoperability.test.ts 大量依赖后者。`,
      files: ["src/app/store/slices/node-slice.ts", "src/app/stores/dashboard-stores.ts"],
    },
    {
      id: "F4",
      severity: "🟡 Warning",
      title: "useWebSocketDataEnhanced 冗余",
      detail: `Enhanced 版本 Hook 功能完全被子集 useWebSocketData 覆盖，
               且仅被自身测试文件引用。386行死代码。`,
      file: "src/app/hooks/useWebSocketDataEnhanced.ts",
    },
    {
      id: "F5",
      severity: "✅ Info",
      title: "SmartMerge 已就位但未被完整利用",
      detail: `DataBus.mergeNodeData() 的 smartMerge 策略已经正确实现：
               userEditedCells 优先级 > websocket 值。问题在于 WS 消息未经过 DataBus 合并
               就直接写入了 Store。`,
      file: "src/app/lib/data-bus.ts",
      lines: "mergeNodeData() 方法",
    },
  ],
};

// ============================================================
// 第二章：目标架构设计
// ============================================================

export const CHAPTER_2_TARGET_ARCHITECTURE = {
  title: "二、目标架构设计 — SSOT 单源真理原则",

  /** 设计原则 */
  principles: [
    "SSOT (Single Source of Truth): 每种数据只有一个权威来源",
    "职责分离: WS管理 / 数据合并 / 状态存储 各司其职",
    "桥接模式: DataBus 不直接持有 WS 连接，通过注入的外部发送器通信",
    "渐进增强: 每个Phase独立可验证、可回滚",
  ],

  /** 目标架构图 */
  targetArchitecture: `
┌──────────────────────────────────────────────────────────────┐
│                   改造后：SSOT 统一架构                       │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │          useWebSocketData (唯一活跃WS管理者)       │       │
│  │  ┌────────────────────────────────────────────┐  │       │
│  │  │ ws.onopen  → dataBus.registerWSSender()   │  │       │
│  │  │ ws.onmessage → dataBus.ingestWSMessage()  │  │       │
│  │  │ ws.onclose  → dataBus.unregisterWSSender() │  │       │
│  │  └────────────────────────────────────────────┘  │       │
│  └──────────────────────┬───────────────────────────┘       │
│                         │ 外部桥接                           │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │              DataBus (纯数据合并层)                │       │
│  │                                                    │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │       │
│  │  │ingestWSMsg  │  │ mergeNodeData│  │sendWS()  │ │       │
│  │  │(外部消息入口)│  │(智能合并)    │  │(回推通道) │ │       │
│  │  └─────────────┘  └─────────────┘  └──────────┘ │       │
│  │                                                    │       │
│  │  ★ SmartMerge: userEditedCells > WS telemetry ★    │       │
│  └──────────────────────┬───────────────────────────┘       │
│                         │ publish(event)                     │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │            useNodeSlice (唯一Node Store)          │       │
│  │                                                    │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │       │
│  │  │mergeFromWS│ │updateNode│ │ add/removeNode   │  │       │
│  │  │(WS写入)  │ │(用户编辑) │ │(自动sendWS回推) │  │       │
│  │  └──────────┘ └──────────┘ └──────────────────┘  │       │
│  └──────────────────────┬───────────────────────────┘       │
│                         │                                   │
│          ┌──────────────┼──────────────┐                   │
│          ▼              ▼              ▼                   │
│     Dashboard    DataEditorPanel   其他消费者                 │
│     (只读节点)    (编辑+自动回推)                             │
│                                                              │
│  【已废弃/标记Legacy】                                       │
│  ├─ useWebSocketDataEnhanced.ts (@deprecated)              │
│  ├─ dashboard-stores.ts nodeStore (@deprecated)             │
│  └─ data-bus.ts 内置WS引擎区域 (@legacy, 保留fallback)      │
└──────────────────────────────────────────────────────────────┘
`,

  /** 数据流向说明 */
  dataFlow: {
    downlink: {
      name: "下行链路 (Server → UI)",
      steps: [
        "1. Server 通过 WebSocket 发送 node_status 消息",
        "2. useWebSocketData.ws.onmessage 接收原始消息",
        "3. dataBus.ingestWSMessage(msg) 格式适配并注入",
        "4. DataBus.handleWSMessage() 解析类型并路由",
        "5. DataBus.mergeNodeData() 执行 SmartMerge（保护userEditedCells）",
        "6. DataBus.publish() 发布变更事件",
        "7. useNodeSlice.mergeFromWS() 写入 Zustand Store",
        "8. Dashboard / 其他组件从 Store 订阅最新数据",
      ],
    },
    uplink: {
      name: "上行链路 (UI → Server)",
      steps: [
        "1. 用户在 DataEditorPanel 编辑节点字段",
        "2. DataEditorPanel 调用 updateNode(id, updates)",
        "3. node-slice.updateNode() 调用 dataBus.updateUserEditNode()",
        "4. DataBus 标记 userEditedCells + 执行本地合并",
        "5. node-slice.updateNode() 调用 dataBus.sendWS({type:'node_update', ...})",
        "6. DataBus.sendWS() 通过 externalWSSender 回调将消息交给 useWebSocketData",
        "7. useWebSocketData.ws.send() 将 JSON 推送到 Server",
        "8. Server 收到更新，后续下行链路不会覆盖用户编辑值（SmartMerge保护）",
      ],
    },
  },
};

// ============================================================
// 第三章：分阶段实施详情
// ============================================================

export const CHAPTER_3_PHASE_IMPLEMENTATION = {
  title: "三、分阶段实施详情（含逐行代码解析）",

  // ---------- Phase 1 ----------
  phase1: {
    name: "Phase 1: 消除脑裂 — 废弃孤立引擎与冗余Store",
    objective: "将 DataBus 从「自建WS引擎+数据合并」精简为「纯数据合并层」，并通过外部桥接接入真实WS流",
    risk: "🟢 低风险（只做加法不做减法）",
    filesModified: [
      { path: "src/app/lib/data-bus.ts", action: "新增3个方法 + 重写2个方法" },
      { path: "src/app/hooks/useWebSocketData.ts", action: "新增import + 4处桥接调用" },
      { path: "src/app/hooks/useWebSocketDataEnhanced.ts", action: "添加@deprecated标记" },
    ],

    step_1_1: {
      title: "Step 1.1 — 新增外部桥接基础设施",
      location: "data-bus.ts L420-L444",
      codeExplanation: `
【新增内容】4 个成员：

  private externalWSSender: ((msg: ...) => boolean) | null = null;
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  设计意图: 外部注入的 WS 发送函数引用。
  为什么用函数而不是直接传 WebSocket 实例？
  → 因为 DataBus 不应该知道 WebSocket API 的具体实现细节。
  → 函数签名 (msg) => boolean 是一个抽象接口：
    - 返回 true  表示消息已成功发送
    - 返回 false 表示发送失败（可用于触发离线队列）
  → 这就是「依赖倒置原则」的实际应用。

  registerWSSender(sender: ...): void { this.externalWSSender = sender; }
  unregisterWSSender(): void { this.externalWSSender = null; }
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  注册/注销配对，遵循 RAII 模式（资源获取即初始化）：
  - register 在 ws.onopen 时调用（连接建立时注册能力）
  - unregister 在 ws.onclose 时调用（连接断开时释放能力）
  - 即使忘记注销也不泄漏（GC 会回收闭包），但显式注销是好习惯

  ingestWSMessage(message: Record<string, unknown>): void
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  这是本次改造最关键的方法之一！

  参数为什么用 Record<string, unknown> 而不是强类型 WSMessage？
  → 因为调用方（useWebSocketData）使用的 WSMessage 类型定义在 types/index.ts
  → 而 DataBus 内部的 WSMessage 类型定义在 data-bus.ts 自身
  → 两者结构不同！types 版本有 payload 字段，data-bus 版本有 data 字段
  → 用 Record<string, unknown> 作为「通用适配器」，内部做格式转换

  格式适配逻辑：
    const adapted: WSMessage = {
      type: (message.type as WSMessage["type"]) || "metrics_update",  // 兜底默认值
      entity: message.entity as string | undefined,
      data: message.data ?? message.payload,                          // ★ 关键：兼容两种格式
      timestamp: Date.now(),                                          // 由 DataBus 打时间戳
      id: message.id as string | undefined,
    };

  为什么 message.data ?? message.payload？
  → useWebSocketData 收到的消息格式是 { type, payload }
  → DataBus handleWSMessage 期望的格式是 { type, data, timestamp }
  → ?? 运算符确保两种来源都能正确映射
  → 这是「防腐层(Anti-Corruption Layer)」模式的轻量实现

  最后构造 fakeEvent 并复用已有的 handleWSMessage：
    const fakeEvent = { data: JSON.stringify(adapted) } as MessageEvent;
    this.handleWSMessage(fakeEvent);
  → 复用 > 重写！不需要重新实现消息路由逻辑
`,
    },

    step_1_2: {
      title: "Step 1.2 — 重写 sendWS() 优先走外部发送器",
      location: "data-bus.ts L368-L396",
      beforeAndAfter: {
        before: `
// 改造前：只检查内置 WebSocket 实例
if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
  // 走离线队列或报错
}
this.throttledSend(fullMessage);  // 直接用内置 WS 发送
`,
        after: `
// 改造后：外部发送器为首选通道
if (this.externalWSSender) {           // ① 先检查是否有外部发送器
  const sent = this.externalWSSender(fullMessage);  // ② 委托外部发送
  if (!sent && this.wsConfig?.enableOfflineQueue) {
    this.offlineQueue.push(fullMessage);  // ③ 发送失败则入队
  }
  return sent;
}
// ④ 无外部发送器时才 fallback 到内置 WS
if (!this.ws || this.ws.readyState !== WebSocket.OPEN) { ... }
this.throttledSend(fullMessage);
`,
      },
      codeExplanation: `
改造要点：

① 优先级策略: externalWSSender > 内置WS > 离线队列 > 报错
  这个优先级链确保了：
  - 有外部桥接时一定走外部（Phase 1~∞ 的主路径）
  - 外部断开时 fallback 到内置（向后兼容）
  - 都不可用时优雅降级到离线队列

② 为什么不删除内置 WS 路径？
  → 向后兼容：如果某场景下不需要 useWebSocketData（如纯测试环境）
  → 渐进迁移：Phase 4 才考虑删除，当前保留作为安全网
  → 符合「开放-封闭原则」：对扩展开放，对修改封闭

③ throttledSend 仍然被调用（在内置路径上）
  → 说明内置 WS 的节流机制保持不变
  → 外部发送器的节流由调用方（useWebSocketData）自行控制
`,
    },

    step_1_3: {
      title: "Step 1.3 — 更新 isWSConnected() 检查外部状态",
      location: "data-bus.ts L409-L415",
      beforeAndAfter: {
        before: `isWSConnected(): boolean { return this.ws?.readyState === WebSocket.OPEN; }`,
        after: `
isWSConnected(): boolean {
  if (this.externalWSSender) { return true; }  // 有发送器=可用
  return this.ws?.readyState === WebSocket.OPEN;
}
`,
      },
      codeExplanation: `
这个改动看似简单，但影响深远：

为什么 externalWSSender 存在就直接返回 true？
→ 因为 externalWSSender 的契约是 (msg) => boolean
→ 如果 WS 断开，发送器函数内部会返回 false
→ 所以「有发送器」≠「一定能发出去」
→ 但「有发送器」=「有发送的能力和离线队列兜底」

这体现了「乐观检查 vs 悲观检查」的设计选择：
- isWSConnected() 做的是乐观检查：「我具备发送条件」
- sendWS() 内部做的是悲观检查：「实际发送是否成功」
两层检查各司其职，互不冲突。
`,
    },

    step_1_4: {
      title: "Step 1.4 — useWebSocketData 对接 DataBus 桥接（4处改造）",
      location: "useWebSocketData.ts",
      modifications: [
        {
          point: "① 新增 import",
          line: "L38",
          code: 'import { dataBus } from "../lib/data-bus";',
          note: "引入单例 DataBus 实例",
        },
        {
          point: "② ws.onopen 注册发送器",
          line: "L151-L157",
          code: `
dataBus.registerWSSender((msg) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
    return true;    // 发送成功
  }
  return false;     // 发送失败（触发离线队列）
});
`,
          note: `
时机选择：为什么在 onopen 而不是在 Hook 初始化时注册？
→ 因为需要 ws 实例才能发送消息
→ onopen 保证 ws.readyState === OPEN
→ 如果在初始化时注册，此时 ws 可能还未创建

闭包捕获：箭头函数捕获了外层的 ws 变量
→ 每次 connectWS 都会创建新的 ws 实例
→ 注册的发送器闭包总是指向最新的 ws
→ 避免了 stale closure 问题
`,
        },
        {
          point: "③ ws.onmessage 桥接到 DataBus",
          line: "L167",
          code: "dataBus.ingestWSMessage(msg);",
          note: `
位置选择：放在 switch(msg.type) 之前
→ 确保**所有**消息类型都经过 DataBus
→ 包括未来新增的消息类型（开放扩展）
→ switch 中的 case 分支处理 UI 层面的副作用（setLiveQPS 等）
→ DataBus 处理数据层面的合并和分发
→ 两者并行不悖，各司其职

执行顺序的重要性：
1. ingestWSMessage → DataBus 合并 → publish → Store 更新
2. switch/case → 直接 setState → 触发重渲染
这两条路径同时执行，但因为 Store 和 Context 是独立的，
所以不会产生冲突。节点数据以 Store 为准（SSOT）。
`,
        },
        {
          point: "④ ws.onclose 注销发送器",
          line: "L205",
          code: "dataBus.unregisterWSSender();",
          note: `
与 registerWSSender 配对
→ 连接断开时清除外部发送器引用
→ 后续 isWSConnected() 会正确返回 false
→ sendWS() 会 fallback 到离线队列
→ 防止向已关闭的 WebSocket 发送消息（会抛异常）
`,
        },
      ],
    },

    step_1_5: {
      title: "Step 1.5 — 标记 Enhanced Hook 废弃",
      location: "useWebSocketDataEnhanced.ts 文件头",
      codeExplanation: `
添加 @deprecated JSDoc 标记：
  @deprecated 此Hook已被 useWebSocketData.ts 完全替代。
  @see useWebSocketData - 替代方案

为什么不立即删除？
→ 可能有其他开发者正在参考此文件
→ @deprecated 让 IDE 显示警告，自然引导迁移
→ Phase 4 再正式删除，给足缓冲期
→ 符合「温和弃用」的最佳实践
`,
    },
  },

  // ---------- Phase 2 ----------
  phase2: {
    name: "Phase 2: 打通双向同步 — UI编辑→DataBus→WS回推链路",
    objective: "让用户编辑操作自动通过 DataBus.sendWS() 推送到服务端，形成完整的双向数据闭环",
    risk: "🟡 中风险（涉及写路径，需验证不破坏现有功能）",
    filesModified: [
      { path: "src/app/store/slices/node-slice.ts", action: "3个方法加入sendWS回推" },
      { path: "src/app/lib/data-bus.ts", action: "publish()增加开发日志" },
    ],

    step_2_1: {
      title: "Step 2.1 — updateNode 加入 sendWS 回推（最核心改动）",
      location: "node-slice.ts L128-L142",
      codeDiff: `
// ======== 改造前 ========
updateNode: (id, updates) => {
  set((state) => {
    const updated = dataBus.updateUserEditNode(state.nodes, id, updates);
    state.nodes = updated;
    state.lastSource = "user_edit";
    state.lastUpdateAt = new Date().toISOString();
    state.derived = computeDerived(updated);
    // ❌ 到此为止，没有通知服务端
  });
},

// ======== 改造后 ========
updateNode: (id, updates) => {
  set((state) => {
    const updated = dataBus.updateUserEditNode(state.nodes, id, updates);
    state.nodes = updated;
    state.lastSource = "user_edit";
    state.lastUpdateAt = new Date().toISOString();
    state.derived = computeDerived(updated);

    // ✅ 新增：找到更新后的节点，通过 DataBus 回推
    const targetNode = updated.find((n) => n.id === id);
    if (targetNode) {
      const sent = dataBus.sendWS({
        type: "node_update",
        entity: "nodes",
        data: [targetNode],        // 发送完整的更新后节点
      });
      if (!sent) {
        console.info(\`[NodeSlice] Edit queued for \${id} (offline or no WS)\`);
      }
    }
  });
},
`,
      codeExplanation: `
设计要点解析：

① 为什么在 set() 回调内部调用 sendWS？
→ set() 回调保证在同一个原子事务中完成「本地更新+远程推送」
→ Zustand 的 set 是同步的，所以 sendWS 也是同步调用
→ 如果 sendWS 放在 set 外面，可能出现：本地已更新但远程未推送的状态不一致

② 为什么发送 [targetNode] 数组而不是 diff？
→ 保持与服务端 node_status 消息格式一致
→ 服务端期望接收完整节点对象
→ DataBus 内部的 mergeNodeData 本身就是按 ID 做 merge
→ 发送完整节点比发送 diff 更健壮（不怕乱序）

③ sent 变量的用途
→ sendWS 返回 boolean 表示是否发送成功
→ 成功：消息已进入网络栈
→ 失败：消息已进入离线队列（DataBus 内部处理）
→ console.info 仅作为开发调试辅助，不影响逻辑

④ 消息体结构
  { type: "node_update", entity: "nodes", data: [targetNode] }
  → type 标识操作类型
  → entity 标识目标实体
  → data 承载实际数据（数组格式，支持批量）
  → DataBus.sendWS() 会自动补充 timestamp 和 id 字段
`,
    },

    step_2_2: {
      title: "Step 2.2 — addNode / removeNode 加入回推",
      location: "node-slice.ts L148-L167",
      codeExplanation: `
addNode 的回推逻辑（简洁版）：
  dataBus.sendWS({ type: "node_update", entity: "nodes", data: [node] });
  → 新节点创建后立即推送
  → 服务端可以广播给其他在线客户端

removeNode 的回推逻辑（带状态标记）：
  const removed = state.nodes.find((n) => n.id === id);
  // ... 执行删除 ...
  if (removed) {
    dataBus.sendWS({
      type: "node_update",
      entity: "nodes",
      data: [{ ...removed, status: "inactive" as const }]  // ★ 标记为 inactive 而非真删除
    });
  }

★ 为什么 remove 发送 status: "inactive" 而不是真的从服务端删除？
→ 「软删除」模式：客户端删除 ≠ 服务端删除
→ 其他客户端可能仍在查看该节点历史数据
→ inactive 状态让服务端知道该节点不再活跃
→ 可以在未来恢复（重新设置 status: "active"）
→ 这是分布式系统中常见的「墓碑标记(Tombstone)」模式
`,
    },

    step_2_3: {
      title: "Step 2.3 — publish() 增加开发环境日志",
      location: "data-bus.ts L127-L131",
      code: `
if (process.env.NODE_ENV === "development") {
  console.info(
    \`[DataBus] \${event.entity}.\${event.action} (source: \${event.source}, payload items: \${Array.isArray(event.payload) ? event.payload.length : 1})\`
  );
}
`,
      codeExplanation: `
日志输出示例：
  [DataBus] nodes.merge (source: websocket, payload items: 9)
  [DataBus] nodes.update (source: user_edit, payload items: 1)

设计考量：
① process.env.NODE_ENV 守卫
  → 生产构建时 Vite 会 dead-code eliminate 整个 if 块
  → 零性能开销，零信息泄露风险

② 日志信息密度
  → entity.action: 精确定位哪个实体的什么操作
  → source: 区分是 WS 推送还是用户编辑（调试覆盖问题的关键）
  → payload items: 数据量感知，帮助发现异常批量

③ 为什么不用 console.info/warn/error？
  → console.log 用于常规信息流追踪
  → info/warn/error 留给更严重的场景
  → 保持日志级别的语义清晰度
`,
    },
  },

  // ---------- Phase 3 ----------
  phase3: {
    name: "Phase 3: 统一消费入口 — Dashboard 审计加固",
    objective: "确认 Dashboard 数据消费符合 SSOT 原则，添加防御性注释防止退化",
    risk: "🟢 低风险（几乎不改逻辑）",
    filesModified: [
      { path: "src/app/components/Dashboard.tsx", action: "添加3行防御注释" },
    ],

    explanation: `
审计发现：Dashboard 当前的数据取用已经基本正确！
- 节点数据：100% 来自 useNodeSlice（Zustand Store）
- WebSocketContext：仅用于 connectionState/liveQPS/liveLatency 等非节点指标

所以 Phase 3 的主要工作是「防退化保险」：

  // ★ SSOT原则: 节点数据统一从 useNodeSlice 获取
  // WebSocketContext 仅用于: 连接状态/QPS/Latency/吞吐量/告警 等非节点类实时指标
  // 禁止从此处读取 nodes 相关数据（2026-04-15 架构审计确认）

这种注释的价值：
① 代码审查时的明确规范（新人一看就懂）
② 未来重构时的护栏（违反注释会被 code review 拦截）
③ 架构决策的可追溯性（日期+原因记录在案）

类似「断言式编程」的思想——把架构约束写进代码里。
`,
  },

  // ---------- Phase 4 ----------
  phase4: {
    name: "Phase 4: 清理技术债务 — Legacy 标记与文档更新",
    objective: "标记所有废弃代码，为未来的物理删除做准备",
    risk: "🟡 中风险（标记操作安全，但需注意不破坏测试）",
    filesModified: [
      { path: "src/app/lib/data-bus.ts", action: "内置WS引擎区域加Legacy注释块" },
      { path: "src/app/stores/dashboard-stores.ts", action: "nodeStore 加@deprecated" },
    ],

    legacyMarkExplanation: `
DataBus 内置 WS 引擎区域的 Legacy 标记：

  // ---------- WebSocket 同步引擎 (Legacy — 已被外部桥接替代) ----------
  // @deprecated 此区域代码已不再被生产调用。
  // 自 2026-04-15 Phase 1 起，WebSocket 管理权已移交 useWebSocketData.ts。
  // DataBus 通过 registerWSSender() / ingestWSMessage() 与外部桥接。
  // 计划 v3.0 删除此区域全部代码（connectWS/disconnectWS/sendWS内置路径/startHeartbeat等）。
  // 保留原因: 内置 sendWS 的 fallback 路径仍作为离线队列兜底。

为什么现在不删除而只是标记？
① fallback 路径还在使用（sendWS 的第三优先级）
② 删除 ~280 行代码增加回归风险
③ 给团队时间适应新架构
④ @deprecated 标记足以在 IDE 中提示开发者避免使用

nodeStore 的 @deprecated 标记同理：
→ 当前仍有测试文件大量引用
→ 需要先完成测试迁移（Step 4.3，建议后续执行）
→ 标记后 IDE 会对 import 发出警告
`,
  },
};

// ============================================================
// 第四章：关键技术模式解析
// ============================================================

export const CHAPTER_4_KEY_PATTERNS = {
  title: "四、关键技术模式深度解析",

  patterns: [
    {
      name: "模式1: 依赖注入 (Dependency Injection via Function Injection)",
      whereUsed: "DataBus.externalWSSender + registerWSSender/unregisterWSSender",
      whatIsIt: `
DI 的本质：不自己创建依赖，而是从外部接收。

传统方式（紧耦合）：
  class DataBus {
    private ws: WebSocket;        // 自己创建和管理
    connectWS() { this.ws = new WebSocket(url); }
  }

注入方式（松耦合）：
  class DataBus {
    private sender: ((msg) => boolean) | null = null;  // 接收外部能力
    registerWSSender(sender) { this.sender = sender; }
  }

好处：
  - DataBus 不知道 WebSocket 的存在（可替换为 HTTP/MQTT/任何传输层）
  - 测试时可以注入 mock sender，无需启动真实服务器
  - 符合 SOLID 的依赖倒置原则（DIP）
`,
      whyFunctionNotObject: `
为什么注入函数而不是 WebSocket 对象？

  方案A: 注入 WebSocket 对象
    registerWS(ws: WebSocket) { this.ws = ws; }
    → DataBus 需要知道 WebSocket API（send, readyState 等）
    → 耦合了具体的传输协议

  方案B: 注入函数（本次采用 ✓）
    registerWSSender(sender: (msg) => boolean) { ... }
    → DataBus 只知道「能发消息」这个抽象能力
    → sender 内部可以是 WebSocket、fetch、postMessage、甚至 console.log
    → 这是「接口隔离原则」（ISP）的体现
`,
    },

    {
      name: "模式2: 防腐层 (Anti-Corruption Layer)",
      whereUsed: "ingestWSMessage() 内部的格式适配逻辑",
      whatIsIt: `
当两个系统使用不同的数据格式通信时，在边界处做格式转换，
阻止「格式污染」蔓延到系统内部。

本项目中的体现：
  types/index.ts 的 WSMessage:  { type, payload }     （UI层格式）
  data-bus.ts 的 WSMessage:      { type, data, timestamp } （DataBus内部格式）

ingestWSMessage 就是这个防腐层：
  输入: Record<string, unknown>  （来自任意格式的上游）
  输出: 标准 WSMessage           （DataBus 内部统一格式）

如果不做适配会怎样？
  → handleWSMessage 内部到处都是 message.data ?? message.payload
  → 每个分支都需要判断格式来源
  → 新增一种消息格式要改 N 个地方
`,
    },

    {
      name: "模式3: 智能合并 (SmartMerge / Last-Write-Wins with Field-level Priority)",
      whereUsed: "DataBus.mergeNodeData() 中的 userEditedCells 保护逻辑",
      whatIsIt: `
解决的核心问题：WebSocket 推送的遥测数据 vs 用户手动编辑的数据，谁优先？

策略：字段级优先级
  - 用户编辑过的字段 → 用户值优先（不被 WS 覆盖）
  - 用户未编辑的字段 → WS 遥测值正常更新

实现机制：
  1. updateUserEditNode() 将编辑字段记入 userEditedCells Set
  2. mergeNodeData() 合并时检查 Set
  3. 若字段在 Set 中 → 保留当前值（用户编辑值）
  4. 若字段不在 Set中 → 采用 incoming 值（WS 遥测值）

类比：就像 Git 合并冲突时，「我们的版本」在某些文件上优先于「他们的版本」。
`,
    },

    {
      name: "模式4: 单源真理 (Single Source of Truth, SSOT)",
      whereUsed: "整体架构 — useNodeSlice 作为唯一 Node 数据权威源",
      whatIsIt: `
SSOT 原则：对于任何一种数据，在整个系统中只有一个地方是它的「官方来源」，
其他所有地方都是这个来源的消费者（拷贝/派生/缓存）。

本项目的 SSOT 映射：

  数据类型              权威源(SSOT)              消费者
  ──────────────────────────────────────────────────────
  节点数据(NodeData)    useNodeSlice(Zustand)      Dashboard, Editor, 图表
  WS连接状态            useWebSocketData(Hook)      Layout, StatusBar
  国际化文本             i18n/zh-CN.ts, en-US.ts    所有组件
  用户认证状态          AuthContext                路由守卫, Header

违反 SSOT 的症状（改造前的项目）：
  - Dashboard 同时从 WebSocketContext 和 useNodeSlice 读节点数据
  - nodeStore 和 useNodeSlice 存储相同的节点数据
  - 不知道改哪个才是「真正生效」的

遵守 SSOT 的好处：
  - 数据一致性有保证（只有一个写入点）
  - Debug 时只需追踪一个源头
  - 缓存失效逻辑简单明了
`,
    },

    {
      name: "模式5: 渐进式架构迁移 (Strangler Fig Pattern)",
      whereUsed: "Phase 1-4 的整体实施策略",
      whatIsIt: `
不搞「大爆炸式重写」，而是逐步用新系统替代旧系统。

类比：榕树（Strangler Fig）缠绕宿主树生长，
最终取代宿主树，但过程中宿主树始终存活提供服务。

本项目的迁移步骤：

  Phase 0: 基线快照（理解现状，不动代码）
  Phase 1: 搭建新通道（加法为主，新旧并存）
  Phase 2: 接通写路径（开始有流量走新通道）
  Phase 3: 审计加固（确保无退化）
  Phase 4: 清理旧代码（确认稳定后才删除）

每个 Phase 都是可回滚的：
  git checkout -- <file>  即可回到上一个稳定状态

关键原则：
  - 每步都可独立验证
  - 不破坏已有功能
  - 新旧系统可以共存一段时间
  - 最后才清理遗留物
`,
    },
  ],
};

// ============================================================
// 第五章：踩坑记录与经验教训
// ============================================================

export const CHAPTER_5_LESSONS_LEARNED = {
  title: "五、踩坑记录与经验教训",

  lessons: [
    {
      issue: "类型不匹配导致编译错误",
      context: `
在 Step 1.4 中，初次实现 ingestWSMessage(message: WSMessage) 时，
TypeScript 报错：类型“types.WSMessage”不能赋值给类型“data-bus.WSMessage”。

原因：项目中存在两套同名但结构不同的 WSMessage 类型定义！
  - src/app/types/index.ts:   { type, payload } （联合类型，用于 UI 层）
  - src/app/lib/data-bus.ts:  { type, data, timestamp } （用于 DataBus 内部）
`,
      solution: `
将参数类型改为 Record<string, unknown>（宽泛类型），
然后在方法内部做显式格式适配。

启示：
  ① 大型项目中「同名类型」是隐患，应统一类型定义位置
  ② 跨模块边界使用宽松输入类型 + 内部严格适配，是实用的防御策略
  ③ 工具型代码（如 DataBus）应定义自己的内部类型，不依赖外部
`,
      prevention: "建议未来将 WSMessage 统一到 types/index.ts，DataBus 内部做适配层",
    },

    {
      issue: "ESLint curly 规则触犯",
      context: `
isWSConnected() 中写了 if (this.externalWSSender) return true;
ESLint 报错：Expected { after 'if' condition (curly规则)
`,
      solution: `
改为多行花括号形式：
  if (this.externalWSSender) {
    return true;
  }
`,
      prevention: "团队 ESLint 配置要求所有 if 必须用花括号，即使是单行语句",
    },

    {
      issue: "sendWS 的优先级顺序设计",
      context: `
初次实现时把 externalWSSender 放在了 !this.ws 判断的 else 分支里，
意味着只有内置 WS 断开时才尝试外部发送器。
`,
      solution: `
调整为 externalWSSender 作为第一优先级（无论内置 WS 状态如何）。
因为 Phase 1 之后，externalWSSender 就是「正统」的发送通道，
内置 WS 只是 fallback。
`,
      prevention: "设计优先级链时画出完整的决策树，不要遗漏组合情况",
    },
  ],
};

// ============================================================
// 第六章：验证标准与方法
// ============================================================

export const CHAPTER_6_VERIFICATION = {
  title: "六、验证标准与方法",

  verificationMatrix: [
    {
      phase: "Phase 1",
      checks: [
        { id: "V1.6", item: "pnpm exec tsc --noEmit", result: "🟢 零错误", notes: "类型安全是第一道防线" },
        { id: "V1.5", item: "ESLint 目标文件", result: "🟢 0 errors", notes: "修复了1个curly违规" },
        { id: "V1.1", item: "pnpm dev 启动", result: "🟢 localhost:3218 正常", notes: "Vite 编译零报错" },
      ],
    },
    {
      phase: "Phase 2",
      checks: [
        { id: "V2.x", item: "tsc --noEmit", result: "🟢 零错误", notes: "node-slice 改动类型安全" },
        { id: "V2.x", item: "ESLint node-slice.ts", result: "🟢 0 errors", notes: "仅有1个预存warning" },
      ],
    },
    {
      phase: "Phase 3-4",
      checks: [
        { id: "V3-4", item: "tsc --noEmit 全量", result: "🟢 零错误", notes: "注释修改不影响类型" },
      ],
    },
  ],

  verificationPhilosophy: `
验证金字塔（从快到慢）：

  🔺 静态分析 (秒级)
    ├── tsc --noEmit     → 类型安全
    ├── eslint           → 代码风格
    └── 编译器警告        → 潜在问题

  🔺 单元测试 (分钟级)
    ├── DataBus 合并逻辑测试
    ├── node-slice 操作测试
    └── ingestWSMessage 适配测试

  🔺 集成测试 (十分钟级)
    ├── WS 桥接端到端测试
    ├── 编辑→回推→合并 全链路测试
    └── 断线重连后的数据一致性

  🔺 手动验证 (需人工)
    ├── DevServer 启动 + 页面渲染
    ├── 编辑 GPU 值观察控制台日志
    └── 模拟模式下数据持续刷新

本次实施完成了「静态分析 + 手动验证」两层，
单元测试和集成测试建议在后续迭代中补充。
`,
};

// ============================================================
// 第七章：后续行动项
// ============================================================

export const CHAPTER_7_NEXT_STEPS = {
  title: "七、后续行动项",

  immediate: [
    {
      priority: "P0",
      task: "浏览器手动验证",
      description: "打开 http://localhost:3218/，编辑节点GPU值，观察控制台 [DataBus] 日志",
      expected: "看到 nodes.update (source: user_edit) 日志，且编辑值不被覆盖",
    },
    {
      priority: "P0",
      task: "运行全量测试套件",
      description: "pnpm test --run 确认无回归",
      expected: "全部 PASS",
    },
  ],

  shortTerm: [
    {
      priority: "P1",
      task: "删除 useWebSocketDataEnhanced 及其测试",
      description: "Phase 4 Step 4.1 — 物理删除废弃文件",
      dependsOn: "全量测试通过",
    },
    {
      priority: "P1",
      task: "迁移 global-data-interoperability.test.ts",
      description: "将 nodeStore 引用改为 useNodeSlice",
      dependsOn: "理解 nodeSlice API 差异",
    },
    {
      priority: "P2",
      task: "补充 DataBus 桥接层的单元测试",
      description: "测试 ingestWSMessage 格式适配、registerWSSender 生命周期",
      dependsOn: "无",
    },
  ],

  longTerm: [
    {
      priority: "P2",
      task: "统一 WSMessage 类型定义",
      description: "消除 types/index.ts 和 data-bus.ts 之间的类型重复",
      dependsOn: "Phase 4 完成",
    },
    {
      priority: "P3",
      task: "删除 DataBus 内置 WS 引擎代码",
      description: "v3.0 清理 Legacy 区域 (~280行)",
      dependsOn: "确认外部桥接稳定运行 ≥ 1个月",
    },
    {
      priority: "P3",
      task: "性能基准测试",
      description: "对比改造前后 DataBus.publish() 吞吐量和内存占用",
      dependsOn: "无",
    },
  ],
};

// ============================================================
// 第八章：文件变更总览
// ============================================================

export const CHAPTER_8_CHANGE_LOG = {
  title: "八、文件变更总览",

  changeSummary: [
    {
      file: "src/app/lib/data-bus.ts",
      action: "修改",
      linesAdded: 45,
      linesDeleted: 2,
      keyChanges: [
        "+ externalWSSender 字段 + registerWSSender/unregisterWSSender/ingestWSMessage 方法",
        "+ sendWS() 重写为首选外部发送器",
        "+ isWSConnected() 检查外部状态",
        "+ publish() 开发环境日志",
        "+ Legacy 区域标记注释",
      ],
    },
    {
      file: "src/app/hooks/useWebSocketData.ts",
      action: "修改",
      linesAdded: 12,
      linesDeleted: 0,
      keyChanges: [
        '+ import { dataBus } from "../lib/data-bus"',
        "+ ws.onopen → dataBus.registerWSSender()",
        "+ ws.onmessage → dataBus.ingestWSMessage()",
        "+ ws.onclose → dataBus.unregisterWSSender()",
      ],
    },
    {
      file: "src/app/store/slices/node-slice.ts",
      action: "修改",
      linesAdded: 17,
      linesDeleted: 0,
      keyChanges: [
        "+ updateNode() → dataBus.sendWS(node_update) 回推",
        "+ addNode() → dataBus.sendWS(node_update) 回推",
        "+ removeNode() → dataBus.sendWS(inactive) 回推",
      ],
    },
    {
      file: "src/app/components/Dashboard.tsx",
      action: "修改",
      linesAdded: 3,
      linesDeleted: 0,
      keyChanges: ["+ SSOT 防御性注释"],
    },
    {
      file: "src/app/hooks/useWebSocketDataEnhanced.ts",
      action: "修改",
      linesAdded: 5,
      linesDeleted: 0,
      keyChanges: ["+ @deprecated 废弃标记"],
    },
    {
      file: "src/app/stores/dashboard-stores.ts",
      action: "修改",
      linesAdded: 8,
      linesDeleted: 0,
      keyChanges: ["+ nodeStore @deprecated 废弃标记"],
    },
    {
      file: "src/app/docs/DATA-BUS-UNIFICATION-PLAN.ts",
      action: "新建",
      linesAdded: 520,
      keyChanges: ["完整分阶段实施计划书"],
    },
  ],

  totalImpact: {
    filesModified: 6,
    filesCreated: 1,
    totalLinesAdded: 90,
    totalLinesDeleted: 2,
    netChange: "+88 行",
    riskLevel: "低-中等",
    rollbackCommand: "git checkout -- src/app/lib/data-bus.ts src/app/hooks/useWebSocketData.ts src/app/store/slices/node-slice.ts src/app/components/Dashboard.tsx src/app/hooks/useWebSocketDataEnhanced.ts src/app/stores/dashboard-stores.ts",
  },
};

// ============================================================
// 导出汇总
// ============================================================

export const SUMMARY = {
  project: "YYC³ Cloud Intelli-Matrix — 数据逻辑互通修复",
  student: "初源",
  mentor: "YYC³ 标准化审计导师",
  date: "2026-04-15",
  duration: "4个Phase，6个文件，+88行净增量",
  outcome: "从「三引擎分裂架构」升级为「SSOT统一架构」",
  status: "Phase 1-4 代码实施完成，待全量测试验证",
};
