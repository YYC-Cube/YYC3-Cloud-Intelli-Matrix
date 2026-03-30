// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { ArchitectureAudit } from "../components/ArchitectureAudit";

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("ArchitectureAudit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render architecture audit page", () => {
    render(React.createElement(ArchitectureAudit));
    expect(screen.getByText("架构审计")).toBeInTheDocument();
  });

  it("should render architecture overview section", () => {
    render(React.createElement(ArchitectureAudit));
    expect(screen.getByText("架构概览")).toBeInTheDocument();
  });

  it("should render routes section", () => {
    render(React.createElement(ArchitectureAudit));
    expect(screen.getByText("路由清单")).toBeInTheDocument();
  });

  it("should render stores section", () => {
    render(React.createElement(ArchitectureAudit));
    expect(screen.getByText("数据层")).toBeInTheDocument();
  });

  it("should render test coverage section", () => {
    render(React.createElement(ArchitectureAudit));
    expect(screen.getByText("测试覆盖")).toBeInTheDocument();
  });

  it("should render feature completion section", () => {
    render(React.createElement(ArchitectureAudit));
    expect(screen.getByText("功能完成度")).toBeInTheDocument();
  });

  it("should render export button", () => {
    render(React.createElement(ArchitectureAudit));
    const exportButtons = screen.getAllByText("导出审计报告");
    expect(exportButtons.length).toBeGreaterThan(0);
  });
});
