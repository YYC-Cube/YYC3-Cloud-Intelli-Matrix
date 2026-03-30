// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { LocalFileManager } from "../components/LocalFileManager";

vi.mock("../hooks/useLocalFileSystem", () => ({
  useLocalFileSystem: vi.fn(() => ({
    files: [],
    logs: [],
    downloadLogs: vi.fn(),
    executeBackup: vi.fn(),
    clearLogs: vi.fn(),
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

describe("LocalFileManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render local file manager page", () => {
    render(React.createElement(LocalFileManager));
    expect(screen.getByText("本地文件管理器")).toBeInTheDocument();
  });

  it("should render tabs", () => {
    render(React.createElement(LocalFileManager));
    expect(screen.getByText("文件浏览")).toBeInTheDocument();
    expect(screen.getByText("日志查看器")).toBeInTheDocument();
    expect(screen.getByText("报告生成器")).toBeInTheDocument();
  });

  it("should render download logs button", () => {
    render(React.createElement(LocalFileManager));
    const downloadButtons = screen.getAllByText("下载日志");
    expect(downloadButtons.length).toBeGreaterThan(0);
  });

  it("should render backup button", () => {
    render(React.createElement(LocalFileManager));
    const backupButtons = screen.getAllByText("执行备份");
    expect(backupButtons.length).toBeGreaterThan(0);
  });

  it("should render clear logs button", () => {
    render(React.createElement(LocalFileManager));
    const clearButtons = screen.getAllByText("清空日志");
    expect(clearButtons.length).toBeGreaterThan(0);
  });
});
