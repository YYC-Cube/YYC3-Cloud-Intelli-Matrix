// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { SecurityMonitor } from "../components/SecurityMonitor";

vi.mock("../hooks/useSecurityMonitor", () => ({
  useSecurityMonitor: vi.fn(() => ({
    activeTab: "security",
    setActiveTab: vi.fn(),
    scanSecurity: vi.fn(),
    scanPerformance: vi.fn(),
    scanDiagnostics: vi.fn(),
    isScanning: false,
    csp: null,
    cookie: null,
    sensitive: null,
    vitals: null,
    storage: null,
    clearData: vi.fn(),
  })),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("SecurityMonitor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render security monitor page", () => {
    render(React.createElement(SecurityMonitor));
    expect(screen.getByText("安全监控")).toBeInTheDocument();
  });

  it("should render security tab", () => {
    render(React.createElement(SecurityMonitor));
    expect(screen.getByText("安全检测")).toBeInTheDocument();
  });

  it("should render performance tab", () => {
    render(React.createElement(SecurityMonitor));
    expect(screen.getByText("性能监控")).toBeInTheDocument();
  });

  it("should render diagnostics tab", () => {
    render(React.createElement(SecurityMonitor));
    expect(screen.getByText("系统诊断")).toBeInTheDocument();
  });

  it("should render data management tab", () => {
    render(React.createElement(SecurityMonitor));
    expect(screen.getByText("数据管理")).toBeInTheDocument();
  });

  it("should render scan button", () => {
    render(React.createElement(SecurityMonitor));
    const scanButtons = screen.getAllByText("扫描");
    expect(scanButtons.length).toBeGreaterThan(0);
  });

  it("should render clear data button", () => {
    render(React.createElement(SecurityMonitor));
    const clearButtons = screen.getAllByText("清空");
    expect(clearButtons.length).toBeGreaterThan(0);
  });
});
