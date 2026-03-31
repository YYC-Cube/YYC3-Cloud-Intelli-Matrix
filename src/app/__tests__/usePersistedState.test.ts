/**
 * @file: usePersistedState.test.ts
 * @description: usePersistedState.test.ts description
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
import { usePersistedList } from "../hooks/usePersistedState";
import type { StoreName } from "../types";

describe("usePersistedList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup IndexedDB
    indexedDB.deleteDatabase("yyc3_matrix");
  });

  describe("initialization", () => {
    it("should initialize with empty list", () => {
      const { result } = renderHook(() => usePersistedList("alertRules"));

      expect(result.current.items).toEqual([]);
      expect(result.current.loaded).toBe(false);
    });

    it("should initialize with default data", () => {
      const defaultData = [
        { id: "test-1", name: "Test Item 1" },
        { id: "test-2", name: "Test Item 2" },
      ];

      const { result } = renderHook(() => usePersistedList("alertRules", defaultData));

      expect(result.current.items).toEqual(defaultData);
    });

    it("should load from IndexedDB on mount", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules"));

      expect(result.current.loaded).toBe(false);

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });
    });
  });

  describe("upsert", () => {
    it("should add new item", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules"));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newItem = { id: "test-1", name: "New Item" };

      await act(async () => {
        await result.current.upsert(newItem);
      });

      expect(result.current.items).toContainEqual(newItem);
    });

    it("should update existing item", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Original Item" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const updatedItem = { id: "test-1", name: "Updated Item" };

      await act(async () => {
        await result.current.upsert(updatedItem);
      });

      expect(result.current.items).toContainEqual(updatedItem);
      expect(result.current.items).not.toContainEqual({ id: "test-1", name: "Original Item" });
    });
  });

  describe("setAll", () => {
    it("should replace all items", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Item 1" },
        { id: "test-2", name: "Item 2" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newItems = [
        { id: "test-3", name: "Item 3" },
        { id: "test-4", name: "Item 4" },
      ];

      await act(async () => {
        await result.current.setAll(newItems);
      });

      expect(result.current.items).toEqual(newItems);
    });

    it("should clear all items when setting empty array", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Item 1" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.setAll([]);
      });

      expect(result.current.items).toEqual([]);
    });
  });

  describe("remove", () => {
    it("should remove item by id", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Item 1" },
        { id: "test-2", name: "Item 2" },
        { id: "test-3", name: "Item 3" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.remove("test-2");
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items.find((i) => i.id === "test-2")).toBeUndefined();
    });
  });

  describe("clear", () => {
    it("should clear all items", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Item 1" },
        { id: "test-2", name: "Item 2" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.clear();
      });

      expect(result.current.items).toEqual([]);
    });
  });

  describe("prepend", () => {
    it("should add item to beginning of list", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Item 1" },
        { id: "test-2", name: "Item 2" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newItem = { id: "test-3", name: "New First Item" };

      await act(async () => {
        await result.current.prepend(newItem);
      });

      expect(result.current.items[0]).toEqual(newItem);
      expect(result.current.items).toHaveLength(3);
    });
  });

  describe("setItems", () => {
    it("should update items directly", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules", [
        { id: "test-1", name: "Item 1" },
      ]));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newItems = [
        { id: "test-2", name: "Item 2" },
        { id: "test-3", name: "Item 3" },
      ];

      act(() => {
        result.current.setItems(newItems);
      });

      expect(result.current.items).toEqual(newItems);
    });
  });

  describe("integration", () => {
    it("should handle complete CRUD workflow", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules"));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      // Create
      const item1 = { id: "test-1", name: "Item 1" };
      await act(async () => {
        await result.current.upsert(item1);
      });
      expect(result.current.items).toContainEqual(item1);

      // Update
      const updatedItem1 = { id: "test-1", name: "Updated Item 1" };
      await act(async () => {
        await result.current.upsert(updatedItem1);
      });
      expect(result.current.items).toContainEqual(updatedItem1);

      // Create another
      const item2 = { id: "test-2", name: "Item 2" };
      await act(async () => {
        await result.current.upsert(item2);
      });
      expect(result.current.items).toHaveLength(2);

      // Prepend
      const item3 = { id: "test-3", name: "Item 3" };
      await act(async () => {
        await result.current.prepend(item3);
      });
      expect(result.current.items[0]).toEqual(item3);

      // Delete
      await act(async () => {
        await result.current.remove("test-2");
      });
      expect(result.current.items).toHaveLength(2);

      // Clear
      await act(async () => {
        await result.current.clear();
      });
      expect(result.current.items).toEqual([]);
    });

    it("should handle batch operations", async () => {
      const { result } = renderHook(() => usePersistedList("alertRules"));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      // Batch create
      const items = Array.from({ length: 10 }, (_, i) => ({
        id: `test-${i}`,
        name: `Item ${i}`,
      }));

      await act(async () => {
        await result.current.setAll(items);
      });

      expect(result.current.items).toHaveLength(10);

      // Batch update
      const updatedItems = items.map((item) => ({
        ...item,
        name: `Updated ${item.name}`,
      }));

      await act(async () => {
        await result.current.setAll(updatedItems);
      });

      expect((result.current.items[0] as any).name).toBe("Updated Item 0");
    });
  });

  describe("error handling", () => {
    it("should handle IndexedDB errors gracefully", async () => {
      // Mock IndexedDB to be undefined
      const originalIndexedDB = global.indexedDB;
      // @ts-ignore
      delete global.indexedDB;

      const { result } = renderHook(() => usePersistedList("alertRules"));

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newItem = { id: "test-1", name: "Test Item" };

      await act(async () => {
        await result.current.upsert(newItem);
      });

      // Should not throw error
      expect(result.current.items).toContainEqual(newItem);

      // Restore
      global.indexedDB = originalIndexedDB;
    });
  });
});
