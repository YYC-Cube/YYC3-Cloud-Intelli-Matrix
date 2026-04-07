/**
 * useEmotionMusic.test.ts
 * ==========================
 * 情感感知音乐Hook测试
 *
 * @file useEmotionMusic.test.ts
 * @description useEmotionMusic Hook单元测试
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-04-05
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useEmotionMusic } from "../hooks/useEmotionMusic";
import type { EmotionState, EmotionMusicMapping } from "../lib/EmotionMusicBridge";

const mockGetCurrentEmotion = vi.fn();
const mockGetEmotionHistory = vi.fn();
const mockDetectEmotion = vi.fn();
const mockGetMusicRecommendation = vi.fn();
const mockGetRecommendedTracksForEmotion = vi.fn();
const mockSuggestMusicAction = vi.fn();

vi.mock("../lib/EmotionMusicBridge", () => ({
  default: {
    getCurrentEmotion: () => mockGetCurrentEmotion(),
    getEmotionHistory: () => mockGetEmotionHistory(),
    detectEmotion: (...args: unknown[]) => mockDetectEmotion(...args),
    getMusicRecommendation: (...args: unknown[]) => mockGetMusicRecommendation(...args),
    getRecommendedTracksForEmotion: (...args: unknown[]) => mockGetRecommendedTracksForEmotion(...args),
    suggestMusicAction: (...args: unknown[]) => mockSuggestMusicAction(...args),
  },
}));

const mockSubscribe = vi.fn();
const mockEmit = vi.fn();

vi.mock("../lib/MusicEventBus", () => ({
  default: {
    subscribe: (...args: unknown[]) => mockSubscribe(...args),
    emit: (...args: unknown[]) => mockEmit(...args),
  },
}));

describe("useEmotionMusic", () => {
  const mockEmotionState: EmotionState = {
    type: "happy",
    confidence: 0.9,
    intensity: 0.8,
    timestamp: Date.now(),
  };

  const mockMusicMapping: EmotionMusicMapping = {
    emotion: "happy",
    preferredGenres: ["pop", "dance"],
    tempoRange: [100, 140],
    energyRange: [60, 90],
    valenceRange: [70, 100],
    color: "#FFD700",
    description: "欢快愉悦",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentEmotion.mockReturnValue(null);
    mockGetEmotionHistory.mockReturnValue([]);
    mockDetectEmotion.mockReturnValue(mockEmotionState);
    mockGetMusicRecommendation.mockReturnValue(mockMusicMapping);
    mockGetRecommendedTracksForEmotion.mockReturnValue([
      { id: 1, score: 0.9, reason: "适合当前情感" },
    ]);
    mockSuggestMusicAction.mockReturnValue({ action: "play", reason: "播放欢快音乐" });
    mockSubscribe.mockReturnValue(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with null emotion", () => {
      const { result } = renderHook(() => useEmotionMusic());

      expect(result.current.currentEmotion).toBeNull();
      expect(result.current.emotionHistory).toEqual([]);
    });

    it("should initialize with existing emotion from bridge", () => {
      mockGetCurrentEmotion.mockReturnValueOnce(mockEmotionState);

      const { result } = renderHook(() => useEmotionMusic());

      expect(result.current.currentEmotion).toEqual(mockEmotionState);
    });

    it("should initialize with existing history from bridge", () => {
      mockGetEmotionHistory.mockReturnValueOnce([mockEmotionState]);

      const { result } = renderHook(() => useEmotionMusic());

      expect(result.current.emotionHistory).toHaveLength(1);
    });
  });

  describe("detectEmotion", () => {
    it("should detect emotion from text", () => {
      const { result } = renderHook(() => useEmotionMusic());

      act(() => {
        const emotion = result.current.detectEmotion("我很开心");
        expect(emotion).toEqual(mockEmotionState);
      });

      expect(mockDetectEmotion).toHaveBeenCalledWith("我很开心", undefined);
    });

    it("should detect emotion with behavior", () => {
      const { result } = renderHook(() => useEmotionMusic());
      const behavior = { clickFrequency: 5, dwellTime: 1000, scrollSpeed: 50 };

      act(() => {
        result.current.detectEmotion("我很开心", behavior);
      });

      expect(mockDetectEmotion).toHaveBeenCalledWith("我很开心", behavior);
    });

    it("should update current emotion after detection", () => {
      const { result } = renderHook(() => useEmotionMusic());

      expect(result.current.currentEmotion).toBeNull();

      act(() => {
        result.current.detectEmotion("我很开心");
      });

      expect(result.current.currentEmotion).toEqual(mockEmotionState);
    });

    it("should update music mapping after detection", () => {
      const { result } = renderHook(() => useEmotionMusic());

      act(() => {
        result.current.detectEmotion("我很开心");
      });

      expect(result.current.musicMapping).toEqual(mockMusicMapping);
    });
  });

  describe("getRecommendations", () => {
    it("should return recommendations for current emotion", () => {
      const { result } = renderHook(() => useEmotionMusic());

      act(() => {
        result.current.detectEmotion("我很开心");
      });

      const tracks = [
        { id: 1, title: "Happy Song", genre: "pop", tempo: 120, energy: 80, valence: 85 },
      ];

      let recommendations: Array<{ id: string | number; score: number; reason: string }> = [];

      act(() => {
        recommendations = result.current.getRecommendations(tracks);
      });

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].id).toBe(1);
    });

    it("should return default recommendations when no emotion", () => {
      const { result } = renderHook(() => useEmotionMusic());

      const tracks = [
        { id: 1, title: "Song 1" },
        { id: 2, title: "Song 2" },
      ];

      let recommendations: Array<{ id: string | number; score: number; reason: string }> = [];

      act(() => {
        recommendations = result.current.getRecommendations(tracks);
      });

      expect(recommendations).toHaveLength(2);
      expect(recommendations[0].score).toBe(0.5);
      expect(recommendations[0].reason).toBe("无情感数据");
    });
  });

  describe("suggestAction", () => {
    it("should suggest action for current emotion", () => {
      const { result } = renderHook(() => useEmotionMusic());

      act(() => {
        result.current.detectEmotion("我很开心");
      });

      let suggestion: { action: string; reason: string } = { action: "", reason: "" };

      act(() => {
        suggestion = result.current.suggestAction();
      });

      expect(suggestion.action).toBe("play");
      expect(suggestion.reason).toBe("播放欢快音乐");
    });

    it("should return default suggestion when no emotion", () => {
      const { result } = renderHook(() => useEmotionMusic());

      let suggestion: { action: string; reason: string } = { action: "", reason: "" };

      act(() => {
        suggestion = result.current.suggestAction();
      });

      expect(suggestion.action).toBe("play");
      expect(suggestion.reason).toBe("暂无情感数据");
    });
  });

  describe("clearHistory", () => {
    it("should clear emotion history", () => {
      mockGetEmotionHistory.mockReturnValueOnce([mockEmotionState]);

      const { result } = renderHook(() => useEmotionMusic());

      expect(result.current.emotionHistory).toHaveLength(1);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.emotionHistory).toEqual([]);
    });
  });

  describe("callbacks", () => {
    it("should call onEmotionChange callback", async () => {
      const onEmotionChange = vi.fn();

      renderHook(() => useEmotionMusic({ onEmotionChange }));

      act(() => {
        result.current.detectEmotion("我很开心");
      });

      expect(onEmotionChange).toHaveBeenCalled();
    });

    it("should call onMusicSuggestion callback", async () => {
      const onMusicSuggestion = vi.fn();

      renderHook(() => useEmotionMusic({ onMusicSuggestion }));

      act(() => {
        result.current.detectEmotion("我很开心");
      });
    });
  });

  describe("autoDetect option", () => {
    it("should subscribe to events when autoDetect is true", () => {
      renderHook(() => useEmotionMusic({ autoDetect: true }));

      expect(mockSubscribe).toHaveBeenCalled();
    });

    it("should not subscribe to events when autoDetect is false", () => {
      renderHook(() => useEmotionMusic({ autoDetect: false }));

      expect(mockSubscribe).not.toHaveBeenCalled();
    });
  });
});
