// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { Dashboard } from "../components/Dashboard";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  RadarChart: ({ children }: any) => <div>{children}</div>,
  Radar: () => <div />,
  PolarGrid: () => <div />,
  PolarAngleAxis: () => <div />,
  PolarRadiusAxis: () => <div />,
  Legend: () => <div />,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
}));

vi.mock("react-swipeable", () => ({
  useSwipeable: vi.fn(() => ({
    ref: { current: null },
    onMouseDown: vi.fn(),
    onTouchStart: vi.fn(),
  })),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock("../lib/view-context", () => ({
  WebSocketContext: React.createContext({
    state: "connected",
    data: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
  ViewContext: React.createContext({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

vi.mock("../stores/dashboard-stores", () => ({
  modelPerfStore: {
    getState: vi.fn(() => ({ data: [] })),
  },
  modelDistStore: {
    getState: vi.fn(() => ({ data: [] })),
  },
  radarStore: {
    getState: vi.fn(() => ({ data: [] })),
  },
  recentOpsStore: {
    getState: vi.fn(() => ({ data: [] })),
  },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render dashboard page", () => {
    render(React.createElement(Dashboard));
    expect(screen.getByText("实时监控")).toBeInTheDocument();
  });

  it("should render chart tabs on mobile", () => {
    const { ViewContext } = require("../lib/view-context");
    ViewContext.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });

    render(React.createElement(Dashboard));
    expect(screen.getByText("雷达图")).toBeInTheDocument();
    expect(screen.getByText("性能趋势")).toBeInTheDocument();
    expect(screen.getByText("预测分析")).toBeInTheDocument();
  });

  it("should render refresh button", () => {
    render(React.createElement(Dashboard));
    const refreshButtons = screen.getAllByText("刷新");
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it("should render maximize button", () => {
    render(React.createElement(Dashboard));
    const maximizeButtons = screen.getAllByText("全屏");
    expect(maximizeButtons.length).toBeGreaterThan(0);
  });
});
