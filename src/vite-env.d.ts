/**
 * Vite 环境变量类型声明
 */

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly API_PROXY_BASE_URL: string;
  readonly API_PROXY_TIMEOUT: string;
  readonly API_PROXY_VERSION: string;
  readonly VITE_WS_URL: string;
  readonly VITE_WS_RECONNECT_INTERVAL: string;
  readonly VITE_WS_MAX_RECONNECT_ATTEMPTS: string;
  readonly VITE_WS_HEARTBEAT_INTERVAL: string;
  readonly VITE_ENABLE_GHOST_MODE: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_AI_ASSistant: string;
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly DB_HOST: string;
  readonly DB_PORT: string;
  readonly DB_USER: string;
  readonly DB_PASSWORD: string;
  readonly DB_NAME: string;
  readonly REDIS_HOST: string;
  readonly REDIS_PORT: string;
  readonly REDIS_DB: string;
  readonly REDIS_PASSWORD: string;
  readonly OLLAMA_HOST: string;
  readonly OLLAMA_PORT: string;
  readonly OLLAMA_MODELS: string;
  readonly PROMETHEUS_MULTIPROC_DIR: string;
  readonly VITE_YYC3_SYSTEM_NAME: string;
  readonly VITE_YYC3_SYSTEM_VERSION: string;
  readonly VITE_YYC3_API_BASE_URL: string;
  readonly VITE_YYC3_WS_ENDPOINT: string;
  readonly VITE_YYC3_OLLAMA_BASE_URL: string;
  readonly VITE_YYC3_OLLAMA_PROXY_PATH: string;
  readonly VITE_YYC3_CLUSTER_ID: string;
  readonly VITE_YYC3_STORAGE_PREFIX: string;
  readonly VITE_YYC3_ENABLE_MOCK: string;
  readonly VITE_YYC3_ENABLE_DEBUG: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_USE_MOCK_AUTH: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface Timeout {
    ref(): this;
    unref(): this;
    hasRef(): boolean;
    refresh(): this;
    [Symbol.toPrimitive](): number;
  }

  interface Immediate {
    ref(): this;
    unref(): this;
    hasRef(): boolean;
    [Symbol.toPrimitive](): number;
  }

  interface Global {
    clearInterval(intervalId: NodeJS.Timeout | string | number | undefined): void;
    clearTimeout(timeoutId: NodeJS.Timeout | string | number | undefined): void;
    setInterval(callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]): NodeJS.Timeout;
    setTimeout(callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]): NodeJS.Timeout;
    clearImmediate(immediateId: NodeJS.Immediate | undefined): void;
    setImmediate(callback: (...args: unknown[]) => void, ...args: unknown[]): NodeJS.Immediate;
  }
}

type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "base64url" | "latin1" | "binary" | "hex";
