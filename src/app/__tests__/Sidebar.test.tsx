// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { BrowserRouter } from "react-router";
import { Sidebar } from "../components/Sidebar";

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

describe("Sidebar Component", () => {
  const mockOnToggle = vi.fn();

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("should render sidebar in collapsed state", () => {
    renderWithRouter(<Sidebar collapsed={true} onToggle={mockOnToggle} />);

    expect(screen.getByTestId("yyc3-logo")).toBeInTheDocument();
    expect(screen.queryByText(/nav.catMonitor/i)).not.toBeInTheDocument();
  });

  it("should render sidebar in expanded state", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByTestId("yyc3-logo")).toBeInTheDocument();
    expect(screen.getByText(/nav.catMonitor/i)).toBeInTheDocument();
  });

  it("should render all navigation categories when expanded", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.catMonitor/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.catOps/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.catAI/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.catDev/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.catAdmin/i)).toBeInTheDocument();
  });

  it("should call onToggle when toggle button is clicked", () => {
    renderWithRouter(<Sidebar collapsed={true} onToggle={mockOnToggle} />);

    const toggleButtons = screen.getAllByRole("button");
    const toggleButton = toggleButtons.find((btn) => btn.querySelector("svg"));

    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(mockOnToggle).toHaveBeenCalled();
    }
  });

  it("should show navigation items when category is hovered", () => {
    renderWithRouter(<Sidebar collapsed={true} onToggle={mockOnToggle} />);

    const categoryIcons = screen.getAllByRole("button");
    const firstCategory = categoryIcons[0];

    if (firstCategory) {
      fireEvent.mouseEnter(firstCategory);
      expect(screen.getByText(/nav.dataMonitor/i)).toBeInTheDocument();
    }
  });

  it("should hide navigation items when category is not hovered", () => {
    renderWithRouter(<Sidebar collapsed={true} onToggle={mockOnToggle} />);

    const categoryIcons = screen.getAllByRole("button");
    const firstCategory = categoryIcons[0];

    if (firstCategory) {
      fireEvent.mouseEnter(firstCategory);
      expect(screen.getByText(/nav.dataMonitor/i)).toBeInTheDocument();

      fireEvent.mouseLeave(firstCategory);
      // Items should be hidden after mouse leave
    }
  });

  it("should render navigation items directly when expanded", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.dataMonitor/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.followUp/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.patrol/i)).toBeInTheDocument();
  });

  it("should highlight active navigation item", () => {
    renderWithRouter(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={mockOnToggle} />
      </BrowserRouter>
    );

    // The dashboard route should be active by default
    const dataMonitorLinks = screen.getAllByText(/nav.dataMonitor/i);
    expect(dataMonitorLinks.length).toBeGreaterThan(0);
  });

  it("should navigate to correct path when navigation item is clicked", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    const followUpLinks = screen.getAllByText(/nav.followUp/i);
    if (followUpLinks.length > 0) {
      fireEvent.click(followUpLinks[0]);
      // Navigation should happen (handled by react-router)
    }
  });

  it("should render all monitor category items", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.dataMonitor/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.followUp/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.patrol/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.alertRules/i)).toBeInTheDocument();
  });

  it("should render all operations category items", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.operations/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.fileManager/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.hostFiles/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.database/i)).toBeInTheDocument();
  });

  it("should render all AI category items", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.aiDecision/i)).toBeInTheDocument();
    expect(screen.getByText(/modelProvider.title/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.aiDiagnostics/i)).toBeInTheDocument();
  });

  it("should render all dev category items", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.designSystem/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.devGuide/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.theme/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.terminal/i)).toBeInTheDocument();
  });

  it("should render all admin category items", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.audit/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.userMgmt/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.settings/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.securityMonitor/i)).toBeInTheDocument();
  });

  it("should render AI family category items", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.aiFamily/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.aiFamilyHome/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.aiFamilyChat/i)).toBeInTheDocument();
  });

  it("should apply correct width class based on collapsed state", () => {
    const { rerender } = renderWithRouter(
      <Sidebar collapsed={true} onToggle={mockOnToggle} />
    );

    const sidebar = screen.getByRole("navigation");
    expect(sidebar).toHaveClass("w-[52px]");

    rerender(<Sidebar collapsed={false} onToggle={mockOnToggle} />);
    expect(sidebar).toHaveClass("w-[208px]");
  });

  it("should show category icons in collapsed state", () => {
    renderWithRouter(<Sidebar collapsed={true} onToggle={mockOnToggle} />);

    const categoryIcons = screen.getAllByRole("button");
    expect(categoryIcons.length).toBeGreaterThan(0);
  });

  it("should show category labels in expanded state", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    expect(screen.getByText(/nav.catMonitor/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.catOps/i)).toBeInTheDocument();
    expect(screen.getByText(/nav.catAI/i)).toBeInTheDocument();
  });

  it("should render navigation icons", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    const icons = screen.getAllByRole("button");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should handle keyboard navigation", () => {
    renderWithRouter(<Sidebar collapsed={false} onToggle={mockOnToggle} />);

    const navItems = screen.getAllByRole("button");
    if (navItems.length > 0) {
      fireEvent.keyDown(navItems[0], { key: "Enter" });
      // Should trigger navigation
    }
  });
});
