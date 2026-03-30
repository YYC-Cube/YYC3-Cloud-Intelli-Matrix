// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as networkUtils from "../lib/network-utils";
import type { NetworkConfig } from "../types";

describe("network-utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("generateWsUrl", () => {
    it("should generate WebSocket URL from address and port", () => {
      const url = networkUtils.generateWsUrl("192.168.1.1", "8080");
      expect(url).toBe("ws://192.168.1.1:8080/ws");
    });

    it("should handle localhost", () => {
      const url = networkUtils.generateWsUrl("localhost", "3000");
      expect(url).toBe("ws://localhost:3000/ws");
    });

    it("should handle IPv6 address", () => {
      const url = networkUtils.generateWsUrl("::1", "8080");
      expect(url).toBe("ws://::1:8080/ws");
    });
  });

  describe("DEFAULT_NETWORK_CONFIG", () => {
    it("should have default configuration", () => {
      expect(networkUtils.DEFAULT_NETWORK_CONFIG.serverAddress).toBe("192.168.3.45");
      expect(networkUtils.DEFAULT_NETWORK_CONFIG.port).toBe("3113");
      expect(networkUtils.DEFAULT_NETWORK_CONFIG.wsUrl).toBe("ws://192.168.3.45:3113/ws");
      expect(networkUtils.DEFAULT_NETWORK_CONFIG.mode).toBe("auto");
    });
  });

  describe("loadNetworkConfig", () => {
    it("should load default config when no stored config", () => {
      const config = networkUtils.loadNetworkConfig();

      expect(config.serverAddress).toBe("192.168.3.45");
      expect(config.port).toBe("3113");
      expect(config.wsUrl).toBe("ws://192.168.3.45:3113/ws");
    });

    it("should load stored config when available", () => {
      const storedConfig: Partial<NetworkConfig> = {
        serverAddress: "192.168.1.100",
        port: "8080",
      };

      localStorage.setItem("network_config", JSON.stringify(storedConfig));

      const config = networkUtils.loadNetworkConfig();

      expect(config.serverAddress).toBe("192.168.1.100");
      expect(config.port).toBe("8080");
      expect(config.wsUrl).toBe("ws://192.168.1.100:8080/ws");
    });

    it("should handle invalid stored config", () => {
      localStorage.setItem("network_config", "invalid json");

      const config = networkUtils.loadNetworkConfig();

      expect(config.serverAddress).toBe("192.168.3.45");
      expect(config.port).toBe("3113");
    });

    it("should merge stored config with defaults", () => {
      const storedConfig: Partial<NetworkConfig> = {
        serverAddress: "192.168.1.100",
      };

      localStorage.setItem("network_config", JSON.stringify(storedConfig));

      const config = networkUtils.loadNetworkConfig();

      expect(config.serverAddress).toBe("192.168.1.100");
      expect(config.port).toBe("3113");
      expect(config.nasAddress).toBe("192.168.3.45:9898");
    });
  });

  describe("saveNetworkConfig", () => {
    it("should save config to localStorage", () => {
      const config: NetworkConfig = {
        serverAddress: "192.168.1.100",
        port: "8080",
        nasAddress: "192.168.1.100:9898",
        wsUrl: "ws://192.168.1.100:8080/ws",
        mode: "manual",
      };

      networkUtils.saveNetworkConfig(config);

      const stored = localStorage.getItem("network_config");
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.serverAddress).toBe("192.168.1.100");
      expect(parsed.port).toBe("8080");
      expect(parsed.mode).toBe("manual");
    });
  });

  describe("resetNetworkConfig", () => {
    it("should remove stored config and return defaults", () => {
      const storedConfig: Partial<NetworkConfig> = {
        serverAddress: "192.168.1.100",
        port: "8080",
      };

      localStorage.setItem("network_config", JSON.stringify(storedConfig));

      const config = networkUtils.resetNetworkConfig();

      expect(config.serverAddress).toBe("192.168.3.45");
      expect(config.port).toBe("3113");
      expect(localStorage.getItem("network_config")).toBeNull();
    });
  });

  describe("getLocalIP", () => {
    it("should return 127.0.0.1 when WebRTC fails", async () => {
      const ip = await networkUtils.getLocalIP();
      expect(ip).toBe("127.0.0.1");
    });

    it("should return IP from WebRTC SDP when available", async () => {
      const mockCreateOffer = vi.fn().mockResolvedValue({
        sdp: "v=0\r\no=- 0 0 IN IP4 192.168.1.100\r\ns=-\r\nc=IN IP4 192.168.1.100\r\n",
      });

      const mockSetLocalDescription = vi.fn().mockResolvedValue(undefined);

      global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
        createDataChannel: vi.fn(),
        createOffer: mockCreateOffer,
        setLocalDescription: mockSetLocalDescription,
        close: vi.fn(),
      })) as any;

      const ip = await networkUtils.getLocalIP();

      expect(ip).toBe("192.168.1.100");
    });

    it("should return 127.0.0.1 when WebRTC returns 0.0.0.0", async () => {
      const mockCreateOffer = vi.fn().mockResolvedValue({
        sdp: "v=0\r\no=- 0 0 IN IP4 0.0.0.0\r\ns=-\r\nc=IN IP4 0.0.0.0\r\n",
      });

      const mockSetLocalDescription = vi.fn().mockResolvedValue(undefined);

      global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
        createDataChannel: vi.fn(),
        createOffer: mockCreateOffer,
        setLocalDescription: mockSetLocalDescription,
        close: vi.fn(),
      })) as any;

      const ip = await networkUtils.getLocalIP();

      expect(ip).toBe("127.0.0.1");
    });
  });

  describe("getNetworkInterfaces", () => {
    it("should return network interfaces", async () => {
      const interfaces = await networkUtils.getNetworkInterfaces();

      expect(interfaces.length).toBeGreaterThan(0);
      expect(interfaces[0]).toHaveProperty("name");
      expect(interfaces[0]).toHaveProperty("type");
      expect(interfaces[0]).toHaveProperty("ip");
      expect(interfaces[0]).toHaveProperty("status");
    });

    it("should include loopback interface when IP is not localhost", async () => {
      const mockCreateOffer = vi.fn().mockResolvedValue({
        sdp: "v=0\r\no=- 0 0 IN IP4 192.168.1.100\r\ns=-\r\nc=IN IP4 192.168.1.100\r\n",
      });

      const mockSetLocalDescription = vi.fn().mockResolvedValue(undefined);

      global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
        createDataChannel: vi.fn(),
        createOffer: mockCreateOffer,
        setLocalDescription: mockSetLocalDescription,
        close: vi.fn(),
      })) as any;

      const interfaces = await networkUtils.getNetworkInterfaces();

      expect(interfaces.some((iface) => iface.name === "lo0")).toBe(true);
      expect(interfaces.some((iface) => iface.ip === "127.0.0.1")).toBe(true);
    });

    it("should detect WiFi connection", async () => {
      Object.defineProperty(navigator, "connection", {
        writable: true,
        value: {
          effectiveType: "4g",
          type: "wifi",
        },
      });

      const interfaces = await networkUtils.getNetworkInterfaces();

      expect(interfaces[0].type).toBe("WiFi");
      expect(interfaces[0].name).toBe("wlan0");
    });

    it("should detect wired connection", async () => {
      Object.defineProperty(navigator, "connection", {
        writable: true,
        value: {
          effectiveType: "3g",
          type: "cellular",
        },
      });

      const interfaces = await networkUtils.getNetworkInterfaces();

      expect(interfaces[0].type).toBe("有线以太网");
      expect(interfaces[0].name).toBe("en0");
    });

    it("should reflect online status", async () => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });

      const interfaces = await networkUtils.getNetworkInterfaces();

      expect(interfaces[0].status).toBe("active");
    });

    it("should reflect offline status", async () => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      const interfaces = await networkUtils.getNetworkInterfaces();

      expect(interfaces[0].status).toBe("inactive");
    });
  });

  describe("testWebSocketConnection", () => {
    it("should return success when connection opens", async () => {
      const mockWebSocket = vi.fn().mockImplementation(() => {
        setTimeout(() => {
          mockWebSocket.mock.instances[0].onopen();
        }, 10);
        return {
          close: vi.fn(),
        };
      });

      global.WebSocket = mockWebSocket as any;

      const result = await networkUtils.testWebSocketConnection("ws://localhost:8080/ws");

      expect(result.success).toBe(true);
      expect(result.latency).toBeGreaterThanOrEqual(0);
    });

    it("should return failure on connection error", async () => {
      const mockWebSocket = vi.fn().mockImplementation(() => {
        setTimeout(() => {
          mockWebSocket.mock.instances[0].onerror();
        }, 10);
        return {
          close: vi.fn(),
        };
      });

      global.WebSocket = mockWebSocket as any;

      const result = await networkUtils.testWebSocketConnection("ws://localhost:8080/ws");

      expect(result.success).toBe(false);
      expect(result.error).toBe("连接被拒绝");
    });

    it("should return failure on connection close", async () => {
      const mockWebSocket = vi.fn().mockImplementation(() => {
        setTimeout(() => {
          mockWebSocket.mock.instances[0].onclose({ reason: "Connection closed" });
        }, 10);
        return {
          close: vi.fn(),
        };
      });

      global.WebSocket = mockWebSocket as any;

      const result = await networkUtils.testWebSocketConnection("ws://localhost:8080/ws");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection closed");
    });

    it("should timeout after specified duration", async () => {
      const mockWebSocket = vi.fn().mockImplementation(() => ({
        close: vi.fn(),
      }));

      global.WebSocket = mockWebSocket as any;

      const result = await networkUtils.testWebSocketConnection("ws://localhost:8080/ws", 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe("连接超时");
    });

    it("should handle WebSocket constructor error", async () => {
      global.WebSocket = vi.fn().mockImplementation(() => {
        throw new Error("Invalid URL");
      }) as any;

      const result = await networkUtils.testWebSocketConnection("invalid-url");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid URL");
    });
  });

  describe("testHTTPConnection", () => {
    it("should return success when fetch succeeds", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      }) as any;

      const result = await networkUtils.testHTTPConnection("http://localhost:8080");

      expect(result.success).toBe(true);
      expect(result.latency).toBeGreaterThanOrEqual(0);
    });

    it("should return failure on fetch error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error")) as any;

      const result = await networkUtils.testHTTPConnection("http://localhost:8080");

      expect(result.success).toBe(false);
      expect(result.error).toBe("网络不可达");
    });

    it("should timeout after specified duration", async () => {
      global.fetch = vi.fn().mockImplementation(() => {
        return new Promise(() => {});
      }) as any;

      const result = await networkUtils.testHTTPConnection("http://localhost:8080", 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe("连接超时");
    });

    it("should use no-cors mode", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      }) as any;

      await networkUtils.testHTTPConnection("http://localhost:8080");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          mode: "no-cors",
        })
      );
    });

    it("should use HEAD method", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      }) as any;

      await networkUtils.testHTTPConnection("http://localhost:8080");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "HEAD",
        })
      );
    });
  });

  describe("Integration", () => {
    it("should handle complete config workflow", () => {
      // Load default
      const defaultConfig = networkUtils.loadNetworkConfig();
      expect(defaultConfig.serverAddress).toBe("192.168.3.45");

      // Save custom
      const customConfig: NetworkConfig = {
        serverAddress: "192.168.1.100",
        port: "8080",
        nasAddress: "192.168.1.100:9898",
        wsUrl: "ws://192.168.1.100:8080/ws",
        mode: "manual",
      };

      networkUtils.saveNetworkConfig(customConfig);

      // Load saved
      const loadedConfig = networkUtils.loadNetworkConfig();
      expect(loadedConfig.serverAddress).toBe("192.168.1.100");
      expect(loadedConfig.mode).toBe("manual");

      // Reset
      const resetConfig = networkUtils.resetNetworkConfig();
      expect(resetConfig.serverAddress).toBe("192.168.3.45");
      expect(resetConfig.mode).toBe("auto");
    });
  });
});
