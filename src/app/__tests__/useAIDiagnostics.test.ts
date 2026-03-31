/**
 * @file: useAIDiagnostics.test.ts
 * @description: useAIDiagnostics.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAIDiagnostics } from "../hooks/useAIDiagnostics";

describe("useAIDiagnostics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with default state", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    expect(result.current.status).toBe("idle");
    expect(result.current.session).toBeNull();
    expect(result.current.activeView).toBe("patterns");
    expect(result.current.executingAction).toBeNull();

    // historyLoaded starts as false (usePersistedList is async); wait for it
    await waitFor(() => {
      expect(result.current.historyLoaded).toBe(true);
    });
    expect(result.current.history.length).toBeGreaterThan(0);
  });

  it("should start diagnosis", () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    expect(result.current.status).toBe("analyzing");
  });

  it("should complete diagnosis and generate session", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    expect(result.current.status).toBe("analyzing");

    // Wait for the 1800ms setTimeout to fire
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.session).not.toBeNull();
    expect(result.current.session?.status).toBe("complete");
    expect(result.current.session?.patterns.length).toBeGreaterThan(0);
    expect(result.current.session?.anomalies.length).toBeGreaterThan(0);
    expect(result.current.session?.actions.length).toBeGreaterThan(0);
    expect(result.current.session?.forecasts.length).toBeGreaterThan(0);
    expect(result.current.session?.summary).toBeDefined();
  });

  it("should add history entry after diagnosis", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.history.length).toBeGreaterThan(0);
    expect(result.current.history[0]).toHaveProperty("id");
    expect(result.current.history[0]).toHaveProperty("time");
    expect(result.current.history[0]).toHaveProperty("patterns");
    expect(result.current.history[0]).toHaveProperty("actions");
  });

  it("should set active view", () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.setActiveView("anomalies");
    });

    expect(result.current.activeView).toBe("anomalies");
  });

  it("should execute action", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    // First complete a diagnosis
    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    // Get first action ID
    const firstActionId = result.current.session?.actions[0].id;

    if (firstActionId) {
      act(() => {
        result.current.executeAction(firstActionId);
      });

      expect(result.current.executingAction).toBe(firstActionId);

      // Wait for the 2000ms execution setTimeout to fire
      await waitFor(() => {
        expect(result.current.executingAction).toBeNull();
      }, { timeout: 5000 });
    }
  });

  it("should generate patterns with live nodes", async () => {
    const liveNodes = [
      { id: "test-node-1", gpu: 90, mem: 85, temp: 75, status: "online" as const },
      { id: "test-node-2", gpu: 70, mem: 65, temp: 60, status: "online" as const },
    ];

    const { result } = renderHook(() => useAIDiagnostics({ liveNodes }));

    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.session?.patterns.length).toBeGreaterThan(0);
  });

  it("should generate anomalies", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.session?.anomalies.length).toBeGreaterThan(0);
  });

  it("should generate suggested actions", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.session?.actions.length).toBeGreaterThan(0);
  });

  it("should generate forecasts", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.session?.forecasts.length).toBeGreaterThan(0);
  });

  it("should generate summary", async () => {
    const { result } = renderHook(() => useAIDiagnostics());

    act(() => {
      result.current.startDiagnosis();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    }, { timeout: 5000 });

    expect(result.current.session?.summary).toBeDefined();
    expect(typeof result.current.session?.summary).toBe("string");
  });

  it("should handle different views", () => {
    const { result } = renderHook(() => useAIDiagnostics());

    const views = ["patterns", "anomalies", "actions", "forecasts"] as const;

    views.forEach((view) => {
      act(() => {
        result.current.setActiveView(view);
      });

      expect(result.current.activeView).toBe(view);
    });
  });
});
