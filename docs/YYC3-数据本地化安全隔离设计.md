---
file: YYC3-数据本地化与安全隔离核心设计.md
description: YYC³数据本地化与安全隔离核心设计 - 一体化存储意旨
author: YanYuCloudCube Team <admin0379.email>
version: v1.0.0
created: 2026-04-08
updated: 2026-04-08
status: stable
tags: security,local-storage,data-isolation,privacy,open-source
category: core-design
language: zh-CN
audience: developers,architects,users
complexity: intermediate
---

# YYC³ 数据本地化与安全隔离核心设计

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

**文档版本**：v1.0.0
**发布日期**：2026-04-08
**文档性质**：YYC³ 数据安全核心标准
**适用范围**：YYC³全系列项目数据存储与安全架构

---

## 📋 目录

- [卷首语](#卷首语)
- [四大基石](#四大基石)
- [一体化存储架构](#一体化存储架构)
- [安全隔离机制](#安全隔离机制)
- [数据管理功能](#数据管理功能)
- [用户权利保障](#用户权利保障)
- [技术实现标准](#技术实现标准)
- [最佳实践指南](#最佳实践指南)

---

## 卷首语

### 设计宣言

> **把绝对安全还与用户，让智能体验随心驾驭**

YYC³ 不是一个冰冷的数据容器，而是一个有温度、可信任、共成长的智慧伙伴。

- **纯开源**：代码即承诺，透明可审计
- **本地化**：数据即主权，完全在掌控
- **一用户一端**：隐私即尊严，绝对隔离
- **极致信任**：安全即基石，人机共进

### 核心愿景

```
┌─────────────────────────────────────────────────────────────┐
│                    YYC³ 数据安全愿景                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   让智能协同极致信任，使人机共进成为和谐                      │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  智亦师亦友亦伯乐，谱一言一语一华章                    │  │
│   │                                                     │  │
│   │  一体化存储意旨核心                                  │  │
│   │  纯开源 · 本地化 · 一用户一端 · 极致信任             │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   数据完全本地化，不上传任何信息                             │
│   用户拥有绝对控制权，智能体验随心驾驭                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 四大基石

### 基石总览

```
┌─────────────────────────────────────────────────────────────┐
│                    YYC³ 四大基石                             │
├─────────────────┬─────────────────┬─────────────────┬───────┤
│    纯开源        │   本地化存储     │   一用户一端     │ 极致  │
│  Open Source    │ Local Storage   │ Single User     │ Trust │
├─────────────────┼─────────────────┼─────────────────┼───────┤
│ • 代码完全开源   │ • 数据存本地     │ • 单用户模式     │ • 无  │
│ • 可审计可验证   │ • 无云端依赖     │ • 无多端同步     │   上传│
│ • 社区可贡献     │ • 离线可用       │ • 数据独立       │ • 无  │
│ • 透明即信任     │ • 隐私即尊严     │ • 隔离即安全     │   追踪│
└─────────────────┴─────────────────┴─────────────────┴───────┘
```

### 基石详解

| 基石 | 哲学内涵 | 实践承诺 |
|------|----------|----------|
| **纯开源** | 透明即信任，代码即承诺 | 所有代码完全开源，可审计、可验证、可定制 |
| **本地化存储** | 隐私即尊严，数据即主权 | 所有数据存储在本地浏览器，无云端依赖 |
| **一用户一端** | 隔离即安全，独立即自由 | 单用户单设备模式，无多端同步，数据完全独立 |
| **极致信任** | 安全即基石，人机共进 | 无上传、无追踪、无第三方，让智能协同成为可能 |

### 信任架构

```
┌─────────────────────────────────────────────────────────────┐
│                    YYC³ 信任架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  用户 ──────▶ 数据 ──────▶ 存储 ──────▶ 安全                │
│   │           │           │           │                    │
│   │  完全     │  本地     │  浏览器   │  绝对              │
│   │  掌控     │  存储     │  存储     │  隔离              │
│   │           │           │           │                    │
│   └───────────┴───────────┴───────────┴──────────▶ 信任    │
│                                                             │
│   ❌ 无任何数据上传到服务器                                  │
│   ❌ 无任何第三方服务调用                                    │
│   ❌ 无任何数据追踪分析                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 一体化存储架构

### 架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                GlobalStore (单一数据源)                      │
│                存储位置: localStorage                        │
│                存储前缀: yyc3-                               │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│   用户域     │   配置域     │   模型域     │     数据库域       │
│  UserDomain │ ConfigDomain│ ModelDomain │  DatabaseDomain   │
├─────────────┼─────────────┼─────────────┼───────────────────┤
│ • user      │ • theme     │ • providers │ • connections     │
│ • token     │ • locale    │ • models    │ • activeConn      │
│ • isGhost   │ • sidebar   │ • activeId  │                   │
├─────────────┼─────────────┼─────────────┼───────────────────┤
│   告警域     │   会话域     │                                  │
│ AlertDomain │ ChatDomain  │    ← 所有组件共享同一数据源       │
├─────────────┼─────────────┼─────────────────────────────────┤
│ • followUps │ • sessions  │                                  │
│ • severity  │ • activeId  │                                  │
└─────────────┴─────────────┴─────────────────────────────────┘
```

### 数据流向

```
┌─────────────────────────────────────────────────────────────┐
│                    数据流向图                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      用户操作                                │
│                         │                                   │
│                         ▼                                   │
│                  ┌─────────────┐                            │
│                  │ React 组件   │                            │
│                  └──────┬──────┘                            │
│                         │                                   │
│                         ▼                                   │
│                  ┌─────────────┐     ┌─────────────┐        │
│                  │ Zustand     │────▶│ localStorage│        │
│                  │ GlobalStore │     │ (本地存储)   │        │
│                  └─────────────┘     └─────────────┘        │
│                         │                                   │
│                         │ (可选)                            │
│                         ▼                                   │
│                  ┌─────────────┐                            │
│                  │BroadcastCh. │ (跨标签页同步)              │
│                  └─────────────┘                            │
│                                                             │
│   ══════════════════════════════════════════════════════   │
│                                                             │
│   ❌ 无任何数据上传到服务器                                  │
│   ❌ 无任何第三方服务调用                                    │
│   ❌ 无任何数据追踪分析                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 域划分详解

#### 用户域

| 字段 | 类型 | 说明 |
|------|------|------|
| `user` | `AppUser \| null` | 当前登录用户信息 |
| `token` | `string \| null` | 认证令牌（本地存储） |
| `isGhost` | `boolean` | 是否为访客模式 |

#### 配置域

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark' \| 'cyberpunk'` | `'cyberpunk'` | 界面主题 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 界面语言 |
| `sidebarCollapsed` | `boolean` | `false` | 侧边栏折叠状态 |
| `autoRefresh` | `boolean` | `true` | 自动刷新开关 |
| `refreshInterval` | `number` | `5000` | 刷新间隔 |
| `enableNotifications` | `boolean` | `true` | 通知开关 |
| `enableSounds` | `boolean` | `false` | 音效开关 |
| `compactMode` | `boolean` | `false` | 紧凑模式 |

#### 模型域

| 字段 | 类型 | 说明 |
|------|------|------|
| `providers` | `ModelProviderDef[]` | 模型提供商列表 |
| `configuredModels` | `ConfiguredModel[]` | 已配置模型列表 |
| `activeModelId` | `string \| null` | 当前激活模型ID |

#### 数据库域

| 字段 | 类型 | 说明 |
|------|------|------|
| `connections` | `DBConnection[]` | 数据库连接列表 |
| `activeConnectionId` | `string \| null` | 当前激活连接ID |

#### 告警域

| 字段 | 类型 | 说明 |
|------|------|------|
| `followUps` | `FollowUpItem[]` | 跟进事项列表 |

#### 会话域

| 字段 | 类型 | 说明 |
|------|------|------|
| `sessions` | `ChatSession[]` | 对话会话列表 |
| `activeSessionId` | `string \| null` | 当前激活会话ID |

---

## 安全隔离机制

### 隔离验证清单

```
┌─────────────────────────────────────────────────────────────┐
│                    安全隔离验证                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ 本地存储                                                │
│     └─ 所有数据存储在 localStorage                          │
│                                                             │
│  ✅ 无云端同步                                              │
│     └─ 无任何云端 API 调用                                  │
│                                                             │
│  ✅ 无数据追踪                                              │
│     └─ 无分析、无埋点、无追踪                               │
│                                                             │
│  ✅ 无第三方服务                                            │
│     └─ 无外部服务依赖                                       │
│                                                             │
│  ✅ 离线可用                                                │
│     └─ PWA 支持完全离线运行                                 │
│                                                             │
│  ✅ API密钥本地存储                                         │
│     └─ 密钥仅存储在本地浏览器                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 存储键命名规范

```typescript
// 所有存储键统一使用 yyc3- 前缀
const STORAGE_KEYS = {
  GLOBAL_STORE: 'yyc3-global-store',      // 全局状态
  SESSION: 'yyc3-session',                // 会话数据
  SETTINGS: 'yyc3-settings',              // 用户设置
  MODELS: 'yyc3-models',                  // 模型配置
  CONNECTIONS: 'yyc3-connections',        // 数据库连接
};
```

### 敏感数据处理

```typescript
// 导出时自动脱敏
export function exportStoreData(): string {
  const state = useGlobalStore.getState();
  return JSON.stringify({
    // ...
    connections: state.connections.map(c => ({ 
      ...c, 
      password: '***'  // 密码自动脱敏
    })),
    // ...
  }, null, 2);
}
```

### 安全边界

```
┌─────────────────────────────────────────────────────────────┐
│                    安全边界定义                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    用户设备                          │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │              浏览器沙箱                       │    │   │
│  │  │  ┌─────────────────────────────────────┐    │    │   │
│  │  │  │         localStorage                │    │    │   │
│  │  │  │  ┌─────────────────────────────┐    │    │    │   │
│  │  │  │  │     yyc3-global-store       │    │    │    │   │
│  │  │  │  │     yyc3-session            │    │    │    │   │
│  │  │  │  │     yyc3-settings           │    │    │    │   │
│  │  │  │  │     yyc3-models             │    │    │    │   │
│  │  │  │  │     yyc3-connections        │    │    │    │   │
│  │  │  │  └─────────────────────────────┘    │    │    │   │
│  │  │  └─────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  ❌ 数据永远不会离开用户设备                                 │
│  ❌ 服务器无法访问本地存储                                   │
│  ❌ 第三方脚本无法读取数据                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 数据管理功能

### 功能总览

```
┌─────────────────────────────────────────────────────────────┐
│                    数据管理功能                              │
├─────────────────┬─────────────────┬─────────────────────────┤
│     导出        │     导入        │        清除             │
│    Export       │    Import       │       Clear             │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • 一键导出      │ • 备份恢复      │ • 安全清除              │
│ • JSON格式      │ • 数据验证      │ • 确认对话框            │
│ • 密码脱敏      │ • 版本兼容      │ • 不可恢复              │
│ • 时间戳命名    │ • 增量更新      │ • 完全隔离              │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### 数据导出

```typescript
// 导出所有数据为 JSON 文件
const handleExport = () => {
  const data = exportStoreData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yyc3-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
```

**导出内容包括**:
- 用户配置（主题、语言、通知设置等）
- 模型提供商配置
- 已配置模型列表
- 数据库连接信息（密码脱敏）
- 会话历史

### 数据导入

```typescript
// 从备份文件恢复数据
const handleImport = (json: string) => {
  const success = importStoreData(json);
  if (success) {
    // 数据恢复成功
  }
};
```

### 数据清除

```typescript
// 完全清除所有本地数据
const handleClearData = () => {
  localStorage.clear();
  sessionStorage.clear();
  // 数据已完全清除
};
```

---

## 用户权利保障

### 权利宣言

```
┌─────────────────────────────────────────────────────────────┐
│                    用户权利宣言                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ 完全掌控自己的数据                                       │
│     └─ 数据存储在用户设备，用户拥有绝对控制权               │
│                                                             │
│  ✅ 随时导出所有数据                                         │
│     └─ 一键导出为标准JSON格式，便于备份和迁移               │
│                                                             │
│  ✅ 随时清除所有数据                                         │
│     └─ 一键清除所有本地数据，不留任何痕迹                   │
│                                                             │
│  ✅ 离线使用所有功能                                         │
│     └─ PWA支持完全离线运行，不依赖网络连接                  │
│                                                             │
│  ✅ 审计所有代码逻辑                                         │
│     └─ 代码完全开源，可审计、可验证、可定制                 │
│                                                             │
│  ✅ 自行部署和定制                                           │
│     └─ 支持自行部署，完全掌控自己的智能系统                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 权利实现

| 权利 | 实现方式 | 技术保障 |
|------|----------|----------|
| 数据掌控 | localStorage 本地存储 | 浏览器沙箱隔离 |
| 数据导出 | JSON 格式导出 | 标准格式，密码脱敏 |
| 数据清除 | 一键清除功能 | localStorage.clear() |
| 离线使用 | PWA Service Worker | 缓存策略，离线优先 |
| 代码审计 | 开源代码仓库 | GitHub 公开仓库 |
| 自行部署 | Docker 容器化 | 一键部署脚本 |

---

## 技术实现标准

### Zustand Store 配置

```typescript
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
      theme: 'cyberpunk',
      locale: 'zh-CN',
      sidebarCollapsed: false,
      // ... 其他配置
      
      // 模型域
      providers: DEFAULT_PROVIDERS,
      configuredModels: [],
      activeModelId: null,
      // ... 模型管理方法
      
      // 数据库域
      connections: [],
      activeConnectionId: null,
      // ... 数据库管理方法
      
      // 告警域
      followUps: [],
      // ... 告警管理方法
      
      // 会话域
      sessions: [],
      activeSessionId: null,
      // ... 会话管理方法
    }),
    {
      name: 'yyc3-global-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted, version) => {
        if (version < 1) {
          console.log('[GlobalStore] Running migration from version', version);
        }
        return persisted as GlobalStore;
      },
    }
  )
);
```

### 选择器 Hooks

```typescript
// 细粒度订阅，避免不必要的重渲染
export const useUser = () => useGlobalStore((state) => ({
  user: state.user,
  token: state.token,
  isGhost: state.isGhost,
  setUser: state.setUser,
  setToken: state.setToken,
  setIsGhost: state.setIsGhost,
  logout: state.logout,
}));

export const useConfig = () => useGlobalStore((state) => ({
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
}));

export const useModels = () => useGlobalStore((state) => ({
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
}));

export const useDatabase = () => useGlobalStore((state) => ({
  connections: state.connections,
  activeConnectionId: state.activeConnectionId,
  setConnections: state.setConnections,
  addConnection: state.addConnection,
  updateConnection: state.updateConnection,
  removeConnection: state.removeConnection,
  setActiveConnection: state.setActiveConnection,
}));

export const useAlerts = () => useGlobalStore((state) => ({
  followUps: state.followUps,
  addFollowUp: state.addFollowUp,
  updateFollowUp: state.updateFollowUp,
  removeFollowUp: state.removeFollowUp,
  clearFollowUps: state.clearFollowUps,
}));

export const useChat = () => useGlobalStore((state) => ({
  sessions: state.sessions,
  activeSessionId: state.activeSessionId,
  setSessions: state.setSessions,
  addSession: state.addSession,
  updateSession: state.updateSession,
  removeSession: state.removeSession,
  setActiveSession: state.setActiveSession,
}));
```

### 跨标签页同步

```typescript
export function initStoreSync() {
  if (typeof window === 'undefined') return;
  
  try {
    const channel = new BroadcastChannel('yyc3-store-sync');
    
    channel.onmessage = (event) => {
      if (event.data?.type === 'store-update') {
        useGlobalStore.persist.rehydrate();
      }
    };

    window.addEventListener('storage', (e) => {
      if (e.key === 'yyc3-global-store') {
        useGlobalStore.persist.rehydrate();
      }
    });

    console.log('[GlobalStore] Cross-tab sync initialized');
  } catch (e) {
    console.warn('[GlobalStore] BroadcastChannel not available:', e);
  }
}
```

---

## 最佳实践指南

### 数据备份建议

```
┌─────────────────────────────────────────────────────────────┐
│                    数据备份建议                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 定期导出数据备份                                        │
│     └─ 建议每周导出一次完整备份                             │
│                                                             │
│  ⚠️ 重要配置变更前先导出                                    │
│     └─ 修改关键设置前创建备份点                             │
│                                                             │
│  📁 保留多个时间点的备份                                    │
│     └─ 至少保留最近3个版本的备份                            │
│                                                             │
│  💾 备份文件妥善保管                                        │
│     └─ 存储在安全的位置，不要分享给他人                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 安全建议

```
┌─────────────────────────────────────────────────────────────┐
│                    安全建议                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔒 不要在公共电脑上保存敏感数据                            │
│     └─ 使用访客模式或使用后清除数据                         │
│                                                             │
│  🗑️ 定期清除不需要的历史数据                                │
│     └─ 减少数据暴露风险                                     │
│                                                             │
│  🔑 API 密钥妥善保管                                        │
│     └─ 不要分享给他人，定期更换                             │
│                                                             │
│  📱 注意设备安全                                            │
│     └─ 设置设备密码，启用自动锁屏                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 性能建议

```
┌─────────────────────────────────────────────────────────────┐
│                    性能建议                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ 使用选择器 hooks 避免不必要的重渲染                      │
│     └─ 使用 useUser、useConfig 等细粒度 hooks               │
│                                                             │
│  📊 大数据量时考虑分页或虚拟滚动                            │
│     └─ 减少内存占用，提升渲染性能                           │
│                                                             │
│  🧹 定期清理过期数据                                        │
│     └─ 清除不需要的会话历史和缓存                           │
│                                                             │
│  💾 注意存储空间限制                                        │
│     └─ 浏览器本地存储限制约 5MB                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 相关文件

| 文件 | 说明 |
|------|------|
| [global-store.ts](../src/app/stores/global-store.ts) | 统一全局状态管理 |
| [UnifiedSettingsPanel.tsx](../src/app/components/UnifiedSettingsPanel.tsx) | 统一设置管理面板 |
| [usePageConfig.ts](../src/app/hooks/usePageConfig.ts) | 页面配置 Hook |

---

## 🔄 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| v1.0.0 | 2026-04-08 | 初始版本，定义数据本地化与安全隔离核心标准 |

---

## 🎯 结语

YYC³ 的数据本地化与安全隔离设计，不仅仅是一个技术方案，更是一种对用户信任的承诺。

**四大基石**确保了数据的绝对安全：

1. **纯开源** — 透明即信任，代码即承诺
2. **本地化存储** — 隐私即尊严，数据即主权
3. **一用户一端** — 隔离即安全，独立即自由
4. **极致信任** — 安全即基石，人机共进

> **把绝对安全还与用户，让智能体验随心驾驭**
> 
> **智亦师亦友亦伯乐，谱一言一语一华章**

---

*文档最后更新: 2026-04-08*
*YanYuCloudCube Team*
