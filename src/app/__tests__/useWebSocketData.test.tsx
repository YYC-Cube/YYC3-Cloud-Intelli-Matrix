// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWebSocketData } from "../hooks/useWebSocketData";

vi.mock("../lib/api-config", () => ({
  getAPIConfig: () => ({
    ws: { url: "ws://localhost:3113/ws" },
  }),
}));

describe("useWebSocketData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("should initialize with simulated state when WebSocket unavailable", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(["simulated", "connecting"]).toContain(result.current.connectionState);
    expect(result.current.nodes).toBeDefined();
  });

  it("should provide simulated data", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.nodes).toBeDefined();
    expect(Array.isArray(result.current.nodes)).toBe(true);
  });

  it("should provide liveQPS data", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.liveQPS).toBeDefined();
    expect(typeof result.current.liveQPS).toBe("number");
  });

  it("should provide alerts data", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.alerts).toBeDefined();
    expect(Array.isArray(result.current.alerts)).toBe(true);
  });

  it("should provide lastSyncTime timestamp", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.lastSyncTime).toBeDefined();
    expect(typeof result.current.lastSyncTime).toBe("string");
  });

  it("should handle clearAlerts", () => {
    const { result } = renderHook(() => useWebSocketData());

    act(() => {
      result.current.clearAlerts();
    });

    expect(result.current.alerts).toEqual([]);
  });

  it("should provide throughput history", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.throughputHistory).toBeDefined();
    expect(Array.isArray(result.current.throughputHistory)).toBe(true);
  });

  it("should provide GPU utilization", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.gpuUtil).toBeDefined();
    expect(typeof result.current.gpuUtil).toBe("string");
  });

  it("should provide active nodes count", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(typeof result.current.activeNodes).toBe("string");
    expect(result.current.activeNodes).toBeDefined();
  });

  it("should provide reconnect count", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(typeof result.current.reconnectCount).toBe("number");
    expect(result.current.reconnectCount).toBeGreaterThanOrEqual(0);
  });

  it("should provide QPS trend", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.qpsTrend).toBeDefined();
    expect(typeof result.current.qpsTrend).toBe("string");
  });

  it("should provide latency data", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.liveLatency).toBeDefined();
    expect(typeof result.current.liveLatency).toBe("number");
    expect(result.current.latencyTrend).toBeDefined();
    expect(typeof result.current.latencyTrend).toBe("string");
  });

  it("should provide token throughput", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.tokenThroughput).toBeDefined();
    expect(typeof result.current.tokenThroughput).toBe("string");
  });

  it("should provide storage used", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.storageUsed).toBeDefined();
    expect(typeof result.current.storageUsed).toBe("string");
  });

  it("should have manualReconnect function", () => {
    const { result } = renderHook(() => useWebSocketData());

    expect(result.current.manualReconnect).toBeDefined();
    expect(typeof result.current.manualReconnect).toBe("function");
  });
});
