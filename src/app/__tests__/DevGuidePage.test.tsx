// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { DevGuidePage } from "../components/DevGuidePage";

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

describe("DevGuidePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render dev guide page", () => {
    render(React.createElement(DevGuidePage));
    expect(screen.getByText("开发指南")).toBeInTheDocument();
  });

  it("should render tech choices section", () => {
    render(React.createElement(DevGuidePage));
    expect(screen.getByText("技术选型")).toBeInTheDocument();
  });

  it("should render development phases section", () => {
    render(React.createElement(DevGuidePage));
    expect(screen.getByText("开发优先级")).toBeInTheDocument();
  });

  it("should render architecture section", () => {
    render(React.createElement(DevGuidePage));
    expect(screen.getByText("架构概览")).toBeInTheDocument();
  });

  it("should render storage strategy section", () => {
    render(React.createElement(DevGuidePage));
    expect(screen.getByText("存储策略")).toBeInTheDocument();
  });

  it("should render tech choice items", () => {
    render(React.createElement(DevGuidePage));
    expect(screen.getByText("本地文件访问")).toBeInTheDocument();
    expect(screen.getByText("前端框架")).toBeInTheDocument();
    expect(screen.getByText("样式系统")).toBeInTheDocument();
  });
});
