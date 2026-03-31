/**
 * @file: broadcast-channel.test.ts
 * @description: broadcast-channel.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSharedChannel, postToChannel, closeChannel, closeAllChannels } from "../lib/broadcast-channel";

describe("broadcast-channel", () => {
  beforeEach(() => {
    // Clear all channels before each test
    closeAllChannels();
  });

  afterEach(() => {
    // Clean up after each test
    closeAllChannels();
  });

  describe("getSharedChannel", () => {
    it("should return null when BroadcastChannel is not supported", () => {
      // @ts-ignore - Temporarily remove BroadcastChannel
      const originalBroadcastChannel = global.BroadcastChannel;
      delete (global as any).BroadcastChannel;

      const channel = getSharedChannel("test-channel");
      expect(channel).toBeNull();

      // Restore BroadcastChannel
      global.BroadcastChannel = originalBroadcastChannel;
    });

    it("should create a new channel for a given name", () => {
      const channel = getSharedChannel("test-channel");
      expect(channel).toBeInstanceOf(BroadcastChannel);
      expect(channel?.name).toBe("test-channel");
    });

    it("should return the same instance for the same name", () => {
      const channel1 = getSharedChannel("test-channel");
      const channel2 = getSharedChannel("test-channel");
      expect(channel1).toBe(channel2);
    });

    it("should create different instances for different names", () => {
      const channel1 = getSharedChannel("channel-1");
      const channel2 = getSharedChannel("channel-2");
      expect(channel1).not.toBe(channel2);
      expect(channel1?.name).toBe("channel-1");
      expect(channel2?.name).toBe("channel-2");
    });
  });

  describe("postToChannel", () => {
    it("should post message to existing channel", () => {
      const channel = getSharedChannel("test-channel");
      const mockPostMessage = vi.fn();
      if (channel) {
        channel.postMessage = mockPostMessage;
      }

      postToChannel("test-channel", { test: "data" });

      expect(mockPostMessage).toHaveBeenCalledWith({ test: "data" });
    });

    it("should not throw when channel does not exist", () => {
      expect(() => {
        postToChannel("non-existent-channel", { test: "data" });
      }).not.toThrow();
    });

    it("should not throw when postMessage fails", () => {
      const channel = getSharedChannel("test-channel");
      if (channel) {
        channel.postMessage = () => {
          throw new Error("PostMessage failed");
        };
      }

      expect(() => {
        postToChannel("test-channel", { test: "data" });
      }).not.toThrow();
    });
  });

  describe("closeChannel", () => {
    it("should close and remove existing channel", () => {
      const channel = getSharedChannel("test-channel");
      const mockClose = vi.fn();
      if (channel) {
        channel.close = mockClose;
      }

      closeChannel("test-channel");

      expect(mockClose).toHaveBeenCalled();
      
      // Channel should be removed from cache
      const newChannel = getSharedChannel("test-channel");
      expect(newChannel).not.toBe(channel);
    });

    it("should not throw when channel does not exist", () => {
      expect(() => {
        closeChannel("non-existent-channel");
      }).not.toThrow();
    });

    it("should not throw when close fails", () => {
      const channel = getSharedChannel("test-channel");
      if (channel) {
        channel.close = () => {
          throw new Error("Close failed");
        };
      }

      expect(() => {
        closeChannel("test-channel");
      }).not.toThrow();
    });
  });

  describe("closeAllChannels", () => {
    it("should close all open channels", () => {
      const channel1 = getSharedChannel("channel-1");
      const channel2 = getSharedChannel("channel-2");
      const channel3 = getSharedChannel("channel-3");

      const mockClose1 = vi.fn();
      const mockClose2 = vi.fn();
      const mockClose3 = vi.fn();

      if (channel1) {
        channel1.close = mockClose1;
      }
      if (channel2) {
        channel2.close = mockClose2;
      }
      if (channel3) {
        channel3.close = mockClose3;
      }

      closeAllChannels();

      expect(mockClose1).toHaveBeenCalled();
      expect(mockClose2).toHaveBeenCalled();
      expect(mockClose3).toHaveBeenCalled();
    });

    it("should not throw when some channels fail to close", () => {
      const channel1 = getSharedChannel("channel-1");
      const channel2 = getSharedChannel("channel-2");

      if (channel1) {
        channel1.close = () => {
          throw new Error("Close failed");
        };
      }

      expect(() => {
        closeAllChannels();
      }).not.toThrow();
    });

    it("should clear the channel map", () => {
      getSharedChannel("channel-1");
      getSharedChannel("channel-2");
      getSharedChannel("channel-3");

      closeAllChannels();

      // New channels should be created after closeAllChannels
      const newChannel1 = getSharedChannel("channel-1");
      const newChannel2 = getSharedChannel("channel-2");
      const newChannel3 = getSharedChannel("channel-3");

      expect(newChannel1).not.toBeNull();
      expect(newChannel2).not.toBeNull();
      expect(newChannel3).not.toBeNull();
    });
  });

  describe("integration", () => {
    it("should handle multiple channels correctly", () => {
      const channel1 = getSharedChannel("channel-1");
      const channel2 = getSharedChannel("channel-2");

      expect(channel1).not.toBe(channel2);

      closeChannel("channel-1");

      const newChannel1 = getSharedChannel("channel-1");
      const sameChannel2 = getSharedChannel("channel-2");

      expect(newChannel1).not.toBe(channel1);
      expect(sameChannel2).toBe(channel2);
    });

    it("should maintain singleton behavior across operations", () => {
      const channel1 = getSharedChannel("test-channel");
      const channel2 = getSharedChannel("test-channel");

      expect(channel1).toBe(channel2);

      closeChannel("test-channel");

      const channel3 = getSharedChannel("test-channel");
      expect(channel3).not.toBe(channel1);

      const channel4 = getSharedChannel("test-channel");
      expect(channel4).toBe(channel3);
    });
  });
});
