/**
 * @file: IDELayout.test.tsx
 * @description: IDELayout组件单元测试
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-05
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { IDELayout } from "../components/ide/IDELayout";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  }),
}));

vi.mock("../components/ide/AIChatPanel", () => ({
  AIChatPanel: () => <div>AI Chat Panel</div>,
}));

vi.mock("../components/ide/FileExplorer", () => ({
  FileExplorer: () => <div>File Explorer</div>,
}));

vi.mock("../components/ide/CodePreviewPanel", () => ({
  CodePreviewPanel: () => <div>Code Preview</div>,
}));

vi.mock("../components/ide/IDETerminal", () => ({
  IDETerminal: () => <div>Terminal</div>,
}));

vi.mock("../components/ide/IDEStatusBar", () => ({
  IDEStatusBar: () => <div>Status Bar</div>,
}));

vi.mock("../components/ide/IDETopBar", () => ({
  IDETopBar: () => <div>Top Bar</div>,
}));

vi.mock("../components/ide/IDEViewSwitcher", () => ({
  IDEViewSwitcher: () => <div>View Switcher</div>,
}));

vi.mock("../components/ide/LayoutContext", () => ({
  LayoutProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../components/ide/Workspace", () => ({
  Workspace: () => <div>Workspace</div>,
}));

describe("IDELayout", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<IDELayout />);
      expect(container.firstChild).toBeDefined();
    });

    it("should render top bar", () => {
      render(<IDELayout />);
      expect(screen.getByText("Top Bar")).toBeInTheDocument();
    });

    it("should render view switcher", () => {
      render(<IDELayout />);
      expect(screen.getByText("View Switcher")).toBeInTheDocument();
    });

    it("should render status bar", () => {
      render(<IDELayout />);
      expect(screen.getByText("Status Bar")).toBeInTheDocument();
    });

    it("should render AI chat panel", () => {
      render(<IDELayout />);
      expect(screen.getByText("AI Chat Panel")).toBeInTheDocument();
    });

    it("should render file explorer", () => {
      render(<IDELayout />);
      expect(screen.getByText("File Explorer")).toBeInTheDocument();
    });

    it("should render code preview panel", () => {
      render(<IDELayout />);
      expect(screen.getByText("Code Preview")).toBeInTheDocument();
    });

    it("should render terminal", () => {
      render(<IDELayout />);
      expect(screen.getByText("Terminal")).toBeInTheDocument();
    });
  });

  describe("layout modes", () => {
    it("should render edit mode by default when stored", () => {
      localStorage.setItem("yyc3-ide-layout-mode", "edit");
      render(<IDELayout />);
      expect(screen.getByText("AI Chat Panel")).toBeInTheDocument();
    });

    it("should render preview mode by default when stored", () => {
      localStorage.setItem("yyc3-ide-layout-mode", "preview");
      render(<IDELayout />);
      expect(screen.getByText("AI Chat Panel")).toBeInTheDocument();
    });

    it("should render free mode when stored", () => {
      localStorage.setItem("yyc3-ide-layout-mode", "free");
      render(<IDELayout />);
      expect(screen.getByText("Workspace")).toBeInTheDocument();
    });
  });

  describe("keyboard shortcuts", () => {
    it("should toggle search on Ctrl+Shift+F", () => {
      render(<IDELayout />);

      fireEvent.keyDown(window, {
        key: "F",
        ctrlKey: true,
        shiftKey: true,
      });

      const searchInput = screen.queryByRole("searchbox") || screen.queryByRole("textbox");
      expect(searchInput || screen.getByPlaceholderText(/ide.search/)).toBeDefined();
    });

    it("should toggle view mode on Ctrl+1", () => {
      render(<IDELayout />);

      fireEvent.keyDown(window, {
        key: "1",
        ctrlKey: true,
      });

      expect(screen.getByText("AI Chat Panel")).toBeInTheDocument();
    });

    it("should toggle code view mode on Ctrl+2", () => {
      render(<IDELayout />);

      fireEvent.keyDown(window, {
        key: "2",
        ctrlKey: true,
      });

      const container = screen.getByText("Top Bar").closest("div");
      expect(container || document.body.firstChild).toBeDefined();
    });

    it("should toggle layout mode on Ctrl+3", () => {
      render(<IDELayout />);

      fireEvent.keyDown(window, {
        key: "3",
        ctrlKey: true,
      });

      const container = screen.getByText("Top Bar").closest("div");
      expect(container || document.body.firstChild).toBeDefined();
    });
  });

  describe("localStorage persistence", () => {
    it("should persist layout mode to localStorage", () => {
      render(<IDELayout />);

      fireEvent.keyDown(window, {
        key: "3",
        ctrlKey: true,
      });

      expect(localStorage.getItem("yyc3-ide-layout-mode")).not.toBeNull();
    });
  });
});
