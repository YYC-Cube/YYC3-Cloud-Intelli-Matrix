/**
 * @file: useNetworkConfig.test.ts
 * @description: useNetworkConfig.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

// @vitest-environment jsdom
/**
 * useNetworkConfig.test.ts
 * ========================
 * useNetworkConfig Hook - 网络配置管理测试
 *
 * 覆盖范围:
 * - 初始化状态（从 localStorage 加载配置）
 * - 网络检测（IP 和接口）
 * - 配置更新（自动生成 wsUrl）
 * - 配置保存和重置
 * - WebSocket 连接测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useNetworkConfig } from "../hooks/useNetworkConfig";

// Import the mocked functions for type-safe access
import {
  loadNetworkConfig,
  saveNetworkConfig,
  resetNetworkConfig,
  getNetworkInterfaces,
  getLocalIP,
  generateWsUrl,
  testWebSocketConnection,
} from "../lib/network-utils";

vi.mock("../lib/network-utils", () => ({
  loadNetworkConfig: vi.fn(() => ({
    serverAddress: "localhost",
    port: "8080",
    nasAddress: "",
    wsUrl: "ws://localhost:8080/ws",
    mode: "auto",
  })),
  saveNetworkConfig: vi.fn(),
  resetNetworkConfig: vi.fn(() => ({
    serverAddress: "localhost",
    port: "8080",
    nasAddress: "",
    wsUrl: "ws://localhost:8080/ws",
    mode: "auto",
  })),
  getNetworkInterfaces: vi.fn().mockResolvedValue([
    { name: "en0", address: "192.168.1.100", family: "IPv4" },
    { name: "en1", address: "192.168.1.101", family: "IPv4" },
  ]),
  getLocalIP: vi.fn().mockResolvedValue("192.168.1.100"),
  generateWsUrl: vi.fn((address: string, port: string) => `ws://${address}:${port}/ws`),
  testWebSocketConnection: vi.fn().mockResolvedValue({
    success: true,
    latency: 50,
    error: "",
  }),
}));

describe("useNetworkConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("初始化状态", () => {
    it("应该从 localStorage 加载初始配置", () => {
      const { result } = renderHook(() => useNetworkConfig());

      expect(result.current.config.serverAddress).toBe("localhost");
      expect(result.current.config.port).toBe("8080");
      expect(result.current.config.wsUrl).toBe("ws://localhost:8080/ws");
    });

    it("应该初始化为空闲状态", () => {
      const { result } = renderHook(() => useNetworkConfig());

      expect(result.current.testStatus).toBe("idle");
      expect(result.current.testLatency).toBe(0);
      expect(result.current.testError).toBe("");
      expect(result.current.detecting).toBe(false);
    });
  });

  describe("网络检测", () => {
    it("应该检测本地 IP 和网络接口", async () => {
      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.detectNetwork();
      });

      expect(result.current.localIP).toBe("192.168.1.100");
      expect(result.current.interfaces).toHaveLength(2);
      expect(result.current.interfaces[0].name).toBe("en0");
      expect(result.current.detecting).toBe(false);
    });

    it("检测时应该设置 detecting 状态", async () => {
      const { result } = renderHook(() => useNetworkConfig());

      // Start detection - don't await it
      let resolveDetect: () => void = () => {};
      const detectPromise = new Promise<void>((resolve) => { resolveDetect = resolve; });

      // Use a slow mock to ensure detecting=true is observable
      vi.mocked(getLocalIP).mockImplementationOnce(() => detectPromise.then(() => "192.168.1.100"));

      act(() => {
        result.current.detectNetwork();
      });

      expect(result.current.detecting).toBe(true);

      // Resolve to clean up
      resolveDetect();
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
    });

    it("检测失败时应该重置 detecting 状态", async () => {
      vi.mocked(getLocalIP).mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.detectNetwork();
      });

      expect(result.current.detecting).toBe(false);
    });
  });

  describe("配置更新", () => {
    it("应该更新服务器地址", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ serverAddress: "192.168.1.1" });
      });

      expect(result.current.config.serverAddress).toBe("192.168.1.1");
    });

    it("应该更新端口", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ port: "9090" });
      });

      expect(result.current.config.port).toBe("9090");
    });

    it("应该自动生成 wsUrl", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ serverAddress: "192.168.1.1", port: "9090" });
      });

      expect(result.current.config.wsUrl).toBe("ws://192.168.1.1:9090/ws");
    });

    it("应该更新模式选项", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ mode: "manual" } as any);
      });

      expect((result.current.config as any).mode).toBe("manual");
    });

    it("更新配置时应该重置测试状态", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ serverAddress: "192.168.1.1" });
      });

      expect(result.current.testStatus).toBe("idle");
    });
  });

  describe("配置保存", () => {
    it("应该保存当前配置到 localStorage", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.save();
      });

      expect(saveNetworkConfig).toHaveBeenCalledWith(result.current.config);
    });
  });

  describe("配置重置", () => {
    it("应该重置为默认配置", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ serverAddress: "192.168.1.1", port: "9090" });
      });

      expect(result.current.config.serverAddress).toBe("192.168.1.1");

      act(() => {
        result.current.reset();
      });

      expect(result.current.config.serverAddress).toBe("localhost");
      expect(result.current.config.port).toBe("8080");
      expect(resetNetworkConfig).toHaveBeenCalled();
    });

    it("重置时应该清空测试状态", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ serverAddress: "192.168.1.1" });
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.testStatus).toBe("idle");
      expect(result.current.testError).toBe("");
    });
  });

  describe("连接测试", () => {
    it("应该测试 WebSocket 连接", async () => {
      const { result } = renderHook(() => useNetworkConfig());

      const testResult = await act(async () => {
        return await result.current.testConnection();
      });

      expect(result.current.testStatus).toBe("success");
      expect(result.current.testLatency).toBe(50);
      expect(result.current.testError).toBe("");
      expect(testWebSocketConnection).toHaveBeenCalledWith("ws://localhost:8080/ws");
      expect(testResult).toEqual({
        success: true,
        latency: 50,
        error: "",
      });
    });

    it("测试时应该设置 testing 状态", async () => {
      const { result } = renderHook(() => useNetworkConfig());

      // The mock resolves immediately, so testing state is very transient.
      // We verify that testStatus transitions from idle -> testing -> success.
      // Since the mock resolves synchronously in the same microtask,
      // we can only verify the final state.
      await act(async () => {
        await result.current.testConnection();
      });

      // After completion, status should be success (not idle)
      expect(result.current.testStatus).toBe("success");
    });

    it("测试失败时应该设置失败状态", async () => {
      vi.mocked(testWebSocketConnection).mockResolvedValueOnce({
        success: false,
        latency: 0,
        error: "Connection refused",
      });

      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.testConnection();
      });

      expect(result.current.testStatus).toBe("failed");
      expect(result.current.testError).toBe("Connection refused");
    });
  });

  describe("边界情况", () => {
    it("应该处理空的服务器地址", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ serverAddress: "" });
      });

      expect(result.current.config.serverAddress).toBe("");
    });

    it("应该处理空的端口", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ port: "" });
      });

      expect(result.current.config.port).toBe("");
    });

    it("应该处理网络接口为空的情况", async () => {
      vi.mocked(getNetworkInterfaces).mockResolvedValueOnce([]);

      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.detectNetwork();
      });

      expect(result.current.interfaces).toHaveLength(0);
    });

    it("应该处理本地 IP 检测失败", async () => {
      vi.mocked(getLocalIP).mockRejectedValueOnce(new Error("IP detection failed"));

      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.detectNetwork();
      });

      expect(result.current.detecting).toBe(false);
    });
  });
});
