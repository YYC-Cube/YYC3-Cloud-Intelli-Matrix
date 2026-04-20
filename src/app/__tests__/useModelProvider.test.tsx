/**
 * @file: useModelProvider.test.tsx
 * @description: useModelProvider Hook test — Zustand slice integration
 * @author: YanYuCloudCube Team
 * @version: v2.0.0
 * @created: 2026-03-31
 * @updated: 2026-04-19
 * @status: active
 * @tags: [component]
 */

// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { renderHook, act, cleanup } from "@testing-library/react";

// ── Mock dependencies before imports ──────────────────────────

vi.mock("../lib/ollama-url", () => ({
  getOllamaTagsUrl: vi.fn(() => "http://localhost:11434/api/tags"),
}));

vi.mock("../lib/connection-test-engine", () => ({
  testAIConnection: vi.fn(async () => ({
    overallStatus: "pass",
    steps: [],
    totalLatencyMs: 50,
  })),
}));

// Mock fetch to throw so fetchOllamaModels triggers mock fallback
global.fetch = vi.fn(() => { throw new Error("Network error"); }) as any;

// Reset the Zustand store state between tests
import { useProviderSlice, BUILTIN_PROVIDERS as SLICE_BUILTIN } from "../store/slices/provider-slice";

// Import hook after mocks
import { useModelProvider, MODEL_PROVIDERS } from "../hooks/useModelProvider";

describe("useModelProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store to clean state with fresh builtin providers
    useProviderSlice.setState({
      providers: SLICE_BUILTIN.map((p) => ({ ...p })),
      configuredModels: [],
      ollamaModels: [],
      ollamaLoading: false,
      ollamaError: null,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("MODEL_PROVIDERS registry", () => {
    it("should have 9 providers", () => {
      expect(MODEL_PROVIDERS.length).toBe(9);
    });

    it("should contain Z.ai", () => {
      const zhipu = MODEL_PROVIDERS.find((p) => p.id === "zhipu");
      expect(zhipu).toBeDefined();
      expect(zhipu!.label).toBe("Z.ai");
      expect(zhipu!.requiresApiKey).toBe(true);
      expect(zhipu!.isLocal).toBe(false);
    });

    it("should contain OpenAI", () => {
      const openai = MODEL_PROVIDERS.find((p) => p.id === "openai");
      expect(openai).toBeDefined();
      expect(openai!.authType).toBe("bearer");
      expect(openai!.models.length).toBeGreaterThanOrEqual(4);
    });

    it("should contain Ollama (local)", () => {
      const ollama = MODEL_PROVIDERS.find((p) => p.id === "ollama");
      expect(ollama).toBeDefined();
      expect(ollama!.isLocal).toBe(true);
      expect(ollama!.requiresApiKey).toBe(false);
      expect(ollama!.authType).toBe("none");
    });

    it("should contain DeepSeek", () => {
      expect(MODEL_PROVIDERS.find((p) => p.id === "deepseek")).toBeDefined();
    });

    it("should contain Kimi-CN and Kimi-Global", () => {
      expect(MODEL_PROVIDERS.find((p) => p.id === "kimi-cn")).toBeDefined();
      expect(MODEL_PROVIDERS.find((p) => p.id === "kimi-global")).toBeDefined();
    });

    it("should contain volcengine series", () => {
      expect(MODEL_PROVIDERS.find((p) => p.id === "volcengine")).toBeDefined();
      expect(MODEL_PROVIDERS.find((p) => p.id === "volcengine-plan")).toBeDefined();
    });
  });

  describe("Hook basic functionality", () => {
    it("initially should have no configured models", () => {
      const { result } = renderHook(() => useModelProvider());
      expect(result.current.configuredModels.length).toBe(0);
    });

    it("addModel should add a model", () => {
      const { result } = renderHook(() => useModelProvider());
      act(() => {
        result.current.addModel("openai", "gpt-4o", "sk-test-123");
      });
      expect(result.current.configuredModels.length).toBe(1);
      expect(result.current.configuredModels[0].model).toBe("gpt-4o");
      expect(result.current.configuredModels[0].providerId).toBe("openai");
    });

    it("removeModel should remove a model", () => {
      const { result } = renderHook(() => useModelProvider());
      act(() => {
        result.current.addModel("openai", "gpt-4o", "sk-test-123");
      });
      const id = result.current.configuredModels[0].id;
      act(() => {
        result.current.removeModel(id);
      });
      expect(result.current.configuredModels.length).toBe(0);
    });

    it("testConnection should update status to active", async () => {
      const { result } = renderHook(() => useModelProvider());
      act(() => {
        result.current.addModel("openai", "gpt-4o", "sk-test-123");
      });
      const id = result.current.configuredModels[0].id;
      await act(async () => {
        await result.current.testConnection(id);
      });
      expect(result.current.configuredModels[0].status).toBe("active");
    });

    it("modalOpen control should work", () => {
      const { result } = renderHook(() => useModelProvider());
      expect(result.current.modalOpen).toBe(false);
      act(() => result.current.openModal());
      expect(result.current.modalOpen).toBe(true);
      act(() => result.current.closeModal());
      expect(result.current.modalOpen).toBe(false);
    });

    it("stats should calculate correctly", () => {
      const { result } = renderHook(() => useModelProvider());
      act(() => {
        result.current.addModel("openai", "gpt-4o", "sk-test-123");
        result.current.addModel("zhipu", "glm-4-flash", "key-456");
      });
      expect(result.current.stats.total).toBe(2);
      expect(result.current.stats.providers).toBe(2);
    });

    it("fetchOllamaModels should fetch models (Mock fallback)", async () => {
      // Test directly through the store to avoid useEffect timing issues
      await useProviderSlice.getState().fetchOllamaModels();
      const ollamaModels = useProviderSlice.getState().ollamaModels;
      expect(ollamaModels.length).toBe(6);
    });
  });
});
