// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { PerformanceMonitor } from "../components/PerformanceMonitor";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  CartesianGrid: () => <div />,
  ReferenceLine: () => <div />,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../lib/env-config", () => ({
  env: {},
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("PerformanceMonitor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render performance monitor page", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("性能监控")).toBeInTheDocument();
  });

  it("should render web vitals section", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("Web Vitals")).toBeInTheDocument();
  });

  it("should render memory section", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("内存使用")).toBeInTheDocument();
  });

  it("should render fps section", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("帧率 (FPS)")).toBeInTheDocument();
  });

  it("should render resources section", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("资源加载")).toBeInTheDocument();
  });

  it("should render storage section", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("存储使用")).toBeInTheDocument();
  });

  it("should render alerts section", () => {
    render(React.createElement(PerformanceMonitor));
    expect(screen.getByText("告警阈值")).toBeInTheDocument();
  });

  it("should render refresh button", () => {
    render(React.createElement(PerformanceMonitor));
    const refreshButtons = screen.getAllByText("刷新");
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(PerformanceMonitor));
    const exportButtons = screen.getAllByText("导出");
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("should render alert toggle", () => {
    render(React.createElement(PerformanceMonitor));
    const alertButtons = screen.getAllByText("告警");
    expect(alertButtons.length).toBeGreaterThan(0);
  });
});
