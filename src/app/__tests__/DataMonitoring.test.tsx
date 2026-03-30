// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { DataMonitoring } from "../components/DataMonitoring";

vi.mock("../components/Dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard</div>,
}));

describe("DataMonitoring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render data monitoring page", () => {
    render(React.createElement(DataMonitoring));
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("should render dashboard component", () => {
    render(React.createElement(DataMonitoring));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
