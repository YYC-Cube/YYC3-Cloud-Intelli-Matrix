// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { ModelProviderPanel } from "../components/ModelProviderPanel";

vi.mock("../hooks/useModelProvider", () => ({
  useModelProvider: vi.fn(() => ({
    providers: [],
    configuredModels: [],
    ollamaModels: [],
    ollamaLoading: false,
    ollamaError: null,
    stats: { totalProviders: 0, totalModels: 0, activeProviders: 0 },
    modalOpen: false,
    openModal: vi.fn(),
    closeModal: vi.fn(),
    addModel: vi.fn(),
    removeModel: vi.fn(),
    testConnection: vi.fn(),
    fetchOllamaModels: vi.fn(),
    addProvider: vi.fn(),
    updateProvider: vi.fn(),
    removeProvider: vi.fn(),
    resetProvider: vi.fn(),
    addModelToProvider: vi.fn(),
    removeModelFromProvider: vi.fn(),
    exportConfig: vi.fn(() => "{}"),
    importConfig: vi.fn(() => true),
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

describe("ModelProviderPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render model provider panel page", () => {
    render(React.createElement(ModelProviderPanel));
    expect(screen.getByText("模型提供商")).toBeInTheDocument();
  });

  it("should render add model button", () => {
    render(React.createElement(ModelProviderPanel));
    const addButtons = screen.getAllByText("添加模型");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render ollama section", () => {
    render(React.createElement(ModelProviderPanel));
    expect(screen.getByText("Ollama 本地模型")).toBeInTheDocument();
  });

  it("should render refresh button", () => {
    render(React.createElement(ModelProviderPanel));
    const refreshButtons = screen.getAllByText("刷新");
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(ModelProviderPanel));
    const exportButtons = screen.getAllByText("导出配置");
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("should render import button", () => {
    render(React.createElement(ModelProviderPanel));
    const importButtons = screen.getAllByText("导入配置");
    expect(importButtons.length).toBeGreaterThan(0);
  });

  it("should render stats section", () => {
    render(React.createElement(ModelProviderPanel));
    expect(screen.getByText("服务商数量")).toBeInTheDocument();
    expect(screen.getByText("模型总数")).toBeInTheDocument();
    expect(screen.getByText("活跃服务商")).toBeInTheDocument();
  });
});
