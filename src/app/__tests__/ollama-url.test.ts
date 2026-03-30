// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isLocalDeployment,
  shouldUseProxy,
  getOllamaChatUrl,
  getOllamaTagsUrl,
  getOllamaUrl,
  getOllamaEndpointInfo,
} from "../lib/ollama-url";

vi.mock("../lib/env-config", () => ({
  env: vi.fn((key: string) => {
    const envMap: Record<string, string> = {
      OLLAMA_PROXY_PATH: "/api/v1/llm/ollama",
      OLLAMA_BASE_URL: "http://localhost:11434",
    };
    return envMap[key] || "";
  }),
}));

describe("ollama-url", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("isLocalDeployment", () => {
    it("should return true for localhost", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      expect(isLocalDeployment()).toBe(true);
    });

    it("should return true for 127.0.0.1", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "127.0.0.1" },
        writable: true,
      });
      expect(isLocalDeployment()).toBe(true);
    });

    it("should return true for 192.168.x.x", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "192.168.1.100" },
        writable: true,
      });
      expect(isLocalDeployment()).toBe(true);
    });

    it("should return true for 10.x.x.x", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "10.0.0.1" },
        writable: true,
      });
      expect(isLocalDeployment()).toBe(true);
    });

    it("should return true for 172.x.x.x", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "172.16.0.1" },
        writable: true,
      });
      expect(isLocalDeployment()).toBe(true);
    });

    it("should return false for remote host", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "example.com" },
        writable: true,
      });
      expect(isLocalDeployment()).toBe(false);
    });

    it("should return false when window is undefined", () => {
      const originalWindow = global.window;
      delete (global as any).window;
      expect(isLocalDeployment()).toBe(false);
      global.window = originalWindow;
    });
  });

  describe("shouldUseProxy", () => {
    it("should return true for local deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      expect(shouldUseProxy()).toBe(true);
    });

    it("should return false for remote deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "example.com" },
        writable: true,
      });
      expect(shouldUseProxy()).toBe(false);
    });
  });

  describe("getOllamaChatUrl", () => {
    it("should return proxy path for local deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      expect(getOllamaChatUrl()).toBe("/api/v1/llm/ollama/chat");
    });

    it("should return direct URL for remote deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "example.com" },
        writable: true,
      });
      expect(getOllamaChatUrl()).toBe("http://localhost:11434/api/chat");
    });
  });

  describe("getOllamaTagsUrl", () => {
    it("should return proxy path for local deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      expect(getOllamaTagsUrl()).toBe("/api/v1/llm/ollama/tags");
    });

    it("should return direct URL for remote deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "example.com" },
        writable: true,
      });
      expect(getOllamaTagsUrl()).toBe("http://localhost:11434/api/tags");
    });
  });

  describe("getOllamaUrl", () => {
    it("should return proxy path for local deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      expect(getOllamaUrl("show")).toBe("/api/v1/llm/ollama/show");
      expect(getOllamaUrl("generate")).toBe("/api/v1/llm/ollama/generate");
    });

    it("should return direct URL for remote deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "example.com" },
        writable: true,
      });
      expect(getOllamaUrl("show")).toBe("http://localhost:11434/api/show");
      expect(getOllamaUrl("generate")).toBe("http://localhost:11434/api/generate");
    });

    it("should handle leading slashes in subPath", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      expect(getOllamaUrl("//show")).toBe("/api/v1/llm/ollama//show");
    });
  });

  describe("getOllamaEndpointInfo", () => {
    it("should return proxy mode for local deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      });
      const info = getOllamaEndpointInfo();
      expect(info.mode).toBe("proxy");
      expect(info.chatUrl).toBe("/api/v1/llm/ollama/chat");
      expect(info.tagsUrl).toBe("/api/v1/llm/ollama/tags");
      expect(info.proxyPath).toBe("/api/v1/llm/ollama");
      expect(info.directBase).toBe("http://localhost:11434");
    });

    it("should return direct mode for remote deployment", () => {
      Object.defineProperty(window, "location", {
        value: { hostname: "example.com" },
        writable: true,
      });
      const info = getOllamaEndpointInfo();
      expect(info.mode).toBe("direct");
      expect(info.chatUrl).toBe("http://localhost:11434/api/chat");
      expect(info.tagsUrl).toBe("http://localhost:11434/api/tags");
      expect(info.proxyPath).toBe("/api/v1/llm/ollama");
      expect(info.directBase).toBe("http://localhost:11434");
    });
  });
});
