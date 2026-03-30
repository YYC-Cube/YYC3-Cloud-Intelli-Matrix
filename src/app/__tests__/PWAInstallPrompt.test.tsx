// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";

vi.mock("../hooks/useInstallPrompt", () => ({
  useInstallPrompt: vi.fn(),
}));

import { useInstallPrompt } from "../hooks/useInstallPrompt";

describe("PWAInstallPrompt", () => {
  it("should not render when already installed", () => {
    vi.mocked(useInstallPrompt).mockReturnValue({
      isInstalled: true,
      canInstall: true,
      promptInstall: vi.fn(),
      dismiss: vi.fn(),
    });

    render(<PWAInstallPrompt />);

    expect(screen.queryByText("安装 CP-IM Cloud")).not.toBeInTheDocument();
  });

  it("should not render when cannot install", () => {
    vi.mocked(useInstallPrompt).mockReturnValue({
      isInstalled: false,
      canInstall: false,
      promptInstall: vi.fn(),
      dismiss: vi.fn(),
    });

    render(<PWAInstallPrompt />);

    expect(screen.queryByText("安装 CP-IM Cloud")).not.toBeInTheDocument();
  });

  it("should render when can install and not installed", () => {
    vi.mocked(useInstallPrompt).mockReturnValue({
      isInstalled: false,
      canInstall: true,
      promptInstall: vi.fn(),
      dismiss: vi.fn(),
    });

    render(<PWAInstallPrompt />);

    expect(screen.getByText("安装 CP-IM Cloud")).toBeInTheDocument();
    expect(screen.getByText("添加到桌面，获得原生应用体验，支持离线使用")).toBeInTheDocument();
    expect(screen.getByText("安装到桌面")).toBeInTheDocument();
  });

  it("should call promptInstall when install button is clicked", () => {
    const mockPromptInstall = vi.fn();
    vi.mocked(useInstallPrompt).mockReturnValue({
      isInstalled: false,
      canInstall: true,
      promptInstall: mockPromptInstall,
      dismiss: vi.fn(),
    });

    render(<PWAInstallPrompt />);

    const installButton = screen.getByText("安装到桌面");
    fireEvent.click(installButton);

    expect(mockPromptInstall).toHaveBeenCalledTimes(1);
  });

  it("should call dismiss when close button is clicked", () => {
    const mockDismiss = vi.fn();
    vi.mocked(useInstallPrompt).mockReturnValue({
      isInstalled: false,
      canInstall: true,
      promptInstall: vi.fn(),
      dismiss: mockDismiss,
    });

    render(<PWAInstallPrompt />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it("should have correct styling classes", () => {
    vi.mocked(useInstallPrompt).mockReturnValue({
      isInstalled: false,
      canInstall: true,
      promptInstall: vi.fn(),
      dismiss: vi.fn(),
    });

    const { container } = render(<PWAInstallPrompt />);

    const promptElement = container.querySelector(".fixed.bottom-20");
    expect(promptElement).toBeInTheDocument();
  });
});
