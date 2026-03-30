// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { CommandPalette } from "../components/CommandPalette";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock("../hooks/useKeyboardShortcuts", () => ({
  SHORTCUT_LIST: [],
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  })),
}));

describe("CommandPalette", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render command palette when open", () => {
    render(
      React.createElement(CommandPalette, {
        isOpen: true,
        onClose: vi.fn(),
      })
    );
    expect(screen.getByPlaceholderText("搜索命令...")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      React.createElement(CommandPalette, {
        isOpen: false,
        onClose: vi.fn(),
      })
    );
    expect(screen.queryByPlaceholderText("搜索命令...")).not.toBeInTheDocument();
  });

  it("should render navigation items", () => {
    render(
      React.createElement(CommandPalette, {
        isOpen: true,
        onClose: vi.fn(),
      })
    );
    expect(screen.getByText("实时监控")).toBeInTheDocument();
    expect(screen.getByText("操作中心")).toBeInTheDocument();
    expect(screen.getByText("巡查模式")).toBeInTheDocument();
  });

  it("should filter items by query", () => {
    render(
      React.createElement(CommandPalette, {
        isOpen: true,
        onClose: vi.fn(),
      })
    );
    const searchInput = screen.getByPlaceholderText("搜索命令...");
    fireEvent.change(searchInput, { target: { value: "监控" } });
    expect(screen.getByText("实时监控")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      React.createElement(CommandPalette, {
        isOpen: true,
        onClose,
      })
    );
    const closeButton = screen.getByRole("button", { name: /关闭/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
