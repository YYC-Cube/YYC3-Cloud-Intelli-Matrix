// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { DatabaseManager } from "../components/DatabaseManager";

vi.mock("../hooks/useLocalDatabase", () => ({
  useLocalDatabase: vi.fn(() => ({
    connections: [],
    tables: [],
    activeConnectionId: null,
    queryHistory: [],
    backups: [],
    addConnection: vi.fn(),
    removeConnection: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    testConnection: vi.fn(),
    loadTables: vi.fn(),
    loadTableData: vi.fn(),
    executeQuery: vi.fn(),
    createBackup: vi.fn(),
    restoreBackup: vi.fn(),
    deleteBackup: vi.fn(),
  })),
}));

vi.mock("../lib/view-context", () => ({
  ViewContext: React.createContext({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("DatabaseManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render database manager page", () => {
    render(React.createElement(DatabaseManager));
    expect(screen.getByText("本地数据库管理器")).toBeInTheDocument();
  });

  it("should render tabs", () => {
    render(React.createElement(DatabaseManager));
    expect(screen.getByText("连接管理")).toBeInTheDocument();
    expect(screen.getByText("表浏览")).toBeInTheDocument();
    expect(screen.getByText("SQL 查询")).toBeInTheDocument();
    expect(screen.getByText("查询历史")).toBeInTheDocument();
    expect(screen.getByText("备份恢复")).toBeInTheDocument();
  });

  it("should render add connection button", () => {
    render(React.createElement(DatabaseManager));
    const addButtons = screen.getAllByText("添加连接");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render database type labels", () => {
    render(React.createElement(DatabaseManager));
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("MySQL")).toBeInTheDocument();
    expect(screen.getByText("Redis")).toBeInTheDocument();
  });
});
