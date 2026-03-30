// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { OperationCenter } from "../components/OperationCenter";

vi.mock("../hooks/useOperationCenter", () => ({
  useOperationCenter: vi.fn(() => ({
    categories: [
      { id: "system", label: "系统操作", icon: "Settings" },
      { id: "network", label: "网络操作", icon: "Network" },
    ],
    activeCategory: "system",
    setActiveCategory: vi.fn(),
    actions: [
      { id: "1", name: "重启服务", category: "system" },
      { id: "2", name: "清理缓存", category: "system" },
    ],
    isExecuting: false,
    executeAction: vi.fn(),
    templates: [],
    runTemplate: vi.fn(),
    addTemplate: vi.fn(),
    deleteTemplate: vi.fn(),
    logs: [],
    logFilter: "all",
    setLogFilter: vi.fn(),
    searchQuery: "",
    setSearchQuery: vi.fn(),
  })),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

vi.mock("../lib/view-context", () => ({
  ViewContext: React.createContext({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

describe("OperationCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render operation center page", () => {
    render(React.createElement(OperationCenter));
    expect(screen.getByText("操作中心")).toBeInTheDocument();
  });

  it("should render quick actions section", () => {
    render(React.createElement(OperationCenter));
    expect(screen.getByText("快捷操作")).toBeInTheDocument();
  });

  it("should render action count", () => {
    render(React.createElement(OperationCenter));
    expect(screen.getByText("(2)")).toBeInTheDocument();
  });

  it("should render templates section", () => {
    render(React.createElement(OperationCenter));
    expect(screen.getByText("操作模板")).toBeInTheDocument();
  });

  it("should render log stream section", () => {
    render(React.createElement(OperationCenter));
    expect(screen.getByText("操作日志")).toBeInTheDocument();
  });
});
