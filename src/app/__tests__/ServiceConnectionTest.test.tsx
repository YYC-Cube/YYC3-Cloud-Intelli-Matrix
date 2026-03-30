// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { ServiceConnectionTest } from "../components/ServiceConnectionTest";

vi.mock("../hooks/useModelProvider", () => ({
  useModelProvider: vi.fn(() => ({
    providers: [],
    addProvider: vi.fn(),
    removeProvider: vi.fn(),
    updateProvider: vi.fn(),
  })),
}));

vi.mock("../stores/dashboard-stores", () => ({
  dbConnectionStore: {
    getState: vi.fn(() => ({
      connections: [],
    })),
    setState: vi.fn(),
  },
}));

vi.mock("../lib/env-config", () => ({
  env: vi.fn((key: string) => {
    const envMap: Record<string, string> = {
      OLLAMA_BASE_URL: "http://localhost:11434",
      OLLAMA_PROXY_PATH: "/api/v1/llm/ollama",
    };
    return envMap[key] || "";
  }),
}));

vi.mock("../lib/ollama-url", () => ({
  getOllamaEndpointInfo: vi.fn(() => ({
    mode: "proxy",
    chatUrl: "/api/v1/llm/ollama/chat",
    tagsUrl: "/api/v1/llm/ollama/tags",
    proxyPath: "/api/v1/llm/ollama",
    directBase: "http://localhost:11434",
  })),
  getOllamaChatUrl: vi.fn(() => "/api/v1/llm/ollama/chat"),
  getOllamaTagsUrl: vi.fn(() => "/api/v1/llm/ollama/tags"),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ServiceConnectionTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render service connection test panel", () => {
    render(React.createElement(ServiceConnectionTest));
    expect(screen.getByText("服务连接测试")).toBeInTheDocument();
  });

  it("should render test categories", () => {
    render(React.createElement(ServiceConnectionTest));
    expect(screen.getByText("AI 模型服务商")).toBeInTheDocument();
    expect(screen.getByText("数据库连接")).toBeInTheDocument();
    expect(screen.getByText("网络连通性")).toBeInTheDocument();
    expect(screen.getByText("WebSocket 连接")).toBeInTheDocument();
  });

  it("should render test all button", () => {
    render(React.createElement(ServiceConnectionTest));
    const testAllButtons = screen.getAllByText("全部测试");
    expect(testAllButtons.length).toBeGreaterThan(0);
  });

  it("should render clear results button", () => {
    render(React.createElement(ServiceConnectionTest));
    const clearButtons = screen.getAllByText("清除结果");
    expect(clearButtons.length).toBeGreaterThan(0);
  });

  it("should render refresh button", () => {
    render(React.createElement(ServiceConnectionTest));
    const refreshButtons = screen.getAllByText("刷新");
    expect(refreshButtons.length).toBeGreaterThan(0);
  });
});
