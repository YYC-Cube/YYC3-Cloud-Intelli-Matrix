/**
 * @file: HotelDashboard.test.tsx
 * @description: YYC3智慧酒店 - 控制台基础功能验证
 * @author: YanYuCloudCube Team (导师指导)
 * @version: v1.0.0
 * @created: 2026-04-09
 * @updated: 2026-04-16
 * @status: active
 * @tags: [hotel, dashboard, smoke-test]
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HotelDashboard } from '../components/HotelDashboard';

vi.mock('../lib/ai-family-hotel-manager', () => ({
  AIFamilyHotelManager: vi.fn().mockImplementation(function() {
    return {
      getAllStaffMembers: () => [],
      getAllConversations: () => [],
    };
  }),
}));

vi.mock('../lib/zhipu-ai-service', () => ({
  getZhipuAIService: vi.fn().mockReturnValue({
    chat: vi.fn(),
    chatStream: vi.fn(),
  }),
}));

vi.mock('../lib/hotel-voice-service', () => ({
  getHotelVoiceService: vi.fn().mockReturnValue({
    startListening: vi.fn(),
    stopListening: vi.fn(),
    speak: vi.fn(),
    on: vi.fn().mockReturnValue(vi.fn()),
    HotelVoiceService: {
      checkBrowserSupport: vi.fn().mockReturnValue({
        recognition: true,
        synthesis: true,
        availableLanguages: [],
        availableVoices: [],
      }),
    },
  }),
}));

vi.mock('../lib/hotel-knowledge-base', () => ({
  getHotelKnowledgeBase: vi.fn().mockReturnValue({
    getCategories: () => [],
    getStats: () => ({
      totalArticles: 0,
      categories: 0,
      averageVersion: 0,
      lastUpdate: '',
    }),
    search: vi.fn(),
  }),
}));

vi.mock('../lib/ai-learning-engine', () => ({
  getAILearningEngine: vi.fn().mockReturnValue({
    getLearningSummary: () => ({
      totalFeedbackRecords: 0,
      totalStaffTracked: 0,
      totalInsightsGenerated: 0,
      averageSatisfactionAcrossAllStaff: 0,
      topPerformers: [],
      needsAttention: [],
    }),
    getInsights: () => [],
  }),
}));

describe('HotelDashboard Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<HotelDashboard />);
    expect(baseElement).toBeTruthy();
  });

  it('should contain the main title', () => {
    render(<HotelDashboard />);
    
    const titleElements = screen.getAllByText(/智慧酒店/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('should display subtitle text', () => {
    render(<HotelDashboard />);
    
    const subtitleElements = screen.getAllByText(/多模型协作/i);
    expect(subtitleElements.length).toBeGreaterThan(0);
  });

  it('should have a header element', () => {
    const { container } = render(<HotelDashboard />);
    
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should have navigation section', () => {
    const { container } = render(<HotelDashboard />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should have main content area', () => {
    const { container } = render(<HotelDashboard />);
    
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
  });

  it('should show overview statistics by default', () => {
    render(<HotelDashboard />);
    
    const statsElements = screen.getAllByText(/总交互次数/i);
    expect(statsElements.length).toBeGreaterThan(0);
  });
});
