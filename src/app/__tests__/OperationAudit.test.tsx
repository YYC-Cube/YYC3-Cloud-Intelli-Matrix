// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { OperationAudit } from "../components/OperationAudit";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  Cell: () => <div />,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("OperationAudit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render operation audit page", () => {
    render(React.createElement(OperationAudit));
    expect(screen.getByText("操作审计")).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(React.createElement(OperationAudit));
    expect(screen.getByPlaceholderText("搜索审计日志...")).toBeInTheDocument();
  });

  it("should render filter buttons", () => {
    render(React.createElement(OperationAudit));
    expect(screen.getByText("全部")).toBeInTheDocument();
    expect(screen.getByText("成功")).toBeInTheDocument();
    expect(screen.getByText("异常")).toBeInTheDocument();
  });

  it("should render audit logs table", () => {
    render(React.createElement(OperationAudit));
    expect(screen.getByText("时间")).toBeInTheDocument();
    expect(screen.getByText("用户")).toBeInTheDocument();
    expect(screen.getByText("操作")).toBeInTheDocument();
    expect(screen.getByText("目标")).toBeInTheDocument();
    expect(screen.getByText("状态")).toBeInTheDocument();
  });

  it("should render export button", () => {
    render(React.createElement(OperationAudit));
    const exportButtons = screen.getAllByText("导出JSON");
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("should render refresh button", () => {
    render(React.createElement(OperationAudit));
    const refreshButtons = screen.getAllByText("刷新");
    expect(refreshButtons.length).toBeGreaterThan(0);
  });
});
