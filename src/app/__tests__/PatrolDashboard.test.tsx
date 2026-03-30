// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { PatrolDashboard } from "../components/PatrolDashboard";

vi.mock("../hooks/usePatrol", () => ({
  usePatrol: vi.fn(() => ({
    patrolStatus: "idle",
    currentResult: null,
    history: [],
    schedule: {
      enabled: false,
      interval: 3600,
      lastRun: null,
      nextRun: null,
    },
    progress: 0,
    selectedReport: null,
    runPatrol: vi.fn(),
    toggleAutoPatrol: vi.fn(),
    updateInterval: vi.fn(),
    viewReport: vi.fn(),
    closeReport: vi.fn(),
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

describe("PatrolDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render patrol dashboard page", () => {
    render(React.createElement(PatrolDashboard));
    expect(screen.getByText("巡查模式")).toBeInTheDocument();
  });

  it("should render patrol plan button", () => {
    render(React.createElement(PatrolDashboard));
    const patrolPlanButtons = screen.getAllByText("巡查计划");
    expect(patrolPlanButtons.length).toBeGreaterThan(0);
  });

  it("should render manual patrol button", () => {
    render(React.createElement(PatrolDashboard));
    const manualPatrolButtons = screen.getAllByText("手动巡查");
    expect(manualPatrolButtons.length).toBeGreaterThan(0);
  });

  it("should render history section", () => {
    render(React.createElement(PatrolDashboard));
    expect(screen.getByText("巡查历史")).toBeInTheDocument();
  });

  it("should render report section", () => {
    render(React.createElement(PatrolDashboard));
    expect(screen.getByText("巡查报告")).toBeInTheDocument();
  });
});
