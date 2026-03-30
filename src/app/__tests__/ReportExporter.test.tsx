// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { ReportExporter } from "../components/ReportExporter";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => <div />,
}));

vi.mock("../hooks/useReportExporter", () => ({
  useReportExporter: vi.fn(() => ({
    reportType: "performance",
    setReportType: vi.fn(),
    timeRange: "24h",
    setTimeRange: vi.fn(),
    isGenerating: false,
    report: null,
    recentReports: [],
    generateReport: vi.fn(),
    exportReport: vi.fn(),
  })),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("ReportExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render report exporter page", () => {
    render(React.createElement(ReportExporter));
    expect(screen.getByText("报表导出")).toBeInTheDocument();
  });

  it("should render report types", () => {
    render(React.createElement(ReportExporter));
    expect(screen.getByText("性能报表")).toBeInTheDocument();
    expect(screen.getByText("安全报表")).toBeInTheDocument();
    expect(screen.getByText("审计报表")).toBeInTheDocument();
    expect(screen.getByText("综合报表")).toBeInTheDocument();
  });

  it("should render time ranges", () => {
    render(React.createElement(ReportExporter));
    expect(screen.getByText("1h")).toBeInTheDocument();
    expect(screen.getByText("6h")).toBeInTheDocument();
    expect(screen.getByText("24h")).toBeInTheDocument();
    expect(screen.getByText("7d")).toBeInTheDocument();
    expect(screen.getByText("30d")).toBeInTheDocument();
  });

  it("should render export formats", () => {
    render(React.createElement(ReportExporter));
    expect(screen.getByText("JSON")).toBeInTheDocument();
    expect(screen.getByText("CSV / Excel")).toBeInTheDocument();
    expect(screen.getByText("PDF / Print")).toBeInTheDocument();
  });

  it("should render generate button", () => {
    render(React.createElement(ReportExporter));
    const generateButtons = screen.getAllByText("生成报表");
    expect(generateButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(ReportExporter));
    const exportButtons = screen.getAllByText("导出");
    expect(exportButtons.length).toBeGreaterThan(0);
  });
});
