// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAIDiagnostics } from "../hooks/useAIDiagnostics";

describe("useAIDiagnostics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    expect(result.current.status).toBe("idle");
    expect(result.current.session).toBeNull();
    expect(result.current.history).toEqual([]);
    expect(result.current.historyLoaded).toBe(true);
    expect(result.current.activeView).toBe("patterns");
    expect(result.current.executingAction).toBeNull();
  });

  it("should start diagnosis", () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    act(() => {
      result.current.startDiagnosis({});
    });
    
    expect(result.current.status).toBe("analyzing");
  });

  it("should complete diagnosis and generate session", async () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    act(() => {
      result.current.startDiagnosis({});
    });
    
    // Fast forward timers
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
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
      result.current.startDiagnosis({});
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
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
      result.current.startDiagnosis({});
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
    // Get first action ID
    const firstActionId = result.current.session?.actions[0].id;
    
    if (firstActionId) {
      act(() => {
        result.current.executeAction(firstActionId);
      });
      
      expect(result.current.executingAction).toBe(firstActionId);
      
      // Fast forward execution time
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      await waitFor(() => {
        expect(result.current.executingAction).toBeNull();
      });
    }
  });

  it("should generate patterns with live nodes", async () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    const liveNodes = [
      { id: "test-node-1", gpu: 90, mem: 85, temp: 75, status: "online" as const },
      { id: "test-node-2", gpu: 70, mem: 65, temp: 60, status: "online" as const },
    ];
    
    act(() => {
      result.current.startDiagnosis({ liveNodes });
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
    expect(result.current.session?.patterns.length).toBeGreaterThan(0);
  });

  it("should generate anomalies", async () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    act(() => {
      result.current.startDiagnosis({});
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
    expect(result.current.session?.anomalies.length).toBeGreaterThan(0);
  });

  it("should generate suggested actions", async () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    act(() => {
      result.current.startDiagnosis({});
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
    expect(result.current.session?.actions.length).toBeGreaterThan(0);
  });

  it("should generate forecasts", async () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    act(() => {
      result.current.startDiagnosis({});
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
    expect(result.current.session?.forecasts.length).toBeGreaterThan(0);
  });

  it("should generate summary", async () => {
    const { result } = renderHook(() => useAIDiagnostics());
    
    act(() => {
      result.current.startDiagnosis({});
    });
    
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });
    
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
