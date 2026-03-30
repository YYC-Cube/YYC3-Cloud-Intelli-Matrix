// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { RefactoringReport } from "../components/RefactoringReport";

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("RefactoringReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render refactoring report page", () => {
    render(React.createElement(RefactoringReport));
    expect(screen.getByText("重构报告")).toBeInTheDocument();
  });

  it("should render severity filters", () => {
    render(React.createElement(RefactoringReport));
    expect(screen.getByText("严重")).toBeInTheDocument();
    expect(screen.getByText("高")).toBeInTheDocument();
    expect(screen.getByText("中")).toBeInTheDocument();
    expect(screen.getByText("低")).toBeInTheDocument();
  });

  it("should render category filters", () => {
    render(React.createElement(RefactoringReport));
    expect(screen.getByText("冲突")).toBeInTheDocument();
    expect(screen.getByText("不稳定")).toBeInTheDocument();
    expect(screen.getByText("重复")).toBeInTheDocument();
  });

  it("should render issue cards", () => {
    render(React.createElement(RefactoringReport));
    expect(screen.getByText("WebSocket URL 三源冲突")).toBeInTheDocument();
    expect(screen.getByText("错误日志双路径存储分裂")).toBeInTheDocument();
  });

  it("should render effort indicators", () => {
    render(React.createElement(RefactoringReport));
    const effortButtons = screen.getAllByText("工作量");
    expect(effortButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(RefactoringReport));
    const exportButtons = screen.getAllByText("导出报告");
    expect(exportButtons.length).toBeGreaterThan(0);
  });
});
