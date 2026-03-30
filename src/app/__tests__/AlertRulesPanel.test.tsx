// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { AlertRulesPanel } from "../components/AlertRulesPanel";

vi.mock("../hooks/useAlertRules", () => ({
  useAlertRules: vi.fn(() => ({
    rules: [],
    events: [],
    stats: {
      totalRules: 0,
      activeRules: 0,
      unresolvedEvents: 0,
      criticalEvents: 0,
    },
    addRule: vi.fn(),
    updateRule: vi.fn(),
    deleteRule: vi.fn(),
    toggleRule: vi.fn(),
    resolveEvent: vi.fn(),
    clearEvents: vi.fn(),
  })),
}));

vi.mock("../hooks/useWebSocketData", () => ({
  useWebSocketData: vi.fn(() => ({
    state: "connected",
    data: null,
    error: null,
    reconnect: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("AlertRulesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render alert rules panel page", () => {
    render(React.createElement(AlertRulesPanel));
    expect(screen.getByText("告警规则")).toBeInTheDocument();
  });

  it("should render stats section", () => {
    render(React.createElement(AlertRulesPanel));
    expect(screen.getByText("总规则数")).toBeInTheDocument();
    expect(screen.getByText("活跃规则")).toBeInTheDocument();
    expect(screen.getByText("未解决事件")).toBeInTheDocument();
    expect(screen.getByText("严重事件")).toBeInTheDocument();
  });

  it("should render add rule button", () => {
    render(React.createElement(AlertRulesPanel));
    const addButtons = screen.getAllByText("添加规则");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render clear events button", () => {
    render(React.createElement(AlertRulesPanel));
    const clearButtons = screen.getAllByText("清空事件");
    expect(clearButtons.length).toBeGreaterThan(0);
  });

  it("should render tabs", () => {
    render(React.createElement(AlertRulesPanel));
    expect(screen.getByText("规则列表")).toBeInTheDocument();
    expect(screen.getByText("告警事件")).toBeInTheDocument();
  });
});
