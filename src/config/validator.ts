/**
 * @file: validator.ts
 * @description: config/validator.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

import type { AppConfig, ConfigValidationError } from "./types";

export function validateConfig(config: AppConfig): ConfigValidationError[] {
  const errors: ConfigValidationError[] = [];

  if (!config.app.name) {
    errors.push({ key: "app.name", message: "Application name is required" });
  }

  if (!config.app.version) {
    errors.push({ key: "app.version", message: "Application version is required" });
  }

  if (!config.api.baseUrl) {
    errors.push({ key: "api.baseUrl", message: "API base URL is required" });
  }

  if (!config.websocket.url) {
    errors.push({ key: "websocket.url", message: "WebSocket URL is required" });
  }

  if (config.websocket.reconnectInterval < 1000) {
    errors.push({
      key: "websocket.reconnectInterval",
      message: "WebSocket reconnect interval must be at least 1000ms",
      value: config.websocket.reconnectInterval,
    });
  }

  if (config.websocket.maxReconnectAttempts < 1) {
    errors.push({
      key: "websocket.maxReconnectAttempts",
      message: "WebSocket max reconnect attempts must be at least 1",
      value: config.websocket.maxReconnectAttempts,
    });
  }

  if (config.database.port < 1 || config.database.port > 65535) {
    errors.push({
      key: "database.port",
      message: "Database port must be between 1 and 65535",
      value: config.database.port,
    });
  }

  if (config.redis.port < 1 || config.redis.port > 65535) {
    errors.push({
      key: "redis.port",
      message: "Redis port must be between 1 and 65535",
      value: config.redis.port,
    });
  }

  if (config.ollama.port < 1 || config.ollama.port > 65535) {
    errors.push({
      key: "ollama.port",
      message: "Ollama port must be between 1 and 65535",
      value: config.ollama.port,
    });
  }

  return errors;
}

export function validateConfigOrThrow(config: AppConfig): void {
  const errors = validateConfig(config);
  if (errors.length > 0) {
    const errorMessages = errors.map((e) => `${e.key}: ${e.message}`).join("\n");
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }
}