// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Panel } from "../components/ide/Panel";
import type { Panel as PanelType } from "../components/ide/ide-layout-types";

vi.mock("../components/ide/PanelHeader", () => ({
  PanelHeader: ({ panel, isActive, onMinimize, onMaximize, onClose }: any) => (
    <div data-testid="panel-header" data-panel-id={panel.id} data-active={isActive}>
      <button data-testid="minimize-btn" onClick={onMinimize}>Minimize</button>
      <button data-testid="maximize-btn" onClick={onMaximize}>Maximize</button>
      <button data-testid="close-btn" onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock("../components/ide/TabBar", () => ({
  TabBar: ({ panel }: any) => (
    <div data-testid="tab-bar" data-panel-id={panel.id}>
      {panel.tabs.map((tab: any) => (
        <div key={tab.id} data-testid={`tab-${tab.id}`}>{tab.title}</div>
      ))}
    </div>
  ),
}));

vi.mock("../components/ide/PanelContent", () => ({
  PanelContent: ({ panel }: any) => (
    <div data-testid="panel-content" data-panel-id={panel.id}>
      {panel.content}
    </div>
  ),
}));

describe("Panel", () => {
  const mockPanel: PanelType = {
    id: "panel-1",
    type: "code-editor",
    title: "Test Panel",
    position: { x: 0, y: 0, w: 400, h: 300 },
    size: { width: 400, height: 300 },
    isLocked: false,
    isMinimized: false,
    isMaximized: false,
    isClosable: true,
    isResizable: true,
    zIndex: 1,
    tabs: [
      { id: "tab-1", panelId: "panel-1", title: "Tab 1", isPinned: false, isModified: false, isUnsaved: false, hasError: false, isActive: true },
      { id: "tab-2", panelId: "panel-1", title: "Tab 2", isPinned: false, isModified: false, isUnsaved: false, hasError: false, isActive: false },
    ],
    activeTabId: "tab-1",
    content: "Panel Content",
  };

  it("should render panel with correct structure", () => {
    const onMouseDown = vi.fn();
    const onMinimize = vi.fn();
    const onMaximize = vi.fn();
    const onClose = vi.fn();

    render(
      <Panel
        panel={mockPanel}
        isActive={true}
        onMouseDown={onMouseDown}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    );

    expect(screen.getByTestId("panel-header")).toBeInTheDocument();
    expect(screen.getByTestId("tab-bar")).toBeInTheDocument();
    expect(screen.getByTestId("panel-content")).toBeInTheDocument();
  });

  it("should not render tab bar when panel has no tabs", () => {
    const panelWithoutTabs = { ...mockPanel, tabs: [] };

    render(
      <Panel
        panel={panelWithoutTabs}
        isActive={true}
      />
    );

    expect(screen.queryByTestId("tab-bar")).not.toBeInTheDocument();
  });

  it("should apply maximized class when panel is maximized", () => {
    const maximizedPanel = { ...mockPanel, isMaximized: true };

    const { container } = render(
      <Panel
        panel={maximizedPanel}
        isActive={true}
      />
    );

    const panelElement = container.querySelector(".panel");
    expect(panelElement).toHaveClass("maximized");
  });

  it("should not apply maximized class when panel is not maximized", () => {
    const { container } = render(
      <Panel
        panel={mockPanel}
        isActive={true}
      />
    );

    const panelElement = container.querySelector(".panel");
    expect(panelElement).not.toHaveClass("maximized");
  });

  it("should call onMouseDown when mouse down event occurs", () => {
    const onMouseDown = vi.fn();

    render(
      <Panel
        panel={mockPanel}
        isActive={true}
        onMouseDown={onMouseDown}
      />
    );

    const panelElement = screen.getByTestId("panel-header").parentElement;
    if (panelElement) {
      fireEvent.mouseDown(panelElement);
    }

    expect(onMouseDown).toHaveBeenCalled();
  });

  it("should call onMinimize when minimize button is clicked", () => {
    const onMinimize = vi.fn();

    render(
      <Panel
        panel={mockPanel}
        isActive={true}
        onMinimize={onMinimize}
      />
    );

    const minimizeButton = screen.getByTestId("minimize-btn");
    fireEvent.click(minimizeButton);

    expect(onMinimize).toHaveBeenCalled();
  });

  it("should call onMaximize when maximize button is clicked", () => {
    const onMaximize = vi.fn();

    render(
      <Panel
        panel={mockPanel}
        isActive={true}
        onMaximize={onMaximize}
      />
    );

    const maximizeButton = screen.getByTestId("maximize-btn");
    fireEvent.click(maximizeButton);

    expect(onMaximize).toHaveBeenCalled();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <Panel
        panel={mockPanel}
        isActive={true}
        onClose={onClose}
      />
    );

    const closeButton = screen.getByTestId("close-btn");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("should render tabs correctly", () => {
    render(
      <Panel
        panel={mockPanel}
        isActive={true}
      />
    );

    expect(screen.getByTestId("tab-1")).toBeInTheDocument();
    expect(screen.getByTestId("tab-2")).toBeInTheDocument();
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
  });

  it("should render panel content", () => {
    render(
      <Panel
        panel={mockPanel}
        isActive={true}
      />
    );

    expect(screen.getByTestId("panel-content")).toHaveTextContent("Panel Content");
  });

  it("should handle missing callbacks gracefully", () => {
    const { container } = render(
      <Panel
        panel={mockPanel}
        isActive={true}
      />
    );

    const panelElement = container.querySelector(".panel");
    if (panelElement) {
      fireEvent.mouseDown(panelElement);
    }

    // Should not throw errors
    expect(screen.getByTestId("panel-header")).toBeInTheDocument();
  });

  it("should apply correct styles for active panel", () => {
    const { container } = render(
      <Panel
        panel={mockPanel}
        isActive={true}
      />
    );

    const panelElement = container.querySelector(".panel");
    expect(panelElement).toHaveStyle({
      border: "2px solid #6366f1",
    });
  });

  it("should apply correct styles for inactive panel", () => {
    const { container } = render(
      <Panel
        panel={mockPanel}
        isActive={false}
      />
    );

    const panelElement = container.querySelector(".panel");
    expect(panelElement).toHaveStyle({
      border: "1px solid #334155",
    });
  });
});
