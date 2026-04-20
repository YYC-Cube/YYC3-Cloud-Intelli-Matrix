/**
 * @file: COMPONENT-REFERENCE.ts
 * @description: YYC3 Component Catalog — navigable in-code documentation
 * @author: YanYuCloudCube Team
 * @version: v1.1.0
 * @created: 2026-04-08
 * @updated: 2026-04-19
 * @status: active
 * @tags: [docs]
 */

// ═══════════════════════════════════════════════════════════════
//  1. Layout Components
// ═══════════════════════════════════════════════════════════════

/**
 * Layout — Root application shell.
 * File: src/app/components/Layout.tsx
 * Renders Sidebar + TopBar + main content area + BottomNav (mobile).
 * Manages sidebar collapse state and responsive breakpoints.
 */

/**
 * Sidebar — Primary navigation panel.
 * File: src/app/components/Sidebar.tsx
 * Hierarchical nav tree built from page-config.ts. Supports collapse,
 * section grouping, icon + label rendering, and active-route highlighting.
 */

/**
 * TopBar — Top navigation bar.
 * File: src/app/components/TopBar.tsx
 * Contains breadcrumbs, global search trigger, theme toggle, user avatar,
 * and notification bell. Responsive: collapses actions on small screens.
 */

/**
 * BottomNav — Mobile bottom tab bar.
 * File: src/app/components/BottomNav.tsx
 * Shows primary navigation items as icon tabs. Visible only on narrow
 * viewports where the Sidebar is hidden.
 */

/**
 * CommandPalette — Keyboard-driven command panel (Cmd+K).
 * File: src/app/components/CommandPalette.tsx
 * Fuzzy-search across pages, actions, and family members.
 * Integrates with the page-config registry for navigation targets.
 */

// ═══════════════════════════════════════════════════════════════
//  2. Dashboard Components
// ═══════════════════════════════════════════════════════════════

/**
 * Dashboard — Default landing page (/ route).
 * File: src/app/components/Dashboard.tsx
 * Top-level container that renders DataMonitoring as the home view.
 */

/**
 * GlassCard — Frosted-glass card container.
 * File: src/app/components/GlassCard.tsx
 * Props: title, icon, children, className, variant, glow.
 * Used universally for dashboard panels, metric tiles, and section wrappers.
 */

/**
 * DataMonitoring — Real-time monitoring dashboard.
 * File: src/app/components/DataMonitoring.tsx
 * Primary view showing node status grid, throughput charts, alert list,
 * and model performance metrics. Consumes useWebSocketData hook.
 */

// ═══════════════════════════════════════════════════════════════
//  3. IDE Components
// ═══════════════════════════════════════════════════════════════
// Directory: src/app/components/ide/
// Full IDE environment with panel management, file explorer, and terminal.

/**
 * IDELayout — Main IDE layout manager with resizable panel groups.
 * File: src/app/components/ide/IDELayout.tsx
 */

/**
 * Workspace — Project workspace container.
 * File: src/app/components/ide/Workspace.tsx
 */

/**
 * FileExplorer — File tree browser.
 * File: src/app/components/ide/FileExplorer.tsx
 */

/**
 * AIChatPanel — Inline AI assistant panel.
 * File: src/app/components/ide/AIChatPanel.tsx
 */

/**
 * CodePreviewPanel — Syntax-highlighted code viewer.
 * File: src/app/components/ide/CodePreviewPanel.tsx
 */

/**
 * GitPanel — Git status, diff viewer, and commit interface.
 * File: src/app/components/ide/GitPanel.tsx
 */

/**
 * IDETerminal — Terminal emulator wrapper.
 * File: src/app/components/ide/IDETerminal.tsx
 */

/**
 * XtermTerminal — xterm.js integration for full terminal emulation.
 * File: src/app/components/ide/XtermTerminal.tsx
 */

/**
 * Panel / PanelContainer / PanelContent / PanelHeader / PanelResizeHandle / PanelToolbar
 * Composable panel primitives for building custom IDE layouts.
 * Files: src/app/components/ide/Panel*.tsx
 */

/**
 * TabBar — Multi-tab editor tabs.
 * File: src/app/components/ide/TabBar.tsx
 */

/**
 * IDETopBar — IDE-specific top bar with action buttons.
 * File: src/app/components/ide/IDETopBar.tsx
 */

/**
 * IDEStatusBar — Bottom status bar (branch, language, encoding).
 * File: src/app/components/ide/IDEStatusBar.tsx
 */

/**
 * IDEViewSwitcher — Toggle between editor/terminal/preview views.
 * File: src/app/components/ide/IDEViewSwitcher.tsx
 */

/**
 * IDESettingsPanel — IDE preferences editor.
 * File: src/app/components/ide/IDESettingsPanel.tsx
 */

/**
 * GPUNodeCard — GPU node status card for the IDE dashboard.
 * File: src/app/components/ide/GPUNodeCard.tsx
 */

/**
 * DeployDialog — Deployment workflow dialog.
 * File: src/app/components/ide/DeployDialog.tsx
 */

/**
 * ShareDialog — Share session/snippet dialog.
 * File: src/app/components/ide/ShareDialog.tsx
 */

/**
 * NotificationPanel — IDE notification center.
 * File: src/app/components/ide/NotificationPanel.tsx
 */

// ═══════════════════════════════════════════════════════════════
//  4. AI Family Components
// ═══════════════════════════════════════════════════════════════
// Directory: src/app/components/ai-family/
// 8 family members: Navigator, Thinker, Prophet, Bolero, Sentinel, Master, Oracle, Creator

/**
 * FamilyHome — Family landing page showing all 8 member cards.
 * File: src/app/components/ai-family/FamilyHome.tsx
 */

/**
 * AIFamilyCenterPage — Central hub for family management.
 * File: src/app/components/ai-family/AIFamilyCenterPage.tsx
 */

/**
 * AIFamilyRouter — Route dispatcher for family sub-pages.
 * File: src/app/components/ai-family/AIFamilyRouter.tsx
 */

/**
 * FamilyChat — Text chat interface with family members.
 * File: src/app/components/ai-family/FamilyChat.tsx
 */

/**
 * FamilyPhone — Voice call interface with family members.
 * File: src/app/components/ai-family/FamilyPhone.tsx
 */

/**
 * FamilyMusic — Music player and generation studio.
 * File: src/app/components/ai-family/FamilyMusic.tsx
 */

/**
 * FamilyVoiceSystem — TTS/STT engine with per-member voice profiles.
 * File: src/app/components/ai-family/FamilyVoiceSystem.tsx
 */

/**
 * FamilyModelSettings — AI model binding and API key management.
 * File: src/app/components/ai-family/FamilyModelSettings.tsx
 */

/**
 * FamilyUISettings — UI preferences, notifications, data import/export.
 * File: src/app/components/ai-family/FamilyUISettings.tsx
 */

/**
 * FamilyEntertainment — Games and fun activities.
 * File: src/app/components/ai-family/FamilyEntertainment.tsx
 */

/**
 * FamilyLearn — Educational content and skill-building.
 * File: src/app/components/ai-family/FamilyLearn.tsx
 */

/**
 * FamilyGrowth — Growth timeline and achievement tracking.
 * File: src/app/components/ai-family/FamilyGrowth.tsx
 */

/**
 * FamilyDataHub — Family data management and analytics.
 * File: src/app/components/ai-family/FamilyDataHub.tsx
 */

/**
 * FamilyCommCenter — Communication hub for inter-family messaging.
 * File: src/app/components/ai-family/FamilyCommCenter.tsx
 */

/**
 * FamilyActivityCenter — Shared activities and events.
 * File: src/app/components/ai-family/FamilyActivityCenter.tsx
 */

/**
 * FamilyCluster — Cluster visualization of family member states.
 * File: src/app/components/ai-family/FamilyCluster.tsx
 */

/**
 * FamilyHotel — Guest/hostel management concept page.
 * File: src/app/components/ai-family/FamilyHotel.tsx
 */

/**
 * FamilyShare — Content sharing across family members.
 * File: src/app/components/ai-family/FamilyShare.tsx
 */

/**
 * CreationStudio — Creative content generation workspace.
 * File: src/app/components/ai-family/CreationStudio.tsx
 */

/**
 * AudioVisualizer / EmotionRipple / EmotionVisualizer —
 * Real-time audio and emotion visualization components.
 * Files: src/app/components/ai-family/AudioVisualizer.tsx, EmotionRipple.tsx, EmotionVisualizer.tsx
 */

/**
 * CoverFlow / VinylPhotoPlayer / LyricsGeneratorPanel —
 * Music playback UI components with album art and lyrics.
 * Files: src/app/components/ai-family/CoverFlow.tsx, VinylPhotoPlayer.tsx, LyricsGeneratorPanel.tsx
 */

/**
 * VoiceMusicControlPanel — Unified voice + music control surface.
 * File: src/app/components/ai-family/VoiceMusicControlPanel.tsx
 */

/**
 * AchievementPanel — Badges and milestones display.
 * File: src/app/components/ai-family/AchievementPanel.tsx
 */

/**
 * FamilyAnnouncer — Periodic announcement broadcaster.
 * File: src/app/components/ai-family/FamilyAnnouncer.tsx
 */

/**
 * FamilyPageHeader — Reusable page header for family sub-pages.
 * File: src/app/components/ai-family/FamilyPageHeader.tsx
 */

/**
 * ThemeSwitcher — Quick theme toggle for family pages.
 * File: src/app/components/ai-family/ThemeSwitcher.tsx
 */

/**
 * FadeIn / LazyWrap — Animation and lazy-loading wrappers.
 * Files: src/app/components/ai-family/FadeIn.tsx, LazyWrap.tsx
 */

// ═══════════════════════════════════════════════════════════════
//  5. UI Design System (shadcn/ui based)
// ═══════════════════════════════════════════════════════════════
// Directory: src/app/components/ui/
// 49 components built on Radix UI primitives with Tailwind CSS styling.
// All components support className override and forwardRef.

/**
 * Form controls: button, input, textarea, select, checkbox,
 * radio-group, switch, slider, form (react-hook-form integration),
 * input-otp, toggle, toggle-group
 */

/**
 * Overlays: dialog, sheet (side panel), drawer, alert-dialog,
 * popover, tooltip, hover-card, context-menu, dropdown-menu,
 * command (command palette), navigation-menu, menubar
 */

/**
 * Data display: card, badge, table, avatar, separator,
 * skeleton, progress, chart (recharts wrapper)
 */

/**
 * Layout: tabs, accordion, collapsible, scroll-area, resizable,
 * aspect-ratio, breadcrumb, pagination, sidebar, carousel,
 * calendar, sonner (toast notifications), label, page-header,
 * alert
 */

// This file is navigable documentation only — no runtime exports.
export {};
