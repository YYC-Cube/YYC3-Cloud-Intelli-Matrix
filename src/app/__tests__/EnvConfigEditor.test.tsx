// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { EnvConfigEditor } from "../components/EnvConfigEditor";

vi.mock("../lib/env-config", () => ({
  getEnvConfig: vi.fn(() => ({})),
  setEnvConfig: vi.fn(),
  resetEnvConfig: vi.fn(),
  exportEnvConfig: vi.fn(() => "{}"),
  importEnvConfig: vi.fn(() => true),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("EnvConfigEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render env config editor page", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("环境变量配置")).toBeInTheDocument();
  });

  it("should render system group", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("系统标识")).toBeInTheDocument();
  });

  it("should render network group", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("网络端点")).toBeInTheDocument();
  });

  it("should render storage group", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("存储配置")).toBeInTheDocument();
  });

  it("should render AI group", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("AI 默认配置")).toBeInTheDocument();
  });

  it("should render security group", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("安全配置")).toBeInTheDocument();
  });

  it("should render features group", () => {
    render(React.createElement(EnvConfigEditor));
    expect(screen.getByText("功能开关")).toBeInTheDocument();
  });

  it("should render save button", () => {
    render(React.createElement(EnvConfigEditor));
    const saveButtons = screen.getAllByText("保存配置");
    expect(saveButtons.length).toBeGreaterThan(0);
  });

  it("should render reset button", () => {
    render(React.createElement(EnvConfigEditor));
    const resetButtons = screen.getAllByText("重置默认");
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(EnvConfigEditor));
    const exportButtons = screen.getAllByText("导出配置");
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("should render import button", () => {
    render(React.createElement(EnvConfigEditor));
    const importButtons = screen.getAllByText("导入配置");
    expect(importButtons.length).toBeGreaterThan(0);
  });
});
