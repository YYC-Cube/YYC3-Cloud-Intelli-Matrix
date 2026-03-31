/**
 * @file: AlertBanner.test.tsx
 * @description: AlertBanner.test.tsx description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-03-31
 * @updated: 2026-03-31
 * @status: active
 * @tags: [component]
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AlertBanner } from "../components/AlertBanner";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("AlertBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render alert banner with latest title", () => {
    render(<AlertBanner />);
    const titleElements = screen.getAllByText("GPU-A100-03 推理延迟异常");
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it("should display alert count", () => {
    render(<AlertBanner />);
    const countElements = screen.getAllByText("5 条告警");
    expect(countElements.length).toBeGreaterThan(0);
  });

  it("should display critical count", () => {
    render(<AlertBanner />);
    const criticalElements = screen.getAllByText("1 严重");
    expect(criticalElements.length).toBeGreaterThan(0);
  });

  it("should display error count", () => {
    render(<AlertBanner />);
    const errorElements = screen.getAllByText("1 错误");
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it("should display warning count", () => {
    render(<AlertBanner />);
    const warningElements = screen.getAllByText("2 警告");
    expect(warningElements.length).toBeGreaterThan(0);
  });

  it("should display latest metric", () => {
    render(<AlertBanner />);
    const metricElements = screen.getAllByText("2,450ms > 2,000ms");
    expect(metricElements.length).toBeGreaterThan(0);
  });

  it("should navigate to follow-up page when clicked", () => {
    render(<AlertBanner />);
    const banner = screen.getByTestId("alert-banner");
    fireEvent.click(banner);
    expect(mockNavigate).toHaveBeenCalledWith("/follow-up");
  });

  it("should render compact mode without detailed counts", () => {
    render(<AlertBanner compact={true} />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
    const countElements = screen.queryAllByText("5 条告警");
    expect(countElements.length).toBe(0);
  });

  it("should show follow-up CTA text", () => {
    render(<AlertBanner />);
    const ctaElements = screen.getAllByText("一键跟进");
    expect(ctaElements.length).toBeGreaterThan(0);
  });

  it("should have correct data-testid", () => {
    render(<AlertBanner />);
    expect(screen.getByTestId("alert-banner")).toBeInTheDocument();
  });

  it("should apply critical styles when critical alerts exist", () => {
    render(<AlertBanner />);
    const banner = screen.getByTestId("alert-banner");
    expect(banner.className).toContain("border-[rgba(255,51,102,0.2)]");
  });
});
