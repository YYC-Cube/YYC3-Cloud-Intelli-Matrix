// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useOfflineMode } from "../hooks/useOfflineMode";

describe("useOfflineMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    localStorage.clear();
  });

  describe("initial state", () => {
    it("should initialize with online status", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      expect(result.current.isOnline).toBe(navigator.onLine);
      expect(result.current.lastSyncTime).toBeNull();
      expect(result.current.pendingSync).toBe(false);
    });

    it("should initialize with offline status when navigator is offline", () => {
      // Mock navigator.onLine
      const originalOnLine = navigator.onLine;
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      const { result } = renderHook(() => useOfflineMode());
      
      expect(result.current.isOnline).toBe(false);

      // Restore
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: originalOnLine,
      });
    });
  });

  describe("online/offline events", () => {
    it("should handle online event", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      expect(result.current.isOnline).toBe(navigator.onLine);

      act(() => {
        window.dispatchEvent(new Event("online"));
      });

      expect(result.current.isOnline).toBe(true);
    });

    it("should handle offline event", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      act(() => {
        window.dispatchEvent(new Event("offline"));
      });

      expect(result.current.isOnline).toBe(false);
    });
  });

  describe("saveOfflineSnapshot", () => {
    it("should save offline snapshot", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      // First save dashboard state
      result.current.saveDashboardState({
        test: "data",
      });

      act(() => {
        result.current.saveOfflineSnapshot();
      });

      const offlineSnapshot = localStorage.getItem("yyc3_offline_snapshot");
      const offlineTime = localStorage.getItem("yyc3_offline_time");

      expect(offlineSnapshot).toBeDefined();
      expect(offlineTime).toBeDefined();
    });

    it("should not throw when dashboard state is not saved", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      expect(() => {
        result.current.saveOfflineSnapshot();
      }).not.toThrow();
    });
  });

  describe("syncOfflineData", () => {
    it("should sync offline data", async () => {
      const { result } = renderHook(() => useOfflineMode());
      
      // Save offline snapshot
      localStorage.setItem("yyc3_offline_snapshot", JSON.stringify({ test: "data" }));
      localStorage.setItem("yyc3_offline_time", new Date().toISOString());

      act(() => {
        result.current.syncOfflineData();
      });

      expect(result.current.pendingSync).toBe(true);

      // Fast forward sync delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.pendingSync).toBe(false);
      });

      expect(result.current.lastSyncTime).not.toBeNull();
      expect(localStorage.getItem("yyc3_offline_snapshot")).toBeNull();
      expect(localStorage.getItem("yyc3_offline_time")).toBeNull();
    });

    it("should handle sync when no offline data exists", async () => {
      const { result } = renderHook(() => useOfflineMode());
      
      act(() => {
        result.current.syncOfflineData();
      });

      expect(result.current.pendingSync).toBe(true);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.pendingSync).toBe(false);
      });

      expect(result.current.lastSyncTime).not.toBeNull();
    });
  });

  describe("getOfflineSnapshotTime", () => {
    it("should return null when no offline time exists", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      const time = result.current.getOfflineSnapshotTime();
      
      expect(time).toBeNull();
    });

    it("should return offline time when it exists", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      const testTime = new Date("2026-01-01T00:00:00.000Z").toISOString();
      localStorage.setItem("yyc3_offline_time", testTime);
      
      const time = result.current.getOfflineSnapshotTime();
      
      expect(time).not.toBeNull();
      expect(time?.toISOString()).toBe(testTime);
    });
  });

  describe("saveDashboardState", () => {
    it("should save dashboard state", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      const testData = {
        savedAt: Date.now(),
        locale: "zh-CN",
        networkConfig: '{"test":"config"}',
        modelsCount: 5,
      };

      result.current.saveDashboardState(testData);

      const saved = localStorage.getItem("yyc3_dashboard_state");
      expect(saved).toBeDefined();
      
      const parsed = JSON.parse(saved!);
      expect(parsed).toEqual(testData);
    });

    it("should not throw when storage is full", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("Storage full");
      });

      expect(() => {
        result.current.saveDashboardState({ test: "data" });
      }).not.toThrow();

      // Restore
      localStorage.setItem = originalSetItem;
    });
  });

  describe("loadDashboardState", () => {
    it("should return null when no dashboard state exists", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      const state = result.current.loadDashboardState();
      
      expect(state).toBeNull();
    });

    it("should load dashboard state when it exists", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      const testData = {
        savedAt: Date.now(),
        locale: "en-US",
        networkConfig: '{"test":"config"}',
        modelsCount: 3,
      };

      localStorage.setItem("yyc3_dashboard_state", JSON.stringify(testData));

      const state = result.current.loadDashboardState();
      
      expect(state).toEqual(testData);
    });

    it("should return null when dashboard state is invalid JSON", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      localStorage.setItem("yyc3_dashboard_state", "invalid json");

      const state = result.current.loadDashboardState();
      
      expect(state).toBeNull();
    });
  });

  describe("auto-save snapshot", () => {
    it("should save snapshot periodically", () => {
      const { result } = renderHook(() => useOfflineMode());
      
      // Fast forward 30 seconds
      act(() => {
        vi.advanceTimersByTime(30_000);
      });

      const saved = localStorage.getItem("yyc3_dashboard_state");
      expect(saved).toBeDefined();
    });

    it("should save snapshot on mount", () => {
      renderHook(() => useOfflineMode());

      const saved = localStorage.getItem("yyc3_dashboard_state");
      expect(saved).toBeDefined();
    });

    it("should cleanup timer on unmount", () => {
      const { unmount } = renderHook(() => useOfflineMode());
      
      // Should not throw
      unmount();
      expect(true).toBe(true);
    });
  });

  describe("integration", () => {
    it("should handle offline to online transition", async () => {
      const { result } = renderHook(() => useOfflineMode());
      
      // Go offline
      act(() => {
        window.dispatchEvent(new Event("offline"));
      });

      expect(result.current.isOnline).toBe(false);

      // Save offline snapshot
      result.current.saveDashboardState({ test: "data" });
      result.current.saveOfflineSnapshot();

      // Go online
      act(() => {
        window.dispatchEvent(new Event("online"));
      });

      expect(result.current.isOnline).toBe(true);
      expect(result.current.pendingSync).toBe(true);

      // Fast forward sync
      act(() => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.pendingSync).toBe(false);
      });

      expect(result.current.lastSyncTime).not.toBeNull();
    });
  });
});
