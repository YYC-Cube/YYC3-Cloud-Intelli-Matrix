// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePushNotifications } from "../hooks/usePushNotifications";

describe("usePushNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Notification API
    global.Notification = {
      permission: "default",
      requestPermission: vi.fn().mockResolvedValue("granted"),
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with default permission when supported", () => {
      const mockNotification = {
        permission: "default",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockNotification as any;

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
      const mockNotification = {
        permission: "granted",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockNotification as any;

      const { result } = renderHook(() => usePushNotifications());
      
      expect(result.current.supported).toBe(true);
      expect(result.current.permission).toBe("granted");
    });

    it("should initialize with denied permission", () => {
      const mockNotification = {
        permission: "denied",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockNotification as any;

      const { result } = renderHook(() => usePushNotifications());
      
      expect(result.current.supported).toBe(true);
      expect(result.current.permission).toBe("denied");
    });
  });

  describe("requestPermission", () => {
    it("should request permission and update state", async () => {
      const { result } = renderHook(() => usePushNotifications());
      
      expect(result.current.permission).toBe("default");

      const promise = act(async () => {
        const permission = await result.current.requestPermission();
        return permission;
      });

      const permission = await promise;
      
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
      global.Notification.requestPermission = vi.fn().mockResolvedValue("denied");

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
      const mockNotification = {
        permission: "denied",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockNotification as any;

      const { result } = renderHook(() => usePushNotifications());
      
      const notification = result.current.showNotification("Test");
      
      expect(notification).toBeNull();
    });

    it("should create notification when permission is granted", () => {
      const mockCreate = vi.fn();
      const mockNotification = {
        permission: "granted",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockCreate as any;
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };

      const { result } = renderHook(() => usePushNotifications());
      
      const notification = result.current.showNotification("Test Title", {
        body: "Test Body",
      });
      
      expect(notification).not.toBeNull();
    });

    it("should use default icon and badge", () => {
      const mockCreate = vi.fn();
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

      const { result } = renderHook(() => usePushNotifications());
      
      result.current.showNotification("Test");
      
      expect(mockCreate).toHaveBeenCalledWith(
        "Test",
        expect.objectContaining({
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          tag: "cpim-notification",
        })
      );
    });

    it("should merge custom options with defaults", () => {
      const mockCreate = vi.fn();
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

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
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
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
      const mockNotification = {
        permission: "granted",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockCreate as any;
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };

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
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

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
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

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
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

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
      const mockNotification = {
        permission: "denied",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockNotification as any;

      const { result } = renderHook(() => usePushNotifications());
      
      result.current.sendAlert("info", "Test Message");
      
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should handle alert without detail", () => {
      const mockCreate = vi.fn();
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };
      // @ts-ignore
      global.Notification.permission = "granted";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");

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
      const mockCreate = vi.fn();
      const mockNotification = {
        permission: "default",
        requestPermission: vi.fn().mockResolvedValue("granted"),
      };
      global.Notification = mockCreate as any;
      // @ts-ignore
      global.Notification.permission = "default";
      // @ts-ignore
      global.Notification.requestPermission = vi.fn().mockResolvedValue("granted");
      // @ts-ignore
      global.Notification = function(title: string, options: NotificationOptions) {
        mockCreate(title, options);
        return { title, options };
      };

      const { result } = renderHook(() => usePushNotifications());
      
      expect(result.current.permission).toBe("default");

      // Request permission
      const permission = await act(async () => {
        return await result.current.requestPermission();
      });
      
      expect(permission).toBe("granted");
      expect(result.current.permission).toBe("granted");

      // Send notification
      result.current.sendAlert("info", "Test Message");
      
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
