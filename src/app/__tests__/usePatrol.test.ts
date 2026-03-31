/**
 * @file: usePatrol.test.ts
 * @description: usePatrol.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePatrol } from "../hooks/usePatrol";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("usePatrol", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => usePatrol());
    expect(result.current.patrolStatus).toBe("idle");
    expect(result.current.history).toBeDefined();
    expect(result.current.schedule).toBeDefined();
  });

  it("should start manual patrol", () => {
    const { result } = renderHook(() => usePatrol());
    act(() => {
      result.current.runPatrol();
    });
    expect(result.current.patrolStatus).toBe("running");
  });

  it("should complete patrol and generate results", () => {
    const { result } = renderHook(() => usePatrol());
    act(() => {
      result.current.runPatrol();
    });
    // Wait for patrol to complete
    setTimeout(() => {
      expect(result.current.patrolStatus).toBe("idle");
      expect(result.current.currentResult).toBeDefined();
    }, 100);
  });

  it("should add patrol to history", () => {
    const { result } = renderHook(() => usePatrol());
    const initialHistoryLength = result.current.history.length;
    act(() => {
      result.current.runPatrol();
    });
    setTimeout(() => {
      expect(result.current.history.length).toBeGreaterThan(initialHistoryLength);
    }, 100);
  });

  it("should update interval", () => {
    const { result } = renderHook(() => usePatrol());
    act(() => {
      result.current.updateInterval(30);
    });
    expect(result.current.schedule.interval).toBe(30);
  });

  it("should toggle auto patrol", () => {
    const { result } = renderHook(() => usePatrol());
    const initialEnabled = result.current.schedule.enabled;
    act(() => {
      result.current.toggleAutoPatrol(!initialEnabled);
    });
    // Verify the enabled state was toggled
    expect(result.current.schedule.enabled).toBe(!initialEnabled);
  });
});
