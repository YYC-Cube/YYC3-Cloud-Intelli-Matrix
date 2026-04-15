/**
 * @file: DATA-BUS-UNIFICATION-PLAN.ts
 * @description: YYC³ 数据逻辑互通修复 — 分阶段实施计划书
 * @author: YanYuCloudCube Team
 * @student: 初源
 * @version: v1.0.0
 * @created: 2026-04-15
 * @updated: 2026-04-16
 * @status: active
 * @tags: [plan],[data-bus],[unification],[ssot],[websocket]
 *
 * @brief: 解决「智能检测数据逻辑互通及UI可编辑数据同步一致」问题的完整实施计划
 *
 * @root-cause:
 * 项目存在 3 套 WebSocket 引擎、2 套节点 Store、1 套孤儿 DataBus WS 的架构分裂问题，
 * 导致数据在多条并行通道中各自为战，无法形成闭环。
 *
 * @goal:
 * 建立 SSOT (Single Source of Truth) 数据流架构：
 *   1 个 WebSocket 管理者 + 1 个 Node Store + 1 个合并引擎 + 所有写操作经过 DataBus 自动回推
 *
 * @phases:
 *   Phase 0: 基线快照 ✅ 已完成
 *   Phase 1: 消除脑裂 — 废弃孤立引擎与冗余Store
 *   Phase 2: 打通双向同步 — UI编辑→DataBus→WS回推链路
 *   Phase 3: 统一消费入口 — Dashboard单源取数
 *   Phase 4: 清理技术债务 — 删除死代码与文档更新
 */

// ============================================================
// 一、总体路线图
// ============================================================

export const ROUTE_MAP = {
  phases: [
    { id: 'P0', name: '基线快照', status: 'completed', desc: '确认当前代码状态与影响范围' },
    { id: 'P1', name: '消除脑裂', status: 'pending', desc: '废弃孤立引擎与冗余Store' },
    { id: 'P2', name: '打通双向同步', status: 'pending', desc: 'UI编辑→DataBus→WS回推链路' },
    { id: 'P3', name: '统一消费入口', status: 'pending', desc: 'Dashboard单源取数' },
    { id: 'P4', name: '清理技术债务', status: 'pending', desc: '删除死代码与文档更新' },
  ],
  totalEstimatedDays: '4-6',
  corePrinciple: '每个Phase独立可验证、可回滚、不破坏现有功能',
};

// ============================================================
// 二、Phase 0：基线快照（已完成）
// ============================================================

/** 当前代码资产清单 */
export const BASELINE_ASSETS = [
  {
    id: 'A',
    file: 'src/app/lib/data-bus.ts',
    lines: 656,
    role: '数据总线 + 孤儿WS引擎',
    status: '⚠️ WS引擎未被调用',
    keyMethods: ['connectWS()', 'disconnectWS()', 'sendWS()', 'ingestWSMessage(新增)', 'registerWSSender(新增)'],
  },
  {
    id: 'B',
    file: 'src/app/hooks/useWebSocketData.ts',
    lines: 283,
    role: '**活跃** WS管理器',
    status: '✅ 实际运行中',
    keyMethods: ['useWebSocketData()', 'mergeFromWS桥接点', 'ws.onopen注册发送器'],
  },
  {
    id: 'C',
    file: 'src/app/hooks/useWebSocketDataEnhanced.ts',
    lines: 386,
    role: '冗余WS Hook',
    status: '❌ 仅自身测试引用',
    action: 'Phase 4 删除',
  },
  {
    id: 'D',
    file: 'src/app/store/slices/node-slice.ts',
    lines: 175,
    role: '**活跃** Zustand Store',
    status: '✅ Dashboard+Editor使用',
    keyMethods: ['mergeFromWS()', 'updateNode(需加sendWS)', 'addNode(需加sendWS)', 'removeNode(需加sendWS)'],
  },
  {
    id: 'E',
    file: 'src/app/stores/dashboard-stores.ts',
    lines: 420,
    role: '冗余Store集合',
    status: '⚠️ nodeStore被测试引用',
    action: 'nodeStore标记deprecated，其余保留',
  },
];

/** 关键依赖关系 */
export const DEPENDENCY_GRAPH = `
生产代码调用链:
  Layout.tsx:47 → useWebSocketData()
    ├── ws.onmessage → mergeFromWS() → dataBus.mergeNodeData()
    │                             ↓
    │                   useNodeSlice (Zustand)
    │                       ↓
    ├── WebSocketContext.Provider → Dashboard.tsx:102
    │                               ↓
    │                   { nodes, derived } ← 读
    │
    └── 返回值.nodes = sliceNodes ← 同一个Store

  DataEditorPanel.tsx:206 → useNodeSlice()
    ↓
    updateNode(id, updates) → dataBus.updateUserEditNode()
      ↓                     ↓
    Zustand更新            标记userEditedCells
      ↓
    ❌ 无sendWS()回推 ← Phase 2 修复此断点

死代码区域:
  data-bus.ts 内置WS引擎: connectWS/disconnectWS/sendWS/startHeartbeat
    → 全部完整实现，但零调用者
  useWebSocketDataEnhanced.ts: 仅被自身测试引用
  dashboard-stores.ts nodeStore: 被global-data-interoperability.test.ts大量引用(仅测试)
`;

// ============================================================
// 三、Phase 1：消除脑裂
// ============================================================

export const PHASE_1 = {
  objective: '将 DataBus 从「自建WS引擎+数据合并」精简为「纯数据合并层」',
  prerequisite: 'Phase 0 完成',
  steps: [
    {
      stepId: '1.1',
      title: '新增 ingestWSMessage() 外部消息注入口',
      file: 'src/app/lib/data-bus.ts',
      location: 'isWSConnected() 方法之后 (约 L397)',
      type: '新增方法',
      codeToAdd: `
/** 外部注入的 WS 发送器（由 useWebSocketData 设置） */
private externalWSSender: ((msg: Omit<WSMessage, 'timestamp' | 'id'>) => boolean) | null = null;

registerWSSender(sender: (msg: Omit<WSMessage, 'timestamp' | 'id'>) => boolean): void {
  this.externalWSSender = sender;
}

unregisterWSSender(): void {
  this.externalWSSender = null;
}

ingestWSMessage(message: WSMessage): void {
  this.lastMessageTime = Date.now();
  const fakeEvent = { data: JSON.stringify(message) } as MessageEvent;
  this.handleWSMessage(fakeEvent);
}`,
      verification: 'TypeScript 编译无报错',
    },
    {
      stepId: '1.2',
      title: '重写 sendWS() 优先走外部发送器',
      file: 'src/app/lib/data-bus.ts',
      location: 'sendWS() 方法 (约 L338)',
      type: '替换方法体',
      codeToReplace: `sendWS(message: Omit<WSMessage, 'timestamp' | 'id'>): boolean {
    const fullMessage: WSMessage = {
      ...message,
      timestamp: Date.now(),
      id: \`msg-\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`,
    };
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.wsConfig?.enableOfflineQueue) {
        this.offlineQueue.push(fullMessage);
        console.info(\`[DataBus] Message queued (offline): \${fullMessage.type}\`);
        return false;
      }
      console.warn("[DataBus] Cannot send: WebSocket not connected");
      return false;
    }
    this.throttledSend(fullMessage);
    return true;
  }`,
      codeReplaceWith: `sendWS(message: Omit<WSMessage, 'timestamp' | 'id'>): boolean {
    const fullMessage: WSMessage = {
      ...message,
      timestamp: Date.now(),
      id: \`msg-\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`,
    };
    if (this.externalWSSender) {
      const sent = this.externalWSSender(fullMessage);
      if (!sent && this.wsConfig?.enableOfflineQueue) {
        this.offlineQueue.push(fullMessage);
        console.info(\`[DataBus] Message queued (offline, via external): \${fullMessage.type}\`);
      }
      return sent;
    }
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.wsConfig?.enableOfflineQueue) {
        this.offlineQueue.push(fullMessage);
        console.info(\`[DataBus] Message queued (offline): \${fullMessage.type}\`);
        return false;
      }
      console.warn("[DataBus] Cannot send: no WebSocket connection available");
      return false;
    }
    this.throttledSend(fullMessage);
    return true;
  }`,
      verification: 'TypeScript 编译无报错',
    },
    {
      stepId: '1.3',
      title: '更新 isWSConnected 检查外部状态',
      file: 'src/app/lib/data-bus.ts',
      location: 'isWSConnected() 方法 (约 L393)',
      type: '替换方法体',
      codeToReplace: `isWSConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }`,
      codeReplaceWith: `isWSConnected(): boolean {
    if (this.externalWSSender) return true;
    return this.ws?.readyState === WebSocket.OPEN;
  }`,
      verification: 'TypeScript 编译无报错',
    },
    {
      stepId: '1.4',
      title: 'useWebSocketData 对接 DataBus 桥接',
      file: 'src/app/hooks/useWebSocketData.ts',
      modifications: [
        {
          location: '文件头部 import 区域',
          action: '新增import',
          code: "import { dataBus } from \"../lib/data-bus\";",
        },
        {
          location: 'ws.onopen 回调内 (约 L118)',
          action: '在 setConnectionState("connected") 后插入',
          code: `dataBus.registerWSSender((msg) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(msg));
              return true;
            }
            return false;
          });`,
        },
        {
          location: 'ws.onmessage 回调内 (约 L140)',
          action: '在 switch(msg.type) 之前插入',
          code: 'dataBus.ingestWSMessage(msg);',
        },
        {
          location: 'ws.onclose 回调内 (约 L155)',
          action: '在 wsRef.current = null 后插入',
          code: 'dataBus.unregisterWSSender();',
        },
      ],
      verification: 'pnpm dev 正常启动，节点数据正常渲染',
    },
    {
      stepId: '1.5',
      title: '标记 useWebSocketDataEnhanced 废弃',
      file: 'src/app/hooks/useWebSocketDataEnhanced.ts',
      location: '文件头部注释块',
      type: '添加废弃标记',
      codeToAdd: ` * @deprecated 此Hook已被 useWebSocketData.ts 完全替代。
 * useWebSocketData 已接入 DataBus 统一合并引擎，具备相同功能。
 * 计划于 Phase 4 删除此文件。最后更新: 2026-04-15
 * @see useWebSocketData - 替代方案`,
      verification: 'TypeScript 编译通过（@deprecated 不影响编译）',
    },
  ],
  verificationChecklist: [
    { id: 'V1.1', item: 'pnpm dev 正常启动无报错', method: '终端输出检查', passCriteria: '零编译错误' },
    { id: 'V1.2', item: 'Dashboard 节点数据正常渲染', method: '浏览器查看', passCriteria: '9个节点全部显示' },
    { id: 'V1.3', item: 'DataEditorPanel 编辑保存后值保持', method: '手动编辑GPU', passCriteria: '编辑值保留不被覆盖' },
    { id: 'V1.4', item: '模拟数据每2秒更新', method: '观察指标卡', passCriteria: 'QPS/Latency/GPU跳动' },
    { id: 'V1.5', item: 'pnpm test 全量通过', method: '终端执行', passCriteria: '全部PASS' },
    { id: 'V1.6', item: 'pnpm type-check 无报错', method: '终端执行', passCriteria: '零type error' },
  ],
  rollbackCommand: 'git checkout -- src/app/lib/data-bus.ts src/app/hooks/useWebSocketData.ts',
};

// ============================================================
// 四、Phase 2：打通双向同步
// ============================================================

export const PHASE_2 = {
  objective: '用户编辑节点后自动通过 DataBus→WebSocket 推送到服务端',
  prerequisite: 'Phase 1 完成且 V1 全绿',
  steps: [
    {
      stepId: '2.1',
      title: '改造 updateNode 加入 sendWS 回推',
      file: 'src/app/store/slices/node-slice.ts',
      location: 'updateNode 方法 (约 L112-L122)',
      type: '替换方法体',
      codeToReplace: `updateNode: (id, updates) => {
    set((state) => {
      const updated = dataBus.updateUserEditNode(state.nodes, id, updates);
      state.nodes = updated;
      state.lastSource = "user_edit";
      state.lastUpdateAt = new Date().toISOString();
      state.derived = computeDerived(updated);
    });
  },`,
      codeReplaceWith: `updateNode: (id, updates) => {
    set((state) => {
      const updated = dataBus.updateUserEditNode(state.nodes, id, updates);
      state.nodes = updated;
      state.lastSource = "user_edit";
      state.lastUpdateAt = new Date().toISOString();
      state.derived = computeDerived(updated);
      const targetNode = updated.find((n) => n.id === id);
      if (targetNode) {
        const sent = dataBus.sendWS({
          type: "node_update",
          entity: "nodes",
          data: [targetNode],
        });
        if (!sent) {
          console.info(\`[NodeSlice] Edit queued for \${id} (offline or no WS)\`);
        }
      }
    });
  },`,
    },
    {
      stepId: '2.2',
      title: '改造 addNode / removeNode 加入 sendWS',
      file: 'src/app/store/slices/node-slice.ts',
      location: 'addNode 和 removeNode 方法',
      type: '追加代码',
      addNodeAppend: `dataBus.sendWS({ type: "node_update", entity: "nodes", data: [node] });`,
      removeNodeAppend: `if (removed) {
        dataBus.sendWS({ type: "node_update", entity: "nodes", data: [{ ...removed, status: "inactive" as const }] });
      }`,
    },
    {
      stepId: '2.3',
      title: 'publish 方法增加开发环境日志',
      file: 'src/app/lib/data-bus.ts',
      location: 'publish() 方法 (约 L130)',
      type: '插入日志代码',
      codeToAdd: `if (process.env.NODE_ENV === 'development') {
    console.info(
      \`[DataBus] \${event.entity}.\${event.action} (source: \${event.source}, payload items: \${Array.isArray(event.payload) ? event.payload.length : 1})\`
    );
  }`,
    },
  ],
  verificationChecklist: [
    { id: 'V2.1', item: '编辑保存后控制台有DataBus日志', method: 'DevTools Console', passCriteria: '[DataBus] nodes.update (source: user_edit)' },
    { id: 'V2.2', item: '编辑后WS不覆盖用户值', method: '编辑GPU=95等2秒', passCriteria: 'GPU仍为95' },
    { id: 'V2.3', item: '断线状态下编辑不崩溃', method: '断网后编辑', passCriteria: '正常保存+queued提示' },
    { id: 'V2.4', item: 'pnpm test 全量通过', method: '终端执行', passCriteria: '全部PASS' },
    { id: 'V2.5', item: 'pnpm type-check 无报错', method: '终端执行', passCriteria: '零error' },
  ],
  rollbackCommand: 'git checkout -- src/app/store/slices/node-slice.ts src/app/lib/data-bus.ts',
};

// ============================================================
// 五、Phase 3：统一消费入口
// ============================================================

export const PHASE_3 = {
  objective: '确保 Dashboard 所有节点数据只从 useNodeSlice 获取',
  prerequisite: 'Phase 2 完成',
  steps: [
    {
      stepId: '3.1',
      title: '审计 Dashboard 双源取数（确认现状已基本正确）',
      file: 'src/app/components/Dashboard.tsx',
      location: 'L102-145',
      finding: '当前已经正确：节点数据全从 Slice 取，Context 仅用于非节点类实时指标',
      action: '无需大幅改动，仅加防御注释',
    },
    {
      stepId: '3.2',
      title: '添加防御性注释防止未来退化',
      file: 'src/app/components/Dashboard.tsx',
      location: 'const ws = useContext(WebSocketContext) 上方',
      type: '添加注释',
      codeToAdd: `// ★ SSOT原则: 节点数据统一从 useNodeSlice 获取
// WebSocketContext 仅用于: 连接状态/QPS/Latency/吞吐量/告警 等非节点类实时指标
// 禁止从此处读取 nodes 相关数据（2026-04-15 架构审计确认）`,
    },
  ],
  verificationChecklist: [
    { id: 'V3.1', item: 'Dashboard 渲染与 P2 完全一致', method: '对比截图', passCriteria: '无视觉变化' },
    { id: 'V3.2', item: 'pnpm test 全量通过', method: '终端执行', passCriteria: '全部PASS' },
  ],
  rollbackCommand: 'git checkout -- src/app/components/Dashboard.tsx',
};

// ============================================================
// 六、Phase 4：清理技术债务
// ============================================================

export const PHASE_4 = {
  objective: '删除所有已废弃的孤立代码、冗余文件，迁移受影响的测试',
  prerequisite: 'Phase 1-3 全部完成且稳定运行 ≥ 24h',
  steps: [
    {
      stepId: '4.1',
      title: '删除 useWebSocketDataEnhanced 及其测试',
      filesToDelete: [
        'src/app/hooks/useWebSocketDataEnhanced.ts',
        'src/app/__tests__/useWebSocketDataEnhanced.test.ts',
      ],
      impactAnalysis: '零生产代码引用（仅自身测试），安全删除',
    },
    {
      stepId: '4.2',
      title: '标记 DataBus 内置 WS 引擎为 Legacy',
      file: 'src/app/lib/data-bus.ts',
      location: 'WebSocket 同步引擎区域头部 (约 L220)',
      type: '添加 Legacy 标记注释',
      note: '不删除代码，仅标记@deprecated，计划v3.0移除',
    },
    {
      stepId: '4.3',
      title: '迁移 global-data-interoperability.test.ts 中 nodeStore 用例',
      file: 'src/app/__tests__/global-data-interoperability.test.ts',
      migrationMap: {
        'import { nodeStore }': 'import { useNodeSlice } from "../store/slices/node-slice"',
        'nodeStore.getAll()': 'useNodeSlice.getState().nodes',
        'nodeStore.add(x)': 'useNodeSlice.getState().addNode(x)',
        'nodeStore.update(id, x)': 'useNodeSlice.getState().updateNode(id, x)',
        'nodeStore.remove(id)': 'useNodeSlice.getState().removeNode(id)',
        'nodeStore.reset()': 'useNodeSlice.getState().resetNodes()',
        'nodeStore.getById(id)': 'useNodeSlice.getState().nodes.find(n => n.id === id)',
        'nodeStore.count()': 'useNodeSlice.getState().nodes.length',
      },
    },
    {
      stepId: '4.4',
      title: '标记 dashboard-stores.ts nodeStore 为 deprecated',
      file: 'src/app/stores/dashboard-stores.ts',
      location: 'nodeStore 定义上方 (L31)',
      type: '添加 JSDoc 废弃标记',
      note: 'dashboard-stores.ts 本身不删除（其他Store仍在使用）',
    },
  ],
  verificationChecklist: [
    { id: 'V4.1', item: '删除 Enhanced 后 pnpm test 全通过', method: '终端执行', passCriteria: '全部PASS' },
    { id: 'V4.2', item: 'interoperability 测试迁移后通过', method: '终端执行', passCriteria: 'nodeStore用例全部改用useNodeSlice' },
    { id: 'V4.3', item: 'pnpm build 生产构建成功', method: '终端执行', passCriteria: '零错误零警告' },
    { id: 'V4.4', item: 'pnpm lint 无新增警告', method: '终端执行', passCriteria: '零warning' },
    { id: 'V4.5', item: 'Electron 构建 pnpm build:mac 成功', method: '终端执行', passCriteria: '生成.dmg' },
  ],
  rollbackCommand: 'git stash (Phase 4 是纯删除操作)',
};

// ============================================================
// 七、各阶段影响范围矩阵
// ============================================================

export const IMPACT_MATRIX = [
  { phase: 'P0 基线', filesModified: 0, linesAdded: 0, linesDeleted: 0, risk: '无', dependsOn: '—' },
  { phase: 'P1 消除脑裂', filesModified: 2, linesAdded: 40, linesDeleted: 0, risk: '🟢 低', dependsOn: 'P0' },
  { phase: 'P2 双向同步', filesModified: 2, linesAdded: 20, linesDeleted: 0, risk: '🟡 中', dependsOn: 'P1' },
  { phase: 'P3 统一入口', filesModified: 1, linesAdded: 5, linesDeleted: 0, risk: '🟢 低', dependsOn: 'P2' },
  { phase: 'P4 清理债务', filesModified: 4, linesAdded: 10, linesDeleted: 450, risk: '🟡 中', dependsOn: 'P3' },
  { phase: '合计', filesModified: 9, linesAdded: 75, linesDeleted: 450, risk: '—', dependsOn: '—' },
];

// ============================================================
// 八、时间衔接表
// ============================================================

export const TIMELINE = [
  { day: 'Day 1 Morning', task: 'Phase 1 Step 1.1-1.3 DataBus 改造' },
  { day: 'Day 1 Afternoon', task: 'Phase 1 Step 1.4-1.5 + 验证 V1.1-V1.6', gate: '必须V1全绿才能进入Phase 2' },
  { day: 'Day 2 Morning', task: 'Phase 2 Step 2.1-2.2 node-slice 回推逻辑' },
  { day: 'Day 2 Afternoon', task: 'Phase 2 Step 2.3 日志增强 + 验证 V2.1-V2.5', gate: '稳定观察期 ≥ 4h' },
  { day: 'Day 3 Morning', task: 'Phase 3 Step 3.1-3.2 Dashboard 审计 + 防御注释' },
  { day: 'Day 3 Afternoon', task: 'Phase 3 验证 + 准备Phase 4迁移', gate: 'Phase 1-3 整体验证一轮' },
  { day: 'Day 4 Morning', task: 'Phase 4 Step 4.1-4.2 删除废弃文件 + 标记Legacy' },
  { day: 'Day 4 Afternoon', task: 'Phase 4 Step 4.3-4.4 测试迁移 + 全量验证 V4.1-V4.5', gate: '生产构建验证' },
  { day: 'Day 5 (可选)', task: '边界场景测试 + 性能回归检测' },
];

// ============================================================
// 九、最终验收标准
// ============================================================

export const ACCEPTANCE_CRITERIA = [
  'pnpm dev 启动零错误零警告',
  'pnpm type-check 通过',
  'pnpm lint 通过',
  'pnpm test 全量 PASS (覆盖率 ≥ 14%)',
  'pnpm build 生产构建成功',
  'Dashboard 9个节点正确渲染',
  'DataEditorPanel 编辑→保存→值保持',
  'WS 模拟模式下数据持续刷新',
  '控制台无 [DataBus] 红色错误日志',
  '仅存在 1 个活跃 WebSocket 管理 Hook',
  '仅存在 1 个活跃 Node Store',
  'DataBus 作为纯逻辑层被外部桥接驱动',
];

// ============================================================
// 十、风险控制与应急响应
// ============================================================

export const RISK_MATRIX = [
  {
    scenario: 'Phase 1 导致 WS 断连',
    trigger: 'pnpm dev 后页面无数据',
    response: '立即 git checkout 回滚两个文件',
    owner: '初源',
  },
  {
    scenario: 'Phase 2 sendWS 报错',
    trigger: '编辑保存时控制台红字',
    response: '检查 externalWSSender 是否注册成功',
    owner: '导师',
  },
  {
    scenario: 'Phase 3 Dashboard 白屏',
    trigger: 'React 渲染崩溃',
    response: '检查 useContext 是否返回 null',
    owner: '初源',
  },
  {
    scenario: 'Phase 4 测试大量失败',
    trigger: 'nodeStore mock 不兼容',
    response: '保留原测试文件，逐步迁移',
    owner: '导师',
  },
  {
    scenario: '整体性能下降',
    trigger: '页面 FPS < 50',
    response: '检查 publish 日志是否过于频繁',
    owner: '初源',
  },
];
