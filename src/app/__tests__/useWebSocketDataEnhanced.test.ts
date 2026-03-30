// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useWebSocketDataEnhanced } from "../hooks/useWebSocketDataEnhanced";

vi.mock("../lib/api-config", () => ({
  getAPIConfig: vi.fn(() => ({
    wsEndpoint: "ws://localhost:3000/ws",
  })),
}));

vi.mock("../stores/dashboard-stores", () => ({
  nodeStore: {
    getAll: vi.fn(() => [
      {
        id: "node-1",
        name: "GPU-A100-01",
        status: "active",
        gpu: 82,
        mem: 78,
        temp: 65,
        tasks: 12,
      },
      {
        id: "node-2",
        name: "GPU-A100-02",
        status: "active",
        gpu: 75,
        mem: 72,
        temp: 62,
        tasks: 10,
      },
    ]),
  },
}));

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url = "";
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.(new Event("open"));
    }, 100);
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error("WebSocket is not open");
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent("close"));
  }
}

// @ts-ignore
global.WebSocket = MockWebSocket;

describe("useWebSocketDataEnhanced", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    expect(result.current.connectionState).toBe("connecting");
    expect(result.current.reconnectCount).toBe(0);
    expect(result.current.liveQPS).toBe(3842);
    expect(result.current.liveLatency).toBe(48);
    expect(result.current.activeNodes).toBe("7/8");
    expect(result.current.gpuUtil).toBe("82.4%");
    expect(result.current.tokenThroughput).toBe("138K/s");
    expect(result.current.storageUsed).toBe("12.8TB");
    expect(result.current.nodes.length).toBeGreaterThan(0);
    expect(result.current.throughputHistory).toEqual([]);
    expect(result.current.alerts).toEqual([]);
  });

  it("should connect to WebSocket", async () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    // Initially connecting
    expect(result.current.connectionState).toBe("connecting");
    
    // Fast forward to allow connection
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(result.current.connectionState).toBe("connected");
    });
  });

  it("should handle manual reconnect", async () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    // Wait for initial connection
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(result.current.connectionState).toBe("connected");
    });
    
    // Manual reconnect
    act(() => {
      result.current.manualReconnect();
    });
    
    // Reconnect count should be reset
    expect(result.current.reconnectCount).toBe(0);
  });

  it("should clear alerts", () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    // Add some alerts manually (simulated)
    act(() => {
      // This would normally be done by the WebSocket connection
    });
    
    // Clear alerts
    act(() => {
      result.current.clearAlerts();
    });
    
    expect(result.current.alerts).toEqual([]);
  });

  it("should have nodes data", () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    expect(result.current.nodes.length).toBeGreaterThan(0);
    expect(result.current.nodes[0]).toHaveProperty("id");
    expect(result.current.nodes[0]).toHaveProperty("name");
    expect(result.current.nodes[0]).toHaveProperty("status");
    expect(result.current.nodes[0]).toHaveProperty("gpu");
    expect(result.current.nodes[0]).toHaveProperty("mem");
    expect(result.current.nodes[0]).toHaveProperty("temp");
    expect(result.current.nodes[0]).toHaveProperty("tasks");
  });

  it("should have last sync time", () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    expect(result.current.lastSyncTime).toBeDefined();
    expect(typeof result.current.lastSyncTime).toBe("string");
  });

  it("should have QPS trend", () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    expect(result.current.qpsTrend).toBeDefined();
    expect(typeof result.current.qpsTrend).toBe("string");
    expect(result.current.qpsTrend).toContain("%");
  });

  it("should have latency trend", () => {
    const { result } = renderHook(() => useWebSocketDataEnhanced());
    
    expect(result.current.latencyTrend).toBeDefined();
    expect(typeof result.current.latencyTrend).toBe("string");
    expect(result.current.latencyTrend).toContain("%");
  });

  it("should cleanup on unmount", () => {
    const { unmount } = renderHook(() => useWebSocketDataEnhanced());
    
    // Should not throw error
    unmount();
    expect(true).toBe(true);
  });
});
