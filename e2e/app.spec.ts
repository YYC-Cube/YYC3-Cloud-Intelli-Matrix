import { test, expect } from '@playwright/test';

test.describe('YYC³ Cloud Intelli-Matrix E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/YYC³ Cloud Intelli-Matrix/);
  });

  test('should display dashboard', async ({ page }) => {
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 });
    const dashboard = page.locator('[data-testid="dashboard"]');
    await expect(dashboard).toBeVisible();
  });

  test('should navigate to data monitor', async ({ page }) => {
    await page.waitForSelector('[data-testid="nav-data-monitor"]', { timeout: 10000 });
    await page.click('[data-testid="nav-data-monitor"]');
    await expect(page).toHaveURL(/.*data-monitor/);
  });

  test('should open AI assistant', async ({ page }) => {
    await page.waitForSelector('[data-testid="ai-assistant-button"]', { timeout: 10000 });
    await page.click('[data-testid="ai-assistant-button"]');
    const aiPanel = page.locator('[data-testid="ai-assistant-panel"]');
    await expect(aiPanel).toBeVisible();
  });

  test('should display system status', async ({ page }) => {
    await page.waitForSelector('[data-testid="system-status"]', { timeout: 10000 });
    const status = page.locator('[data-testid="system-status"]');
    await expect(status).toBeVisible();
    const statusText = await status.textContent();
    expect(statusText).toBeTruthy();
  });

  test('should toggle theme', async ({ page }) => {
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 10000 });
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();
    await page.waitForTimeout(500);
    await expect(themeToggle).toBeVisible();
  });

  test('should display user menu', async ({ page }) => {
    await page.waitForSelector('[data-testid="user-menu-button"]', { timeout: 10000 });
    await page.click('[data-testid="user-menu-button"]');
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
  });

  test('should navigate through tabs', async ({ page }) => {
    await page.waitForSelector('[data-testid="nav-tabs"]', { timeout: 10000 });
    const tabs = page.locator('[data-testid="nav-tabs"] button');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);

    await tabs.first().click();
    await page.waitForTimeout(500);
    await expect(tabs.first()).toHaveClass(/active/);
  });

  test('should display charts', async ({ page }) => {
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 });
    const charts = page.locator('[data-testid^="chart-"]');
    await charts.first().waitFor({ state: 'visible', timeout: 10000 });
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThan(0);
  });
});
