/**
 * index.ts
 * =========
 * YYC³ 配置中心入口文件
 *
 * 统一导出所有配置模块，确保全局一致性
 *
 * @version v1.0.0
 * @created 2026-04-06
 */

// 页面配置
export {
  PAGE_REGISTRY,
  getPageConfig,
  getPageConfigByPath,
  getPagesByCategory,
  getAllPages,
  getNavGroups,
  loadPageConfigOverrides,
  savePageConfigOverrides,
  updatePageConfig,
  getMergedPageConfig,
  resetPageConfig,
  resetAllPageConfigs,
  type PageConfig,
  type PageCategory,
  type PageLayout,
  type PageHeaderConfig,
  type PageSidebarConfig,
  type PagePermission,
} from "./page-config";

// 设计系统
export {
  COLOR_TOKENS,
  CHART_COLORS,
  FAMILY_COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  SPACING,
  BORDER_RADIUS,
  SHADOW_TOKENS,
  ANIMATION_TOKENS,
  ANIMATION,
  BREAKPOINTS,
  Z_INDEX,
  COMPONENT_SIZES,
  hexToRgb,
  rgba,
  getCSSVar,
  setCSSVar,
  loadDesignSystemOverrides,
  saveDesignSystemOverrides,
  applyDesignSystemOverrides,
  resetDesignSystemOverrides,
  type ColorToken,
  type TypographyToken,
  type SpacingToken,
  type ShadowToken,
  type AnimationToken,
  type DesignSystemOverrides,
} from "./design-system";
