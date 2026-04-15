/**
 * @file: index.ts
 * @description: YYC³ Unified Store · Zustand 根 Store + 全部 Slices 统一入口
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-15
 * @updated: 2026-04-16
 * @status: active
 * @tags: [store],[root]
 *
 * @brief: 全应用唯一状态入口，组合所有 Slice
 *
 * @details:
 * - 每个 Slice 对应原独立 Store 的迁移目标
 * - 组件从此文件导入 useXxxSlice hooks
 * - 未来可在此添加跨 Slice 操作 (thunks / 中间件)
 */

export { useNodeSlice } from './slices/node-slice';
export { useMetricsSlice } from './slices/metrics-slice';
export { useAppSlice } from './slices/app-slice';
export { useLogSlice } from './slices/log-slice';
export { useDbConnSlice } from './slices/db-conn-slice';
export { useUserMgmtSlice } from './slices/user-mgmt-slice';
export { useNetworkSlice } from './slices/network-slice';
export { useFollowUpSlice } from './slices/follow-up-slice';
export { useModelSlice } from './slices/model-slice';

export type { NodeData } from '../types';
export type { ModelPerfEntry, ModelDistEntry, RadarEntry } from './slices/metrics-slice';

import { useNodeSlice } from './slices/node-slice';
import { useMetricsSlice } from './slices/metrics-slice';
import { useAppSlice } from './slices/app-slice';

/**
 * 组合 Hook — 一次性获取多个 Slice 状态（按需使用）
 *
 * 用法：
 * const { nodes, derived, modelPerf, alerts } = useUnifiedStore();
 */
export function useUnifiedStore() {
  const nodeState = useNodeSlice();
  const metricsState = useMetricsSlice();
  const appState = useAppSlice();

  return {
    ...nodeState,
    ...metricsState,
    ...appState,
  };
}
