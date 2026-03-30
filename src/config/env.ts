/**
 * config/env.ts
 * ============
 * 环境变量管理
 */

import type { AppConfig } from "./types";

function getEnvVar(key: string, defaultValue?: string): string {
  // @ts-expect-error - Vite 环境变量在运行时注入
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || "";
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key);
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = getEnvVar(key);
  return value ? value === "true" : defaultValue;
}

export function loadConfig(): AppConfig {
  return {
    app: {
      name: getEnvVar("VITE_APP_NAME", "YYC³ Cloud Intelli-Matrix"),
      version: getEnvVar("VITE_APP_VERSION", "0.0.1"),
      url: getEnvVar("VITE_APP_URL", "http://localhost:3118"),
    },
    api: {
      baseUrl: getEnvVar("VITE_API_BASE_URL", "http://localhost:3118/api"),
      proxyBaseUrl: getEnvVar("API_PROXY_BASE_URL", "https://api.0379.world"),
      proxyTimeout: getEnvNumber("API_PROXY_TIMEOUT", 30000),
      proxyVersion: getEnvVar("API_PROXY_VERSION", "1.0.0"),
    },
    websocket: {
      url: getEnvVar("VITE_WS_URL", "ws://localhost:3113/ws"),
      reconnectInterval: getEnvNumber("VITE_WS_RECONNECT_INTERVAL", 5000),
      maxReconnectAttempts: getEnvNumber("VITE_WS_MAX_RECONNECT_ATTEMPTS", 10),
      heartbeatInterval: getEnvNumber("VITE_WS_HEARTBEAT_INTERVAL", 30000),
    },
    features: {
      ghostMode: getEnvBoolean("VITE_ENABLE_GHOST_MODE", true),
      pwa: getEnvBoolean("VITE_ENABLE_PWA", true),
      aiAssistant: getEnvBoolean("VITE_ENABLE_AI_ASSISTANT", true),
    },
    theme: {
      default: getEnvVar("VITE_DEFAULT_THEME", "cyberpunk"),
      defaultLanguage: getEnvVar("VITE_DEFAULT_LANGUAGE", "zh-CN"),
    },
    database: {
      host: getEnvVar("DB_HOST", "postgres"),
      port: getEnvNumber("DB_PORT", 5432),
      user: getEnvVar("DB_USER", "postgres"),
      password: getEnvVar("DB_PASSWORD", ""),
      name: getEnvVar("DB_NAME", "yyc3_gpt"),
    },
    redis: {
      host: getEnvVar("REDIS_HOST", "redis"),
      port: getEnvNumber("REDIS_PORT", 6379),
      db: getEnvNumber("REDIS_DB", 0),
      password: getEnvVar("REDIS_PASSWORD", ""),
    },
    ollama: {
      host: getEnvVar("OLLAMA_HOST", "host.docker.internal"),
      port: getEnvNumber("OLLAMA_PORT", 11435),
      models: getEnvVar("OLLAMA_MODELS", "/mnt/models"),
    },
    monitoring: {
      prometheusMultiprocDir: getEnvVar("PROMETHEUS_MULTIPROC_DIR", "/tmp/prometheus_multiproc"),
    },
  };
}