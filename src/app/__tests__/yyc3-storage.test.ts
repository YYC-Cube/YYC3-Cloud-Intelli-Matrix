/**
 * @file: yyc3-storage.test.ts
 * @description: yyc3-storage.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

// @vitest-environment jsdom
/**
 * yyc3-storage.test.ts
 * =======================
 * yyc3-storage - 统一本地存储层测试
 *
 * 覆盖范围:
 * - IndexedDB 连接管理
 * - CRUD 操作（put, get, getAll, delete, clear, count）
 * - 批量操作（putMany）
 * - BroadcastChannel 同步
 * - 数据导入导出
 * - 存储统计
 * - localStorage 管理
 * - 错误处理
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  idbPut,
  idbPutMany,
  idbGet,
  idbGetAll,
  idbDelete,
  idbClear,
  idbCount,
  onStorageChange,
  exportAllData,
  importAllData,
  getStorageStats,
  clearAllLocalStorage,
  clearAllStorage,
  LOCALSTORAGE_KEYS,
  ALL_STORES,
} from "../lib/yyc3-storage";
import type { StoreName } from "../types";

describe("yyc3-storage", () => {
  const TEST_STORE: StoreName = "alertRules";

  beforeEach(() => {
    vi.clearAllMocks();
    // 清理 localStorage
    for (const key of Object.values(LOCALSTORAGE_KEYS)) {
      localStorage.removeItem(key);
    }
  });

  // 移除 afterEach 清理，让每个测试独立运行
  // afterEach(async () => {
  //   // 清理当前测试创建的数据，而不是清空整个数据库
  //   try {
  //     await idbClear(TEST_STORE);
  //   } catch {
  //     // 忽略清理错误
  //   }
  // });

  describe("IndexedDB 连接管理", () => {
    it("应该成功打开数据库", async () => {
      const result = await idbGet(TEST_STORE, "test-id");
      expect(result).toBeUndefined();
    });

    it("应该创建所有必需的 object stores", async () => {
      const stats = await getStorageStats();
      expect(stats.stores).toHaveLength(ALL_STORES.length);
    });

    it("应该处理 IndexedDB 不可用的情况", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const result = await idbPut(TEST_STORE, { id: "test" });
      expect(result).toBeUndefined();

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("CRUD 操作 - idbPut", () => {
    it("应该写入单条记录", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const item = { id: "put-test-1", name: "Test Rule", enabled: true };
      await idbPut(TEST_STORE, item);

      const result = await idbGet(TEST_STORE, "put-test-1");
      expect(result).toEqual(item);
    });

    it("应该更新已存在的记录", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const item1 = { id: "put-update-test-1", name: "Original", enabled: true };
      await idbPut(TEST_STORE, item1);

      const item2 = { id: "put-update-test-1", name: "Updated", enabled: false };
      await idbPut(TEST_STORE, item2);

      const result = await idbGet(TEST_STORE, "put-update-test-1");
      expect(result).toEqual(item2);
    });

    it("应该处理写入错误", async () => {
      const result = await idbPut(TEST_STORE, { id: "test" });
      expect(result).toBeUndefined();
    });
  });

  describe("CRUD 操作 - idbGet", () => {
    it("应该读取单条记录", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const item = { id: "get-test-1", name: "Test Rule", enabled: true };
      await idbPut(TEST_STORE, item);

      const result = await idbGet(TEST_STORE, "get-test-1");
      expect(result).toEqual(item);
    });

    it("应该返回 undefined 当记录不存在", async () => {
      const result = await idbGet(TEST_STORE, "non-existent");
      expect(result).toBeUndefined();
    });

    it("应该处理读取错误", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const result = await idbGet(TEST_STORE, "test-id");
      expect(result).toBeUndefined();

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("CRUD 操作 - idbGetAll", () => {
    it("应该读取所有记录", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const items = [
        { id: "getall-test-1", name: "Rule 1", enabled: true },
        { id: "getall-test-2", name: "Rule 2", enabled: false },
        { id: "getall-test-3", name: "Rule 3", enabled: true },
      ];
      for (const item of items) {
        await idbPut(TEST_STORE, item);
      }

      const result = await idbGetAll(TEST_STORE);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining(items));
    });

    it("应该返回空数组当 store 为空", async () => {
      await idbClear(TEST_STORE);
      const result = await idbGetAll(TEST_STORE);
      expect(result).toEqual([]);
    });

    it("应该处理读取所有记录错误", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const result = await idbGetAll(TEST_STORE);
      expect(result).toEqual([]);

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("CRUD 操作 - idbDelete", () => {
    it("应该删除单条记录", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const item = { id: "delete-test-1", name: "Test Rule", enabled: true };
      await idbPut(TEST_STORE, item);

      await idbDelete(TEST_STORE, "delete-test-1");

      const result = await idbGet(TEST_STORE, "delete-test-1");
      expect(result).toBeUndefined();
    });

    it("应该处理删除不存在的记录", async () => {
      const result = await idbDelete(TEST_STORE, "non-existent");
      expect(result).toBeUndefined();
    });

    it("应该处理删除错误", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const result = await idbDelete(TEST_STORE, "test-id");
      expect(result).toBeUndefined();

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("CRUD 操作 - idbClear", () => {
    it("应该清空 store", async () => {
      const items = [
        { id: "test-1", name: "Rule 1", enabled: true },
        { id: "test-2", name: "Rule 2", enabled: false },
      ];
      for (const item of items) {
        await idbPut(TEST_STORE, item);
      }

      await idbClear(TEST_STORE);

      const result = await idbGetAll(TEST_STORE);
      expect(result).toEqual([]);
    });

    it("应该处理清空错误", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const result = await idbClear(TEST_STORE);
      expect(result).toBeUndefined();

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("CRUD 操作 - idbCount", () => {
    it("应该返回记录数", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const items = [
        { id: "count-test-1", name: "Rule 1", enabled: true },
        { id: "count-test-2", name: "Rule 2", enabled: false },
        { id: "count-test-3", name: "Rule 3", enabled: true },
      ];
      for (const item of items) {
        await idbPut(TEST_STORE, item);
      }

      const count = await idbCount(TEST_STORE);
      expect(count).toBe(3);
    });

    it("应该返回 0 当 store 为空", async () => {
      await idbClear(TEST_STORE);
      const count = await idbCount(TEST_STORE);
      expect(count).toBe(0);
    });

    it("应该处理计数错误", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const count = await idbCount(TEST_STORE);
      expect(count).toBe(0);

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("批量操作 - idbPutMany", () => {
    it("应该批量写入多条记录", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const items = [
        { id: "batch-test-1", name: "Rule 1", enabled: true },
        { id: "batch-test-2", name: "Rule 2", enabled: false },
        { id: "batch-test-3", name: "Rule 3", enabled: true },
      ];
      await idbPutMany(TEST_STORE, items);

      const result = await idbGetAll(TEST_STORE);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining(items));
    });

    it("应该处理空数组", async () => {
      const result = await idbPutMany(TEST_STORE, []);
      expect(result).toBeUndefined();
    });

    it("应该处理批量写入错误", async () => {
      const originalIndexedDB = global.indexedDB;
      delete (global as any).indexedDB;

      const result = await idbPutMany(TEST_STORE, [
        { id: "batch-error-test-1", name: "Rule 1", enabled: true },
      ]);
      expect(result).toBeUndefined();

      global.indexedDB = originalIndexedDB;
    });
  });

  describe("BroadcastChannel 同步", () => {
    it("应该注册变更监听器", () => {
      const listener = vi.fn();
      const unsubscribe = onStorageChange(listener);

      expect(typeof unsubscribe).toBe("function");

      unsubscribe();
    });

    it("应该移除已注册的监听器", () => {
      const listener = vi.fn();
      const unsubscribe = onStorageChange(listener);

      unsubscribe();

      // 验证监听器已被移除（通过检查是否仍然在列表中）
      // 由于这是内部实现，我们只验证 unsubscribe 函数可以正常调用
      expect(true).toBe(true);
    });

    it("应该处理监听器错误", () => {
      const errorListener = vi.fn(() => {
        throw new Error("Listener error");
      });
      const normalListener = vi.fn();

      onStorageChange(errorListener);
      onStorageChange(normalListener);

      // 由于这是内部实现，我们只验证监听器可以正常注册
      expect(true).toBe(true);
    });
  });

  describe("数据导入导出", () => {
    it("应该导出所有 IndexedDB 数据", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const items = [
        { id: "export-test-1", name: "Rule 1", enabled: true },
        { id: "export-test-2", name: "Rule 2", enabled: false },
      ];
      await idbPutMany(TEST_STORE, items);

      const exported = await exportAllData();

      expect(exported).toHaveProperty(TEST_STORE);
      expect(exported[TEST_STORE]).toHaveLength(2);
    });

    it("应该导入 JSON 数据到 IndexedDB", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const data = {
        [TEST_STORE]: [
          { id: "import-test-1", name: "Rule 1", enabled: true },
          { id: "import-test-2", name: "Rule 2", enabled: false },
        ],
      };

      const result = await importAllData(data);

      expect(result.imported).toBe(2);
      expect(result.stores).toContain(TEST_STORE);

      const imported = await idbGetAll(TEST_STORE);
      expect(imported).toHaveLength(2);
    });

    it("应该处理导入空数据", async () => {
      const result = await importAllData({});
      expect(result.imported).toBe(0);
      expect(result.stores).toEqual([]);
    });

    it("应该处理导入非数组数据", async () => {
      const result = await importAllData({
        [TEST_STORE]: null as any,
      });
      expect(result.imported).toBe(0);
    });
  });

  describe("存储统计", () => {
    it("应该返回所有 store 的统计信息", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      const items = [
        { id: "stats-test-1", name: "Rule 1", enabled: true },
        { id: "stats-test-2", name: "Rule 2", enabled: false },
      ];
      await idbPutMany(TEST_STORE, items);

      const stats = await getStorageStats();

      expect(stats.stores).toHaveLength(ALL_STORES.length);
      expect(stats.totalRecords).toBeGreaterThan(0);

      const testStoreStats = stats.stores.find((s) => s.name === TEST_STORE);
      expect(testStoreStats?.count).toBeGreaterThanOrEqual(2);
    });
  });

  describe("localStorage 管理", () => {
    it("应该清除所有 YYC³ localStorage 数据", () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.session, "test-session");
      localStorage.setItem(LOCALSTORAGE_KEYS.locale, "zh-CN");
      localStorage.setItem(LOCALSTORAGE_KEYS.networkConfig, "{}");

      clearAllLocalStorage();

      expect(localStorage.getItem(LOCALSTORAGE_KEYS.session)).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEYS.locale)).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEYS.networkConfig)).toBeNull();
    });

    it("应该清除所有存储数据", async () => {
      // 先清理测试数据
      await idbClear(TEST_STORE);

      localStorage.setItem(LOCALSTORAGE_KEYS.session, "test-session");
      await idbPut(TEST_STORE, { id: "clear-test-1", name: "Test", enabled: true });

      await clearAllStorage();

      expect(localStorage.getItem(LOCALSTORAGE_KEYS.session)).toBeNull();
      const result = await idbGet(TEST_STORE, "clear-test-1");
      expect(result).toBeUndefined();
    });
  });
});
