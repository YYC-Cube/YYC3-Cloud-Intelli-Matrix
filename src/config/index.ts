/**
 * @file: index.ts
 * @description: config/index.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
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