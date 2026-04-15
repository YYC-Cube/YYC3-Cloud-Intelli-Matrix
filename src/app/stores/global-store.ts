/**
 * @file: global-store.ts
 * @description: global-store.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { 
  AppUser, 
  Locale,
  ConfiguredModel,
  ModelProviderDef,
  DBConnection,
  FollowUpItem,
  ChatSession,
} from '../types';

// ============================================================
// 数据域定义
// ============================================================

interface UserDomain {
  user: AppUser | null;
  token: string | null;
  isGhost: boolean;
  setUser: (user: AppUser | null) => void;
  setToken: (token: string | null) => void;
  setIsGhost: (isGhost: boolean) => void;
  logout: () => void;
}

interface ConfigDomain {
  theme: 'light' | 'dark' | 'cyberpunk';
  locale: Locale;
  sidebarCollapsed: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  enableNotifications: boolean;
  enableSounds: boolean;
  compactMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'cyberpunk') => void;
  setLocale: (locale: Locale) => void;
  toggleSidebar: () => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setEnableNotifications: (enabled: boolean) => void;
  setEnableSounds: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  resetConfig: () => void;
}

interface ModelDomain {
  providers: ModelProviderDef[];
  configuredModels: ConfiguredModel[];
  activeModelId: string | null;
  setProviders: (providers: ModelProviderDef[]) => void;
  addProvider: (provider: ModelProviderDef) => void;
  updateProvider: (id: string, updates: Partial<ModelProviderDef>) => void;
  removeProvider: (id: string) => void;
  setConfiguredModels: (models: ConfiguredModel[]) => void;
  addConfiguredModel: (model: ConfiguredModel) => void;
  updateConfiguredModel: (id: string, updates: Partial<ConfiguredModel>) => void;
  removeConfiguredModel: (id: string) => void;
  setActiveModel: (id: string | null) => void;
}

interface DatabaseDomain {
  connections: DBConnection[];
  activeConnectionId: string | null;
  setConnections: (connections: DBConnection[]) => void;
  addConnection: (conn: DBConnection) => void;
  updateConnection: (id: string, updates: Partial<DBConnection>) => void;
  removeConnection: (id: string) => void;
  setActiveConnection: (id: string | null) => void;
}

interface AlertDomain {
  followUps: FollowUpItem[];
  addFollowUp: (item: FollowUpItem) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUpItem>) => void;
  removeFollowUp: (id: string) => void;
  clearFollowUps: () => void;
}

interface ChatDomain {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  removeSession: (id: string) => void;
  setActiveSession: (id: string | null) => void;
}

// ============================================================
// 默认值
// ============================================================

const DEFAULT_CONFIG = {
  theme: 'cyberpunk' as const,
  locale: 'zh-CN' as Locale,
  sidebarCollapsed: false,
  autoRefresh: true,
  refreshInterval: 5000,
  enableNotifications: true,
  enableSounds: false,
  compactMode: false,
};

const DEFAULT_PROVIDERS: ModelProviderDef[] = [
  {
    id: "zhipu",
    label: "Z.ai",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    authType: "api-key",
    models: ["glm-4-flash", "glm-4-plus", "glm-4-air", "glm-4-airx", "glm-4-long", "glm-4v-plus"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "zhipu-plan",
    label: "Z.ai-plan",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    authType: "api-key",
    models: ["glm-4-plan", "glm-4-plan-plus"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "kimi-cn",
    label: "Kimi-CN",
    baseUrl: "https://api.moonshot.cn/v1",
    authType: "bearer",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "kimi-global",
    label: "Kimi-Global",
    baseUrl: "https://api.moonshot.ai/v1",
    authType: "bearer",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    authType: "bearer",
    models: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "volcengine",
    label: "火山引擎",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    authType: "bearer",
    models: ["doubao-pro-32k", "doubao-pro-128k", "doubao-lite-32k"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "volcengine-plan",
    label: "火山引擎 Plan",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    authType: "bearer",
    models: ["doubao-plan-pro", "doubao-plan-lite"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    authType: "bearer",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "o1-preview", "o1-mini"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "ollama",
    label: "Ollama (本地)",
    baseUrl: "http://localhost:11434",
    authType: "none",
    models: [],
    requiresApiKey: false,
    isLocal: true,
    isBuiltin: true,
  },
];

// ============================================================
// 统一全局 Store
// ============================================================

interface GlobalStore extends UserDomain, ConfigDomain, ModelDomain, DatabaseDomain, AlertDomain, ChatDomain {
  _version: number;
  _lastSync: string | null;
  _migrate: () => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // 元数据
      _version: 1,
      _lastSync: null,
      
      // 用户域
      user: null,
      token: null,
      isGhost: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsGhost: (isGhost) => set({ isGhost }),
      logout: () => set({ user: null, token: null, isGhost: false }),

      // 配置域
      ...DEFAULT_CONFIG,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setEnableNotifications: (enableNotifications) => set({ enableNotifications }),
      setEnableSounds: (enableSounds) => set({ enableSounds }),
      setCompactMode: (compactMode) => set({ compactMode }),
      resetConfig: () => set(DEFAULT_CONFIG),

      // 模型域
      providers: DEFAULT_PROVIDERS,
      configuredModels: [],
      activeModelId: null,
      setProviders: (providers) => set({ providers }),
      addProvider: (provider) => set((state) => ({ providers: [...state.providers, provider] })),
      updateProvider: (id, updates) => set((state) => ({
        providers: state.providers.map((p) => p.id === id ? { ...p, ...updates } : p),
      })),
      removeProvider: (id) => set((state) => ({
        providers: state.providers.filter((p) => p.id !== id),
      })),
      setConfiguredModels: (configuredModels) => set({ configuredModels }),
      addConfiguredModel: (model) => set((state) => ({ 
        configuredModels: [...state.configuredModels, model] 
      })),
      updateConfiguredModel: (id, updates) => set((state) => ({
        configuredModels: state.configuredModels.map((m) => m.id === id ? { ...m, ...updates } : m),
      })),
      removeConfiguredModel: (id) => set((state) => ({
        configuredModels: state.configuredModels.filter((m) => m.id !== id),
        activeModelId: state.activeModelId === id ? null : state.activeModelId,
      })),
      setActiveModel: (activeModelId) => set({ activeModelId }),

      // 数据库域 (写入时反向桥接到 db-conn-slice)
      connections: [],
      activeConnectionId: null,
      setConnections: (connections) => {
        set({ connections });
        try {
          const { useDbConnSlice } = require("../store/slices/db-conn-slice");
          const sliceConns = useDbConnSlice.getState().connections;
          if (JSON.stringify(sliceConns.map((c: { id: string }) => c.id)) !== JSON.stringify(connections.map((c) => c.id))) {
            useDbConnSlice.setState({ connections });
          }
        } catch { /* slice not available */ }
      },
      addConnection: (conn) => set((state) => ({ connections: [...state.connections, conn] })),
      updateConnection: (id, updates) => set((state) => ({
        connections: state.connections.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),
      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter((c) => c.id !== id),
        activeConnectionId: state.activeConnectionId === id ? null : state.activeConnectionId,
      })),
      setActiveConnection: (activeConnectionId) => set({ activeConnectionId }),

      // 告警域
      followUps: [],
      addFollowUp: (item) => set((state) => ({ followUps: [...state.followUps, item] })),
      updateFollowUp: (id, updates) => set((state) => ({
        followUps: state.followUps.map((f) => f.id === id ? { ...f, ...updates } : f),
      })),
      removeFollowUp: (id) => set((state) => ({
        followUps: state.followUps.filter((f) => f.id !== id),
      })),
      clearFollowUps: () => set({ followUps: [] }),

      // 会话域
      sessions: [],
      activeSessionId: null,
      setSessions: (sessions) => set({ sessions }),
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map((s) => s.id === id ? { ...s, ...updates } : s),
      })),
      removeSession: (id) => set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
      })),
      setActiveSession: (activeSessionId) => set({ activeSessionId }),

      // 迁移函数
      _migrate: () => {
        const state = get();
        if (state._version < 1) {
          console.info('[GlobalStore] Migrating to version 1...');
          set({ _version: 1 });
        }
      },
    }),
    {
      name: 'yyc3-global-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted, version) => {
        if (version < 1) {
          console.info('[GlobalStore] Running migration from version', version);
        }
        return persisted as GlobalStore;
      },
    }
  )
);

// ============================================================
// 选择器 Hooks (优化性能)
// ============================================================

export const useUser = () => useGlobalStore(useShallow((state) => ({
  user: state.user,
  token: state.token,
  isGhost: state.isGhost,
  setUser: state.setUser,
  setToken: state.setToken,
  setIsGhost: state.setIsGhost,
  logout: state.logout,
})));

export const useConfig = () => useGlobalStore(useShallow((state) => ({
  theme: state.theme,
  locale: state.locale,
  sidebarCollapsed: state.sidebarCollapsed,
  autoRefresh: state.autoRefresh,
  refreshInterval: state.refreshInterval,
  enableNotifications: state.enableNotifications,
  enableSounds: state.enableSounds,
  compactMode: state.compactMode,
  setTheme: state.setTheme,
  setLocale: state.setLocale,
  toggleSidebar: state.toggleSidebar,
  setAutoRefresh: state.setAutoRefresh,
  setRefreshInterval: state.setRefreshInterval,
  setEnableNotifications: state.setEnableNotifications,
  setEnableSounds: state.setEnableSounds,
  setCompactMode: state.setCompactMode,
  resetConfig: state.resetConfig,
})));

export const useModels = () => useGlobalStore(useShallow((state) => ({
  providers: state.providers,
  configuredModels: state.configuredModels,
  activeModelId: state.activeModelId,
  setProviders: state.setProviders,
  addProvider: state.addProvider,
  updateProvider: state.updateProvider,
  removeProvider: state.removeProvider,
  setConfiguredModels: state.setConfiguredModels,
  addConfiguredModel: state.addConfiguredModel,
  updateConfiguredModel: state.updateConfiguredModel,
  removeConfiguredModel: state.removeConfiguredModel,
  setActiveModel: state.setActiveModel,
})));

export const useDatabase = () => useGlobalStore(useShallow((state) => ({
  connections: state.connections,
  activeConnectionId: state.activeConnectionId,
  setConnections: state.setConnections,
  addConnection: state.addConnection,
  updateConnection: state.updateConnection,
  removeConnection: state.removeConnection,
  setActiveConnection: state.setActiveConnection,
})));

export const useAlerts = () => useGlobalStore(useShallow((state) => ({
  followUps: state.followUps,
  addFollowUp: state.addFollowUp,
  updateFollowUp: state.updateFollowUp,
  removeFollowUp: state.removeFollowUp,
  clearFollowUps: state.clearFollowUps,
})));

export const useChat = () => useGlobalStore(useShallow((state) => ({
  sessions: state.sessions,
  activeSessionId: state.activeSessionId,
  setSessions: state.setSessions,
  addSession: state.addSession,
  updateSession: state.updateSession,
  removeSession: state.removeSession,
  setActiveSession: state.setActiveSession,
})));

// ============================================================
// 跨标签页同步 (统一频道)
// ============================================================

import { onUnifiedSync, broadcastSyncMessage } from '../lib/broadcast-channel';

const SYNC_CHANNEL = 'yyc3-store-sync';

export function initStoreSync() {
  if (typeof window === 'undefined') {return;}

  try {
    // 旧通道兼容
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data?.type === 'store-update') {
        useGlobalStore.persist.rehydrate();
      }
    };

    // 统一频道监听
    onUnifiedSync((msg) => {
      if (msg.domain === 'global-store' ||
          msg.domain === 'model-providers' ||
          msg.domain === 'settings' ||
          msg.domain === 'db-conn-slice' ||
          msg.domain === 'follow-up-slice') {
        useGlobalStore.persist.rehydrate();
        syncAllSlicesToGlobal();
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'yyc3-global-store' ||
          e.key === 'yyc3_model_providers' ||
          e.key === 'yyc3_configured_models' ||
          e.key === 'yyc3_system_settings') {
        useGlobalStore.persist.rehydrate();
        syncAllSlicesToGlobal();
      }
    });

    console.info('[GlobalStore] Unified cross-tab sync initialized');
  } catch (e) {
    console.warn('[GlobalStore] BroadcastChannel not available:', e);
  }
}

/**
 * 广播 GlobalStore 变更到统一频道
 */
export function broadcastGlobalStoreChange(action: string = 'update') {
  broadcastSyncMessage({ domain: 'global-store', action: action as 'update' });
}

// ============================================================
// 数据导出/导入
// ============================================================

export function exportStoreData(): string {
  const state = useGlobalStore.getState();
  return JSON.stringify({
    _exportedAt: new Date().toISOString(),
    _version: state._version,
    user: state.user,
    config: {
      theme: state.theme,
      locale: state.locale,
      autoRefresh: state.autoRefresh,
      refreshInterval: state.refreshInterval,
      enableNotifications: state.enableNotifications,
      enableSounds: state.enableSounds,
      compactMode: state.compactMode,
    },
    providers: state.providers,
    configuredModels: state.configuredModels,
    connections: state.connections.map(c => ({ ...c, password: '***' })),
    sessions: state.sessions,
  }, null, 2);
}

export function importStoreData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    const state = useGlobalStore.getState();
    
    if (data.config) {
      state.setTheme(data.config.theme);
      state.setLocale(data.config.locale);
      state.setAutoRefresh(data.config.autoRefresh);
      state.setRefreshInterval(data.config.refreshInterval);
      state.setEnableNotifications(data.config.enableNotifications);
      state.setEnableSounds(data.config.enableSounds);
      state.setCompactMode(data.config.compactMode);
    }
    
    if (data.providers) {
      state.setProviders(data.providers);
    }
    
    if (data.configuredModels) {
      state.setConfiguredModels(data.configuredModels);
    }
    
    if (data.connections) {
      state.setConnections(data.connections);
    }
    
    if (data.sessions) {
      state.setSessions(data.sessions);
    }
    
    return true;
  } catch (e) {
    console.error('[GlobalStore] Import failed:', e);
    return false;
  }
}

// ============================================================
// SSOT 桥接函数 — 让外部 Store/Hook 的写入同步到 GlobalStore
// ============================================================

/**
 * 桥接: useModelProvider → GlobalStore
 * 当 useModelProvider 的 providers 或 configuredModels 变更时调用，
 * 确保从 GlobalStore 读取的组件也能看到最新数据。
 */
export function bridgeProvidersToGlobal(providers: ModelProviderDef[]) {
  useGlobalStore.getState().setProviders(providers);
}

export function bridgeModelsToGlobal(models: ConfiguredModel[]) {
  useGlobalStore.getState().setConfiguredModels(models);
}

/**
 * 桥接: db-conn-slice → GlobalStore
 * 当 DatabaseConnectionPanel 编辑连接时调用。
 */
export function bridgeConnectionsToGlobal(connections: import('../types').DBConnection[]) {
  useGlobalStore.getState().setConnections(connections);
}

/**
 * 桥接: follow-up-slice → GlobalStore
 * 当 FollowUpManager 编辑跟进任务时调用。
 */
export function bridgeFollowUpsToGlobal(followUps: import('../types').FollowUpRecord[]) {
  const items: import('../types').FollowUpItem[] = followUps.map(fu => ({
    id: fu.id,
    title: fu.taskName,
    severity: (fu.priority === "critical" ? "critical" : fu.priority === "high" ? "error" : "warning") as import('../types').FollowUpSeverity,
    status: (fu.status === "completed" ? "resolved" : fu.status === "cancelled" ? "ignored" : "active") as import('../types').FollowUpStatus,
    source: fu.category,
    timestamp: fu.createdAt,
    chain: [],
    assignee: fu.assigneeName,
  }));
  useGlobalStore.getState().clearFollowUps();
  items.forEach(item => useGlobalStore.getState().addFollowUp(item));
}

/**
 * 全量数据同步: 将所有 Slice Store 的当前状态拉取到 GlobalStore
 * 用于应用启动时确保一致性。
 */
export function syncAllSlicesToGlobal() {
  // 模型服务商: 从 localStorage 的 yyc3_model_providers 读取
  try {
    const rawProviders = localStorage.getItem('yyc3_model_providers');
    if (rawProviders) {
      const providers = JSON.parse(rawProviders) as ModelProviderDef[];
      if (providers.length > 0) {
        useGlobalStore.getState().setProviders(providers);
      }
    }
  } catch { /* ignore */ }

  // 已配置模型: 从 localStorage 的 yyc3_configured_models 读取
  try {
    const rawModels = localStorage.getItem('yyc3_configured_models');
    if (rawModels) {
      const models = JSON.parse(rawModels) as ConfiguredModel[];
      if (models.length > 0) {
        useGlobalStore.getState().setConfiguredModels(models);
      }
    }
  } catch { /* ignore */ }
}
