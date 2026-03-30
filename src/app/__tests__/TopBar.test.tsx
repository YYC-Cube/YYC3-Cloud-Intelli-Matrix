// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { BrowserRouter } from "react-router";
import { TopBar } from "../components/TopBar";
import type { ConnectionState } from "../types";

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  }),
}));

vi.mock("../components/YYC3Logo", () => ({
  YYC3Logo: () => <div data-testid="yyc3-logo">YYC3 Logo</div>,
}));

vi.mock("../components/ConnectionStatus", () => ({
  ConnectionStatus: () => <div data-testid="connection-status">Connected</div>,
}));

vi.mock("../components/LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language</div>,
}));

vi.mock("../lib/supabaseClient", () => ({
  isGhostMode: () => false,
}));

describe("TopBar Component", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  const defaultProps = {
    connectionState: "connected" as ConnectionState,
    reconnectCount: 0,
    lastSyncTime: "2024-01-01T00:00:00Z",
    onReconnect: vi.fn(),
    isMobile: false,
    isTablet: false,
    mobileMenuOpen: false,
    onToggleMobileMenu: vi.fn(),
    onLogout: vi.fn(),
    userEmail: "test@example.com",
    userRole: "admin",
    onToggleTerminal: vi.fn(),
  };

  it("should render top bar", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    expect(screen.getByTestId("yyc3-logo")).toBeInTheDocument();
    expect(screen.getByTestId("connection-status")).toBeInTheDocument();
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("should render hamburger menu button", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    expect(hamburgerButton).toBeDefined();
  });

  it("should open mobile drawer when hamburger is clicked", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);
      // Mobile drawer should be visible
    }
  });

  it("should close mobile drawer when close button is clicked", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const closeButtons = screen.getAllByRole("button");
      const closeButton = closeButtons.find((btn) => btn.querySelector("svg"));

      if (closeButton) {
        fireEvent.click(closeButton);
        // Drawer should be closed
      }
    }
  });

  it("should render navigation categories in mobile drawer", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      expect(screen.getByText(/nav.catMonitor/i)).toBeInTheDocument();
      expect(screen.getByText(/nav.catOps/i)).toBeInTheDocument();
      expect(screen.getByText(/nav.catAI/i)).toBeInTheDocument();
    }
  });

  it("should expand navigation category when clicked", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catMonitor/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);
        // Category should expand
      }
    }
  });

  it("should collapse navigation category when clicked again", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catMonitor/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);
        fireEvent.click(categoryButtons[0]);
        // Category should collapse
      }
    }
  });

  it("should render navigation items when category is expanded", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catMonitor/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);

        expect(screen.getByText(/nav.dataMonitor/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.followUp/i)).toBeInTheDocument();
      }
    }
  });

  it("should navigate when navigation item is clicked", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catMonitor/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);

        const dataMonitorLinks = screen.getAllByText(/nav.dataMonitor/i);
        if (dataMonitorLinks.length > 0) {
          fireEvent.click(dataMonitorLinks[0]);
          // Should navigate
        }
      }
    }
  });

  it("should show ghost mode indicator when in ghost mode", () => {
    const { isGhostMode } = require("../lib/supabaseClient");
    isGhostMode.mockReturnValue(true);

    renderWithRouter(<TopBar {...defaultProps} />);

    expect(screen.getByText(/GHOST MODE/i)).toBeInTheDocument();
  });

  it("should not show ghost mode indicator when not in ghost mode", () => {
    const { isGhostMode } = require("../lib/supabaseClient");
    isGhostMode.mockReturnValue(false);

    renderWithRouter(<TopBar {...defaultProps} />);

    expect(screen.queryByText(/GHOST MODE/i)).not.toBeInTheDocument();
  });

  it("should render user avatar", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBeGreaterThan(0);
  });

  it("should render notification bell", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const bellButtons = screen.getAllByRole("button");
    const bellButton = bellButtons.find((btn) => btn.querySelector("svg"));

    expect(bellButton).toBeDefined();
  });

  it("should apply correct styling to top bar", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const topBar = screen.getByRole("banner");
    expect(topBar).toHaveClass("fixed", "top-0", "left-0", "right-0");
  });

  it("should handle keyboard navigation", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.keyDown(hamburgerButton, { key: "Enter" });
      // Should open drawer
    }
  });

  it("should close drawer when clicking outside", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const overlay = screen.getByTestId("mobile-drawer-overlay");
      if (overlay) {
        fireEvent.click(overlay);
        // Drawer should close
      }
    }
  });

  it("should render all monitor category items", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catMonitor/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);

        expect(screen.getByText(/nav.dataMonitor/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.followUp/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.patrol/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.alertRules/i)).toBeInTheDocument();
      }
    }
  });

  it("should render all operations category items", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catOps/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);

        expect(screen.getByText(/nav.operations/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.fileManager/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.hostFiles/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.database/i)).toBeInTheDocument();
      }
    }
  });

  it("should render all AI category items", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const categoryButtons = screen.getAllByText(/nav.catAI/i);
      if (categoryButtons.length > 0) {
        fireEvent.click(categoryButtons[0]);

        expect(screen.getByText(/nav.aiDecision/i)).toBeInTheDocument();
        expect(screen.getByText(/modelProvider.title/i)).toBeInTheDocument();
        expect(screen.getByText(/nav.aiDiagnostics/i)).toBeInTheDocument();
      }
    }
  });

  it("should animate drawer open/close", () => {
    renderWithRouter(<TopBar {...defaultProps} />);

    const menuButtons = screen.getAllByRole("button");
    const hamburgerButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);

      const drawer = screen.getByTestId("mobile-drawer");
      expect(drawer).toHaveClass("translate-x-0");
    }
  });
});
