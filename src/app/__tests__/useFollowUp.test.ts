// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFollowUp } from "../hooks/useFollowUp";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "sonner";

describe("useFollowUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("initial state", () => {
    it("should initialize with default items", () => {
      const { result } = renderHook(() => useFollowUp());
      
      expect(result.current.allItems.length).toBeGreaterThan(0);
      expect(result.current.drawerOpen).toBe(false);
      expect(result.current.drawerItem).toBeNull();
      expect(result.current.filterSeverity).toBe("all");
      expect(result.current.filterStatus).toBe("all");
    });

    it("should calculate correct stats", () => {
      const { result } = renderHook(() => useFollowUp());
      
      expect(result.current.stats.total).toBeGreaterThan(0);
      expect(result.current.stats.critical).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.error).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.warning).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.active).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.investigating).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.resolved).toBeGreaterThanOrEqual(0);
    });
  });

  describe("drawer management", () => {
    it("should open drawer with item", () => {
      const { result } = renderHook(() => useFollowUp());
      
      expect(result.current.drawerOpen).toBe(false);
      expect(result.current.drawerItem).toBeNull();

      const testItem = result.current.allItems[0];
      act(() => {
        result.current.openDrawer(testItem);
      });

      expect(result.current.drawerOpen).toBe(true);
      expect(result.current.drawerItem).toBe(testItem);
    });

    it("should close drawer", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      act(() => {
        result.current.openDrawer(testItem);
      });

      expect(result.current.drawerOpen).toBe(true);

      act(() => {
        result.current.closeDrawer();
      });

      expect(result.current.drawerOpen).toBe(false);
    });

    it("should clear drawer item after close delay", async () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      act(() => {
        result.current.openDrawer(testItem);
      });

      expect(result.current.drawerItem).toBe(testItem);

      act(() => {
        result.current.closeDrawer();
      });

      // Item should still be there immediately
      expect(result.current.drawerItem).toBe(testItem);

      // Wait for animation delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.drawerItem).toBeNull();
      });
    });
  });

  describe("quick fix", () => {
    it("should execute quick fix and show toast", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      act(() => {
        result.current.quickFix(testItem);
      });

      expect(toast.success).toHaveBeenCalledWith(
        `正在执行一键修复: ${testItem.title}`,
        expect.objectContaining({
          description: `来源: ${testItem.source}`,
        })
      );
    });

    it("should update item status to investigating", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      const originalStatus = testItem.status;

      act(() => {
        result.current.quickFix(testItem);
      });

      const updatedItem = result.current.allItems.find((i) => i.id === testItem.id);
      expect(updatedItem?.status).toBe("investigating");
      expect(originalStatus).not.toBe("investigating");
    });
  });

  describe("mark resolved", () => {
    it("should mark item as resolved and show toast", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      act(() => {
        result.current.markResolved(testItem);
      });

      expect(toast.success).toHaveBeenCalledWith(
        `已标记为已解决: ${testItem.title}`
      );
    });

    it("should update item status to resolved", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      act(() => {
        result.current.markResolved(testItem);
      });

      const updatedItem = result.current.allItems.find((i) => i.id === testItem.id);
      expect(updatedItem?.status).toBe("resolved");
    });

    it("should close drawer after marking resolved", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];
      act(() => {
        result.current.openDrawer(testItem);
      });

      expect(result.current.drawerOpen).toBe(true);

      act(() => {
        result.current.markResolved(testItem);
      });

      expect(result.current.drawerOpen).toBe(false);
    });
  });

  describe("filtering", () => {
    it("should filter by severity", () => {
      const { result } = renderHook(() => useFollowUp());
      
      act(() => {
        result.current.setFilterSeverity("critical");
      });

      expect(result.current.filterSeverity).toBe("critical");
      expect(result.current.items.every((i) => i.severity === "critical")).toBe(true);
    });

    it("should filter by status", () => {
      const { result } = renderHook(() => useFollowUp());
      
      act(() => {
        result.current.setFilterStatus("active");
      });

      expect(result.current.filterStatus).toBe("active");
      expect(result.current.items.every((i) => i.status === "active")).toBe(true);
    });

    it("should show all items when filter is all", () => {
      const { result } = renderHook(() => useFollowUp());
      
      act(() => {
        result.current.setFilterSeverity("all");
        result.current.setFilterStatus("all");
      });

      expect(result.current.items.length).toBe(result.current.allItems.length);
    });

    it("should combine severity and status filters", () => {
      const { result } = renderHook(() => useFollowUp());
      
      act(() => {
        result.current.setFilterSeverity("critical");
        result.current.setFilterStatus("active");
      });

      expect(result.current.items.every((i) => 
        i.severity === "critical" && i.status === "active"
      )).toBe(true);
    });
  });

  describe("stats calculation", () => {
    it("should calculate total count", () => {
      const { result } = renderHook(() => useFollowUp());
      
      expect(result.current.stats.total).toBe(result.current.allItems.length);
    });

    it("should calculate severity counts", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const criticalCount = result.current.allItems.filter((i) => i.severity === "critical").length;
      const errorCount = result.current.allItems.filter((i) => i.severity === "error").length;
      const warningCount = result.current.allItems.filter((i) => i.severity === "warning").length;

      expect(result.current.stats.critical).toBe(criticalCount);
      expect(result.current.stats.error).toBe(errorCount);
      expect(result.current.stats.warning).toBe(warningCount);
    });

    it("should calculate status counts", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const activeCount = result.current.allItems.filter((i) => i.status === "active").length;
      const investigatingCount = result.current.allItems.filter((i) => i.status === "investigating").length;
      const resolvedCount = result.current.allItems.filter((i) => i.status === "resolved").length;

      expect(result.current.stats.active).toBe(activeCount);
      expect(result.current.stats.investigating).toBe(investigatingCount);
      expect(result.current.stats.resolved).toBe(resolvedCount);
    });
  });

  describe("integration", () => {
    it("should handle complete workflow", () => {
      const { result } = renderHook(() => useFollowUp());
      
      const testItem = result.current.allItems[0];

      // Open drawer
      act(() => {
        result.current.openDrawer(testItem);
      });
      expect(result.current.drawerOpen).toBe(true);
      expect(result.current.drawerItem).toBe(testItem);

      // Quick fix
      act(() => {
        result.current.quickFix(testItem);
      });
      expect(toast.success).toHaveBeenCalled();

      // Mark resolved
      act(() => {
        result.current.markResolved(testItem);
      });
      expect(toast.success).toHaveBeenCalled();
      expect(result.current.drawerOpen).toBe(false);

      // Filter
      act(() => {
        result.current.setFilterSeverity("critical");
      });
      expect(result.current.filterSeverity).toBe("critical");
    });
  });
});
