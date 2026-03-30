// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { UserManagement } from "../components/UserManagement";

vi.mock("../stores/dashboard-stores", () => ({
  userStore: {
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

describe("UserManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render user management page", () => {
    render(React.createElement(UserManagement));
    expect(screen.getByText("用户管理")).toBeInTheDocument();
  });

  it("should render add user button", () => {
    render(React.createElement(UserManagement));
    const addButtons = screen.getAllByText("添加用户");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render search input", () => {
    render(React.createElement(UserManagement));
    expect(screen.getByPlaceholderText("搜索用户...")).toBeInTheDocument();
  });

  it("should render role statistics", () => {
    render(React.createElement(UserManagement));
    expect(screen.getByText("超级管理员")).toBeInTheDocument();
    expect(screen.getByText("运维工程师")).toBeInTheDocument();
    expect(screen.getByText("开发者")).toBeInTheDocument();
  });

  it("should render permission matrix button", () => {
    render(React.createElement(UserManagement));
    const permButtons = screen.getAllByText("权限矩阵");
    expect(permButtons.length).toBeGreaterThan(0);
  });
});
