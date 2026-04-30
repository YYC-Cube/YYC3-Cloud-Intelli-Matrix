/**
 * @file Auth模块入口
 * @description 导出认证管理相关功能
 * @module @family-pai/core/auth
 * @author YYC
 */

export { UnifiedAuthManager } from './unified-auth.js'
export { OpenAIProvider } from './openai-provider.js'
export { OllamaProvider } from './ollama-provider.js'
export { AuthMonitor } from './auth-monitor.js'
export { AuthSwitcher } from './auth-switcher.js'

export type {
  AuthProvider,
  AuthProviderInfo,
  AuthStatus,
} from './types.js'

export type {
  AuthState,
  HealthCheckResult,
  AuthMonitorConfig,
  AuthMonitorEvents,
} from './auth-monitor.js'

export type {
  SwitchStrategy,
  SwitchReason,
  SwitchDecision,
  AuthSwitcherConfig,
  AuthSwitcherEvents,
} from './auth-switcher.js'

export type {
  UnifiedAuthManagerConfig,
} from './unified-auth.js'
