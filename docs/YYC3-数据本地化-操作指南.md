---
file: YYC3-数据本地化操作指南.md
description: YYC³数据本地化操作指南 - 详细操作示例
author: YanYuCloudCube Team <admin0379.email>
version: v1.0.0
created: 2026-04-08
updated: 2026-04-08
status: stable
tags: guide,operations,examples,local-storage
category: documentation
language: zh-CN
audience: developers,users
complexity: beginner
---

# YYC³ 数据本地化操作指南

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*

---

**文档版本**：v1.0.0  
**发布日期**：2026-04-08  
**文档性质**：YYC³ 数据操作指南  
**适用范围**：YYC³全系列项目数据操作

---

## 📋 目录

- [操作指南总览](#操作指南总览)
- [用户域操作](#用户域操作)
- [配置域操作](#配置域操作)
- [模型域操作](#模型域操作)
- [数据库域操作](#数据库域操作)
- [告警域操作](#告警域操作)
- [会话域操作](#会话域操作)
- [数据导入导出操作](#数据导入导出操作)
- [UI组件使用指南](#ui组件使用指南)

---

## 操作指南总览

### 数据域划分

```
┌─────────────────────────────────────────────────────────────┐
│                    YYC³ 数据域划分                           │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│   用户域     │   配置域     │   模型域     │     数据库域       │
│  UserDomain │ ConfigDomain│ ModelDomain │  DatabaseDomain   │
├─────────────┼─────────────┼─────────────┼───────────────────┤
│ • user      │ • theme     │ • providers │ • connections     │
│ • token     │ • locale    │ • models    │ • activeConn      │
│ • isGhost   │ • sidebar   │ • activeId  │                   │
├─────────────┼─────────────┼─────────────┼───────────────────┤
│   告警域     │   会话域     │                                  │
│ AlertDomain │ ChatDomain  │                                  │
├─────────────┼─────────────┼─────────────────────────────────┤
│ • followUps │ • sessions  │                                  │
│ • severity  │ • activeId  │                                  │
└─────────────┴─────────────┴─────────────────────────────────┘
```

### 操作方式对比

| 操作方式 | 适用场景 | 复杂度 |
|----------|----------|--------|
| **选择器 Hooks** | 组件内响应式数据 | ⭐ 简单 |
| **直接调用 Store** | 非组件环境 | ⭐⭐ 中等 |
| **UI 组件** | 用户界面操作 | ⭐ 简单 |

---

## 用户域操作

### 1. 获取用户信息

#### 方式一：使用选择器 Hook（推荐）

```tsx
import { useUser } from '../stores/global-store';

function UserProfile() {
  const { user, isGhost } = useUser();
  
  if (isGhost) {
    return <div>访客模式</div>;
  }
  
  return (
    <div>
      <p>用户名：{user?.name}</p>
      <p>邮箱：{user?.email}</p>
      <p>角色：{user?.role}</p>
    </div>
  );
}
```

#### 方式二：直接访问 Store

```tsx
import { useGlobalStore } from '../stores/global-store';

function UserProfile() {
  const user = useGlobalStore((state) => state.user);
  const isGhost = useGlobalStore((state) => state.isGhost);
  
  return (
    <div>
      {isGhost ? '访客模式' : `欢迎，${user?.name}`}
    </div>
  );
}
```

### 2. 设置用户信息

```tsx
import { useUser } from '../stores/global-store';

function LoginForm() {
  const { setUser, setToken, setIsGhost } = useUser();
  
  const handleLogin = async (credentials) => {
    // 登录逻辑...
    const response = await login(credentials);
    
    // 设置用户信息
    setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
    });
    
    // 设置令牌
    setToken(response.token);
  };
  
  const handleGhostMode = () => {
    setIsGhost(true);
  };
  
  return (
    <div>
      <button onClick={handleLogin}>登录</button>
      <button onClick={handleGhostMode}>访客模式</button>
    </div>
  );
}
```

### 3. 用户登出

```tsx
import { useUser } from '../stores/global-store';

function LogoutButton() {
  const { logout, user } = useUser();
  
  const handleLogout = () => {
    // 清除所有用户数据
    logout();
    // 跳转到登录页
    navigate('/login');
  };
  
  return (
    <button onClick={handleLogout}>
      登出 ({user?.name})
    </button>
  );
}
```

### 4. 用户域完整操作示例

```tsx
import { useUser } from '../stores/global-store';

function UserManagement() {
  const { 
    user, 
    token, 
    isGhost, 
    setUser, 
    setToken, 
    setIsGhost, 
    logout 
  } = useUser();
  
  // 检查登录状态
  const isLoggedIn = !!user && !!token;
  
  // 切换访客模式
  const toggleGhostMode = () => {
    if (isGhost) {
      setIsGhost(false);
    } else {
      logout(); // 先清除用户数据
      setIsGhost(true);
    }
  };
  
  // 更新用户信息
  const updateUserInfo = (updates) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };
  
  return (
    <div>
      <h2>用户管理</h2>
      
      {/* 显示当前状态 */}
      <div>
        状态：{isGhost ? '访客模式' : isLoggedIn ? '已登录' : '未登录'}
      </div>
      
      {/* 用户信息 */}
      {user && (
        <div>
          <p>用户名：{user.name}</p>
          <p>邮箱：{user.email}</p>
          <p>角色：{user.role}</p>
        </div>
      )}
      
      {/* 操作按钮 */}
      <div>
        <button onClick={toggleGhostMode}>
          {isGhost ? '退出访客模式' : '进入访客模式'}
        </button>
        {isLoggedIn && (
          <button onClick={logout}>登出</button>
        )}
      </div>
    </div>
  );
}
```

---

## 配置域操作

### 1. 获取配置信息

```tsx
import { useConfig } from '../stores/global-store';

function SettingsDisplay() {
  const { 
    theme, 
    locale, 
    sidebarCollapsed,
    autoRefresh,
    refreshInterval,
    enableNotifications,
    enableSounds,
    compactMode,
  } = useConfig();
  
  return (
    <div>
      <p>主题：{theme}</p>
      <p>语言：{locale}</p>
      <p>侧边栏：{sidebarCollapsed ? '折叠' : '展开'}</p>
      <p>自动刷新：{autoRefresh ? '开启' : '关闭'}</p>
      <p>刷新间隔：{refreshInterval}ms</p>
      <p>通知：{enableNotifications ? '开启' : '关闭'}</p>
      <p>音效：{enableSounds ? '开启' : '关闭'}</p>
      <p>紧凑模式：{compactMode ? '开启' : '关闭'}</p>
    </div>
  );
}
```

### 2. 修改主题

```tsx
import { useConfig } from '../stores/global-store';

function ThemeSelector() {
  const { theme, setTheme } = useConfig();
  
  const themes = [
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' },
    { value: 'cyberpunk', label: '赛博朋克' },
  ];
  
  return (
    <select 
      value={theme} 
      onChange={(e) => setTheme(e.target.value as any)}
    >
      {themes.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
```

### 3. 修改语言

```tsx
import { useConfig } from '../stores/global-store';

function LocaleSelector() {
  const { locale, setLocale } = useConfig();
  
  const locales = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en-US', label: 'English' },
  ];
  
  return (
    <select 
      value={locale} 
      onChange={(e) => setLocale(e.target.value as any)}
    >
      {locales.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
```

### 4. 切换侧边栏

```tsx
import { useConfig } from '../stores/global-store';

function SidebarToggle() {
  const { sidebarCollapsed, toggleSidebar } = useConfig();
  
  return (
    <button onClick={toggleSidebar}>
      {sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
    </button>
  );
}
```

### 5. 配置自动刷新

```tsx
import { useConfig } from '../stores/global-store';

function AutoRefreshSettings() {
  const { 
    autoRefresh, 
    setAutoRefresh, 
    refreshInterval, 
    setRefreshInterval 
  } = useConfig();
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
        />
        启用自动刷新
      </label>
      
      {autoRefresh && (
        <div>
          <label>刷新间隔（毫秒）：</label>
          <input
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            min={1000}
            max={60000}
            step={1000}
          />
        </div>
      )}
    </div>
  );
}
```

### 6. 重置配置

```tsx
import { useConfig } from '../stores/global-store';

function ResetSettings() {
  const { resetConfig } = useConfig();
  
  const handleReset = () => {
    if (confirm('确定要重置所有配置吗？')) {
      resetConfig();
    }
  };
  
  return (
    <button onClick={handleReset}>
      重置为默认配置
    </button>
  );
}
```

### 7. 配置域完整操作示例

```tsx
import { useConfig } from '../stores/global-store';

function ConfigPanel() {
  const {
    theme,
    locale,
    sidebarCollapsed,
    autoRefresh,
    refreshInterval,
    enableNotifications,
    enableSounds,
    compactMode,
    setTheme,
    setLocale,
    toggleSidebar,
    setAutoRefresh,
    setRefreshInterval,
    setEnableNotifications,
    setEnableSounds,
    setCompactMode,
    resetConfig,
  } = useConfig();
  
  return (
    <div className="config-panel">
      <h2>系统配置</h2>
      
      {/* 主题设置 */}
      <div className="config-item">
        <label>主题</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
          <option value="light">浅色</option>
          <option value="dark">深色</option>
          <option value="cyberpunk">赛博朋克</option>
        </select>
      </div>
      
      {/* 语言设置 */}
      <div className="config-item">
        <label>语言</label>
        <select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>
      
      {/* 侧边栏设置 */}
      <div className="config-item">
        <label>侧边栏</label>
        <button onClick={toggleSidebar}>
          {sidebarCollapsed ? '展开' : '折叠'}
        </button>
      </div>
      
      {/* 自动刷新设置 */}
      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          自动刷新
        </label>
        {autoRefresh && (
          <input
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            min={1000}
            max={60000}
          />
        )}
      </div>
      
      {/* 通知设置 */}
      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={enableNotifications}
            onChange={(e) => setEnableNotifications(e.target.checked)}
          />
          启用通知
        </label>
      </div>
      
      {/* 音效设置 */}
      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={enableSounds}
            onChange={(e) => setEnableSounds(e.target.checked)}
          />
          启用音效
        </label>
      </div>
      
      {/* 紧凑模式设置 */}
      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
          />
          紧凑模式
        </label>
      </div>
      
      {/* 重置按钮 */}
      <button onClick={resetConfig}>
        重置为默认配置
      </button>
    </div>
  );
}
```

---

## 模型域操作

### 1. 获取模型提供商列表

```tsx
import { useModels } from '../stores/global-store';

function ProviderList() {
  const { providers } = useModels();
  
  return (
    <div>
      <h3>模型提供商</h3>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id}>
            <strong>{provider.label}</strong>
            <span>{provider.isLocal ? '(本地)' : '(云端)'}</span>
            <ul>
              {provider.models.map((model) => (
                <li key={model}>{model}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. 添加模型提供商

```tsx
import { useModels } from '../stores/global-store';

function AddProviderForm() {
  const { addProvider } = useModels();
  
  const handleAdd = () => {
    const newProvider = {
      id: 'custom-provider',
      label: '自定义提供商',
      baseUrl: 'https://api.example.com/v1',
      authType: 'api-key',
      models: ['model-1', 'model-2'],
      requiresApiKey: true,
      isLocal: false,
      isBuiltin: false,
    };
    
    addProvider(newProvider);
  };
  
  return (
    <button onClick={handleAdd}>
      添加自定义提供商
    </button>
  );
}
```

### 3. 更新模型提供商

```tsx
import { useModels } from '../stores/global-store';

function UpdateProviderForm() {
  const { updateProvider } = useModels();
  
  const handleUpdate = () => {
    updateProvider('zhipu', {
      baseUrl: 'https://new-api.bigmodel.cn/v1',
      models: ['glm-4-flash', 'glm-4-plus', 'glm-5'],
    });
  };
  
  return (
    <button onClick={handleUpdate}>
      更新智谱AI配置
    </button>
  );
}
```

### 4. 删除模型提供商

```tsx
import { useModels } from '../stores/global-store';

function RemoveProviderButton() {
  const { removeProvider } = useModels();
  
  const handleRemove = (id: string) => {
    if (confirm('确定要删除此提供商吗？')) {
      removeProvider(id);
    }
  };
  
  return (
    <button onClick={() => handleRemove('custom-provider')}>
      删除自定义提供商
    </button>
  );
}
```

### 5. 管理已配置模型

```tsx
import { useModels } from '../stores/global-store';

function ConfiguredModelsManager() {
  const { 
    configuredModels, 
    activeModelId,
    addConfiguredModel, 
    updateConfiguredModel, 
    removeConfiguredModel,
    setActiveModel,
  } = useModels();
  
  // 添加已配置模型
  const handleAddModel = () => {
    addConfiguredModel({
      id: 'gpt-4o-configured',
      providerId: 'openai',
      modelId: 'gpt-4o',
      name: 'GPT-4o',
      apiKey: 'sk-xxx',
      temperature: 0.7,
      maxTokens: 4096,
    });
  };
  
  // 更新模型配置
  const handleUpdateModel = () => {
    updateConfiguredModel('gpt-4o-configured', {
      temperature: 0.9,
      maxTokens: 8192,
    });
  };
  
  // 删除模型配置
  const handleRemoveModel = (id: string) => {
    removeConfiguredModel(id);
  };
  
  // 设置激活模型
  const handleSetActive = (id: string) => {
    setActiveModel(id);
  };
  
  return (
    <div>
      <h3>已配置模型</h3>
      
      {/* 模型列表 */}
      <ul>
        {configuredModels.map((model) => (
          <li key={model.id}>
            <span>{model.name}</span>
            {activeModelId === model.id && <span> (激活)</span>}
            <button onClick={() => handleSetActive(model.id)}>
              激活
            </button>
            <button onClick={() => handleRemoveModel(model.id)}>
              删除
            </button>
          </li>
        ))}
      </ul>
      
      {/* 操作按钮 */}
      <button onClick={handleAddModel}>添加模型</button>
      <button onClick={handleUpdateModel}>更新模型配置</button>
    </div>
  );
}
```

### 6. 模型域完整操作示例

```tsx
import { useModels } from '../stores/global-store';

function ModelManagementPanel() {
  const {
    providers,
    configuredModels,
    activeModelId,
    setProviders,
    addProvider,
    updateProvider,
    removeProvider,
    setConfiguredModels,
    addConfiguredModel,
    updateConfiguredModel,
    removeConfiguredModel,
    setActiveModel,
  } = useModels();
  
  // 添加新提供商
  const handleAddProvider = () => {
    addProvider({
      id: `provider-${Date.now()}`,
      label: '新提供商',
      baseUrl: 'https://api.example.com',
      authType: 'api-key',
      models: [],
      requiresApiKey: true,
      isLocal: false,
      isBuiltin: false,
    });
  };
  
  // 配置新模型
  const handleConfigureModel = (providerId: string, modelId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;
    
    addConfiguredModel({
      id: `${providerId}-${modelId}-${Date.now()}`,
      providerId,
      modelId,
      name: modelId,
      temperature: 0.7,
      maxTokens: 4096,
    });
  };
  
  return (
    <div>
      <h2>模型管理</h2>
      
      {/* 提供商列表 */}
      <section>
        <h3>提供商</h3>
        {providers.map((provider) => (
          <div key={provider.id}>
            <h4>{provider.label}</h4>
            <p>地址：{provider.baseUrl}</p>
            <p>类型：{provider.isLocal ? '本地' : '云端'}</p>
            
            {/* 可用模型 */}
            <div>
              <h5>可用模型</h5>
              {provider.models.map((model) => (
                <div key={model}>
                  <span>{model}</span>
                  <button onClick={() => handleConfigureModel(provider.id, model)}>
                    配置
                  </button>
                </div>
              ))}
            </div>
            
            {/* 操作按钮 */}
            {!provider.isBuiltin && (
              <button onClick={() => removeProvider(provider.id)}>
                删除提供商
              </button>
            )}
          </div>
        ))}
        
        <button onClick={handleAddProvider}>添加提供商</button>
      </section>
      
      {/* 已配置模型 */}
      <section>
        <h3>已配置模型</h3>
        {configuredModels.map((model) => (
          <div key={model.id}>
            <span>{model.name}</span>
            {activeModelId === model.id && <span> (激活)</span>}
            <button onClick={() => setActiveModel(model.id)}>激活</button>
            <button onClick={() => updateConfiguredModel(model.id, { temperature: 0.9 })}>
              更新
            </button>
            <button onClick={() => removeConfiguredModel(model.id)}>删除</button>
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

## 数据库域操作

### 1. 获取数据库连接列表

```tsx
import { useDatabase } from '../stores/global-store';

function ConnectionList() {
  const { connections, activeConnectionId } = useDatabase();
  
  return (
    <div>
      <h3>数据库连接</h3>
      <ul>
        {connections.map((conn) => (
          <li key={conn.id}>
            <strong>{conn.name}</strong>
            <span>{conn.type}</span>
            <span>{conn.host}:{conn.port}</span>
            {activeConnectionId === conn.id && <span> (激活)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. 添加数据库连接

```tsx
import { useDatabase } from '../stores/global-store';

function AddConnectionForm() {
  const { addConnection } = useDatabase();
  
  const handleAdd = () => {
    addConnection({
      id: `conn-${Date.now()}`,
      name: '生产数据库',
      type: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: 'yyc3_production',
      username: 'admin',
      password: 'secure_password',
      ssl: true,
    });
  };
  
  return (
    <button onClick={handleAdd}>
      添加数据库连接
    </button>
  );
}
```

### 3. 更新数据库连接

```tsx
import { useDatabase } from '../stores/global-store';

function UpdateConnectionForm() {
  const { updateConnection } = useDatabase();
  
  const handleUpdate = (id: string) => {
    updateConnection(id, {
      host: 'new-host.example.com',
      port: 5433,
      ssl: true,
    });
  };
  
  return (
    <button onClick={() => handleUpdate('conn-123')}>
      更新连接配置
    </button>
  );
}
```

### 4. 删除数据库连接

```tsx
import { useDatabase } from '../stores/global-store';

function RemoveConnectionButton() {
  const { removeConnection } = useDatabase();
  
  const handleRemove = (id: string) => {
    if (confirm('确定要删除此连接吗？')) {
      removeConnection(id);
    }
  };
  
  return (
    <button onClick={() => handleRemove('conn-123')}>
      删除连接
    </button>
  );
}
```

### 5. 切换激活连接

```tsx
import { useDatabase } from '../stores/global-store';

function ConnectionSelector() {
  const { connections, activeConnectionId, setActiveConnection } = useDatabase();
  
  return (
    <select 
      value={activeConnectionId || ''} 
      onChange={(e) => setActiveConnection(e.target.value || null)}
    >
      <option value="">选择连接</option>
      {connections.map((conn) => (
        <option key={conn.id} value={conn.id}>
          {conn.name}
        </option>
      ))}
    </select>
  );
}
```

### 6. 数据库域完整操作示例

```tsx
import { useDatabase } from '../stores/global-store';

function DatabaseManagementPanel() {
  const {
    connections,
    activeConnectionId,
    setConnections,
    addConnection,
    updateConnection,
    removeConnection,
    setActiveConnection,
  } = useDatabase();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addConnection({
      id: `conn-${Date.now()}`,
      ...formData,
      ssl: false,
    });
    setFormData({
      name: '',
      type: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: '',
      username: '',
      password: '',
    });
  };
  
  return (
    <div>
      <h2>数据库管理</h2>
      
      {/* 连接列表 */}
      <section>
        <h3>已配置连接</h3>
        {connections.map((conn) => (
          <div key={conn.id}>
            <h4>{conn.name}</h4>
            <p>类型：{conn.type}</p>
            <p>地址：{conn.host}:{conn.port}</p>
            <p>数据库：{conn.database}</p>
            
            {activeConnectionId === conn.id && (
              <span style={{ color: 'green' }}>当前激活</span>
            )}
            
            <div>
              <button onClick={() => setActiveConnection(conn.id)}>
                激活
              </button>
              <button onClick={() => updateConnection(conn.id, { ssl: true })}>
                启用SSL
              </button>
              <button onClick={() => removeConnection(conn.id)}>
                删除
              </button>
            </div>
          </div>
        ))}
      </section>
      
      {/* 添加连接表单 */}
      <section>
        <h3>添加新连接</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="连接名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
            <option value="sqlite">SQLite</option>
          </select>
          <input
            placeholder="主机地址"
            value={formData.host}
            onChange={(e) => setFormData({ ...formData, host: e.target.value })}
          />
          <input
            type="number"
            placeholder="端口"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
          />
          <input
            placeholder="数据库名"
            value={formData.database}
            onChange={(e) => setFormData({ ...formData, database: e.target.value })}
          />
          <input
            placeholder="用户名"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="密码"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit">添加连接</button>
        </form>
      </section>
    </div>
  );
}
```

---

## 告警域操作

### 1. 获取告警列表

```tsx
import { useAlerts } from '../stores/global-store';

function AlertList() {
  const { followUps } = useAlerts();
  
  // 按严重程度分组
  const criticalAlerts = followUps.filter(a => a.severity === 'critical');
  const errorAlerts = followUps.filter(a => a.severity === 'error');
  const warningAlerts = followUps.filter(a => a.severity === 'warning');
  
  return (
    <div>
      <h3>告警概览</h3>
      <div>严重：{criticalAlerts.length}</div>
      <div>错误：{errorAlerts.length}</div>
      <div>警告：{warningAlerts.length}</div>
      
      <ul>
        {followUps.map((alert) => (
          <li key={alert.id}>
            <span className={`severity-${alert.severity}`}>
              [{alert.severity}]
            </span>
            <span>{alert.title}</span>
            <span>{alert.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. 添加告警

```tsx
import { useAlerts } from '../stores/global-store';

function AlertCreator() {
  const { addFollowUp } = useAlerts();
  
  const handleCreateAlert = () => {
    addFollowUp({
      id: `AL-${Date.now()}`,
      severity: 'warning',
      title: 'CPU使用率过高',
      source: 'Server-01',
      metric: '85% > 80%',
      status: 'active',
      timestamp: Date.now(),
      tags: ['CPU', '性能'],
    });
  };
  
  return (
    <button onClick={handleCreateAlert}>
      创建测试告警
    </button>
  );
}
```

### 3. 更新告警状态

```tsx
import { useAlerts } from '../stores/global-store';

function AlertActions() {
  const { updateFollowUp } = useAlerts();
  
  const handleAcknowledge = (id: string) => {
    updateFollowUp(id, { status: 'investigating' });
  };
  
  const handleResolve = (id: string) => {
    updateFollowUp(id, { status: 'resolved' });
  };
  
  return (
    <div>
      <button onClick={() => handleAcknowledge('AL-001')}>
        确认处理
      </button>
      <button onClick={() => handleResolve('AL-001')}>
        标记已解决
      </button>
    </div>
  );
}
```

### 4. 删除告警

```tsx
import { useAlerts } from '../stores/global-store';

function RemoveAlertButton() {
  const { removeFollowUp } = useAlerts();
  
  return (
    <button onClick={() => removeFollowUp('AL-001')}>
      删除告警
    </button>
  );
}
```

### 5. 清除所有告警

```tsx
import { useAlerts } from '../stores/global-store';

function ClearAllAlerts() {
  const { clearFollowUps } = useAlerts();
  
  const handleClear = () => {
    if (confirm('确定要清除所有告警吗？')) {
      clearFollowUps();
    }
  };
  
  return (
    <button onClick={handleClear}>
      清除所有告警
    </button>
  );
}
```

### 6. 告警域完整操作示例

```tsx
import { useAlerts } from '../stores/global-store';

function AlertManagementPanel() {
  const {
    followUps,
    addFollowUp,
    updateFollowUp,
    removeFollowUp,
    clearFollowUps,
  } = useAlerts();
  
  // 统计信息
  const stats = {
    total: followUps.length,
    critical: followUps.filter(a => a.severity === 'critical').length,
    error: followUps.filter(a => a.severity === 'error').length,
    warning: followUps.filter(a => a.severity === 'warning').length,
    active: followUps.filter(a => a.status === 'active').length,
    investigating: followUps.filter(a => a.status === 'investigating').length,
    resolved: followUps.filter(a => a.status === 'resolved').length,
  };
  
  return (
    <div>
      <h2>告警管理</h2>
      
      {/* 统计概览 */}
      <div className="alert-stats">
        <div>总数：{stats.total}</div>
        <div>严重：{stats.critical}</div>
        <div>错误：{stats.error}</div>
        <div>警告：{stats.warning}</div>
        <div>活跃：{stats.active}</div>
        <div>处理中：{stats.investigating}</div>
        <div>已解决：{stats.resolved}</div>
      </div>
      
      {/* 告警列表 */}
      <div className="alert-list">
        {followUps.map((alert) => (
          <div key={alert.id} className={`alert-item severity-${alert.severity}`}>
            <div className="alert-header">
              <span className="severity">[{alert.severity}]</span>
              <span className="title">{alert.title}</span>
              <span className="status">{alert.status}</span>
            </div>
            <div className="alert-body">
              <p>来源：{alert.source}</p>
              <p>指标：{alert.metric}</p>
              <p>时间：{new Date(alert.timestamp).toLocaleString()}</p>
              <p>标签：{alert.tags.join(', ')}</p>
            </div>
            <div className="alert-actions">
              {alert.status === 'active' && (
                <button onClick={() => updateFollowUp(alert.id, { status: 'investigating' })}>
                  确认处理
                </button>
              )}
              {alert.status === 'investigating' && (
                <button onClick={() => updateFollowUp(alert.id, { status: 'resolved' })}>
                  标记已解决
                </button>
              )}
              <button onClick={() => removeFollowUp(alert.id)}>
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 批量操作 */}
      <div className="alert-batch-actions">
        <button onClick={() => {
          followUps
            .filter(a => a.status === 'active')
            .forEach(a => updateFollowUp(a.id, { status: 'investigating' }));
        }}>
          批量确认处理
        </button>
        <button onClick={clearFollowUps}>
          清除所有告警
        </button>
      </div>
    </div>
  );
}
```

---

## 会话域操作

### 1. 获取会话列表

```tsx
import { useChat } from '../stores/global-store';

function SessionList() {
  const { sessions, activeSessionId } = useChat();
  
  return (
    <div>
      <h3>对话历史</h3>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <span>{session.title}</span>
            <span>{new Date(session.createdAt).toLocaleDateString()}</span>
            {activeSessionId === session.id && <span> (当前)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. 创建新会话

```tsx
import { useChat } from '../stores/global-store';

function NewSessionButton() {
  const { addSession, setActiveSession } = useChat();
  
  const handleNewSession = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    addSession(newSession);
    setActiveSession(newSession.id);
  };
  
  return (
    <button onClick={handleNewSession}>
      新建对话
    </button>
  );
}
```

### 3. 更新会话

```tsx
import { useChat } from '../stores/global-store';

function SessionEditor() {
  const { updateSession } = useChat();
  
  const handleRename = (id: string, newTitle: string) => {
    updateSession(id, { 
      title: newTitle,
      updatedAt: Date.now(),
    });
  };
  
  const handleAddMessage = (id: string, message) => {
    // 注意：需要先获取当前会话，然后更新消息列表
    const session = useChat().sessions.find(s => s.id === id);
    if (session) {
      updateSession(id, {
        messages: [...session.messages, message],
        updatedAt: Date.now(),
      });
    }
  };
  
  return (
    <div>
      <button onClick={() => handleRename('session-123', '新标题')}>
        重命名
      </button>
    </div>
  );
}
```

### 4. 删除会话

```tsx
import { useChat } from '../stores/global-store';

function DeleteSessionButton() {
  const { removeSession } = useChat();
  
  const handleDelete = (id: string) => {
    if (confirm('确定要删除此对话吗？')) {
      removeSession(id);
    }
  };
  
  return (
    <button onClick={() => handleDelete('session-123')}>
      删除对话
    </button>
  );
}
```

### 5. 切换激活会话

```tsx
import { useChat } from '../stores/global-store';

function SessionSelector() {
  const { sessions, activeSessionId, setActiveSession } = useChat();
  
  return (
    <select 
      value={activeSessionId || ''} 
      onChange={(e) => setActiveSession(e.target.value || null)}
    >
      <option value="">选择会话</option>
      {sessions.map((session) => (
        <option key={session.id} value={session.id}>
          {session.title}
        </option>
      ))}
    </select>
  );
}
```

### 6. 会话域完整操作示例

```tsx
import { useChat } from '../stores/global-store';

function ChatPanel() {
  const {
    sessions,
    activeSessionId,
    addSession,
    updateSession,
    removeSession,
    setActiveSession,
  } = useChat();
  
  const [input, setInput] = useState('');
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  
  // 发送消息
  const handleSend = () => {
    if (!input.trim() || !activeSessionId) return;
    
    const message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    
    updateSession(activeSessionId, {
      messages: [...(activeSession?.messages || []), message],
      updatedAt: Date.now(),
    });
    
    setInput('');
  };
  
  // 新建会话
  const handleNewSession = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      title: `对话 ${sessions.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    addSession(newSession);
    setActiveSession(newSession.id);
  };
  
  return (
    <div className="chat-panel">
      {/* 会话列表 */}
      <div className="session-list">
        <button onClick={handleNewSession}>新建对话</button>
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
            onClick={() => setActiveSession(session.id)}
          >
            <span>{session.title}</span>
            <button onClick={(e) => {
              e.stopPropagation();
              removeSession(session.id);
            }}>
              删除
            </button>
          </div>
        ))}
      </div>
      
      {/* 对话区域 */}
      <div className="chat-area">
        {activeSession ? (
          <>
            {/* 消息列表 */}
            <div className="message-list">
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            
            {/* 输入区域 */}
            <div className="input-area">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入消息..."
              />
              <button onClick={handleSend}>发送</button>
            </div>
          </>
        ) : (
          <div className="no-session">
            请选择或创建一个对话
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 数据导入导出操作

### 1. 数据导出

```tsx
import { exportStoreData } from '../stores/global-store';

function ExportButton() {
  const handleExport = () => {
    try {
      // 获取导出数据
      const data = exportStoreData();
      
      // 创建 Blob
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = `yyc3-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // 释放 URL
      URL.revokeObjectURL(url);
      
      alert('数据导出成功！');
    } catch (error) {
      alert('数据导出失败：' + error.message);
    }
  };
  
  return (
    <button onClick={handleExport}>
      导出所有数据
    </button>
  );
}
```

### 2. 数据导入

```tsx
import { useRef } from 'react';
import { importStoreData } from '../stores/global-store';

function ImportButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importStoreData(content);
        
        if (success) {
          alert('数据导入成功！');
          // 刷新页面以应用新数据
          window.location.reload();
        } else {
          alert('数据导入失败：无效的数据格式');
        }
      } catch (error) {
        alert('数据导入失败：' + error.message);
      }
    };
    
    reader.readAsText(file);
    
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current?.click()}>
        导入数据
      </button>
    </div>
  );
}
```

### 3. 数据清除

```tsx
function ClearDataButton() {
  const handleClear = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      // 清除 localStorage
      localStorage.clear();
      
      // 清除 sessionStorage
      sessionStorage.clear();
      
      alert('数据已清除！');
      
      // 刷新页面
      window.location.reload();
    }
  };
  
  return (
    <button 
      onClick={handleClear}
      style={{ color: 'red' }}
    >
      清除所有数据
    </button>
  );
}
```

### 4. 完整的数据管理面板

```tsx
import { useRef } from 'react';
import { exportStoreData, importStoreData } from '../stores/global-store';

function DataManagerPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 导出数据
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
  
  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importStoreData(content)) {
        alert('导入成功！');
        window.location.reload();
      } else {
        alert('导入失败！');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  // 清除数据
  const handleClear = () => {
    if (confirm('确定要清除所有数据吗？')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };
  
  // 复制到剪贴板
  const handleCopy = async () => {
    const data = exportStoreData();
    await navigator.clipboard.writeText(data);
    alert('已复制到剪贴板！');
  };
  
  return (
    <div className="data-manager">
      <h2>数据管理</h2>
      
      {/* 导出 */}
      <section>
        <h3>数据导出</h3>
        <p>将所有数据导出为 JSON 文件</p>
        <button onClick={handleExport}>导出到文件</button>
        <button onClick={handleCopy}>复制到剪贴板</button>
      </section>
      
      {/* 导入 */}
      <section>
        <h3>数据导入</h3>
        <p>从备份文件恢复数据</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          选择备份文件
        </button>
      </section>
      
      {/* 清除 */}
      <section>
        <h3>数据清除</h3>
        <p>清除所有本地数据（不可恢复）</p>
        <button onClick={handleClear} style={{ color: 'red' }}>
          清除所有数据
        </button>
      </section>
    </div>
  );
}
```

---

## UI组件使用指南

### 1. 使用 UnifiedSettingsPanel

```tsx
import { UnifiedSettingsPanel } from '../components/UnifiedSettingsPanel';

function SettingsPage() {
  return (
    <div className="settings-page">
      <UnifiedSettingsPanel />
    </div>
  );
}
```

### 2. 在路由中配置

```tsx
// routes.tsx
import { createHashRouter } from 'react-router-dom';
import { UnifiedSettingsPanel } from './components/UnifiedSettingsPanel';

export const router = createHashRouter([
  // ... 其他路由
  {
    path: '/settings',
    element: <UnifiedSettingsPanel />,
  },
]);
```

### 3. 在导航菜单中添加

```tsx
// Navigation.tsx
import { Settings } from 'lucide-react';

const menuItems = [
  // ... 其他菜单项
  {
    path: '/settings',
    label: '设置管理',
    icon: Settings,
  },
];
```

---

## 📚 相关文件

| 文件 | 说明 |
|------|------|
| [global-store.ts](../src/app/stores/global-store.ts) | 统一全局状态管理 |
| [UnifiedSettingsPanel.tsx](../src/app/components/UnifiedSettingsPanel.tsx) | 统一设置管理面板 |
| [YYC3-数据本地化与安全隔离核心设计.md](./YYC3-数据本地化与安全隔离核心设计.md) | 核心设计文档 |

---

## 🔄 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| v1.0.0 | 2026-04-08 | 初始版本，完整操作指南 |

---

*文档最后更新: 2026-04-08*
*YanYuCloudCube Team*
