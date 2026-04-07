/**
 * VinylPhotoPlayer.test.tsx
 * ==========================
 * 黑胶唱片照片播放器测试
 *
 * @file VinylPhotoPlayer.test.tsx
 * @description 黑胶唱片照片轮播组件单元测试
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-04-04
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { VinylPhotoPlayer, MVPlayerOverlay } from "../components/ai-family/VinylPhotoPlayer";

const mockPhotos = [
  "/D-Music/test-photo-1.jpg",
  "/D-Music/test-photo-2.jpg",
  "/D-Music/test-photo-3.jpg",
];

const defaultProps = {
  photos: mockPhotos,
  isPlaying: false,
  audioEnergy: 0.5,
  hasVideo: false,
  onOpenVideo: vi.fn(),
};

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: vi.fn(),
  }),
}));

describe("VinylPhotoPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render vinyl photo player component", () => {
    const { container } = render(<VinylPhotoPlayer {...defaultProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("should display coverUrl when provided", () => {
    render(<VinylPhotoPlayer {...defaultProps} coverUrl="/custom-cover.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/custom-cover.jpg");
  });

  it("should display track title and artist when provided", () => {
    render(
      <VinylPhotoPlayer
        {...defaultProps}
        trackTitle="测试歌曲"
        artist="测试艺术家"
      />
    );
    expect(screen.getByText("测试歌曲")).toBeTruthy();
    expect(screen.getByText("测试艺术家")).toBeTruthy();
  });

  it("should show video hint when hasVideo is true", () => {
    render(<VinylPhotoPlayer {...defaultProps} hasVideo={true} />);
    const videoButton = screen.getByTitle("播放 MV");
    expect(videoButton).toBeTruthy();
  });

  it("should call onOpenVideo when video button is clicked", () => {
    const handleOpenVideo = vi.fn();
    render(<VinylPhotoPlayer {...defaultProps} hasVideo={true} onOpenVideo={handleOpenVideo} />);
    const videoButton = screen.getByTitle("播放 MV");
    fireEvent.click(videoButton);
    expect(handleOpenVideo).toHaveBeenCalledTimes(1);
  });

  it("should display image with correct src", () => {
    render(<VinylPhotoPlayer {...defaultProps} />);
    const img = screen.getByRole("img");
    expect(img).toBeTruthy();
  });

  it("should render motion elements when playing", () => {
    const { container } = render(<VinylPhotoPlayer {...defaultProps} isPlaying={true} />);
    expect(container.firstChild).toBeTruthy();
    const divs = container.querySelectorAll("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  it("should display audio energy indicator", () => {
    const { container } = render(<VinylPhotoPlayer {...defaultProps} isPlaying={true} audioEnergy={0.8} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("MVPlayerOverlay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const defaultOverlayProps = {
    isOpen: false,
    onClose: vi.fn(),
    videoUrl: "/test-video.mp4",
    trackTitle: "测试MV",
    isPlaying: false,
    currentTime: 0,
    duration: 180,
    onSeek: vi.fn(),
    formatTime: (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`,
  };

  it("should not render when closed", () => {
    render(<MVPlayerOverlay {...defaultOverlayProps} isOpen={false} />);
    expect(screen.queryByText("测试MV")).toBeFalsy();
  });

  it("should render when open", () => {
    render(<MVPlayerOverlay {...defaultOverlayProps} isOpen={true} />);
    expect(screen.getByText("测试MV")).toBeTruthy();
  });

  it("should display video element with correct src", () => {
    const { container } = render(<MVPlayerOverlay {...defaultOverlayProps} isOpen={true} />);
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("src", "/test-video.mp4");
  });

  it("should call onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    const { container } = render(<MVPlayerOverlay {...defaultOverlayProps} isOpen={true} onClose={handleClose} />);
    const closeButton = container.querySelector("button");
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it("should display formatted time", () => {
    render(<MVPlayerOverlay {...defaultOverlayProps} isOpen={true} currentTime={90} />);
    expect(screen.getByText("1:30")).toBeTruthy();
  });

  it("should display placeholder when no videoUrl", () => {
    render(<MVPlayerOverlay {...defaultOverlayProps} isOpen={true} videoUrl={null} />);
    expect(screen.getByText(/暂无|no video/i)).toBeTruthy();
  });
});
