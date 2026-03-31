/**
 * @file: env-config.test.ts
 * @description: env-config.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { env, getEnvConfig, setEnvConfig, resetEnvConfig, exportEnvConfig, importEnvConfig } from "../lib/env-config";

describe("env-config", () => {
  beforeEach(() => {
    // Reset env config before each test
    resetEnvConfig();
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    resetEnvConfig();
    localStorage.clear();
  });

  describe("env", () => {
    it("should return default value for system name", () => {
      expect(env("SYSTEM_NAME")).toBe("YYC³ Cloud Intelli-Matrix");
    });

    it("should return default value for system version", () => {
      expect(env("SYSTEM_VERSION")).toBe("3.2.0");
    });

    it("should return default value for API base URL", () => {
      expect(env("API_BASE_URL")).toBe("http://192.168.3.1:3118/api");
    });

    it("should return default value for WS endpoint", () => {
      expect(env("WS_ENDPOINT")).toBe("ws://localhost:3113/ws");
    });

    it("should return default value for OLLAMA base URL", () => {
      expect(env("OLLAMA_BASE_URL")).toBe("http://localhost:11434");
    });

    it("should return default value for storage prefix", () => {
      expect(env("STORAGE_PREFIX")).toBe("yyc3_");
    });

    it("should return default value for cluster ID", () => {
      expect(env("CLUSTER_ID")).toBe("CN-EAST-PROD-01");
    });

    it("should return test for node env (overridden by vitest MODE)", () => {
      // Vitest sets import.meta.env.MODE to "test", which overrides the default
      expect(env("NODE_ENV")).toBe("test");
    });

    it("should return default value for mock mode", () => {
      expect(env("ENABLE_MOCK_MODE")).toBe(true);
    });

    it("should return default value for debug mode", () => {
      expect(env("ENABLE_DEBUG")).toBe(false);
    });

    it("should return default value for PWA", () => {
      expect(env("ENABLE_PWA")).toBe(true);
    });

    it("should return default value for Electron IPC", () => {
      expect(env("ENABLE_ELECTRON_IPC")).toBe(false);
    });

    it("should return default value for session timeout", () => {
      expect(env("SESSION_TIMEOUT_MIN")).toBe(30);
    });

    it("should return default value for max login attempts", () => {
      expect(env("MAX_LOGIN_ATTEMPTS")).toBe(5);
    });

    it("should return default value for CORS origins", () => {
      expect(env("CORS_ORIGINS")).toBe("192.168.1.0/24,10.0.0.0/16,172.16.0.0/12");
    });

    it("should return default value for default AI base URL", () => {
      expect(env("DEFAULT_AI_BASE_URL")).toBe("https://api.openai.com/v1");
    });

    it("should return default value for default AI model", () => {
      expect(env("DEFAULT_AI_MODEL")).toBe("gpt-4o");
    });

    it("should return default value for default AI temperature", () => {
      expect(env("DEFAULT_AI_TEMPERATURE")).toBe(0.7);
    });

    it("should return default value for default AI max tokens", () => {
      expect(env("DEFAULT_AI_MAX_TOKENS")).toBe(2048);
    });

    it("should return default value for default AI timeout", () => {
      expect(env("DEFAULT_AI_TIMEOUT")).toBe(30000);
    });

    it("should return default value for DB pool min", () => {
      expect(env("DB_POOL_MIN")).toBe(2);
    });

    it("should return default value for DB pool max", () => {
      expect(env("DB_POOL_MAX")).toBe(10);
    });

    it("should return default value for DB pool idle timeout", () => {
      expect(env("DB_POOL_IDLE_TIMEOUT")).toBe(30000);
    });

    it("should return default value for DB pool acquire timeout", () => {
      expect(env("DB_POOL_ACQUIRE_TIMEOUT")).toBe(5000);
    });

    it("should return default value for SQL blocked commands", () => {
      expect(env("SQL_BLOCKED_COMMANDS")).toBe("DROP,DELETE,TRUNCATE,ALTER");
    });

    it("should return default value for SQL max history", () => {
      expect(env("SQL_MAX_HISTORY")).toBe(20);
    });

    it("should return default value for SQL test simulate delay", () => {
      expect(env("SQL_TEST_SIMULATE_DELAY")).toBe(500);
    });
  });

  describe("getEnvConfig", () => {
    it("should return all default config values", () => {
      const config = getEnvConfig();
      
      expect(config.SYSTEM_NAME).toBe("YYC³ Cloud Intelli-Matrix");
      expect(config.SYSTEM_VERSION).toBe("3.2.0");
      expect(config.API_BASE_URL).toBe("http://192.168.3.1:3118/api");
      expect(config.WS_ENDPOINT).toBe("ws://localhost:3113/ws");
      expect(config.OLLAMA_BASE_URL).toBe("http://localhost:11434");
      expect(config.STORAGE_PREFIX).toBe("yyc3_");
      expect(config.CLUSTER_ID).toBe("CN-EAST-PROD-01");
      // NODE_ENV is overridden by vitest's import.meta.env.MODE ("test")
      expect(config.NODE_ENV).toBe("test");
      expect(config.ENABLE_MOCK_MODE).toBe(true);
      expect(config.ENABLE_DEBUG).toBe(false);
    });

    it("should return readonly config", () => {
      const config = getEnvConfig();
      
      // Should not be able to modify directly
      expect(() => {
        (config as any).SYSTEM_NAME = "Modified";
      }).not.toThrow();
      
      // But the original should remain unchanged
      expect(getEnvConfig().SYSTEM_NAME).toBe("YYC³ Cloud Intelli-Matrix");
    });
  });

  describe("setEnvConfig", () => {
    it("should update config value", () => {
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      
      expect(env("SYSTEM_NAME")).toBe("Test System");
    });

    it("should persist to localStorage", () => {
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      
      const stored = localStorage.getItem("yyc3_env_config");
      expect(stored).toBeDefined();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.SYSTEM_NAME).toBe("Test System");
    });

    it("should update multiple values", () => {
      setEnvConfig({
        SYSTEM_NAME: "Test System",
        SYSTEM_VERSION: "1.0.0",
        API_BASE_URL: "http://test.com/api",
      });
      
      expect(env("SYSTEM_NAME")).toBe("Test System");
      expect(env("SYSTEM_VERSION")).toBe("1.0.0");
      expect(env("API_BASE_URL")).toBe("http://test.com/api");
    });

    it("should merge with existing config", () => {
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      setEnvConfig({ SYSTEM_VERSION: "1.0.0" });
      
      expect(env("SYSTEM_NAME")).toBe("Test System");
      expect(env("SYSTEM_VERSION")).toBe("1.0.0");
    });
  });

  describe("resetEnvConfig", () => {
    it("should reset to default values", () => {
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      
      resetEnvConfig();
      
      expect(env("SYSTEM_NAME")).toBe("YYC³ Cloud Intelli-Matrix");
    });

    it("should clear localStorage", () => {
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      
      resetEnvConfig();
      
      const stored = localStorage.getItem("yyc3_env_config");
      expect(stored).toBeNull();
    });
  });

  describe("exportEnvConfig", () => {
    it("should export config as JSON string", () => {
      const exported = exportEnvConfig();
      
      expect(typeof exported).toBe("string");
      
      const parsed = JSON.parse(exported);
      expect(parsed._type).toBe("env-config");
      expect(parsed._exportedAt).toBeDefined();
      expect(parsed.config).toBeDefined();
    });

    it("should include all config values", () => {
      const exported = exportEnvConfig();
      const parsed = JSON.parse(exported);
      
      expect(parsed.config.SYSTEM_NAME).toBe("YYC³ Cloud Intelli-Matrix");
      expect(parsed.config.SYSTEM_VERSION).toBe("3.2.0");
    });

    it("should include modified values", () => {
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      
      const exported = exportEnvConfig();
      const parsed = JSON.parse(exported);
      
      expect(parsed.config.SYSTEM_NAME).toBe("Test System");
    });
  });

  describe("importEnvConfig", () => {
    it("should import valid config JSON", () => {
      const json = JSON.stringify({
        SYSTEM_NAME: "Imported System",
        SYSTEM_VERSION: "2.0.0",
      });
      
      const result = importEnvConfig(json);
      
      expect(result).toBe(true);
      expect(env("SYSTEM_NAME")).toBe("Imported System");
      expect(env("SYSTEM_VERSION")).toBe("2.0.0");
    });

    it("should import exported config", () => {
      const exported = exportEnvConfig();
      
      const result = importEnvConfig(exported);
      
      expect(result).toBe(true);
    });

    it("should return false for invalid JSON", () => {
      const result = importEnvConfig("invalid json");
      
      expect(result).toBe(false);
    });

    it("should return true for unrecognized keys (accepts any JSON object)", () => {
      // importEnvConfig does not validate keys — it accepts any valid JSON object
      const result = importEnvConfig(JSON.stringify({ invalid: "config" }));

      expect(result).toBe(true);
    });

    it("should merge imported config with existing", () => {
      setEnvConfig({ SYSTEM_NAME: "Existing System" });
      
      const json = JSON.stringify({
        SYSTEM_VERSION: "3.0.0",
      });
      
      importEnvConfig(json);
      
      expect(env("SYSTEM_NAME")).toBe("Existing System");
      expect(env("SYSTEM_VERSION")).toBe("3.0.0");
    });
  });

  describe("integration", () => {
    it("should maintain consistency across operations", () => {
      // Set initial config
      setEnvConfig({ SYSTEM_NAME: "Test System" });
      expect(env("SYSTEM_NAME")).toBe("Test System");
      
      // Export
      const exported = exportEnvConfig();
      
      // Reset
      resetEnvConfig();
      expect(env("SYSTEM_NAME")).toBe("YYC³ Cloud Intelli-Matrix");
      
      // Import
      importEnvConfig(exported);
      expect(env("SYSTEM_NAME")).toBe("Test System");
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("Storage error");
      });
      
      // Should not throw
      expect(() => {
        setEnvConfig({ SYSTEM_NAME: "Test System" });
      }).not.toThrow();
      
      // Restore
      localStorage.setItem = originalSetItem;
    });
  });
});
