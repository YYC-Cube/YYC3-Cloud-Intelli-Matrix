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

// Mock network-utils
vi.mock("../lib/network-utils", () => ({
  loadNetworkConfig: vi.fn(() => ({
    serverAddress: "localhost",
    port: "8080",
    wsUrl: "ws://localhost:8080/ws",
    autoConnect: true,
  })),
  saveNetworkConfig: vi.fn(),
  resetNetworkConfig: vi.fn(() => ({
    serverAddress: "localhost",
    port: "8080",
    wsUrl: "ws://localhost:8080/ws",
    autoConnect: true,
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
      expect(result.current.config.autoConnect).toBe(true);
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

      act(() => {
        result.current.detectNetwork();
      });

      expect(result.current.detecting).toBe(true);
    });

    it("检测失败时应该重置 detecting 状态", async () => {
      const { getLocalIP, getNetworkInterfaces } = require("../lib/network-utils");
      getLocalIP.mockRejectedValueOnce(new Error("Network error"));

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

    it("应该更新自动连接选项", () => {
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.updateConfig({ autoConnect: false });
      });

      expect(result.current.config.autoConnect).toBe(false);
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
      const { saveNetworkConfig } = require("../lib/network-utils");
      const { result } = renderHook(() => useNetworkConfig());

      act(() => {
        result.current.save();
      });

      expect(saveNetworkConfig).toHaveBeenCalledWith(result.current.config);
    });
  });

  describe("配置重置", () => {
    it("应该重置为默认配置", () => {
      const { resetNetworkConfig } = require("../lib/network-utils");
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
      const { testWebSocketConnection } = require("../lib/network-utils");
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

      const promise = act(async () => {
        result.current.testConnection();
      });

      expect(result.current.testStatus).toBe("testing");

      await promise;
    });

    it("测试失败时应该设置失败状态", async () => {
      const { testWebSocketConnection } = require("../lib/network-utils");
      testWebSocketConnection.mockResolvedValueOnce({
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
      const { getNetworkInterfaces } = require("../lib/network-utils");
      getNetworkInterfaces.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.detectNetwork();
      });

      expect(result.current.interfaces).toHaveLength(0);
    });

    it("应该处理本地 IP 检测失败", async () => {
      const { getLocalIP } = require("../lib/network-utils");
      getLocalIP.mockRejectedValueOnce(new Error("IP detection failed"));

      const { result } = renderHook(() => useNetworkConfig());

      await act(async () => {
        await result.current.detectNetwork();
      });

      expect(result.current.detecting).toBe(false);
    });
  });
});
