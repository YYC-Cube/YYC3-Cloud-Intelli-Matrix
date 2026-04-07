/**
 * useFollowUp.test.ts
 * =====================
 * 一键跟进系统 Hook 测试
 *
 * @file useFollowUp.test.ts
 * @description useFollowUp Hook单元测试
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-04-05
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../lib/create-local-store", () => ({
  createLocalStore: () => ({
    getAll: vi.fn(() => []),
    setAll: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  }),
}));

import { useFollowUp } from "../hooks/useFollowUp";

describe("useFollowUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with empty items", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.items).toEqual([]);
    });

    it("should initialize with closed drawer", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.drawerOpen).toBe(false);
    });

    it("should initialize with null drawer item", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.drawerItem).toBeNull();
    });

    it("should initialize with all filter", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.filterSeverity).toBe("all");
      expect(result.current.filterStatus).toBe("all");
    });

    it("should initialize with stats", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.stats).toBeDefined();
      expect(result.current.stats.total).toBe(0);
    });
  });

  describe("openDrawer", () => {
    it("should open drawer with item", () => {
      const { result } = renderHook(() => useFollowUp());

      const mockItem = {
        id: "AL-001",
        severity: "warning" as const,
        title: "Test Alert",
        source: "Test Source",
        metric: "Test Metric",
        status: "active" as const,
        timestamp: Date.now(),
        tags: [],
        chain: [],
      };

      act(() => {
        result.current.openDrawer(mockItem);
      });

      expect(result.current.drawerOpen).toBe(true);
      expect(result.current.drawerItem).toEqual(mockItem);
    });
  });

  describe("closeDrawer", () => {
    it("should close drawer", () => {
      const { result } = renderHook(() => useFollowUp());

      const mockItem = {
        id: "AL-001",
        severity: "warning" as const,
        title: "Test Alert",
        source: "Test Source",
        metric: "Test Metric",
        status: "active" as const,
        timestamp: Date.now(),
        tags: [],
        chain: [],
      };

      act(() => {
        result.current.openDrawer(mockItem);
      });

      expect(result.current.drawerOpen).toBe(true);

      act(() => {
        result.current.closeDrawer();
      });

      expect(result.current.drawerOpen).toBe(false);
    });
  });

  describe("setFilterSeverity", () => {
    it("should set severity filter", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.filterSeverity).toBe("all");

      act(() => {
        result.current.setFilterSeverity("critical");
      });

      expect(result.current.filterSeverity).toBe("critical");
    });
  });

  describe("setFilterStatus", () => {
    it("should set status filter", () => {
      const { result } = renderHook(() => useFollowUp());

      expect(result.current.filterStatus).toBe("all");

      act(() => {
        result.current.setFilterStatus("active");
      });

      expect(result.current.filterStatus).toBe("active");
    });
  });

  describe("quickFix", () => {
    it("should handle quick fix for empty items", () => {
      const { result } = renderHook(() => useFollowUp());

      const mockItem = {
        id: "AL-001",
        severity: "warning" as const,
        title: "Test Alert",
        source: "Test Source",
        metric: "Test Metric",
        status: "active" as const,
        timestamp: Date.now(),
        tags: [],
        chain: [],
      };

      act(() => {
        result.current.quickFix(mockItem);
      });

      expect(result.current.items).toEqual([]);
    });
  });

  describe("markResolved", () => {
    it("should handle mark resolved for empty items", () => {
      const { result } = renderHook(() => useFollowUp());

      const mockItem = {
        id: "AL-001",
        severity: "warning" as const,
        title: "Test Alert",
        source: "Test Source",
        metric: "Test Metric",
        status: "active" as const,
        timestamp: Date.now(),
        tags: [],
        chain: [],
      };

      act(() => {
        result.current.markResolved(mockItem);
      });

      expect(result.current.items).toEqual([]);
    });
  });
});
