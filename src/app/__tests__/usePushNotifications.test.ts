/**
 * @file: usePushNotifications.test.ts
 * @description: usePushNotifications.test.ts description
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
import { usePushNotifications } from "../hooks/usePushNotifications";

/** Helper: set up a constructor-style Notification mock with granted permission */
function mockNotificationConstructor(mockCreate: ReturnType<typeof vi.fn>) {
  // Must use 'function' (not arrow) so `new` works
  const ctor = vi.fn(function(this: any, title: string, options: NotificationOptions) {
    (mockCreate as any)(title, options);
    return { title, options };
  }) as any;
  ctor.permission = "granted" as NotificationPermission;
  ctor.requestPermission = vi.fn().mockResolvedValue("granted");
  global.Notification = ctor;
  return ctor;
}

/** Helper: set up an object-style Notification mock */
function mockNotificationObject(permission: NotificationPermission) {
  global.Notification = {
    permission,
    requestPermission: vi.fn().mockResolvedValue("granted"),
  } as any;
}

describe("usePushNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNotificationObject("default");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with default permission when supported", () => {
      mockNotificationObject("default");

      const { result } = renderHook(() => usePushNotifications());

      expect(result.current.supported).toBe(true);
      expect(result.current.permission).toBe("default");
    });

    it("should initialize as not supported when Notification API is not available", () => {
      // @ts-ignore - Remove Notification API
      delete (global as any).Notification;

      const { result } = renderHook(() => usePushNotifications());

      expect(result.current.supported).toBe(false);
      expect(result.current.permission).toBe("default");
    });

    it("should initialize with granted permission", () => {
      mockNotificationObject("granted");

      const { result } = renderHook(() => usePushNotifications());

      expect(result.current.supported).toBe(true);
      expect(result.current.permission).toBe("granted");
    });

    it("should initialize with denied permission", () => {
      mockNotificationObject("denied");

      const { result } = renderHook(() => usePushNotifications());

      expect(result.current.supported).toBe(true);
      expect(result.current.permission).toBe("denied");
    });
  });

  describe("requestPermission", () => {
    it("should request permission and update state", async () => {
      const { result } = renderHook(() => usePushNotifications());

      expect(result.current.permission).toBe("default");

      const permission = await act(async () => {
        return await result.current.requestPermission();
      });

      expect(permission).toBe("granted");
      expect(result.current.permission).toBe("granted");
    });

    it("should return denied when not supported", async () => {
      // @ts-ignore - Remove Notification API
      delete (global as any).Notification;

      const { result } = renderHook(() => usePushNotifications());

      const permission = await act(async () => {
        return await result.current.requestPermission();
      });

      expect(permission).toBe("denied");
    });

    it("should handle denied permission request", async () => {
      mockNotificationObject("default");
      (global.Notification.requestPermission as ReturnType<typeof vi.fn>).mockResolvedValue("denied");

      const { result } = renderHook(() => usePushNotifications());

      const permission = await act(async () => {
        return await result.current.requestPermission();
      });

      expect(permission).toBe("denied");
      expect(result.current.permission).toBe("denied");
    });
  });

  describe("showNotification", () => {
    it("should return null when permission is not granted", () => {
      mockNotificationObject("denied");

      const { result } = renderHook(() => usePushNotifications());

      const notification = result.current.showNotification("Test");

      expect(notification).toBeNull();
    });

    it("should create notification when permission is granted", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      const notification = result.current.showNotification("Test Title", {
        body: "Test Body",
      });

      expect(notification).not.toBeNull();
    });

    it("should use default icon and badge", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.showNotification("Test");

      expect(mockCreate).toHaveBeenCalledWith(
        "Test",
        expect.objectContaining({
          icon: "/yyc3-icons/Web App/android-chrome-192.png",
          badge: "/yyc3-icons/Android/hdpi.png",
          tag: "cpim-notification",
        })
      );
    });

    it("should merge custom options with defaults", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.showNotification("Test", {
        body: "Custom Body",
        tag: "custom-tag",
      });

      expect(mockCreate).toHaveBeenCalledWith(
        "Test",
        expect.objectContaining({
          body: "Custom Body",
          tag: "custom-tag",
          icon: "/yyc3-icons/Web App/android-chrome-192.png",
          badge: "/yyc3-icons/Android/hdpi.png",
        })
      );
    });

    it("should handle notification creation errors gracefully", () => {
      // @ts-ignore
      global.Notification = function() {
        throw new Error("Notification error");
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

      const { result } = renderHook(() => usePushNotifications());

      const notification = result.current.showNotification("Test");

      expect(notification).toBeNull();
    });
  });

  describe("sendAlert", () => {
    it("should send info alert", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.sendAlert("info", "Test Message", "Test Detail");

      expect(mockCreate).toHaveBeenCalledWith(
        "CP-IM 信息",
        expect.objectContaining({
          body: "Test Message\nTest Detail",
          tag: "cpim-alert-info",
          requireInteraction: false,
        })
      );
    });

    it("should send warning alert", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.sendAlert("warning", "Test Warning");

      expect(mockCreate).toHaveBeenCalledWith(
        "CP-IM 告警",
        expect.objectContaining({
          body: "Test Warning",
          tag: "cpim-alert-warning",
          requireInteraction: false,
        })
      );
    });

    it("should send error alert with requireInteraction", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.sendAlert("error", "Test Error", "Error Detail");

      expect(mockCreate).toHaveBeenCalledWith(
        "CP-IM 错误",
        expect.objectContaining({
          body: "Test Error\nError Detail",
          tag: "cpim-alert-error",
          requireInteraction: true,
        })
      );
    });

    it("should send critical alert with requireInteraction", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.sendAlert("critical", "Critical Alert");

      expect(mockCreate).toHaveBeenCalledWith(
        "CP-IM 严重告警",
        expect.objectContaining({
          body: "Critical Alert",
          tag: "cpim-alert-critical",
          requireInteraction: true,
        })
      );
    });

    it("should not send alert when permission is not granted", () => {
      const mockCreate = vi.fn();
      mockNotificationObject("denied");

      const { result } = renderHook(() => usePushNotifications());

      result.current.sendAlert("info", "Test Message");

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should handle alert without detail", () => {
      const mockCreate = vi.fn();
      mockNotificationConstructor(mockCreate);

      const { result } = renderHook(() => usePushNotifications());

      result.current.sendAlert("info", "Test Message");

      expect(mockCreate).toHaveBeenCalledWith(
        "CP-IM 信息",
        expect.objectContaining({
          body: "Test Message",
        })
      );
    });
  });

  describe("integration", () => {
    it("should handle permission request and notification flow", async () => {
      // Set up constructor mock with default permission
      const mockCreate = vi.fn();
      // Must use 'function' (not arrow) so `new` works
      const ctor = vi.fn(function(this: any, title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      }) as any;
      ctor.permission = "default" as NotificationPermission;
      ctor.requestPermission = vi.fn().mockResolvedValue("granted");
      global.Notification = ctor;

      const { result } = renderHook(() => usePushNotifications());

      expect(result.current.permission).toBe("default");

      // Request permission
      const permission = await act(async () => {
        return await result.current.requestPermission();
      });

      expect(permission).toBe("granted");
      expect(result.current.permission).toBe("granted");

      // Send notification
      act(() => {
        result.current.sendAlert("info", "Test Message");
      });

      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
