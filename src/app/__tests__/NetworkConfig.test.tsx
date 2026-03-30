// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { NetworkConfig } from "../components/NetworkConfig";

vi.mock("../hooks/useNetworkConfig", () => ({
  useNetworkConfig: vi.fn(() => ({
    config: {
      serverAddress: "192.168.1.1",
      port: "8080",
      nasAddress: "192.168.1.1:9898",
      wsUrl: "ws://192.168.1.1:8080/ws",
      mode: "auto",
    },
    interfaces: [
      {
        name: "en0",
        type: "有线以太网",
        ip: "192.168.1.100",
        status: "active",
      },
    ],
    localIP: "192.168.1.100",
    testStatus: "idle",
    testLatency: 0,
    testError: "",
    detecting: false,
    updateConfig: vi.fn(),
    save: vi.fn(),
    reset: vi.fn(),
    detectNetwork: vi.fn(),
    testConnection: vi.fn(),
  })),
}));

vi.mock("../stores/dashboard-stores", () => ({
  wifiNetworkStore: {
    getState: vi.fn(() => ({
      networks: [],
      autoReconnect: {
        enabled: false,
        networkId: "",
      },
    })),
    setState: vi.fn(),
  },
  getWifiAutoReconnectConfig: vi.fn(() => ({
    enabled: false,
    networkId: "",
  })),
  updateWifiAutoReconnectConfig: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("NetworkConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render network config modal when open", () => {
    render(
      React.createElement(NetworkConfig, {
        open: true,
        onClose: vi.fn(),
      })
    );
    expect(screen.getByText("网络连接配置")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      React.createElement(NetworkConfig, {
        open: false,
        onClose: vi.fn(),
      })
    );
    expect(screen.queryByText("网络连接配置")).not.toBeInTheDocument();
  });

  it("should render tabs", () => {
    render(
      React.createElement(NetworkConfig, {
        open: true,
        onClose: vi.fn(),
      })
    );
    expect(screen.getByText("自动检测")).toBeInTheDocument();
    expect(screen.getByText("WiFi 配置")).toBeInTheDocument();
    expect(screen.getByText("手动配置")).toBeInTheDocument();
    expect(screen.getByText("连接历史")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      React.createElement(NetworkConfig, {
        open: true,
        onClose,
      })
    );
    const closeButton = screen.getByRole("button", { name: /关闭/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("should display local IP", () => {
    render(
      React.createElement(NetworkConfig, {
        open: true,
        onClose: vi.fn(),
      })
    );
    expect(screen.getByText("192.168.1.100")).toBeInTheDocument();
  });

  it("should display network interfaces", () => {
    render(
      React.createElement(NetworkConfig, {
        open: true,
        onClose: vi.fn(),
      })
    );
    expect(screen.getByText("有线以太网")).toBeInTheDocument();
    expect(screen.getByText("en0")).toBeInTheDocument();
  });
});
