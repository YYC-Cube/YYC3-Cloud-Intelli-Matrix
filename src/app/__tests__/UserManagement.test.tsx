/**
 * @file: UserManagement.test.tsx
 * @description: UserManagement.test.tsx description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [component]
 */

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
    remove: vi.fn(),
    reset: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
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
    expect(screen.getByText("userMgmt.userList")).toBeInTheDocument();
  });

  it("should render add user button", () => {
    render(React.createElement(UserManagement));
    const addButtons = screen.getAllByText("userMgmt.addUser");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("should render search input", () => {
    render(React.createElement(UserManagement));
    const searchInputs = screen.getAllByPlaceholderText("userMgmt.searchUser");
    expect(searchInputs.length).toBeGreaterThan(0);
  });

  it("should render role statistics", () => {
    render(React.createElement(UserManagement));
    // Roles are hardcoded in the component and may appear in multiple places
    expect(screen.getAllByText("超级管理员").length).toBeGreaterThan(0);
    expect(screen.getAllByText("运维工程师").length).toBeGreaterThan(0);
    expect(screen.getAllByText("开发者").length).toBeGreaterThan(0);
  });

  it("should render permission matrix button", () => {
    render(React.createElement(UserManagement));
    const permButtons = screen.getAllByText("userMgmt.permMatrix");
    expect(permButtons.length).toBeGreaterThan(0);
  });
});
