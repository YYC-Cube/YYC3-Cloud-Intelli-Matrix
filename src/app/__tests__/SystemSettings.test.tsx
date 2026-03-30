// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { SystemSettings } from "../components/SystemSettings";

vi.mock("../lib/api-config", () => ({
  getAPIConfig: vi.fn(() => ({
    apiBaseUrl: "http://localhost:3000/api",
    wsEndpoint: "ws://localhost:3000/ws",
    ollamaBaseUrl: "http://localhost:11434",
  })),
  setAPIConfig: vi.fn(),
  resetAPIConfig: vi.fn(),
  onAPIConfigChange: vi.fn(),
  ENDPOINT_META: [],
}));

vi.mock("../hooks/useModelProvider", () => ({
  useModelProvider: vi.fn(() => ({
    providers: [],
    configuredModels: [],
    addModel: vi.fn(),
    removeModel: vi.fn(),
    testConnection: vi.fn(),
  })),
}));

vi.mock("../hooks/useSettingsStore", () => ({
  useSettingsStore: vi.fn(() => ({
    settings: {},
    values: {},
    toggleSetting: vi.fn(),
    updateValue: vi.fn(),
    updateValues: vi.fn(),
    resetSettings: vi.fn(),
    exportSettings: vi.fn(() => "{}"),
    importSettings: vi.fn(() => true),
  })),
}));

vi.mock("../stores/dashboard-stores", () => ({
  deployedModelStore: {
    getAll: vi.fn(() => []),
    add: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
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

describe("SystemSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render system settings page", () => {
    render(React.createElement(SystemSettings));
    expect(screen.getByText("系统设置")).toBeInTheDocument();
  });

  it("should render settings sections", () => {
    render(React.createElement(SystemSettings));
    expect(screen.getByText("通用设置")).toBeInTheDocument();
    expect(screen.getByText("网络设置")).toBeInTheDocument();
    expect(screen.getByText("集群设置")).toBeInTheDocument();
    expect(screen.getByText("模型设置")).toBeInTheDocument();
  });

  it("should render save button", () => {
    render(React.createElement(SystemSettings));
    const saveButtons = screen.getAllByText("保存");
    expect(saveButtons.length).toBeGreaterThan(0);
  });

  it("should render reset button", () => {
    render(React.createElement(SystemSettings));
    const resetButtons = screen.getAllByText("重置");
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  it("should render export button", () => {
    render(React.createElement(SystemSettings));
    const exportButtons = screen.getAllByText("导出");
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("should render import button", () => {
    render(React.createElement(SystemSettings));
    const importButtons = screen.getAllByText("导入");
    expect(importButtons.length).toBeGreaterThan(0);
  });
});
