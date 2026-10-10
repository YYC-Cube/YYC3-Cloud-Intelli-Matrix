/**
 * @file: app.spec.ts
 * @description: E2E Smoke Tests · 基于真实应用锚点（Login → Ghost 登录 → 主应用）
 * @author: YanYuCloudCube Team
 * @version: v2.0.0
 * @created: 2026-04-08
 * @updated: 2026-10-11
 * @status: active
 * @tags: [e2e],[smoke],[playwright]
 */

import { test, expect } from '@playwright/test';

test.describe('YYC³ Cloud Intelli-Matrix E2E Smoke Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/YYC³ Cloud Intelli-Matrix/);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/');
    // 未认证时显示登录页（supabase 会话检查有 3s 超时兜底）
    await page.waitForSelector('[data-testid="login-title"]', { timeout: 15000 });
    await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-submit-button"]')).toBeVisible();
  });

  test('should sign in via ghost mode and enter main app', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="login-ghost-button"]', { timeout: 15000 });
    // 幽灵登录：跳过认证直接进入主应用
    await page.click('[data-testid="login-ghost-button"]');
    // 主应用挂载后 TopBar 渲染品牌名与用户头像
    await page.waitForSelector('[data-testid="brand-name"]', { timeout: 20000 });
    await expect(page.locator('[data-testid="user-avatar-btn"]')).toBeVisible();
  });
});
