// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as errorHandler from "../lib/error-handler";
import type { AppError, ErrorCategory, ErrorSeverity } from "../types";

describe("error-handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("getErrorLog", () => {
    it("should return empty array when no errors", () => {
      const log = errorHandler.getErrorLog();
      expect(log).toEqual([]);
    });

    it("should return errors from localStorage", () => {
      const errors = [
        {
          id: "err_1",
          category: "NETWORK" as ErrorCategory,
          severity: "error" as ErrorSeverity,
          message: "Test error",
          timestamp: Date.now(),
          resolved: false,
        },
      ];
      localStorage.setItem("yyc3_error_log", JSON.stringify(errors));

      const log = errorHandler.getErrorLog();
      expect(log).toEqual(errors);
    });

    it("should handle corrupted localStorage data", () => {
      localStorage.setItem("yyc3_error_log", "invalid json");

      const log = errorHandler.getErrorLog();
      expect(log).toEqual([]);
    });
  });

  describe("clearErrorLog", () => {
    it("should clear error log from localStorage", () => {
      localStorage.setItem("yyc3_error_log", JSON.stringify([{ id: "err_1" }]));

      errorHandler.clearErrorLog();

      expect(localStorage.getItem("yyc3_error_log")).toBeNull();
    });

    it("should handle clearing empty log", () => {
      expect(() => errorHandler.clearErrorLog()).not.toThrow();
    });
  });

  describe("getFullErrorLog", () => {
    it("should return empty array when no errors", async () => {
      const log = await errorHandler.getFullErrorLog();
      expect(log).toEqual([]);
    });

    it("should return errors sorted by timestamp descending", async () => {
      const errors = [
        {
          id: "err_1",
          category: "NETWORK" as ErrorCategory,
          severity: "error" as ErrorSeverity,
          message: "Error 1",
          timestamp: 1000,
          resolved: false,
        },
        {
          id: "err_2",
          category: "RUNTIME" as ErrorCategory,
          severity: "warning" as ErrorSeverity,
          message: "Error 2",
          timestamp: 2000,
          resolved: false,
        },
      ];

      for (const error of errors) {
        errorHandler.captureError(error.message);
      }

      const log = await errorHandler.getFullErrorLog();
      expect(log.length).toBeGreaterThan(0);
      if (log.length >= 2) {
        expect(log[0].timestamp).toBeGreaterThanOrEqual(log[1].timestamp);
      }
    });
  });

  describe("getErrorStats", () => {
    it("should return zero stats when no errors", () => {
      const stats = errorHandler.getErrorStats();
      expect(stats.total).toBe(0);
      expect(stats.unresolvedCount).toBe(0);
      expect(stats.lastErrorTime).toBeNull();
    });

    it("should count errors by category", () => {
      errorHandler.captureError("Network error", { category: "NETWORK" });
      errorHandler.captureError("Runtime error", { category: "RUNTIME" });
      errorHandler.captureError("Another network error", { category: "NETWORK" });

      const stats = errorHandler.getErrorStats();
      expect(stats.total).toBe(3);
      expect(stats.byCategory.NETWORK).toBe(2);
      expect(stats.byCategory.RUNTIME).toBe(1);
    });

    it("should count errors by severity", () => {
      errorHandler.captureError("Error 1", { severity: "error" });
      errorHandler.captureError("Error 2", { severity: "warning" });
      errorHandler.captureError("Error 3", { severity: "critical" });

      const stats = errorHandler.getErrorStats();
      expect(stats.total).toBe(3);
      expect(stats.bySeverity.error).toBe(1);
      expect(stats.bySeverity.warning).toBe(1);
      expect(stats.bySeverity.critical).toBe(1);
    });

    it("should count unresolved errors", () => {
      const err1 = errorHandler.captureError("Error 1");
      const err2 = errorHandler.captureError("Error 2");

      const stats = errorHandler.getErrorStats();
      expect(stats.unresolvedCount).toBe(2);

      err1.resolved = true;
      localStorage.setItem("yyc3_error_log", JSON.stringify([err1, err2]));

      const stats2 = errorHandler.getErrorStats();
      expect(stats2.unresolvedCount).toBe(1);
    });

    it("should return last error time", () => {
      errorHandler.captureError("Error 1");

      const stats = errorHandler.getErrorStats();
      expect(stats.lastErrorTime).not.toBeNull();
      expect(stats.lastErrorTime).toBeGreaterThan(0);
    });
  });

  describe("categorizeError", () => {
    it("should categorize TypeError as RUNTIME", () => {
      const error = new TypeError("Type error");
      const { category, severity } = errorHandler.captureError(error);

      expect(category).toBe("RUNTIME");
      expect(severity).toBe("error");
    });

    it("should categorize SyntaxError as PARSE", () => {
      const error = new SyntaxError("Syntax error");
      const { category } = errorHandler.captureError(error);

      expect(category).toBe("PARSE");
    });

    it("should categorize DOMException QuotaExceededError as STORAGE", () => {
      const error = new DOMException("Quota exceeded", "QuotaExceededError");
      const { category, severity } = errorHandler.captureError(error);

      expect(category).toBe("STORAGE");
      expect(severity).toBe("warning");
    });

    it("should categorize DOMException SecurityError as AUTH", () => {
      const error = new DOMException("Security error", "SecurityError");
      const { category } = errorHandler.captureError(error);

      expect(category).toBe("AUTH");
    });

    it("should categorize unknown error as UNKNOWN", () => {
      const error = { message: "Unknown error" };
      const { category } = errorHandler.captureError(error);

      expect(category).toBe("UNKNOWN");
    });
  });

  describe("extractMessage", () => {
    it("should extract message from Error", () => {
      const error = new Error("Test error");
      const appError = errorHandler.captureError(error);

      expect(appError.message).toBe("Test error");
    });

    it("should extract message from string", () => {
      const appError = errorHandler.captureError("String error");

      expect(appError.message).toBe("String error");
    });

    it("should extract message from object", () => {
      const error = { message: "Object error" };
      const appError = errorHandler.captureError(error);

      expect(appError.message).toBe("Object error");
    });

    it("should return default message for unknown type", () => {
      const appError = errorHandler.captureError(null);

      expect(appError.message).toBe("未知错误");
    });
  });

  describe("extractStack", () => {
    it("should extract stack from Error", () => {
      const error = new Error("Test error");
      const appError = errorHandler.captureError(error);

      expect(appError.stack).toBeDefined();
      expect(typeof appError.stack).toBe("string");
    });

    it("should return undefined for non-Error", () => {
      const appError = errorHandler.captureError("String error");

      expect(appError.stack).toBeUndefined();
    });
  });

  describe("captureError", () => {
    it("should create AppError with required fields", () => {
      const error = new Error("Test error");
      const appError = errorHandler.captureError(error);

      expect(appError.id).toMatch(/^err_\d+_[a-z0-9]+$/);
      expect(appError.message).toBe("Test error");
      expect(appError.timestamp).toBeGreaterThan(0);
      expect(appError.resolved).toBe(false);
    });

    it("should use provided category and severity", () => {
      const error = new Error("Test error");
      const appError = errorHandler.captureError(error, {
        category: "NETWORK",
        severity: "critical",
      });

      expect(appError.category).toBe("NETWORK");
      expect(appError.severity).toBe("critical");
    });

    it("should use provided source and userAction", () => {
      const error = new Error("Test error");
      const appError = errorHandler.captureError(error, {
        source: "API",
        userAction: "Retry",
      });

      expect(appError.source).toBe("API");
      expect(appError.userAction).toBe("Retry");
    });

    it("should save error to localStorage", () => {
      errorHandler.captureError("Test error");

      const log = errorHandler.getErrorLog();
      expect(log.length).toBe(1);
      expect(log[0].message).toBe("Test error");
    });

    it("should limit log to MAX_ERROR_ENTRIES", () => {
      const MAX_ERROR_ENTRIES = 200;

      for (let i = 0; i < MAX_ERROR_ENTRIES + 10; i++) {
        errorHandler.captureError(`Error ${i}`);
      }

      const log = errorHandler.getErrorLog();
      expect(log.length).toBe(MAX_ERROR_ENTRIES);
    });

    it("should log to console by default", () => {
      errorHandler.captureError("Test error", { severity: "error" });

      expect(console.error).toHaveBeenCalled();
    });

    it("should not log to console in silent mode", () => {
      errorHandler.captureError("Test error", { silent: true });

      expect(console.error).not.toHaveBeenCalled();
    });

    it("should use different console methods based on severity", () => {
      errorHandler.captureError("Critical error", { severity: "critical" });
      errorHandler.captureError("Warning error", { severity: "warning" });
      errorHandler.captureError("Info error", { severity: "info" });

      expect(console.error).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("captureNetworkError", () => {
    it("should capture network error with correct category", () => {
      const error = new Error("Network failed");
      const appError = errorHandler.captureNetworkError(error, "https://api.example.com");

      expect(appError.category).toBe("NETWORK");
      expect(appError.severity).toBe("warning");
      expect(appError.source).toBe("https://api.example.com");
      expect(appError.userAction).toBe("检查网络连或稍后重试");
    });
  });

  describe("captureWSError", () => {
    it("should capture WebSocket error with correct category", () => {
      const error = new Error("WebSocket failed");
      const appError = errorHandler.captureWSError(error);

      expect(appError.category).toBe("NETWORK");
      expect(appError.severity).toBe("warning");
      expect(appError.source).toBe("WebSocket");
      expect(appError.userAction).toBe("系统将自动尝试重连，或点击手动重连按钮");
    });
  });

  describe("captureAuthError", () => {
    it("should capture auth error with correct category", () => {
      const error = new Error("Auth failed");
      const appError = errorHandler.captureAuthError(error);

      expect(appError.category).toBe("AUTH");
      expect(appError.severity).toBe("error");
      expect(appError.source).toBe("AuthContext");
      expect(appError.userAction).toBe("请重新登录");
    });
  });

  describe("captureParseError", () => {
    it("should capture parse error with correct category", () => {
      const error = new Error("Parse failed");
      const appError = errorHandler.captureParseError(error, "JSON parsing");

      expect(appError.category).toBe("PARSE");
      expect(appError.severity).toBe("warning");
      expect(appError.source).toBe("JSON parsing");
      expect(appError.userAction).toBe("数据格式异常，请检查数据源");
    });
  });

  describe("trySafe", () => {
    it("should return result when function succeeds", async () => {
      const fn = async () => "success";
      const [result, error] = await errorHandler.trySafe(fn);

      expect(result).toBe("success");
      expect(error).toBeNull();
    });

    it("should capture error when function fails", async () => {
      const fn = async () => {
        throw new Error("Async error");
      };
      const [result, error] = await errorHandler.trySafe(fn);

      expect(result).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.message).toBe("Async error");
    });

    it("should include source in captured error", async () => {
      const fn = async () => {
        throw new Error("Async error");
      };
      const [result, error] = await errorHandler.trySafe(fn, "TestSource");

      expect(result).toBeNull();
      expect(error?.source).toBe("TestSource");
    });
  });

  describe("trySafeSync", () => {
    it("should return result when function succeeds", () => {
      const fn = () => "success";
      const [result, error] = errorHandler.trySafeSync(fn);

      expect(result).toBe("success");
      expect(error).toBeNull();
    });

    it("should capture error when function fails", () => {
      const fn = () => {
        throw new Error("Sync error");
      };
      const [result, error] = errorHandler.trySafeSync(fn);

      expect(result).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.message).toBe("Sync error");
    });

    it("should include source in captured error", () => {
      const fn = () => {
        throw new Error("Sync error");
      };
      const [result, error] = errorHandler.trySafeSync(fn, "TestSource");

      expect(result).toBeNull();
      expect(error?.source).toBe("TestSource");
    });
  });

  describe("installGlobalErrorListeners", () => {
    it("should install global error listeners", () => {
      errorHandler.installGlobalErrorListeners();

      expect(() => errorHandler.installGlobalErrorListeners()).not.toThrow();
    });

    it("should capture window.onerror events", () => {
      errorHandler.installGlobalErrorListeners();

      const errorEvent = new ErrorEvent("error", {
        message: "Runtime error",
        filename: "test.js",
        lineno: 10,
        colno: 5,
        error: new Error("Runtime error"),
      });

      window.dispatchEvent(errorEvent);

      const log = errorHandler.getErrorLog();
      expect(log.length).toBeGreaterThan(0);
      expect(log[0].category).toBe("RUNTIME");
    });

    it("should capture unhandledrejection events", () => {
      errorHandler.installGlobalErrorListeners();

      const rejectionEvent = new PromiseRejectionEvent("unhandledrejection", {
        reason: new Error("Promise rejection"),
        promise: Promise.reject(),
      });

      window.dispatchEvent(rejectionEvent);

      const log = errorHandler.getErrorLog();
      expect(log.length).toBeGreaterThan(0);
      expect(log[0].category).toBe("RUNTIME");
    });
  });

  describe("Integration", () => {
    it("should handle complete error workflow", () => {
      // Capture error
      const error = errorHandler.captureError("Test error", {
        category: "NETWORK",
        severity: "warning",
      });

      // Check log
      const log = errorHandler.getErrorLog();
      expect(log.length).toBe(1);
      expect(log[0].id).toBe(error.id);

      // Check stats
      const stats = errorHandler.getErrorStats();
      expect(stats.total).toBe(1);
      expect(stats.byCategory.NETWORK).toBe(1);

      // Resolve error
      error.resolved = true;
      localStorage.setItem("yyc3_error_log", JSON.stringify([error]));

      const stats2 = errorHandler.getErrorStats();
      expect(stats2.unresolvedCount).toBe(0);

      // Clear log
      errorHandler.clearErrorLog();
      const log2 = errorHandler.getErrorLog();
      expect(log2.length).toBe(0);
    });

    it("should handle multiple errors", () => {
      errorHandler.captureError("Error 1", { category: "NETWORK", severity: "error" });
      errorHandler.captureError("Error 2", { category: "RUNTIME", severity: "warning" });
      errorHandler.captureError("Error 3", { category: "AUTH", severity: "critical" });

      const log = errorHandler.getErrorLog();
      expect(log.length).toBe(3);

      const stats = errorHandler.getErrorStats();
      expect(stats.total).toBe(3);
      expect(stats.byCategory.NETWORK).toBe(1);
      expect(stats.byCategory.RUNTIME).toBe(1);
      expect(stats.byCategory.AUTH).toBe(1);
      expect(stats.bySeverity.error).toBe(1);
      expect(stats.bySeverity.warning).toBe(1);
      expect(stats.bySeverity.critical).toBe(1);
    });

    it("should handle safe wrappers", async () => {
      // Async safe wrapper
      const asyncFn = async () => {
        return "async result";
      };
      const [asyncResult, asyncError] = await errorHandler.trySafe(asyncFn);
      expect(asyncResult).toBe("async result");
      expect(asyncError).toBeNull();

      // Sync safe wrapper
      const syncFn = () => {
        return "sync result";
      };
      const [syncResult, syncError] = errorHandler.trySafeSync(syncFn);
      expect(syncResult).toBe("sync result");
      expect(syncError).toBeNull();

      // Error cases
      const asyncErrorFn = async () => {
        throw new Error("Async error");
      };
      const [asyncErrResult, asyncErrError] = await errorHandler.trySafe(asyncErrorFn);
      expect(asyncErrResult).toBeNull();
      expect(asyncErrError).not.toBeNull();

      const syncErrorFn = () => {
        throw new Error("Sync error");
      };
      const [syncErrResult, syncErrError] = errorHandler.trySafeSync(syncErrorFn);
      expect(syncErrResult).toBeNull();
      expect(syncErrError).not.toBeNull();
    });
  });
});
