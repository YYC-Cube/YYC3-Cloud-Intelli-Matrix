/**
 * @file: DatabaseConnectionPanel.test.tsx
 * @description: DatabaseConnectionPanel.test.tsx description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [component]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { DatabaseConnectionPanel } from "../components/DatabaseConnectionPanel";

vi.mock("../stores/dashboard-stores", () => ({
  dbConnectionStore: {
    getAll: vi.fn(() => []),
    add: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../lib/env-config", () => ({
  env: vi.fn((key: string) => ""),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../components/CodeEditor", () => ({
  SQLEditor: ({ value, onChange }: any) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

vi.mock("../lib/view-context", () => ({
  ViewContext: React.createContext({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

describe("DatabaseConnectionPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render database connection panel", () => {
    render(React.createElement(DatabaseConnectionPanel));
    expect(screen.getByText("数据库连接管理")).toBeInTheDocument();
  });

  it("should render new connection button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const buttons = screen.getAllByText("新建连接");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const exportButtons = screen.getAllByText("导出");
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("should render import button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const importButtons = screen.getAllByText("导入");
    expect(importButtons.length).toBeGreaterThan(0);
  });

  it("should render reset button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const resetButtons = screen.getAllByText("重置");
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  it("should show empty state when no connections", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const emptyTexts = screen.getAllByText("暂无数据库连接");
    expect(emptyTexts.length).toBeGreaterThan(0);
  });
});
