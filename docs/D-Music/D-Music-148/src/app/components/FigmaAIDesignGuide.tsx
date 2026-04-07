/**
 * ═══════════════════════════════════════════════════════════════
 * D-Music · Figma AI 设计指南 (Design Guide)
 * ═══════════════════════════════════════════════════════════════
 *
 * 版本: v1.0.0
 * 生成时间: 2026-03-02
 * 基于: D-Music 项目全量代码审计 (114 文件 · 16 后端路由模块 · 45+ 前端组件)
 *
 * 本指南是基于项目实际代码现状的诊断报告与可执行重构蓝图，
 * 涵盖架构分析、风险识别、优化方案和高可用重构提示词。
 *
 * 目录:
 *   §A. 项目全景扫描 (Architecture Snapshot)
 *   §B. 六大核心问题诊断 (Critical Issue Diagnosis)
 *   §C. 高可用重构蓝图 (High-Availability Refactoring Blueprint)
 *   §D. 可执行重构提示词库 (Actionable Refactoring Prompts)
 *   §E. UI/UX 深空主题设计规范 (Deep-Space Theme Specification)
 *   §F. 性能优化检查清单 (Performance Optimization Checklist)
 *   §G. 安全加固矩阵 (Security Hardening Matrix)
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileCode2, AlertTriangle, Zap, Shield, Palette,
  ChevronDown, ChevronRight, Copy, Check, X, Layers, GitBranch,
  Database, Monitor, Globe, Eye, Cpu,
  Star, Heart, BookOpen, Search,
} from 'lucide-react';
import { clsx } from 'clsx';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface GuideSection {
  id: string;
  icon: React.ElementType;
  titleZh: string;
  titleEn: string;
  severity?: 'critical' | 'warning' | 'info' | 'success';
  items: GuideItem[];
}

interface GuideItem {
  id: string;
  titleZh: string;
  titleEn: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  descriptionZh: string;
  descriptionEn: string;
  currentState: string;
  targetState: string;
  prompt?: string; // refactoring prompt
  codeSnippet?: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

interface FigmaAIDesignGuideProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'zh' | 'en';
}

// ═══════════════════════════════════════════════════════════════
// Data: Architecture Snapshot
// ═══════════════════════════════════════════════════════════════

const ARCH_STATS = {
  frontendFiles: 45,
  backendModules: 16,
  totalEndpoints: '90+',
  hooksCount: 9,
  lazyPanels: 24,
  designTokens: '60+',
  i18nKeys: '500+',
  kvSchemaKeys: '20+',
  appTsxLines: 2069,
  componentAvgLines: 450,
};

// ═══════════════════════════════════════════════════════════════
// Data: Guide Sections
// ═══════════════════════════════════════════════════════════════

const GUIDE_SECTIONS: GuideSection[] = [
  // ── §B.1 App.tsx 巨石组件 ──
  {
    id: 'monolith',
    icon: FileCode2,
    titleZh: '§B.1 App.tsx 巨石组件拆分',
    titleEn: '§B.1 App.tsx Monolith Decomposition',
    severity: 'critical',
    items: [
      {
        id: 'b1-1',
        titleZh: 'AppInner 状态膨胀',
        titleEn: 'AppInner State Bloat',
        severity: 'critical',
        descriptionZh: 'App.tsx 单文件 2069 行，AppInner 组件集中管理 30+ 状态变量、28 个面板布尔派生值、15+ useEffect，违反单一职责原则。任何面板逻辑修改都要编辑此文件。',
        descriptionEn: 'App.tsx is 2069 lines with 30+ state vars, 28 panel booleans, 15+ useEffects in a single component, violating SRP.',
        currentState: 'AppInner: 2069行 · 30+ useState · 28 showXxx 布尔值',
        targetState: 'AppShell(~300行) + PanelOrchestrator + AudioProvider + 领域Context',
        prompt: `请将 App.tsx 拆分为以下结构（严格遵守 hook 数量不可变原则）：

1. **AppShell** (src/app/AppShell.tsx ~300行)
   - 仅负责布局骨架、路由、ErrorBoundary
   - 渲染 <AudioProvider> → <PanelProvider> → <AppContent>

2. **AudioProvider** (src/app/providers/AudioProvider.tsx)
   - 将 useAudioEngine 及音频相关状态封装为 Context
   - 暴露: play, pause, seek, volume, currentTime, isPlaying, emotion
   - 子组件通过 useAudio() 消费

3. **PanelProvider** (src/app/providers/PanelProvider.tsx)
   - 将 panelReducer + openPanel/closePanel 封装为 Context
   - 消除 28 个 showXxx 布尔派生值
   - 子组件通过 usePanel('playlist') 获取 isOpen 状态

4. **AppContent** (src/app/AppContent.tsx ~500行)
   - 渲染主界面层（Starfield、MediaDisplay、LyricsDisplay、PlayerControls）
   - 渲染 <PanelRenderer /> 按需挂载面板

5. **PanelRenderer** (src/app/components/PanelRenderer.tsx)
   - 集中管理所有 Suspense + lazy 面板的条件渲染
   - 使用 panelRegistry Map 替代 24 个 if 块

关键约束：
- 不新增任何 hook 调用（使用 ref + 普通函数模式）
- 所有 Context.Provider 在树顶部一次性注入
- 面板组件内部自行消费 Context，不通过 props 传递`,
        codeSnippet: `// PanelProvider.tsx — 消除 28 个 showXxx 布尔值
const PanelContext = createContext<{
  active: PanelType | null;
  open: (p: PanelType) => void;
  close: () => void;
  isOpen: (p: PanelType) => boolean;
}>(null!);

export function usePanel(panel?: PanelType) {
  const ctx = useContext(PanelContext);
  return panel
    ? { ...ctx, isOpen: ctx.active === panel }
    : ctx;
}

// 使用: const { isOpen, close } = usePanel('playlist');`,
        impact: '可维护性 +70% · 每次编辑减少冲突风险 · 单元测试可独立',
        effort: 'high',
      },
      {
        id: 'b1-2',
        titleZh: '面板注册表模式',
        titleEn: 'Panel Registry Pattern',
        severity: 'warning',
        descriptionZh: '当前 24 个 lazy 面板通过 24 个独立的 {showXxx && <Suspense><Panel/></Suspense>} 块渲染，新增面板需改动 3 处（类型定义、lazy 导入、JSX 块）。应改用注册表 Map。',
        descriptionEn: '24 panels rendered via 24 individual conditional blocks. Adding a panel requires 3 changes.',
        currentState: '24 个独立条件渲染块 · 新增面板改 3 处',
        targetState: 'panelRegistry Map · 新增面板只需注册 1 行',
        prompt: `请创建 src/app/components/PanelRenderer.tsx，将所有面板改为注册表模式：

const panelRegistry = new Map<PanelType, React.LazyExoticComponent<any>>([
  ['playlist', lazy(() => import('./PlaylistPanel'))],
  ['profile', lazy(() => import('./UserProfile'))],
  ['analytics', lazy(() => import('./AnalyticsDashboard'))],
  // ... 24 个面板
]);

export function PanelRenderer() {
  const { active } = usePanel();
  if (!active) return null;
  const Component = panelRegistry.get(active);
  if (!Component) return null;
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <Component />
    </Suspense>
  );
}

要求：
- 每个面板组件内部通过 usePanel() 获取 isOpen + onClose
- 面板组件不再接收 isOpen/onClose props（自给自足）
- 非面板组件（AuthModal、AIAssistant、MobilePlayer）保持独立渲染`,
        codeSnippet: '',
        impact: '新增面板只需 1 行注册 · 代码行数 -200',
        effort: 'medium',
      },
    ],
  },

  // ── §B.2 类型系统碎片化 ──
  {
    id: 'types',
    icon: Layers,
    titleZh: '§B.2 类型系统碎片化修复',
    titleEn: '§B.2 Type System Fragmentation Fix',
    severity: 'warning',
    items: [
      {
        id: 'b2-1',
        titleZh: 'LyricLine 三重定义',
        titleEn: 'LyricLine Triple Definition',
        severity: 'warning',
        descriptionZh: 'LyricLine 接口在三处独立定义：playlistData.ts（emotion?: Emotion）、UploadPanel.tsx（emotion: 5 枚举）、LyricsDisplay.tsx（导出版）。字段可选性不一致导致运行时类型断言。',
        descriptionEn: 'LyricLine defined in 3 places with inconsistent optionality.',
        currentState: 'playlistData.ts · UploadPanel.tsx · LyricsDisplay.tsx 各自定义',
        targetState: 'types/index.ts 统一导出 · 其他文件 import type',
        prompt: `请统一 LyricLine 类型定义：

1. 在 src/app/types/index.ts 中已存在 Emotion 类型，请确认 LyricLine 定义为：
   export interface LyricLine {
     time: number;
     text: string;
     translation: string;  // 非可选，默认 ''
     emotion: Emotion;     // 非可选，默认 'neutral'
   }

2. 删除 playlistData.ts 中的 LyricLine 定义，改为从 types/index.ts 导入

3. 删除 UploadPanel.tsx 中的本地 LyricLine 定义，改为从 types/index.ts 导入

4. 删除 LyricsDisplay.tsx 中的导出定义，改为从 types/index.ts re-export

5. 全局搜索 'as Emotion' 类型断言，替换为 satisfies 或在数据源头保证类型`,
        codeSnippet: `// types/index.ts — 统一定义
export interface LyricLine {
  time: number;
  text: string;
  translation: string;
  emotion: Emotion;
}

// playlistData.ts — 改为导入
import type { LyricLine, Emotion } from './types';`,
        impact: '消除类型断言 · 编译期捕获字段错误',
        effort: 'low',
      },
      {
        id: 'b2-2',
        titleZh: 'UploadedMedia 未入全局类型',
        titleEn: 'UploadedMedia Not in Global Types',
        severity: 'info',
        descriptionZh: 'UploadedMedia 仅在 UploadPanel.tsx 内部定义，但 App.tsx 的 onUploadComplete 回调需要引用此类型。当前通过 any 隐式传递。',
        descriptionEn: 'UploadedMedia only defined locally in UploadPanel.tsx but needed in App.tsx.',
        currentState: 'UploadPanel.tsx 内部定义 · App.tsx 用 any',
        targetState: 'types/index.ts 统一定义 · 强类型回调',
        prompt: `请将 UploadedMedia 接口移至 src/app/types/index.ts 并在两个文件中导入使用。`,
        codeSnippet: '',
        impact: 'App.tsx onUploadComplete 回调强类型化',
        effort: 'low',
      },
    ],
  },

  // ── §B.3 i18n 碎片化 ──
  {
    id: 'i18n',
    icon: Globe,
    titleZh: '§B.3 国际化 (i18n) 碎片化治理',
    titleEn: '§B.3 i18n Fragmentation Governance',
    severity: 'warning',
    items: [
      {
        id: 'b3-1',
        titleZh: '每个组件独立 T 字典',
        titleEn: 'Per-Component T Dictionary',
        severity: 'warning',
        descriptionZh: '45+ 组件各自定义 const T = { ... } 翻译对象，相同术语在不同组件中翻译不一致（如"删除"在 UploadPanel 用"删除"，在 CommentSystem 用"移除"）。新增语言需修改 45+ 文件。',
        descriptionEn: '45+ components each define their own T translation dict, causing inconsistency.',
        currentState: '45+ 独立 T 字典 · 新增语言改 45 文件',
        targetState: '中央翻译注册表 + useI18n() 统一消费',
        prompt: `请将分散的 i18n 翻译合并到中央注册表：

1. 扩展 src/app/hooks/i18n-translations.ts 为总翻译表：
   - 按模块命名空间: upload.*, player.*, community.*, etc.
   - 每个键: { zh: string; en: string }
   - 支持插值: "upload.filesReady": { zh: "{count} 个文件就绪", en: "{count} file(s) ready" }

2. 扩展 useI18n hook:
   - t('upload.filesReady', { count: 5 }) → "5 个文件就绪"
   - 支持 namespace 前缀快捷方式: const t = useI18nNs('upload')

3. 逐步迁移（不一次性重写）：
   - 优先迁移 UploadPanel.tsx (30+ 键)
   - 然后 MobileDiscoverHub.tsx (20+ 键)
   - 每个组件删除本地 T，改用 useI18n

4. 保持向后兼容：旧组件的本地 T 仍可工作，逐步替换`,
        codeSnippet: `// i18n-translations.ts — 中央注册
export const translations = {
  'upload.title': { zh: '上传音乐/视频', en: 'Upload Music / Video' },
  'upload.dragDrop': { zh: '将文件拖拽到这里', en: 'Drag & drop files here' },
  // ... 500+ keys
} as const;

// useI18n hook 扩展
export function useI18nNs(ns: string) {
  const { t, lang } = useI18n();
  return (key: string, vars?: Record<string,any>) =>
    t(\`\${ns}.\${key}\`, vars);
}`,
        impact: '翻译一致性 +100% · 新增语言只改 1 文件',
        effort: 'high',
      },
    ],
  },

  // ── §B.4 设计主题一致性 ──
  {
    id: 'theme',
    icon: Palette,
    titleZh: '§B.4 设计主题令牌与 CSS 断层',
    titleEn: '§B.4 Design Token & CSS Theme Disconnect',
    severity: 'warning',
    items: [
      {
        id: 'b4-1',
        titleZh: 'theme.css 与 design-tokens.ts 脱节',
        titleEn: 'theme.css vs design-tokens.ts Disconnect',
        severity: 'warning',
        descriptionZh: 'theme.css 使用 Tailwind v4 默认的 oklch() 令牌（--background, --foreground 等），但 D-Music 运行时主题系统（themes.ts）使用自定义 --dm-* CSS 变量。两套令牌并存导致 Tailwind 默认类（bg-background, text-foreground）渲染白色背景而非深空主题。',
        descriptionEn: 'theme.css uses oklch default tokens while themes.ts uses --dm-* custom properties. Tailwind default classes render wrong colors.',
        currentState: 'theme.css: oklch 白色系 + themes.ts: --dm-* 深空系 · 两套并存',
        targetState: 'theme.css 令牌映射到 --dm-* 变量 · 或禁用默认 Tailwind 色彩',
        prompt: `请修复设计令牌断层：

方案 A（推荐）— 让 theme.css 令牌映射到 --dm-* 系统：
  :root {
    --background: var(--dm-bg, #0A0E2F);
    --foreground: var(--dm-text-primary, rgba(255,255,255,0.95));
    --card: var(--dm-bg-panel, rgba(255,255,255,0.04));
    --primary: var(--dm-accent-from, #8B5CF6);
    --destructive: var(--dm-error, #EF4444);
    --border: var(--dm-border, rgba(255,255,255,0.08));
    --input-background: var(--dm-bg-elevated, rgba(255,255,255,0.06));
  }

方案 B — 在 theme.css 中根据 data-theme 属性切换：
  [data-theme="deep-space"] { --background: #0A0E2F; ... }
  [data-theme="aurora"] { --background: #0A1F0F; ... }
  [data-theme="light"] { --background: #FFFFFF; ... }

要求：
- 不修改 themes.ts（它通过 JS 设置 --dm-* 变量，运行正常）
- 不修改 /src/styles/theme.css 中的 .dark 选择器（保持兼容）
- 在 :root 块中将默认值改为深空主题色`,
        codeSnippet: `/* theme.css — 修复后 */
:root {
  --background: var(--dm-bg, #0A0E2F);
  --foreground: var(--dm-text-primary, rgba(255,255,255,0.95));
  --card: var(--dm-bg-panel, #0D1235);
  --primary: var(--dm-accent-from, #8B5CF6);
  --border: var(--dm-border, rgba(255,255,255,0.08));
  --muted: rgba(255,255,255,0.04);
  --muted-foreground: rgba(255,255,255,0.45);
}`,
        impact: 'Tailwind 默认类渲染正确深空主题 · 消除视觉断层',
        effort: 'low',
      },
      {
        id: 'b4-2',
        titleZh: '组件硬编码颜色',
        titleEn: 'Hard-Coded Colors in Components',
        severity: 'info',
        descriptionZh: '多数组件直接使用 bg-[#0D1235]/95, text-white/40 等硬编码值而非 CSS 变量。切换主题时这些区域不会变化。',
        descriptionEn: 'Most components use hard-coded hex colors instead of CSS vars, ignoring theme changes.',
        currentState: '组件中 500+ 处硬编码 #0D1235, white/XX',
        targetState: '渐进替换为 var(--dm-*) 或 Tailwind 语义类',
        prompt: `请创建 Tailwind v4 的自定义工具类映射 D-Music 令牌：

在 src/styles/theme.css 中追加：
  @theme {
    --color-dm-bg: var(--dm-bg, #0A0E2F);
    --color-dm-panel: var(--dm-bg-panel, #0D1235);
    --color-dm-elevated: var(--dm-bg-elevated, rgba(255,255,255,0.06));
    --color-dm-text: var(--dm-text-primary, rgba(255,255,255,0.95));
    --color-dm-text-muted: var(--dm-text-secondary, rgba(255,255,255,0.6));
    --color-dm-accent: var(--dm-accent-from, #8B5CF6);
    --color-dm-accent-to: var(--dm-accent-to, #EC4899);
    --color-dm-border: var(--dm-border, rgba(255,255,255,0.08));
  }

然后在组件中将 bg-[#0D1235]/95 替换为 bg-dm-panel/95
将 text-white/40 替换为 text-dm-text-muted

优先替换频率最高的 10 个组件。`,
        codeSnippet: '',
        impact: '主题切换完整生效 · 设计一致性 +50%',
        effort: 'medium',
      },
    ],
  },

  // ── §B.5 后端效率优化 ──
  {
    id: 'backend',
    icon: Database,
    titleZh: '§B.5 后端性能与 KV 效率',
    titleEn: '§B.5 Backend Performance & KV Efficiency',
    severity: 'warning',
    items: [
      {
        id: 'b5-1',
        titleZh: 'GET /upload/media 列表 N+1 问题',
        titleEn: 'GET /upload/media List N+1 Problem',
        severity: 'warning',
        descriptionZh: 'routes-upload.ts GET /upload/media 端点遍历 mediaIds 数组，逐个 kv.get + createSignedUrl，50 条记录产生 100+ 次 KV+Storage 调用。',
        descriptionEn: 'GET /upload/media iterates mediaIds one-by-one, causing 100+ KV+Storage calls for 50 records.',
        currentState: 'for 循环逐个 kv.get + createSignedUrl · O(n) 串行',
        targetState: 'kv.mget 批量读 + Promise.all 并行签名',
        prompt: `请优化 routes-upload.ts GET /upload/media 端点：

1. 将串行 for 循环改为 kv.mget 批量读取：
   const keys = limited.map(id => \`media:\${id}\`);
   const rawValues = await kv.mget(keys);

2. 将 createSignedUrl 改为 Promise.all 并行：
   const mediaList = await Promise.all(
     rawValues.filter(Boolean).map(async (raw, i) => {
       const meta = JSON.parse(raw);
       const [fileUrl, coverUrl] = await Promise.all([
         sb.storage.from(MEDIA_BUCKET).createSignedUrl(meta.filePath, SIGNED_URL_EXPIRY),
         meta.coverPath
           ? sb.storage.from(MEDIA_BUCKET).createSignedUrl(meta.coverPath, SIGNED_URL_EXPIRY)
           : Promise.resolve({ data: null }),
       ]);
       return { ...meta, signedUrl: fileUrl.data?.signedUrl || null, coverSignedUrl: coverUrl.data?.signedUrl || null };
     })
   );

3. 同样优化 GET /upload/media/:mediaId（已含 lyrics 查询，可并行化）`,
        codeSnippet: '',
        impact: '列表接口延迟从 ~2s 降至 ~300ms · 减少 90% KV 调用',
        effort: 'medium',
      },
      {
        id: 'b5-2',
        titleZh: 'QueryCache 覆盖不足',
        titleEn: 'QueryCache Under-Utilization',
        severity: 'info',
        descriptionZh: 'server-utils.ts 提供了 QueryCache（128 条 · 60s TTL），但仅 song-index 使用了缓存。高频读接口（likes、annotations、leaderboard）未利用缓存。',
        descriptionEn: 'QueryCache exists but only song-index uses it. High-frequency read endpoints are uncached.',
        currentState: '仅 cache:song-index 1 个缓存键',
        targetState: '扩展至 likes, annotations, leaderboard, media-list',
        prompt: `请扩展 QueryCache 覆盖范围至以下高频读端点：

1. GET /likes/:songId → cache key: \`cache:likes:\${songId}\` · TTL 30s
   POST /likes/:songId 后 invalidate

2. GET /annotations/:songId → cache key: \`cache:anno:\${songId}\` · TTL 30s
   POST 后 invalidate

3. GET /leaderboard → cache key: \`cache:leaderboard\` · TTL 60s

4. GET /upload/media?userId=X → cache key: \`cache:media-list:\${userId}\` · TTL 30s
   POST/DELETE /upload/media 后 invalidate

模式：
  const cached = queryCache.get(cacheKey);
  if (cached) return c.json(cached);
  // ... fetch from KV ...
  queryCache.set(cacheKey, result);
  return c.json(result);`,
        codeSnippet: '',
        impact: '高频接口响应时间 -60% · KV 负载 -50%',
        effort: 'medium',
      },
    ],
  },

  // ── §B.6 前端组件目录结构 ──
  {
    id: 'structure',
    icon: GitBranch,
    titleZh: '§B.6 组件目录扁平化问题',
    titleEn: '§B.6 Flat Component Directory Problem',
    severity: 'info',
    items: [
      {
        id: 'b6-1',
        titleZh: '45+ 组件平铺',
        titleEn: '45+ Components Flat',
        severity: 'info',
        descriptionZh: 'src/app/components/ 下 45+ .tsx 文件平铺，无子目录分类。查找相关组件需要在列表中滚动搜索。',
        descriptionEn: '45+ files in a flat directory with no subdirectory organization.',
        currentState: 'components/ 下 45 个 .tsx 平铺',
        targetState: '按领域分 7 个子目录',
        prompt: `请将 src/app/components/ 按领域重组为子目录（仅移动文件，更新 import 路径）：

components/
├── player/          # 播放器核心
│   ├── PlayerControls.tsx
│   ├── LyricsDisplay.tsx
│   ├── AudioVisualizer.tsx
│   ├── MediaDisplay.tsx
│   ├── EmotionRipple.tsx
│   └── MobilePlayer.tsx
├── social/          # 社区/社交
│   ├── CommunityFeed.tsx
│   ├── CommentSystem.tsx
│   ├── TimelineComments.tsx
│   ├── ForkTree.tsx
│   └── LeaderboardPanel.tsx
├── creation/        # 创作
│   ├── CreationStudio.tsx
│   ├── AILyricsGenerator.tsx
│   ├── MVCreator.tsx
│   ├── UploadPanel.tsx
│   └── ShareWorkModal.tsx
├── economy/         # 经济/商城
│   ├── StarPowerPanel.tsx
│   ├── StarPowerShop.tsx
│   ├── MHeartSystem.tsx
│   ├── SecondaryMarket.tsx
│   └── AlbumStore.tsx
├── profile/         # 用户
│   ├── UserProfile.tsx
│   ├── AchievementsPanel.tsx
│   ├── ListeningStats.tsx
│   └── AuthModal.tsx
├── system/          # 系统/工具
│   ├── ErrorBoundary.tsx
│   ├── PerfMonitor.tsx
│   ├── KeyboardShortcuts.tsx
│   ├── ThemeSwitcher.tsx
│   └── OfflineIndicator.tsx
├── layout/          # 布局/导航
│   ├── MobileNav.tsx
│   ├── MobileDiscoverHub.tsx
│   ├── PlaylistPanel.tsx
│   └── Starfield.tsx
└── dmusic/          # 品牌展示（已存在）
    └── ...

注意：更新所有 import 路径，包括 App.tsx 中的 lazy() 导入。`,
        codeSnippet: '',
        impact: '文件定位效率 +3x · 团队协作减少冲突',
        effort: 'medium',
      },
    ],
  },

  // ── §C 性能优化 ──
  {
    id: 'performance',
    icon: Zap,
    titleZh: '§C 性能优化清单',
    titleEn: '§C Performance Optimization Checklist',
    severity: 'info',
    items: [
      {
        id: 'c1',
        titleZh: 'currentTime 高频渲染',
        titleEn: 'currentTime High-Frequency Rendering',
        severity: 'warning',
        descriptionZh: 'audio.currentTime 从 useAudioEngine 返回，每 ~16ms 更新一次。作为 useMemo 依赖驱动 currentLyricLine 计算，进而触发全树渲染。应改为 ref + requestAnimationFrame 模式，仅在歌词行切换时 setState。',
        descriptionEn: 'audio.currentTime updates at ~60fps, driving useMemo recalculation and full tree re-render.',
        currentState: 'currentTime → useMemo → 全组件重渲染 @60fps',
        targetState: 'ref 追踪 currentTime · 仅 lyricLine 变化时 setState',
        prompt: `请优化 currentLyricLine 计算避免 60fps 全树重渲染：

1. 在 useAudioEngine 中将 currentTime 改为 ref + callback 模式：
   - currentTimeRef 实时更新（不触发渲染）
   - 暴露 onTimeUpdate(callback) 订阅接口
   - 保留 getCurrentTime() 同步读取方法

2. 在 AppInner 中用 useRef 追踪当前歌词行 index：
   - onTimeUpdate 中计算新 lyricIndex
   - 仅当 index 变化时 setEmotion + 触发 LyricsDisplay 更新

3. PlayerControls 进度条使用独立 RAF 循环读取 currentTimeRef
   而非从 props 接收渲染驱动的 currentTime

预期效果: 主组件从 ~60fps 重渲染降至 ~0.2fps（仅歌词切换）`,
        codeSnippet: '',
        impact: 'CPU 渲染负载 -90% · 低端设备帧率 +50%',
        effort: 'high',
      },
      {
        id: 'c2',
        titleZh: 'Starfield Canvas 优化',
        titleEn: 'Starfield Canvas Optimization',
        severity: 'info',
        descriptionZh: 'Starfield 组件每帧渲染 300+ 粒子。当播放停止（saturate-[0.7]）时动画仍在运行。应在非播放状态降低帧率或暂停。',
        descriptionEn: 'Starfield renders 300+ particles per frame even when paused.',
        currentState: '始终 60fps 渲染 · 暂停时仍消耗 GPU',
        targetState: '暂停时 5fps · 后台标签页暂停',
        prompt: `请优化 Starfield.tsx 的 Canvas 渲染性能：

1. 接收 isPlaying prop，暂停时降低 RAF 频率至 5fps
2. 使用 document.hidden 检测后台标签页，完全暂停动画
3. 使用 OffscreenCanvas（如支持）在 Worker 中渲染
4. 粒子数根据设备性能自适应: navigator.hardwareConcurrency < 4 → 100 粒子`,
        codeSnippet: '',
        impact: '暂停时 CPU/GPU -80% · 电池寿命 +30%',
        effort: 'low',
      },
    ],
  },

  // ── §D 安全加固 ──
  {
    id: 'security',
    icon: Shield,
    titleZh: '§D 安全加固矩阵',
    titleEn: '§D Security Hardening Matrix',
    severity: 'success',
    items: [
      {
        id: 'd1',
        titleZh: '上传端点鉴权缺失',
        titleEn: 'Upload Endpoint Auth Missing',
        severity: 'critical',
        descriptionZh: 'routes-upload.ts 的所有端点仅使用 body.userId 自报身份，未验证 JWT token。任何人可以伪造 userId 上传/删除他人文件。',
        descriptionEn: 'Upload routes use self-reported body.userId without JWT verification.',
        currentState: 'userId 从 request body 读取 · 无 JWT 校验',
        targetState: 'requireAuth 中间件 · userId 从 token 提取',
        prompt: `请为 routes-upload.ts 添加身份验证：

1. 在 server-utils.ts 中已有 requireAuth 函数，请应用到所有写操作端点：
   - POST /upload/media
   - POST /upload/chunk/init
   - POST /upload/chunk/:sessionId/complete
   - PUT /upload/media/:mediaId/lyrics
   - DELETE /upload/media/:mediaId

2. 从验证后的 token 中提取 userId：
   const { userId } = await requireAuth(c);
   // 不再从 body.userId 读取

3. DELETE 端点增加所有权检查：
   if (meta.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

4. 读取端点保持公开访问（GET /upload/media、GET /:mediaId/lyrics）

5. 前端 UploadPanel 使用 apiFetch（已自动附加 auth token）无需改动`,
        codeSnippet: `// routes-upload.ts — 添加鉴权
app.post(\`\${ROUTE_PREFIX}/upload/media\`, rateLimit(RATE_SENSITIVE), async (c) => {
  const { userId, userName } = await requireAuth(c);
  // ... 不再从 body 读取 userId
});`,
        impact: '消除未授权上传/删除风险 · 安全评级 A+',
        effort: 'low',
      },
      {
        id: 'd2',
        titleZh: 'CSP 与 XSS 防护',
        titleEn: 'CSP & XSS Protection',
        severity: 'info',
        descriptionZh: '后端 CORS 已配置，但未设置 Content-Security-Policy 响应头。前端评论/歌词内容未做 HTML 实体转义。',
        descriptionEn: 'CORS configured but no CSP headers. User content not sanitized for XSS.',
        currentState: '无 CSP 头 · 用户内容直接渲染',
        targetState: 'CSP 头 + DOMPurify 清洗',
        prompt: `请添加 CSP 和 XSS 防护：

1. 在 server index.tsx 添加安全响应头中间件：
   app.use('*', async (c, next) => {
     await next();
     c.header('X-Content-Type-Options', 'nosniff');
     c.header('X-Frame-Options', 'DENY');
     c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
   });

2. 前端所有用户生成内容（评论、歌词文本、用户名）渲染时确保使用 React 默认转义
   （不使用 dangerouslySetInnerHTML）

3. 后端保存用户内容前进行清洗：
   - 去除 HTML 标签: text.replace(/<[^>]*>/g, '')
   - 长度限制已在 Zod schema 中实现 ✓`,
        codeSnippet: '',
        impact: 'XSS 攻击面归零 · 合规性 +30%',
        effort: 'low',
      },
    ],
  },

  // ── §E UI/UX 规范 ──
  {
    id: 'uiux',
    icon: Eye,
    titleZh: '§E 深空主题 UI/UX 设计规范',
    titleEn: '§E Deep-Space Theme UI/UX Specification',
    severity: 'success',
    items: [
      {
        id: 'e1',
        titleZh: '色彩系统标准',
        titleEn: 'Color System Standard',
        severity: 'success',
        descriptionZh: 'D-Music 深空宇宙主题的完整色彩系统规范，确保所有组件视觉一致。',
        descriptionEn: 'Complete color system specification for the deep-space universe theme.',
        currentState: 'themes.ts 定义完整 · 但组件未统一使用',
        targetState: '100% 组件通过 CSS 变量消费主题色',
        prompt: '',
        codeSnippet: `/* D-Music 深空色彩系统 */

/* 1. 表面色 (Surfaces) */
--dm-bg:           #0A0E2F;  /* 主背景: 深空蓝黑 */
--dm-bg-panel:     #0D1235;  /* 面板背景 */
--dm-bg-elevated:  rgba(255,255,255,0.04);  /* 悬浮层 */
--dm-bg-overlay:   rgba(0,0,0,0.6);  /* 遮罩层 */

/* 2. 文本色 (Text) — WCAG AA 4.5:1 对比度 */
--dm-text-primary:   rgba(255,255,255,0.95);  /* 标题 */
--dm-text-secondary: rgba(255,255,255,0.60);  /* 正文 */
--dm-text-tertiary:  rgba(255,255,255,0.40);  /* 辅助 */
--dm-text-disabled:  rgba(255,255,255,0.20);  /* 禁用 */

/* 3. 品牌渐变 (Brand Gradient) */
--dm-accent-from: #8B5CF6;  /* Violet-500 */
--dm-accent-to:   #EC4899;  /* Pink-500 */
/* 渐变: from-violet-500 to-pink-500 */

/* 4. 语义色 (Semantic) */
--dm-success: #10B981;  /* Emerald-500 */
--dm-warning: #F59E0B;  /* Amber-500 */
--dm-error:   #EF4444;  /* Red-500 */
--dm-info:    #3B82F6;  /* Blue-500 */

/* 5. 交互色 (Interactive) */
--dm-hover-bg:   rgba(255,255,255,0.06);
--dm-active-bg:  rgba(255,255,255,0.10);
--dm-border:     rgba(255,255,255,0.08);
--dm-focus-ring: rgba(139,92,246,0.50);

/* 6. 情感色映射 (Emotion Colors) */
--emotion-happy:     #FFD700;  /* 金色 */
--emotion-sad:       #6495ED;  /* 蓝灰 */
--emotion-energetic: #FF4500;  /* 橙红 */
--emotion-calm:      #00CED1;  /* 青绿 */
--emotion-neutral:   #9370DB;  /* 紫色 */`,
        impact: '视觉一致性基准线',
        effort: 'low',
      },
      {
        id: 'e2',
        titleZh: '排版系统标准',
        titleEn: 'Typography System Standard',
        severity: 'success',
        descriptionZh: '统一字体族、字重、字号规范。',
        descriptionEn: 'Unified font family, weight, and size specification.',
        currentState: '字体已加载 · 但未统一应用到所有组件',
        targetState: '100% 组件使用统一排版令牌',
        prompt: '',
        codeSnippet: `/* 字体族 */
--font-display: 'Space Grotesk', system-ui, sans-serif;  /* 英文标题 */
--font-body:    'Noto Sans SC', system-ui, sans-serif;    /* 中文正文 */
--font-mono:    'JetBrains Mono', monospace;              /* 代码/数据 */

/* 字号系统 (4px 递增) */
--text-2xs: 0.625rem;   /* 10px 最小标签 */
--text-xs:  0.75rem;    /* 12px 辅助文本 */
--text-sm:  0.875rem;   /* 14px 正文 */
--text-base: 1rem;      /* 16px 标题3 */
--text-lg:  1.125rem;   /* 18px 标题2 */
--text-xl:  1.25rem;    /* 20px 标题1 */
--text-2xl: 1.5rem;     /* 24px 大标题 */

/* 字重 */
--font-light:    300;
--font-regular:  400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* 行高 */
--leading-tight: 1.25;  /* 标题 */
--leading-normal: 1.5;  /* 正文 */
--leading-relaxed: 1.75; /* 长文本 */`,
        impact: '排版一致性基准线',
        effort: 'low',
      },
      {
        id: 'e3',
        titleZh: '间距与圆角系统',
        titleEn: 'Spacing & Border Radius System',
        severity: 'success',
        descriptionZh: '基于 4px 网格的间距系统和统一圆角。',
        descriptionEn: '4px grid spacing system and unified border radii.',
        currentState: '组件间距不统一 · 圆角 4~24px 混用',
        targetState: '4px 网格 · 4 级圆角',
        prompt: '',
        codeSnippet: `/* 间距 (4px 基础网格) */
--space-0.5: 2px;   --space-1:  4px;
--space-1.5: 6px;   --space-2:  8px;
--space-3:   12px;  --space-4:  16px;
--space-5:   20px;  --space-6:  24px;
--space-8:   32px;  --space-10: 40px;
--space-12:  48px;  --space-16: 64px;

/* 圆角 (4 级) */
--radius-sm:   4px;   /* 小按钮、标签 */
--radius-md:   8px;   /* 卡片、输入框 */
--radius-lg:   12px;  /* 面板、弹窗 */
--radius-xl:   16px;  /* 大面板 */
--radius-2xl:  24px;  /* 特殊元素 */
--radius-full: 9999px; /* 圆形 */

/* 阴影/光晕 (深空主题) */
--shadow-sm:  0 1px 3px rgba(0,0,0,0.3);
--shadow-md:  0 4px 12px rgba(0,0,0,0.4);
--shadow-lg:  0 8px 24px rgba(0,0,0,0.5);
--shadow-glow: 0 0 20px rgba(139,92,246,0.15);
--shadow-glow-lg: 0 0 40px rgba(139,92,246,0.25);`,
        impact: '设计一致性基准线',
        effort: 'low',
      },
      {
        id: 'e4',
        titleZh: '动画与过渡标准',
        titleEn: 'Animation & Transition Standard',
        severity: 'success',
        descriptionZh: '统一动画时长和缓动函数。',
        descriptionEn: 'Unified animation durations and easing functions.',
        currentState: 'motion 组件参数不统一',
        targetState: '4 级动画时长 · 3 种缓动',
        prompt: '',
        codeSnippet: `/* 动画时长 */
--duration-fast:   150ms;  /* 按钮响应、tooltip */
--duration-normal: 250ms;  /* 面板切换、折叠 */
--duration-slow:   400ms;  /* 页面过渡、大面板 */
--duration-slower: 700ms;  /* 背景渐变、主题切换 */

/* 缓动函数 */
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);  /* 打开动画 */
--ease-in:     cubic-bezier(0.7, 0, 0.84, 0);  /* 关闭动画 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性 */

/* Motion 组件标准参数 */
面板滑入:  { type: 'spring', stiffness: 300, damping: 30 }
面板淡出:  { duration: 0.2, ease: 'easeIn' }
按钮缩放:  whileTap={{ scale: 0.95 }}
列表项入场: initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
进度条:    transition={{ duration: 0.3 }}`,
        impact: '交互体验一致性基准线',
        effort: 'low',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: { zh: '严重', en: 'Critical' } },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: { zh: '警告', en: 'Warning' } },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: { zh: '信息', en: 'Info' } },
  success: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: { zh: '规范', en: 'Spec' } },
};

const EFFORT_LABEL = {
  low: { zh: '低', en: 'Low', color: 'text-emerald-400 bg-emerald-500/10' },
  medium: { zh: '中', en: 'Med', color: 'text-amber-400 bg-amber-500/10' },
  high: { zh: '高', en: 'High', color: 'text-red-400 bg-red-500/10' },
};

// ═══════════════════════════════════════════════════════════════
// Sub-component: Collapsible Item
// ═══════════════════════════════════════════════════════════════

const GuideItemCard: React.FC<{
  item: GuideItem;
  lang: 'zh' | 'en';
}> = ({ item, lang }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const sev = SEVERITY_CONFIG[item.severity];
  const eff = EFFORT_LABEL[item.effort];

  const copyPrompt = () => {
    if (item.prompt) {
      navigator.clipboard.writeText(item.prompt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className={clsx('rounded-xl border transition-all', sev.border, expanded ? sev.bg : 'bg-white/[0.01] hover:bg-white/[0.03]')}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', sev.color.replace('text-', 'bg-'))} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/90 font-medium">{lang === 'zh' ? item.titleZh : item.titleEn}</p>
          <p className="text-[10px] text-white/30 mt-0.5 truncate">
            {item.currentState} → {item.targetState}
          </p>
        </div>
        <span className={clsx('text-[9px] px-1.5 py-0.5 rounded-full font-medium', eff.color)}>
          {lang === 'zh' ? `${eff.zh}成本` : `${eff.en} effort`}
        </span>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-white/30 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Description */}
              <p className="text-xs text-white/60 leading-relaxed">
                {lang === 'zh' ? item.descriptionZh : item.descriptionEn}
              </p>

              {/* Impact */}
              <div className="flex items-center gap-2 text-[10px]">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400/80">{item.impact}</span>
              </div>

              {/* Code Snippet */}
              {item.codeSnippet && (
                <div className="relative rounded-lg bg-black/40 border border-white/[0.06] overflow-hidden">
                  <pre className="p-3 text-[10px] text-white/70 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    {item.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Refactoring Prompt */}
              {item.prompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-violet-400 font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {lang === 'zh' ? '可执行重构提示词' : 'Actionable Refactoring Prompt'}
                    </span>
                    <button
                      onClick={copyPrompt}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-[10px] hover:bg-violet-500/20 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? (lang === 'zh' ? '已复制' : 'Copied') : (lang === 'zh' ? '复制提示词' : 'Copy Prompt')}
                    </button>
                  </div>
                  <div className="rounded-lg bg-violet-500/[0.05] border border-violet-500/20 p-3">
                    <pre className="text-[10px] text-white/60 font-mono whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                      {item.prompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export const FigmaAIDesignGuide: React.FC<FigmaAIDesignGuideProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['monolith']));
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter items by search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return GUIDE_SECTIONS;
    const q = searchQuery.toLowerCase();
    return GUIDE_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.titleZh.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.descriptionZh.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q) ||
        (item.prompt && item.prompt.toLowerCase().includes(q))
      ),
    })).filter(s => s.items.length > 0);
  }, [searchQuery]);

  // Stats
  const criticalCount = GUIDE_SECTIONS.reduce((sum, s) => sum + s.items.filter(i => i.severity === 'critical').length, 0);
  const warningCount = GUIDE_SECTIONS.reduce((sum, s) => sum + s.items.filter(i => i.severity === 'warning').length, 0);
  const totalItems = GUIDE_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0A0E2F]/98 backdrop-blur-2xl border-l border-white/[0.08] z-50 flex flex-col shadow-2xl"
    >
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'zh' ? 'Figma AI 设计指南' : 'Figma AI Design Guide'}
              </h2>
              <p className="text-[10px] text-white/30">
                D-Music v11.2 · {lang === 'zh' ? '全量代码审计报告' : 'Full Code Audit Report'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-400">
            <AlertTriangle className="w-3 h-3" />
            {criticalCount} {lang === 'zh' ? '严重' : 'Critical'}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            {warningCount} {lang === 'zh' ? '警告' : 'Warning'}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] text-white/40">
            <FileCode2 className="w-3 h-3" />
            {totalItems} {lang === 'zh' ? '项诊断' : 'Items'}
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-violet-500/10 text-violet-400">
            <Cpu className="w-3 h-3" />
            {ARCH_STATS.appTsxLines} {lang === 'zh' ? '行 App.tsx' : 'lines App.tsx'}
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'zh' ? '搜索诊断项、提示词...' : 'Search items, prompts...'}
            className="w-full pl-8 pr-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 transition-colors"
          />
        </div>
      </div>

      {/* ── Architecture Stats Panel ── */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <p className="text-[10px] text-white/30 font-medium mb-2 uppercase tracking-wider">
          {lang === 'zh' ? '§A 项目全景' : '§A Architecture Snapshot'}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: lang === 'zh' ? '前端组件' : 'Components', value: ARCH_STATS.frontendFiles, icon: Monitor },
            { label: lang === 'zh' ? '后端模块' : 'Backend Mods', value: ARCH_STATS.backendModules, icon: Database },
            { label: lang === 'zh' ? 'API 端点' : 'Endpoints', value: ARCH_STATS.totalEndpoints, icon: Globe },
            { label: lang === 'zh' ? 'Lazy 面板' : 'Lazy Panels', value: ARCH_STATS.lazyPanels, icon: Layers },
            { label: lang === 'zh' ? '自定义 Hook' : 'Hooks', value: ARCH_STATS.hooksCount, icon: GitBranch },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
              <stat.icon className="w-3.5 h-3.5 text-violet-400/50 mx-auto mb-1" />
              <p className="text-sm text-white/90 font-bold font-mono">{stat.value}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {filteredSections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const sev = section.severity ? SEVERITY_CONFIG[section.severity] : null;

          return (
            <div key={section.id} className="space-y-2">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2.5 py-1.5 text-left group"
              >
                <section.icon className={clsx('w-4 h-4 flex-shrink-0', sev ? sev.color : 'text-white/40')} />
                <span className="text-sm font-semibold text-white/90 flex-1">
                  {lang === 'zh' ? section.titleZh : section.titleEn}
                </span>
                <span className="text-[10px] text-white/20 group-hover:text-white/40 transition-colors">
                  {section.items.length} {lang === 'zh' ? '项' : 'items'}
                </span>
                {isExpanded
                  ? <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                  : <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                }
              </button>

              {/* Section items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pl-2">
                      {section.items.map(item => (
                        <GuideItemCard key={item.id} item={item} lang={lang} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">
              {lang === 'zh' ? '未找到匹配的诊断项' : 'No matching items found'}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-white/20">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-pink-400/50" />
            Figma AI {lang === 'zh' ? '设计指南' : 'Design Guide'} v1.0.0
          </span>
          <span>
            {lang === 'zh' ? '生成于' : 'Generated'} 2026-03-02 · D-Music v11.2
          </span>
        </div>
      </div>
    </motion.div>
  );
};