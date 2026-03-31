/**
 * @file: Dashboard.test.tsx
 * @description: Dashboard.test.tsx description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [component]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { Dashboard } from "../components/Dashboard";
import { ViewContext } from "../lib/view-context";

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
  useView: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
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
    getAll: vi.fn(() => []),
  },
  modelDistStore: {
    getState: vi.fn(() => ({ data: [] })),
    getAll: vi.fn(() => []),
  },
  radarStore: {
    getState: vi.fn(() => ({ data: [] })),
    getAll: vi.fn(() => []),
  },
  recentOpsStore: {
    getState: vi.fn(() => ({ data: [] })),
    getAll: vi.fn(() => []),
  },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should render dashboard page", () => {
    render(React.createElement(Dashboard));
    // The component renders stat cards and sections using t() keys
    expect(screen.getByText("monitor.throughputChart")).toBeInTheDocument();
  });

  it("should render chart tabs on mobile", () => {
    // Wrap Dashboard with mobile ViewContext provider
    const mobileViewValue = { breakpoint: "sm" as const, isMobile: true, isTablet: false, isDesktop: false, width: 375, isTouch: true };
    const MobileWrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ViewContext.Provider, { value: mobileViewValue }, children)
    );

    render(React.createElement(Dashboard), { wrapper: MobileWrapper });
    // ChartTabBar renders t() keys for tabs
    expect(screen.getByText("monitor.radarTab")).toBeInTheDocument();
    expect(screen.getByText("monitor.performanceTab")).toBeInTheDocument();
    expect(screen.getByText("monitor.predictionTab")).toBeInTheDocument();
  });

  it("should render refresh button", () => {
    render(React.createElement(Dashboard));
    // The refresh button renders t("monitor.refresh") text (but only on non-mobile)
    const refreshButtons = screen.getAllByText("monitor.refresh");
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it("should render panorama button", () => {
    render(React.createElement(Dashboard));
    // The panorama/view-all button renders t("monitor.panorama") text (non-mobile)
    const panoramaButtons = screen.getAllByText("monitor.panorama");
    expect(panoramaButtons.length).toBeGreaterThan(0);
  });
});
