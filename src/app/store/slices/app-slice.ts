/**
 * @file: app-slice.ts
 * @description: YYC³ 应用基础 Slice · 合并原 useUserStore + useUIStore + useAlertStore + usePerformanceStore
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-15
 * @updated: 2026-04-16
 * @status: active
 * @tags: [store],[slice],[app]
 *
 * @brief: 应用级基础状态：用户认证、UI主题、告警、性能指标
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, AlertData, Locale } from '../../types';

export interface RecentOpEntry {
  id: string;
  action: string;
  target: string;
  user: string;
  time: string;
  status: "success" | "running" | "pending" | "warning" | "error";
}

const DEFAULT_RECENT_OPS: RecentOpEntry[] = [
  { id: "OP-001", action: "模型部署", target: "DeepSeek-V3 → GPU-A100-03", user: "admin",   time: "14:28:32", status: "success" },
  { id: "OP-002", action: "推理任务", target: "Batch#2847 → LLaMA-70B",    user: "api_svc", time: "14:25:10", status: "running" },
  { id: "OP-003", action: "节点扩容", target: "GPU-H100-03 加入集群",      user: "ops_bot", time: "14:20:55", status: "pending" },
  { id: "OP-004", action: "数据同步", target: "向量库 → 分片迁移",         user: "admin",   time: "14:15:22", status: "success" },
  { id: "OP-005", action: "告警处理", target: "GPU-A100-03 温度预警",      user: "system",  time: "14:10:08", status: "warning" },
];

interface AppSlice {
  user: AppUser | null;
  token: string | null;
  isGhost: boolean;
  theme: 'light' | 'dark' | 'cyberpunk';
  locale: Locale;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  alerts: AlertData[];
  maxAlerts: number;
  fps: number;
  memoryUsage: number;
  recentOps: RecentOpEntry[];

  setUser: (user: AppUser | null) => void;
  setToken: (token: string | null) => void;
  setIsGhost: (isGhost: boolean) => void;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark' | 'cyberpunk') => void;
  setLocale: (locale: Locale) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addAlert: (alert: AlertData) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  setFps: (fps: number) => void;
  setMemoryUsage: (usage: number) => void;
  addRecentOp: (op: RecentOpEntry) => void;
  clearRecentOps: () => void;
}

export const useAppSlice = create<AppSlice>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isGhost: false,
      theme: 'cyberpunk',
      locale: 'zh-CN',
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      alerts: [],
      maxAlerts: 100,
      fps: 60,
      memoryUsage: 0,
      recentOps: DEFAULT_RECENT_OPS,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsGhost: (isGhost) => set({ isGhost }),
      logout: () => set({ user: null, token: null, isGhost: false }),
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      addAlert: (alert) =>
        set((s) => ({ alerts: [alert, ...s.alerts].slice(0, s.maxAlerts) })),
      removeAlert: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      clearAlerts: () => set({ alerts: [] }),
      setFps: (fps) => set({ fps }),
      setMemoryUsage: (usage) => set({ memoryUsage: usage }),
      addRecentOp: (op) =>
        set((s) => ({ recentOps: [op, ...s.recentOps].slice(0, 50) })),
      clearRecentOps: () => set({ recentOps: [] }),
    }),
    {
      name: 'yyc3-app-slice',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
