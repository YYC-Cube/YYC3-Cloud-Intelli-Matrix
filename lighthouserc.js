/**
 * @file: lighthouserc.js
 * @description: Lighthouse CI 配置 · 显式核心断言集（不含 recommended preset）
 * @author: YanYuCloudCube Team
 * @version: v2.0.0
 * @created: 2026-03-19
 * @updated: 2026-10-11
 * @status: active
 * @tags: [config],[performance],[lighthouse]
 *
 * @notes:
 * - 不使用 `lighthouse:recommended` preset：其 auditRan 断言与 Lighthouse 13 的
 *   insight 类审计不兼容（audit 未产出值导致 NaN/auditRan=0 误报）
 * - performance 阈值 0.5 为当前实测基线（0.55），bundle 优化后逐步收紧
 */

module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3218'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
