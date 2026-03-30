// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionRecommender } from "../components/ActionRecommender";
import type { AIRecommendation } from "../types";

describe("ActionRecommender", () => {
  const mockRecommendations: AIRecommendation[] = [
    {
      id: "rec-1",
      action: "优化 GPU 使用率",
      description: "当前 GPU 使用率仅为 45%，建议增加批处理大小",
      impact: "high",
      confidence: 95,
      autoExecutable: true,
      applied: false,
    },
    {
      id: "rec-2",
      action: "清理临时文件",
      description: "检测到大量临时文件占用存储空间",
      impact: "medium",
      confidence: 88,
      autoExecutable: false,
      applied: false,
    },
    {
      id: "rec-3",
      action: "重启服务",
      description: "服务响应时间过长，建议重启",
      impact: "low",
      confidence: 72,
      autoExecutable: false,
      applied: true,
    },
  ];

  it("should render pending recommendations", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("优化 GPU 使用率")).toBeInTheDocument();
    expect(screen.getByText("清理临时文件")).toBeInTheDocument();
    expect(screen.getByText("当前 GPU 使用率仅为 45%，建议增加批处理大小")).toBeInTheDocument();
  });

  it("should render applied recommendations", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    const appliedTexts = screen.getAllByText("已应用 (1)");
    expect(appliedTexts.length).toBeGreaterThan(0);
    expect(screen.getByText("重启服务")).toBeInTheDocument();
  });

  it("should show empty state when no pending recommendations", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={[mockRecommendations[2]]}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("暂无待处理建议")).toBeInTheDocument();
  });

  it("should call onApply when apply button is clicked", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    const applyButtons = screen.getAllByTestId("apply-rec-1");
    expect(applyButtons.length).toBeGreaterThan(0);
    fireEvent.click(applyButtons[0]);

    expect(onApply).toHaveBeenCalledWith("rec-1");
  });

  it("should call onDismiss when dismiss button is clicked", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    const dismissButtons = screen.getAllByTestId("dismiss-rec-1");
    expect(dismissButtons.length).toBeGreaterThan(0);
    fireEvent.click(dismissButtons[0]);

    expect(onDismiss).toHaveBeenCalledWith("rec-1");
  });

  it("should disable apply button when applying", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
        isApplying="rec-1"
      />
    );

    const applyButtons = screen.getAllByTestId("apply-rec-1");
    expect(applyButtons.length).toBeGreaterThan(0);
    expect(applyButtons[0]).toBeDisabled();
    const executingTexts = screen.getAllByText("执行中");
    expect(executingTexts.length).toBeGreaterThan(0);
  });

  it("should show impact labels correctly", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("高影响")).toBeInTheDocument();
    expect(screen.getByText("中影响")).toBeInTheDocument();
    expect(screen.getByText("低影响")).toBeInTheDocument();
  });

  it("should show confidence percentages", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("置信度 95%")).toBeInTheDocument();
    expect(screen.getByText("置信度 88%")).toBeInTheDocument();
    expect(screen.getByText("置信度 72%")).toBeInTheDocument();
  });

  it("should show auto-executable badge", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("可自动执行")).toBeInTheDocument();
  });

  it("should not show auto-executable badge for non-auto-executable recommendations", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={[mockRecommendations[1]]}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.queryByText("可自动执行")).not.toBeInTheDocument();
  });

  it("should have correct data-testid attributes", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={mockRecommendations}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByTestId("action-recommender")).toBeInTheDocument();
    expect(screen.getByTestId("rec-1")).toBeInTheDocument();
    expect(screen.getByTestId("rec-2")).toBeInTheDocument();
    expect(screen.getByTestId("applied-rec-3")).toBeInTheDocument();
  });

  it("should handle empty recommendations array", () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();

    render(
      <ActionRecommender
        recommendations={[]}
        onApply={onApply}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("暂无待处理建议")).toBeInTheDocument();
    expect(screen.queryByText("已应用")).not.toBeInTheDocument();
  });
});
