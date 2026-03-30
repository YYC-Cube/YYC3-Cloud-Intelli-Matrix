// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { DataEditorPanel } from "../components/DataEditorPanel";

vi.mock("../lib/db-queries", () => ({
  getActiveModels: vi.fn(() => ({ data: [] })),
  getNodesStatus: vi.fn(() => ({ data: [] })),
  getAllAgents: vi.fn(() => ({ data: [] })),
  addDbModel: vi.fn(),
  updateDbModel: vi.fn(),
  deleteDbModel: vi.fn(),
  addDbNode: vi.fn(),
  updateDbNode: vi.fn(),
  deleteDbNode: vi.fn(),
  addDbAgent: vi.fn(),
  updateDbAgent: vi.fn(),
  deleteDbAgent: vi.fn(),
  resetDbModels: vi.fn(),
  resetDbAgents: vi.fn(),
  resetDbNodes: vi.fn(),
}));

vi.mock("../hooks/useValidation", () => ({
  useValidation: vi.fn(() => ({
    errors: {},
    validate: vi.fn(),
    clearErrors: vi.fn(),
  })),
  validateRange: vi.fn(() => null),
  validateModelName: vi.fn(() => null),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

describe("DataEditorPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render data editor panel page", () => {
    render(React.createElement(DataEditorPanel));
    expect(screen.getByText("数据编辑器")).toBeInTheDocument();
  });

  it("should render models tab", () => {
    render(React.createElement(DataEditorPanel));
    expect(screen.getByText("模型管理")).toBeInTheDocument();
  });

  it("should render nodes tab", () => {
    render(React.createElement(DataEditorPanel));
    expect(screen.getByText("节点管理")).toBeInTheDocument();
  });

  it("should render agents tab", () => {
    render(React.createElement(DataEditorPanel));
    expect(screen.getByText("Agent 管理")).toBeInTheDocument();
  });

  it("should render export tab", () => {
    render(React.createElement(DataEditorPanel));
    expect(screen.getByText("配置中心")).toBeInTheDocument();
  });

  it("should render add button", () => {
    render(React.createElement(DataEditorPanel));
    const addButtons = screen.getAllByText("添加");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render save button", () => {
    render(React.createElement(DataEditorPanel));
    const saveButtons = screen.getAllByText("保存");
    expect(saveButtons.length).toBeGreaterThan(0);
  });

  it("should render reset button", () => {
    render(React.createElement(DataEditorPanel));
    const resetButtons = screen.getAllByText("重置");
    expect(resetButtons.length).toBeGreaterThan(0);
  });
});
