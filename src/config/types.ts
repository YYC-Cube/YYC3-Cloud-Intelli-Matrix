/**
 * @file: types.ts
 * @description: config/types.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    url: string;
  };
  api: {
    baseUrl: string;
    proxyBaseUrl: string;
    proxyTimeout: number;
    proxyVersion: string;
  };
  websocket: {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
    heartbeatInterval: number;
  };
  features: {
    ghostMode: boolean;
    pwa: boolean;
    aiAssistant: boolean;
  };
  theme: {
    default: string;
    defaultLanguage: string;
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  redis: {
    host: string;
    port: number;
    db: number;
    password: string;
  };
  ollama: {
    host: string;
    port: number;
    models: string;
  };
  monitoring: {
    prometheusMultiprocDir: string;
  };
}

export interface ConfigValidationError {
  key: string;
  message: string;
  value?: unknown;
}