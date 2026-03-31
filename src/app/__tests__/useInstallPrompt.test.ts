/**
 * @file: useInstallPrompt.test.ts
 * @description: useInstallPrompt.test.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [type]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

/** Helper: dispatch a beforeinstallprompt-like event with mock properties */
function dispatchBeforeInstallPrompt(mockEvent: {
  preventDefault?: ReturnType<typeof vi.fn>;
  prompt: ReturnType<typeof vi.fn>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}) {
  const preventDefault = mockEvent.preventDefault ?? vi.fn();
  // Create an event that has preventDefault, prompt, and userChoice directly
  const event = new Event("beforeinstallprompt") as any;
  event.preventDefault = preventDefault;
  event.prompt = mockEvent.prompt;
  event.userChoice = mockEvent.userChoice;
  window.dispatchEvent(event);
  return preventDefault;
}

describe("useInstallPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useInstallPrompt());

      expect(result.current.isInstalled).toBe(false);
      expect(result.current.canInstall).toBe(false);
      expect(typeof result.current.promptInstall).toBe("function");
      expect(typeof result.current.dismiss).toBe("function");
    });

    it("should detect standalone mode", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(display-mode: standalone)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useInstallPrompt());

      expect(result.current.isInstalled).toBe(true);
    });

    it("should detect navigator standalone", () => {
      // @ts-ignore
      window.navigator.standalone = true;

      const { result } = renderHook(() => useInstallPrompt());

      expect(result.current.isInstalled).toBe(true);

      // @ts-ignore
      delete window.navigator.standalone;
    });
  });

  describe("beforeinstallprompt event", () => {
    it("should handle beforeinstallprompt event", async () => {
      const { result } = renderHook(() => useInstallPrompt());

      expect(result.current.canInstall).toBe(false);

      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.canInstall).toBe(true);
      });
    });

    it("should prevent default on beforeinstallprompt", () => {
      const preventDefault = vi.fn();

      act(() => {
        const event = new Event("beforeinstallprompt") as any;
        event.preventDefault = preventDefault;
        // Add dummy prompt/userChoice so hook can store it
        event.prompt = vi.fn();
        event.userChoice = Promise.resolve({ outcome: "accepted" as const });
        window.dispatchEvent(event);
      });

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe("promptInstall", () => {
    it("should prompt install and return true when accepted", async () => {
      const { result } = renderHook(() => useInstallPrompt());

      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.canInstall).toBe(true);
      });

      const installed = await act(async () => {
        return await result.current.promptInstall();
      });

      expect(mockEvent.prompt).toHaveBeenCalled();
      expect(installed).toBe(true);
    });

    it("should prompt install and return false when dismissed", async () => {
      const { result } = renderHook(() => useInstallPrompt());

      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "dismissed" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.canInstall).toBe(true);
      });

      const installed = await act(async () => {
        return await result.current.promptInstall();
      });

      expect(mockEvent.prompt).toHaveBeenCalled();
      expect(installed).toBe(false);
    });

    it("should return false when no deferred prompt", async () => {
      const { result } = renderHook(() => useInstallPrompt());

      const installed = await act(async () => {
        return await result.current.promptInstall();
      });

      expect(installed).toBe(false);
    });

    it("should set isInstalled to true when accepted", async () => {
      const { result } = renderHook(() => useInstallPrompt());

      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.canInstall).toBe(true);
      });

      await act(async () => {
        await result.current.promptInstall();
      });

      expect(result.current.isInstalled).toBe(true);
    });
  });

  describe("dismiss", () => {
    it("should dismiss install prompt", () => {
      const { result } = renderHook(() => useInstallPrompt());

      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.canInstall).toBe(false);
      expect(localStorage.getItem("pwa_install_dismissed")).toBe("true");
    });

    it("should restore dismissed state from localStorage", () => {
      localStorage.setItem("pwa_install_dismissed", "true");

      const { result } = renderHook(() => useInstallPrompt());

      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      expect(result.current.canInstall).toBe(false);
    });
  });

  describe("media query change", () => {
    it("should update isInstalled when media query changes", () => {
      const mockMediaQuery = {
        matches: false,
        media: "(display-mode: standalone)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(function(this: any, event: string, handler: any) {
          if (event === "change") {
            this.onchange = handler;
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn(() => mockMediaQuery),
      });

      const { result } = renderHook(() => useInstallPrompt());

      expect(result.current.isInstalled).toBe(false);

      act(() => {
        mockMediaQuery.matches = true;
        if (mockMediaQuery.onchange) {
          (mockMediaQuery.onchange as any)({ matches: true } as MediaQueryListEvent);
        }
      });

      expect(result.current.isInstalled).toBe(true);
    });
  });

  describe("cleanup", () => {
    it("should remove event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useInstallPrompt());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "beforeinstallprompt",
        expect.any(Function)
      );
    });
  });

  describe("integration", () => {
    it("should handle complete install workflow", async () => {
      const { result, unmount } = renderHook(() => useInstallPrompt());

      // Trigger beforeinstallprompt
      const mockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.canInstall).toBe(true);
      });

      // Dismiss first
      act(() => {
        result.current.dismiss();
      });

      expect(result.current.canInstall).toBe(false);

      // Clear localStorage and unmount to reset internal dismissed state
      localStorage.removeItem("pwa_install_dismissed");
      unmount();

      // Re-render the hook — it will read fresh localStorage (no dismissed flag)
      const { result: result2 } = renderHook(() => useInstallPrompt());

      const mockEvent2 = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
      };

      act(() => {
        dispatchBeforeInstallPrompt(mockEvent2);
      });

      await waitFor(() => {
        expect(result2.current.canInstall).toBe(true);
      });

      // Install
      const installed = await act(async () => {
        return await result2.current.promptInstall();
      });

      expect(installed).toBe(true);
      expect(result2.current.isInstalled).toBe(true);
      expect(result2.current.canInstall).toBe(false);
    });
  });
});
