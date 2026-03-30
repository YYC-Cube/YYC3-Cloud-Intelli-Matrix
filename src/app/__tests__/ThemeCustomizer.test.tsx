// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { ThemeCustomizer } from "../components/ThemeCustomizer";

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

describe("ThemeCustomizer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render theme customizer page", () => {
    render(React.createElement(ThemeCustomizer));
    expect(screen.getByText("主题自定义")).toBeInTheDocument();
  });

  it("should render colors section", () => {
    render(React.createElement(ThemeCustomizer));
    expect(screen.getByText("颜色系统")).toBeInTheDocument();
  });

  it("should render typography section", () => {
    render(React.createElement(ThemeCustomizer));
    expect(screen.getByText("排版")).toBeInTheDocument();
  });

  it("should render shadow section", () => {
    render(React.createElement(ThemeCustomizer));
    expect(screen.getByText("阴影")).toBeInTheDocument();
  });

  it("should render branding section", () => {
    render(React.createElement(ThemeCustomizer));
    expect(screen.getByText("品牌")).toBeInTheDocument();
  });

  it("should render presets section", () => {
    render(React.createElement(ThemeCustomizer));
    expect(screen.getByText("预设")).toBeInTheDocument();
  });

  it("should render save button", () => {
    render(React.createElement(ThemeCustomizer));
    const saveButtons = screen.getAllByText("保存主题");
    expect(saveButtons.length).toBeGreaterThan(0);
  });

  it("should render reset button", () => {
    render(React.createElement(ThemeCustomizer));
    const resetButtons = screen.getAllByText("重置");
    expect(resetButtons.length).toBeGreaterThan(0);
  });
});
