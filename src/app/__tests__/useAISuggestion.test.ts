/**
 * @file: useAISuggestion.test.ts
 * @description: useAISuggestion Hook单元测试
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-05
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
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

import { useAISuggestion } from "../hooks/useAISuggestion";

describe("useAISuggestion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with empty patterns", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.patterns).toEqual([]);
    });

    it("should initialize with empty recommendations", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.recommendations).toEqual([]);
    });

    it("should initialize with isAnalyzing false", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.isAnalyzing).toBe(false);
    });

    it("should initialize with enabledAutoSuggestion true", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.enabledAutoSuggestion).toBe(true);
    });

    it("should initialize with overallHealth 100 when no patterns", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.overallHealth).toBe(100);
    });
  });

  describe("stats", () => {
    it("should return correct stats for empty state", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.stats).toEqual({
        totalPatterns: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        totalRecommendations: 0,
        appliedCount: 0,
      });
    });
  });

  describe("setEnabledAutoSuggestion", () => {
    it("should toggle auto suggestion", () => {
      const { result } = renderHook(() => useAISuggestion());

      expect(result.current.enabledAutoSuggestion).toBe(true);

      act(() => {
        result.current.setEnabledAutoSuggestion(false);
      });

      expect(result.current.enabledAutoSuggestion).toBe(false);
    });
  });

  describe("runAnalysis", () => {
    it("should run analysis", async () => {
      const { result } = renderHook(() => useAISuggestion());

      act(() => {
        result.current.runAnalysis();
      });

      expect(result.current.isAnalyzing).toBe(true);

      await act(async () => {
        vi.advanceTimersByTimeAsync(4000);
      });

      expect(result.current.isAnalyzing).toBe(false);
    });
  });

  describe("getRecommendationsForPattern", () => {
    it("should return empty array for unknown pattern", () => {
      const { result } = renderHook(() => useAISuggestion());

      const recs = result.current.getRecommendationsForPattern("unknown");

      expect(recs).toEqual([]);
    });
  });

  describe("dismissRecommendation", () => {
    it("should dismiss recommendation", () => {
      const { result } = renderHook(() => useAISuggestion());

      act(() => {
        result.current.dismissRecommendation("rec-1");
      });

      expect(result.current.recommendations).toEqual([]);
    });
  });

  describe("dismissPattern", () => {
    it("should dismiss pattern", () => {
      const { result } = renderHook(() => useAISuggestion());

      act(() => {
        result.current.dismissPattern("pat-1");
      });

      expect(result.current.patterns).toEqual([]);
    });
  });

  describe("applyRecommendation", () => {
    it("should handle apply for non-existent recommendation", async () => {
      const { result } = renderHook(() => useAISuggestion());

      await act(async () => {
        await result.current.applyRecommendation("non-existent");
      });

      expect(result.current.recommendations).toEqual([]);
    });
  });
});
