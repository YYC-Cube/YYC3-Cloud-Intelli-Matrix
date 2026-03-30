/**
 * config/index.ts
 * ==============
 * 统一配置管理
 */

import { loadConfig } from "./env";
import { validateConfigOrThrow } from "./validator";
import type { AppConfig } from "./types";

let config: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!config) {
    config = loadConfig();
    validateConfigOrThrow(config);
  }
  return config;
}

export function resetConfig(): void {
  config = null;
}

export { loadConfig } from "./env";
export { validateConfig, validateConfigOrThrow } from "./validator";
export type { AppConfig, ConfigValidationError } from "./types";