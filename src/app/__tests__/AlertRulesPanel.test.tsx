/**
 * @file: AlertRulesPanel.test.tsx
 * @description: AlertRulesPanel.test.tsx description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [component]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
    selectedRule: null,
    setSelectedRule: vi.fn(),
    filterSeverity: "all",
    setFilterSeverity: vi.fn(),
    toggleRule: vi.fn(),
    deleteRule: vi.fn(),
    acknowledgeEvent: vi.fn(),
    resolveEvent: vi.fn(),
    createRule: vi.fn(),
    updateRule: vi.fn(),
    isCreating: false,
    setIsCreating: vi.fn(),
    editingRule: null,
    setEditingRule: vi.fn(),
  })),
}));

vi.mock("../hooks/useWebSocketData", () => ({
  useWebSocketData: vi.fn(() => ({
    nodes: [],
    liveLatency: 0,
    connectionState: "simulated",
  })),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

vi.mock("../components/CreateRuleModal", () => ({
  CreateRuleModal: () => null,
}));

describe("AlertRulesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render alert rules panel page", () => {
    render(React.createElement(AlertRulesPanel));
    expect(screen.getByText("alerts.title")).toBeInTheDocument();
  });

  it("should render stats section", () => {
    render(React.createElement(AlertRulesPanel));
    expect(screen.getByText("alerts.totalRules")).toBeInTheDocument();
    expect(screen.getByText("alerts.activeRules")).toBeInTheDocument();
    expect(screen.getByText("alerts.unresolvedEvents")).toBeInTheDocument();
    expect(screen.getByText("alerts.criticalEvents")).toBeInTheDocument();
  });

  it("should render add rule button", () => {
    render(React.createElement(AlertRulesPanel));
    const addButtons = screen.getAllByText("alerts.createRule");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render tabs", () => {
    render(React.createElement(AlertRulesPanel));
    expect(screen.getByText("alerts.rulesTab")).toBeInTheDocument();
    expect(screen.getByText("alerts.eventsTab")).toBeInTheDocument();
  });
});
