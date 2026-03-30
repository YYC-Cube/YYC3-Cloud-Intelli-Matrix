/**
 * stores/index.ts
 * ================
 * YYC³ 全局状态管理
 * 
 * 使用 Zustand 统一管理应用状态
 * - 用户状态
 * - 主题配置
 * - 语言设置
 * - UI 状态
 * - 缓存数据
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppUser, Locale, AlertData, NodeData } from '../app/types';

// ============================================================
// 用户状态
// ============================================================

interface UserState {
  user: AppUser | null;
  token: string | null;
  isGhost: boolean;
  setUser: (user: AppUser | null) => void;
  setToken: (token: string | null) => void;
  setIsGhost: (isGhost: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isGhost: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsGhost: (isGhost) => set({ isGhost }),
      logout: () => set({ user: null, token: null, isGhost: false }),
    }),
    {
      name: 'yyc3-user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// UI 状态
// ============================================================

interface UIState {
  theme: 'light' | 'dark' | 'cyberpunk';
  locale: Locale;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  setTheme: (theme: 'light' | 'dark' | 'cyberpunk') => void;
  setLocale: (locale: Locale) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'cyberpunk',
      locale: 'zh-CN',
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'yyc3-ui-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// 告警状态
// ============================================================

interface AlertState {
  alerts: AlertData[];
  maxAlerts: number;
  addAlert: (alert: AlertData) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>()((set) => ({
  alerts: [],
  maxAlerts: 100,
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, state.maxAlerts),
    })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
  clearAlerts: () => set({ alerts: [] }),
}));

// ============================================================
// 节点状态缓存
// ============================================================

interface NodeCacheState {
  nodes: NodeData[];
  lastUpdate: string | null;
  setNodes: (nodes: NodeData[]) => void;
  updateNode: (id: string, updates: Partial<NodeData>) => void;
  clearNodes: () => void;
}

export const useNodeCacheStore = create<NodeCacheState>()(
  persist(
    (set) => ({
      nodes: [],
      lastUpdate: null,
      setNodes: (nodes) =>
        set({
          nodes,
          lastUpdate: new Date().toISOString(),
        }),
      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...updates } : node
          ),
          lastUpdate: new Date().toISOString(),
        })),
      clearNodes: () => set({ nodes: [], lastUpdate: null }),
    }),
    {
      name: 'yyc3-node-cache',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// 性能监控状态
// ============================================================

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  bundleSize: number;
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  history: PerformanceMetrics[];
  maxHistory: number;
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  addHistory: (metrics: PerformanceMetrics) => void;
  clearHistory: () => void;
}

export const usePerformanceStore = create<PerformanceState>()((set) => ({
  metrics: {
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    bundleSize: 0,
  },
  history: [],
  maxHistory: 60,
  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),
  addHistory: (metrics) =>
    set((state) => ({
      history: [...state.history, metrics].slice(-state.maxHistory),
    })),
  clearHistory: () => set({ history: [] }),
}));

// ============================================================
// 设置状态
// ============================================================

interface SettingsState {
  autoRefresh: boolean;
  refreshInterval: number;
  enableNotifications: boolean;
  enableSounds: boolean;
  compactMode: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setEnableNotifications: (enabled: boolean) => void;
  setEnableSounds: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  autoRefresh: true,
  refreshInterval: 5000,
  enableNotifications: true,
  enableSounds: false,
  compactMode: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setEnableNotifications: (enableNotifications) => set({ enableNotifications }),
      setEnableSounds: (enableSounds) => set({ enableSounds }),
      setCompactMode: (compactMode) => set({ compactMode }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'yyc3-settings-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// 组合 Store（可选）
// ============================================================

// 如果需要在组件中访问多个 store，可以创建组合 hook
export const useAppStores = () => {
  const userStore = useUserStore();
  const uiStore = useUIStore();
  const alertStore = useAlertStore();
  const nodeCacheStore = useNodeCacheStore();
  const performanceStore = usePerformanceStore();
  const settingsStore = useSettingsStore();

  return {
    user: userStore,
    ui: uiStore,
    alerts: alertStore,
    nodeCache: nodeCacheStore,
    performance: performanceStore,
    settings: settingsStore,
  };
};
