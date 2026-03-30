// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { ServiceLoopPanel } from "../components/ServiceLoopPanel";

vi.mock("../hooks/useServiceLoop", () => ({
  useServiceLoop: vi.fn(() => ({
    currentRun: null,
    history: [],
    isRunning: false,
    autoMode: false,
    setAutoMode: vi.fn(),
    currentStageIndex: 0,
    stats: {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      avgDuration: 0,
    },
    startLoop: vi.fn(),
    abortLoop: vi.fn(),
    clearHistory: vi.fn(),
    stageMeta: [],
    dataFlowNodes: [],
    dataFlowEdges: [],
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

describe("ServiceLoopPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render service loop panel page", () => {
    render(React.createElement(ServiceLoopPanel));
    expect(screen.getByText("服务闭环")).toBeInTheDocument();
  });

  it("should render start button", () => {
    render(React.createElement(ServiceLoopPanel));
    const startButtons = screen.getAllByText("开始闭环");
    expect(startButtons.length).toBeGreaterThan(0);
  });

  it("should render auto loop toggle", () => {
    render(React.createElement(ServiceLoopPanel));
    const autoLoopButtons = screen.getAllByText("自动闭环");
    expect(autoLoopButtons.length).toBeGreaterThan(0);
  });

  it("should render clear history button", () => {
    render(React.createElement(ServiceLoopPanel));
    const clearButtons = screen.getAllByText("清空历史");
    expect(clearButtons.length).toBeGreaterThan(0);
  });

  it("should render stats section", () => {
    render(React.createElement(ServiceLoopPanel));
    expect(screen.getByText("总运行次数")).toBeInTheDocument();
    expect(screen.getByText("成功次数")).toBeInTheDocument();
    expect(screen.getByText("失败次数")).toBeInTheDocument();
    expect(screen.getByText("平均耗时")).toBeInTheDocument();
  });

  it("should render stage cards", () => {
    render(React.createElement(ServiceLoopPanel));
    expect(screen.getByText("监测")).toBeInTheDocument();
    expect(screen.getByText("分析")).toBeInTheDocument();
    expect(screen.getByText("决策")).toBeInTheDocument();
    expect(screen.getByText("执行")).toBeInTheDocument();
    expect(screen.getByText("验证")).toBeInTheDocument();
    expect(screen.getByText("优化")).toBeInTheDocument();
  });
});
