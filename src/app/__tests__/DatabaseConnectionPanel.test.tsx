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

vi.mock("./CodeEditor", () => ({
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
    expect(screen.getByText("数据库连接")).toBeInTheDocument();
  });

  it("should render add connection button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const addButtons = screen.getAllByText("添加连接");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render database types", () => {
    render(React.createElement(DatabaseConnectionPanel));
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("MySQL")).toBeInTheDocument();
    expect(screen.getByText("SQLite")).toBeInTheDocument();
    expect(screen.getByText("Redis")).toBeInTheDocument();
    expect(screen.getByText("MongoDB")).toBeInTheDocument();
  });

  it("should render test button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const testButtons = screen.getAllByText("测试连接");
    expect(testButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(DatabaseConnectionPanel));
    const exportButtons = screen.getAllByText("导出配置");
    expect(exportButtons.length).toBeGreaterThan(0);
  });
});
