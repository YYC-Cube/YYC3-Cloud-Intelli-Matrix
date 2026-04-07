import { useState, useEffect, useCallback } from 'react';
import {
  X, Palette, RotateCcw, Check,
  Type, Droplets, Eye,
  Download, Upload, Cloud, CloudOff, Share2, Copy, Link2,
  Sparkles, Paintbrush, Grid3x3, SlidersHorizontal,
  Plus, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// ─── Types ───────────────────────────────────────────

type PanelLayout = 'visual' | 'grid' | 'compact';
type Language = 'zh' | 'en';
export type PlayerSkin = 'glass' | 'neon' | 'minimal' | 'retro' | 'aurora';

export interface OKLchColor {
  l: number; // 0-1
  c: number; // 0-0.4
  h: number; // 0-360
}

export interface ThemeConfig {
  colors: Record<string, OKLchColor>;
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  radius: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: OKLchColor;
  glassOpacity: number;
  glassBlur: number;
  hueShift: number;
  saturation: number;
  brightness: number;
  playerSkin: PlayerSkin;
  // New: Module Visibility & Layout
  visibleModules: {
    sidebar: boolean;
    visualizer: boolean;
    analytics: boolean;
    lyrics: boolean;
    spectrum: boolean;
  };
  layoutPreset: 'standard' | 'focused' | 'classic';
}

interface CustomSkin {
  id: string;
  name: string;
  icon: string;
  config: Partial<ThemeConfig>;
  preview: { bg: string; accent: string; text: string };
  createdAt: string;
}

interface SkinPreset {
  id: string;
  name: Record<Language, string>;
  icon: string;
  config: Partial<ThemeConfig>;
  preview: { bg: string; accent: string; text: string };
  category?: 'default' | 'season' | 'festival';
}

// ─── Constants ───────────────────────────────────────

const STORAGE_KEY = 'dmusic_theme_config';
const CUSTOM_SKINS_KEY = 'dmusic_custom_skins';
const DEVICE_ID_KEY = 'dmusic_device_id';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8196f310`;

export const DEFAULT_CONFIG: ThemeConfig = {
  colors: {
    primary:              { l: 0.621, c: 0.180, h: 348 },
    'primary-fg':         { l: 1.000, c: 0,     h: 0 },
    secondary:            { l: 0.810, c: 0.069, h: 198 },
    'secondary-fg':       { l: 0.321, c: 0,     h: 0 },
    accent:               { l: 0.920, c: 0.080, h: 88 },
    'accent-fg':          { l: 0.321, c: 0,     h: 0 },
    background:           { l: 0.940, c: 0.020, h: 346 },
    foreground:           { l: 0.471, c: 0,     h: 0 },
    card:                 { l: 0.950, c: 0.050, h: 87 },
    'card-fg':            { l: 0.471, c: 0,     h: 0 },
    popover:              { l: 1.000, c: 0,     h: 0 },
    'popover-fg':         { l: 0.471, c: 0,     h: 0 },
    muted:                { l: 0.880, c: 0.050, h: 212 },
    'muted-fg':           { l: 0.580, c: 0,     h: 0 },
    destructive:          { l: 0.709, c: 0.170, h: 22 },
    'destructive-fg':     { l: 1.000, c: 0,     h: 0 },
    border:               { l: 0.621, c: 0.180, h: 348 },
    input:                { l: 0.919, c: 0,     h: 0 },
    ring:                 { l: 0.700, c: 0.160, h: 351 },
    'chart-1':            { l: 0.700, c: 0.160, h: 351 },
    'chart-2':            { l: 0.819, c: 0.080, h: 212 },
    'chart-3':            { l: 0.920, c: 0.080, h: 88 },
    'chart-4':            { l: 0.800, c: 0.111, h: 348 },
    'chart-5':            { l: 0.620, c: 0.190, h: 354 },
    sidebar:              { l: 0.914, c: 0.042, h: 343 },
    'sidebar-fg':         { l: 0.321, c: 0,     h: 0 },
    'sidebar-primary':    { l: 0.656, c: 0.212, h: 354 },
    'sidebar-primary-fg': { l: 1.000, c: 0,     h: 0 },
    'sidebar-accent':     { l: 0.823, c: 0.110, h: 346 },
    'sidebar-accent-fg':  { l: 0.321, c: 0,     h: 0 },
    'sidebar-border':     { l: 0.946, c: 0.033, h: 307 },
    'sidebar-ring':       { l: 0.700, c: 0.160, h: 351 },
  },
  fontSans: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontSerif: "Source Serif 4, Georgia, 'Times New Roman', serif",
  fontMono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  radius: 0.5,
  shadowY: 1,
  shadowBlur: 2,
  shadowSpread: 0,
  shadowColor: { l: 0, c: 0, h: 0 },
  glassOpacity: 0.25,
  glassBlur: 40,
  hueShift: 0,
  saturation: 100,
  brightness: 100,
  playerSkin: 'glass',
  visibleModules: {
    sidebar: true,
    visualizer: true,
    analytics: true,
    lyrics: true,
    spectrum: true,
  },
  layoutPreset: 'standard',
};

// ─── Built-in Presets — deeply differentiated visual identities ──
//
// Industry reference: Spotify (dark + green), Apple Music (spatial gradients),
// Tidal (deep blue + hi-fi), YouTube Music (warm dark), NetEase (red + ink).
// Each preset now applies distinct OKLch color tokens + unique effects.

const SKIN_PRESETS: SkinPreset[] = [
  // ── CORE THEMES ──
  { id: 'future-tech', name: { zh: '「未来科技」', en: 'Future Tech' }, icon: '🔮', category: 'default',
    config: {
      hueShift: 0, saturation: 105, brightness: 100,
      glassOpacity: 0.18, glassBlur: 45, radius: 0.5, playerSkin: 'glass',
      colors: {
        primary: { l: 0.55, c: 0.22, h: 270 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.65, c: 0.18, h: 290 }, 'accent-fg': { l: 1, c: 0, h: 0 },
        background: { l: 0.06, c: 0.03, h: 280 }, foreground: { l: 0.92, c: 0.02, h: 270 },
      },
    },
    preview: { bg: '#0d0520', accent: '#a855f7', text: '#e2d6ff' } },

  { id: 'modern-aesthetic', name: { zh: '「现代美学」', en: 'Modern Aesthetic' }, icon: '◆', category: 'default',
    config: {
      hueShift: 0, saturation: 75, brightness: 105,
      glassOpacity: 0.10, glassBlur: 50, radius: 1.0, playerSkin: 'minimal',
      colors: {
        primary: { l: 0.45, c: 0.01, h: 0 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.72, c: 0.14, h: 40 }, 'accent-fg': { l: 0.15, c: 0, h: 0 },
        background: { l: 0.08, c: 0.005, h: 250 }, foreground: { l: 0.88, c: 0.01, h: 60 },
      },
    },
    preview: { bg: '#111118', accent: '#d4a574', text: '#e8e4de' } },

  { id: 'cyberpunk', name: { zh: '「赛博朋克」', en: 'Cyberpunk' }, icon: '⚡', category: 'default',
    config: {
      hueShift: 0, saturation: 160, brightness: 105,
      glassOpacity: 0.12, glassBlur: 35, radius: 0.25, playerSkin: 'neon',
      colors: {
        primary: { l: 0.70, c: 0.20, h: 195 }, 'primary-fg': { l: 0.05, c: 0.02, h: 280 },
        accent: { l: 0.72, c: 0.24, h: 330 }, 'accent-fg': { l: 0.05, c: 0, h: 0 },
        background: { l: 0.04, c: 0.02, h: 280 }, foreground: { l: 0.90, c: 0.04, h: 195 },
      },
    },
    preview: { bg: '#05010e', accent: '#00e5ff', text: '#e0f7fa' } },

  { id: 'dark-elegance', name: { zh: '「暗黑优雅」', en: 'Dark Elegance' }, icon: '🖤', category: 'default',
    config: {
      hueShift: 0, saturation: 60, brightness: 95,
      glassOpacity: 0.08, glassBlur: 55, radius: 0.75, playerSkin: 'glass',
      colors: {
        primary: { l: 0.50, c: 0.10, h: 0 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.80, c: 0.04, h: 60 }, 'accent-fg': { l: 0.10, c: 0, h: 0 },
        background: { l: 0.05, c: 0.002, h: 0 }, foreground: { l: 0.80, c: 0.005, h: 60 },
      },
    },
    preview: { bg: '#0a0a0a', accent: '#c9b99a', text: '#d4d0c8' } },

  { id: 'ocean-depth', name: { zh: '「深海蓝境」', en: 'Ocean Depth' }, icon: '🌊', category: 'default',
    config: {
      hueShift: 0, saturation: 115, brightness: 95,
      glassOpacity: 0.20, glassBlur: 45, radius: 0.625, playerSkin: 'glass',
      colors: {
        primary: { l: 0.55, c: 0.18, h: 230 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.60, c: 0.15, h: 200 }, 'accent-fg': { l: 1, c: 0, h: 0 },
        background: { l: 0.06, c: 0.03, h: 230 }, foreground: { l: 0.88, c: 0.03, h: 215 },
      },
    },
    preview: { bg: '#040d1e', accent: '#3b82f6', text: '#bfdbfe' } },

  { id: 'cherry-ink', name: { zh: '「樱墨丹青」', en: 'Cherry Ink' }, icon: '🎋', category: 'default',
    config: {
      hueShift: 0, saturation: 100, brightness: 98,
      glassOpacity: 0.22, glassBlur: 38, radius: 0.875, playerSkin: 'retro',
      colors: {
        primary: { l: 0.52, c: 0.20, h: 15 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.68, c: 0.16, h: 350 }, 'accent-fg': { l: 1, c: 0, h: 0 },
        background: { l: 0.06, c: 0.015, h: 20 }, foreground: { l: 0.85, c: 0.03, h: 30 },
      },
    },
    preview: { bg: '#120806', accent: '#e74c3c', text: '#f5d5cd' } },

  // ── SEASONAL ──
  { id: 'spring-blossom', name: { zh: '「春日樱花」', en: 'Spring Blossom' }, icon: '🌸', category: 'season',
    config: {
      hueShift: 0, saturation: 90, brightness: 108,
      glassOpacity: 0.18, glassBlur: 42, radius: 1.0, playerSkin: 'minimal',
      colors: {
        primary: { l: 0.68, c: 0.18, h: 340 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.78, c: 0.12, h: 20 }, 'accent-fg': { l: 0.15, c: 0, h: 0 },
        background: { l: 0.07, c: 0.02, h: 330 }, foreground: { l: 0.90, c: 0.03, h: 340 },
      },
    },
    preview: { bg: '#1a0816', accent: '#f9a8d4', text: '#fdf2f8' } },

  { id: 'summer-wave', name: { zh: '「盛夏浪潮」', en: 'Summer Wave' }, icon: '🏖', category: 'season',
    config: {
      hueShift: 0, saturation: 130, brightness: 105,
      glassOpacity: 0.14, glassBlur: 48, radius: 0.75, playerSkin: 'neon',
      colors: {
        primary: { l: 0.70, c: 0.18, h: 190 }, 'primary-fg': { l: 0.05, c: 0, h: 0 },
        accent: { l: 0.75, c: 0.16, h: 170 }, 'accent-fg': { l: 0.05, c: 0, h: 0 },
        background: { l: 0.05, c: 0.025, h: 200 }, foreground: { l: 0.92, c: 0.03, h: 185 },
      },
    },
    preview: { bg: '#031a22', accent: '#22d3ee', text: '#cffafe' } },

  { id: 'autumn-maple', name: { zh: '「秋枫红叶」', en: 'Autumn Maple' }, icon: '🍂', category: 'season',
    config: {
      hueShift: 0, saturation: 110, brightness: 95,
      glassOpacity: 0.25, glassBlur: 32, radius: 0.625, playerSkin: 'retro',
      colors: {
        primary: { l: 0.58, c: 0.18, h: 30 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.62, c: 0.20, h: 50 }, 'accent-fg': { l: 0.10, c: 0, h: 0 },
        background: { l: 0.06, c: 0.02, h: 30 }, foreground: { l: 0.85, c: 0.04, h: 40 },
      },
    },
    preview: { bg: '#140a03', accent: '#ea580c', text: '#ffedd5' } },

  { id: 'winter-frost', name: { zh: '「冬日霜雪」', en: 'Winter Frost' }, icon: '❄', category: 'season',
    config: {
      hueShift: 0, saturation: 55, brightness: 112,
      glassOpacity: 0.10, glassBlur: 55, radius: 0.5, playerSkin: 'glass',
      colors: {
        primary: { l: 0.65, c: 0.04, h: 230 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.75, c: 0.03, h: 210 }, 'accent-fg': { l: 0.10, c: 0, h: 0 },
        background: { l: 0.09, c: 0.008, h: 230 }, foreground: { l: 0.88, c: 0.01, h: 220 },
      },
    },
    preview: { bg: '#111827', accent: '#94a3b8', text: '#e2e8f0' } },

  // ── FESTIVAL ──
  { id: 'lunar-new-year', name: { zh: '「新春红韵」', en: 'Lunar New Year' }, icon: '🧧', category: 'festival',
    config: {
      hueShift: 0, saturation: 135, brightness: 98,
      glassOpacity: 0.28, glassBlur: 30, radius: 0.75, playerSkin: 'retro',
      colors: {
        primary: { l: 0.55, c: 0.22, h: 25 }, 'primary-fg': { l: 1, c: 0, h: 0 },
        accent: { l: 0.65, c: 0.18, h: 50 }, 'accent-fg': { l: 0.08, c: 0, h: 0 },
        background: { l: 0.06, c: 0.04, h: 15 }, foreground: { l: 0.88, c: 0.04, h: 30 },
      },
    },
    preview: { bg: '#1a0505', accent: '#ef4444', text: '#fecaca' } },

  { id: 'aurora-night', name: { zh: '「极光之夜」', en: 'Aurora Night' }, icon: '🌌', category: 'festival',
    config: {
      hueShift: 0, saturation: 140, brightness: 92,
      glassOpacity: 0.12, glassBlur: 55, radius: 0.375, playerSkin: 'aurora',
      colors: {
        primary: { l: 0.65, c: 0.18, h: 165 }, 'primary-fg': { l: 0.05, c: 0, h: 0 },
        accent: { l: 0.70, c: 0.16, h: 145 }, 'accent-fg': { l: 0.05, c: 0, h: 0 },
        background: { l: 0.04, c: 0.025, h: 170 }, foreground: { l: 0.90, c: 0.04, h: 160 },
      },
    },
    preview: { bg: '#021a18', accent: '#2dd4bf', text: '#ccfbf1' } },
];

const COLOR_GROUPS: { title: Record<Language, string>; keys: string[] }[] = [
  { title: { zh: '基础语义', en: 'Core Semantic' }, keys: ['primary', 'primary-fg', 'secondary', 'secondary-fg', 'accent', 'accent-fg', 'background', 'foreground'] },
  { title: { zh: '组件语义', en: 'Component' }, keys: ['card', 'card-fg', 'popover', 'popover-fg', 'muted', 'muted-fg', 'destructive', 'destructive-fg', 'border', 'input', 'ring'] },
  { title: { zh: '图表颜色', en: 'Charts' }, keys: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
  { title: { zh: '侧边栏', en: 'Sidebar' }, keys: ['sidebar', 'sidebar-fg', 'sidebar-primary', 'sidebar-primary-fg', 'sidebar-accent', 'sidebar-accent-fg', 'sidebar-border', 'sidebar-ring'] },
];

const COLOR_LABELS: Record<string, Record<Language, string>> = {
  primary: { zh: '主色', en: 'Primary' }, 'primary-fg': { zh: '主前景', en: 'Primary FG' },
  secondary: { zh: '次色', en: 'Secondary' }, 'secondary-fg': { zh: '次前景', en: 'Secondary FG' },
  accent: { zh: '强调色', en: 'Accent' }, 'accent-fg': { zh: '强调前景', en: 'Accent FG' },
  background: { zh: '背景色', en: 'Background' }, foreground: { zh: '前景色', en: 'Foreground' },
  card: { zh: '卡片', en: 'Card' }, 'card-fg': { zh: '卡片前景', en: 'Card FG' },
  popover: { zh: '弹窗', en: 'Popover' }, 'popover-fg': { zh: '弹窗前景', en: 'Popover FG' },
  muted: { zh: '柔和色', en: 'Muted' }, 'muted-fg': { zh: '柔和前景', en: 'Muted FG' },
  destructive: { zh: '破坏性', en: 'Destructive' }, 'destructive-fg': { zh: '破坏前景', en: 'Destruct FG' },
  border: { zh: '边框', en: 'Border' }, input: { zh: '输入', en: 'Input' }, ring: { zh: '环形', en: 'Ring' },
  'chart-1': { zh: '图表1', en: 'Chart 1' }, 'chart-2': { zh: '图表2', en: 'Chart 2' },
  'chart-3': { zh: '图表3', en: 'Chart 3' }, 'chart-4': { zh: '图表4', en: 'Chart 4' },
  'chart-5': { zh: '图表5', en: 'Chart 5' },
  sidebar: { zh: '侧边栏', en: 'Sidebar' }, 'sidebar-fg': { zh: '侧栏前景', en: 'Sidebar FG' },
  'sidebar-primary': { zh: '侧栏主色', en: 'Side Primary' }, 'sidebar-primary-fg': { zh: '侧栏主前景', en: 'Side Pri FG' },
  'sidebar-accent': { zh: '侧栏强调', en: 'Side Accent' }, 'sidebar-accent-fg': { zh: '侧栏强调前景', en: 'Side Acc FG' },
  'sidebar-border': { zh: '侧栏边框', en: 'Side Border' }, 'sidebar-ring': { zh: '侧栏环形', en: 'Side Ring' },
};

export const PLAYER_SKINS: { id: PlayerSkin; name: Record<Language, string>; icon: string; desc: Record<Language, string> }[] = [
  { id: 'glass', name: { zh: '毛玻璃', en: 'Glass' }, icon: '🔮', desc: { zh: '经典玻璃拟态风格', en: 'Classic glassmorphism' } },
  { id: 'neon', name: { zh: '霓虹灯', en: 'Neon' }, icon: '💡', desc: { zh: '明亮发光边框效果', en: 'Bright glowing borders' } },
  { id: 'minimal', name: { zh: '极简', en: 'Minimal' }, icon: '◻', desc: { zh: '干净简约无装饰', en: 'Clean, no decorations' } },
  { id: 'retro', name: { zh: '复古', en: 'Retro' }, icon: '📻', desc: { zh: '温暖怀旧色调', en: 'Warm nostalgic tones' } },
  { id: 'aurora', name: { zh: '极光', en: 'Aurora' }, icon: '🌌', desc: { zh: '动态渐变极光效果', en: 'Dynamic aurora gradient' } },
];

// ─── Helpers ─────────────────────────────────────────

function oklchToCSS(c: OKLchColor): string {
  return `oklch(${c.l.toFixed(4)} ${c.c.toFixed(4)} ${c.h.toFixed(2)})`;
}

// Canvas-based accurate OKLch → hex conversion
const _colorCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
if (_colorCanvas) { _colorCanvas.width = 1; _colorCanvas.height = 1; }

function oklchToHex(c: OKLchColor): string {
  if (_colorCanvas) {
    const ctx = _colorCanvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      try {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = oklchToCSS(c);
        ctx.fillRect(0, 0, 1, 1);
        const px = ctx.getImageData(0, 0, 1, 1).data;
        return `#${px[0].toString(16).padStart(2, '0')}${px[1].toString(16).padStart(2, '0')}${px[2].toString(16).padStart(2, '0')}`;
      } catch (_e) { /* fallback below */ }
    }
  }
  // Fallback approximation
  const L = Math.round(c.l * 255);
  const hRad = (c.h * Math.PI) / 180;
  const sf = Math.min(c.c * 3, 1);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${clamp(L + sf * 80 * Math.cos(hRad)).toString(16).padStart(2, '0')}${clamp(L + sf * 80 * Math.cos(hRad - 2.094)).toString(16).padStart(2, '0')}${clamp(L + sf * 80 * Math.cos(hRad + 2.094)).toString(16).padStart(2, '0')}`;
}

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'dm_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function loadConfig(): ThemeConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed, colors: { ...DEFAULT_CONFIG.colors, ...(parsed.colors || {}) } };
    }
  } catch (_e) { /* ignore */ }
  return { ...DEFAULT_CONFIG };
}

function saveConfig(config: ThemeConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function loadCustomSkins(): CustomSkin[] {
  try {
    const s = localStorage.getItem(CUSTOM_SKINS_KEY);
    return s ? JSON.parse(s) : [];
  } catch (_e) { return []; }
}

function saveCustomSkins(skins: CustomSkin[]) {
  localStorage.setItem(CUSTOM_SKINS_KEY, JSON.stringify(skins));
}

// ─── Apply theme to DOM ──────────────────────────────

export function applyThemeToDOM(config: ThemeConfig) {
  const root = document.documentElement;
  const cssMap: Record<string, string> = {
    primary: '--primary', 'primary-fg': '--primary-foreground',
    secondary: '--secondary', 'secondary-fg': '--secondary-foreground',
    accent: '--accent', 'accent-fg': '--accent-foreground',
    background: '--background', foreground: '--foreground',
    card: '--card', 'card-fg': '--card-foreground',
    popover: '--popover', 'popover-fg': '--popover-foreground',
    muted: '--muted', 'muted-fg': '--muted-foreground',
    destructive: '--destructive', 'destructive-fg': '--destructive-foreground',
    border: '--border', input: '--input', ring: '--ring',
    'chart-1': '--chart-1', 'chart-2': '--chart-2', 'chart-3': '--chart-3',
    'chart-4': '--chart-4', 'chart-5': '--chart-5',
    sidebar: '--sidebar', 'sidebar-fg': '--sidebar-foreground',
    'sidebar-primary': '--sidebar-primary', 'sidebar-primary-fg': '--sidebar-primary-foreground',
    'sidebar-accent': '--sidebar-accent', 'sidebar-accent-fg': '--sidebar-accent-foreground',
    'sidebar-border': '--sidebar-border', 'sidebar-ring': '--sidebar-ring',
  };
  for (const [key, cssVar] of Object.entries(cssMap)) {
    if (config.colors[key]) {
      root.style.setProperty(cssVar, oklchToCSS(config.colors[key]));
    }
  }
  root.style.setProperty('--radius', `${config.radius}rem`);
  root.style.setProperty('--font-sans', config.fontSans);
  root.style.setProperty('--font-serif', config.fontSerif);
  root.style.setProperty('--font-mono', config.fontMono);
  root.style.setProperty('--dm-glass-opacity', config.glassOpacity.toString());
  root.style.setProperty('--dm-glass-blur', `${config.glassBlur}px`);
  root.style.setProperty('--dm-hue-shift', `${config.hueShift}deg`);
  root.style.setProperty('--dm-saturation', `${config.saturation}%`);
  root.style.setProperty('--dm-brightness', `${config.brightness}%`);
  root.style.setProperty('--dm-player-skin', config.playerSkin || 'glass');

  const playerEl = document.querySelector('[data-dm-player]') as HTMLElement;
  if (playerEl) {
    playerEl.style.filter = `hue-rotate(${config.hueShift}deg) saturate(${config.saturation / 100}) brightness(${config.brightness / 100})`;
  }
}

// ─��─ Cloud Sync ──────────────────────────────────────

async function cloudSave(config: ThemeConfig): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/theme/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ deviceId: getDeviceId(), config }),
    });
    return res.ok;
  } catch (e) {
    console.log('Cloud save failed:', e);
    return false;
  }
}

async function cloudLoad(): Promise<ThemeConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/theme/load/${getDeviceId()}`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.config || null;
  } catch (e) {
    console.log('Cloud load failed:', e);
    return null;
  }
}

async function shareSkin(skin: { name: string; config: Partial<ThemeConfig>; preview: { bg: string; accent: string; text: string } }): Promise<string | null> {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  try {
    const res = await fetch(`${API_BASE}/theme/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ shareCode: code, skin }),
    });
    return res.ok ? code : null;
  } catch (_e) { return null; }
}

async function loadSharedSkin(code: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/theme/shared/${code}`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.skin || null;
  } catch (_e) { return null; }
}

// ─── Component ───────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onPlayerSkinChange?: (skin: PlayerSkin) => void;
  onConfigChange?: (config: ThemeConfig) => void;
}

export function ThemeCustomizer({ isOpen, onClose, language, onPlayerSkinChange, onConfigChange }: Props) {
  const [config, setConfig] = useState<ThemeConfig>(loadConfig);
  const [panelLayout, setPanelLayout] = useState<PanelLayout>('visual');
  const [activeColorGroup, setActiveColorGroup] = useState(0);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(false);

  // Custom skins
  const [customSkins, setCustomSkins] = useState<CustomSkin[]>(loadCustomSkins);
  const [showNewSkinDialog, setShowNewSkinDialog] = useState(false);
  const [newSkinName, setNewSkinName] = useState('');
  const [newSkinIcon, setNewSkinIcon] = useState('🎨');
  const [editingCustomSkin, setEditingCustomSkin] = useState<string | null>(null);

  // Share
  const [shareCode, setShareCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Skin category filter
  const [skinFilter, setSkinFilter] = useState<'all' | 'default' | 'season' | 'festival' | 'custom'>('all');

  const T = {
    zh: {
      title: '主题工坊',
      subtitle: 'D-Music 设计令牌编辑器 · OKLch',
      skins: '预设皮肤',
      colors: '颜色系统',
      typography: '字体排版',
      effects: '视觉效果',
      playerSkin: '播放器皮肤',
      radius: '圆角',
      shadow: '阴影',
      glass: '毛玻璃',
      hue: '色相偏移',
      saturation: '饱和度',
      brightness: '亮度',
      opacity: '透明度',
      blur: '模糊',
      reset: '重置默认',
      save: '保存方案',
      export: '导出',
      import: '导入',
      saved: '已保存！',
      cloudSync: '云端同步',
      cloudSynced: '已同步到云端',
      cloudLoaded: '已从云端加载',
      cloudFailed: '同步失败',
      panelVisual: '视觉',
      panelGrid: '网格',
      panelCompact: '紧凑',
      sans: '无衬线',
      serif: '衬线',
      mono: '等宽',
      lightness: '亮度 L',
      chroma: '色度 C',
      hueAngle: '色相 H',
      all: '全部',
      default: '经典',
      season: '季节',
      festival: '节日',
      custom: '自定义',
      saveCurrent: '保存当前为皮肤',
      skinName: '皮肤名称',
      skinIcon: '图标',
      create: '创建',
      cancel: '取消',
      share: '分享',
      shareTitle: '分享皮肤',
      shareCode: '分享码',
      importShare: '导入分享',
      copied: '已复制！',
      importSuccess: '导入成功！',
      importFail: '导入失败',
    },
    en: {
      title: 'Theme Studio',
      subtitle: 'D-Music Design Token Editor · OKLch',
      skins: 'Skin Presets',
      colors: 'Color System',
      typography: 'Typography',
      effects: 'Visual Effects',
      playerSkin: 'Player Skin',
      radius: 'Radius',
      shadow: 'Shadow',
      glass: 'Glass',
      hue: 'Hue Shift',
      saturation: 'Saturation',
      brightness: 'Brightness',
      opacity: 'Opacity',
      blur: 'Blur',
      reset: 'Reset',
      save: 'Save',
      export: 'Export',
      import: 'Import',
      saved: 'Saved!',
      cloudSync: 'Cloud Sync',
      cloudSynced: 'Synced to cloud',
      cloudLoaded: 'Loaded from cloud',
      cloudFailed: 'Sync failed',
      panelVisual: 'Visual',
      panelGrid: 'Grid',
      panelCompact: 'Compact',
      sans: 'Sans',
      serif: 'Serif',
      mono: 'Mono',
      lightness: 'L',
      chroma: 'C',
      hueAngle: 'H',
      all: 'All',
      default: 'Classic',
      season: 'Season',
      festival: 'Festival',
      custom: 'Custom',
      saveCurrent: 'Save as Skin',
      skinName: 'Skin Name',
      skinIcon: 'Icon',
      create: 'Create',
      cancel: 'Cancel',
      share: 'Share',
      shareTitle: 'Share Skin',
      shareCode: 'Share Code',
      importShare: 'Import Shared',
      copied: 'Copied!',
      importSuccess: 'Imported!',
      importFail: 'Import failed',
    },
  }[language];

  useEffect(() => { 
    applyThemeToDOM(config); 
    if (onConfigChange) {
      // Use a timeout to avoid "Cannot update a component while rendering a different component"
      const timeout = setTimeout(() => onConfigChange(config), 0);
      return () => clearTimeout(timeout);
    }
  }, [config, onConfigChange]);

  // Try cloud load on first open
  useEffect(() => {
    if (isOpen && !cloudConnected) {
      cloudLoad().then(cloudConfig => {
        if (cloudConfig) setCloudConnected(true);
      }).catch(() => {});
    }
  }, [isOpen]);

  const flash = (msg: string) => {
    setSavedMsg(msg); setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
  };

  const updateConfig = useCallback((partial: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        ...partial,
        // Deep merge colors so preset color overrides blend with existing palette
        colors: { ...prev.colors, ...(partial.colors || {}) },
      };
      saveConfig(next);
      return next;
    });
    // Call skin change outside of the state updater
    if (partial.playerSkin && onPlayerSkinChange) {
      onPlayerSkinChange(partial.playerSkin);
    }
  }, [onPlayerSkinChange]);

  const updateColor = useCallback((key: string, color: OKLchColor) => {
    setConfig(prev => {
      const next = { ...prev, colors: { ...prev.colors, [key]: color } };
      saveConfig(next);
      return next;
    });
  }, []);

  const applySkin = (skinConfig: Partial<ThemeConfig>) => {
    updateConfig(skinConfig);
    flash(T.saved);
  };

  const resetToDefault = () => {
    setConfig({ ...DEFAULT_CONFIG });
    saveConfig(DEFAULT_CONFIG);
    applyThemeToDOM(DEFAULT_CONFIG);
    if (onPlayerSkinChange) onPlayerSkinChange('glass');
    flash(T.reset);
  };

  // Cloud sync
  const handleCloudSync = async () => {
    setCloudSyncing(true);
    const ok = await cloudSave(config);
    setCloudSyncing(false);
    setCloudConnected(ok);
    flash(ok ? T.cloudSynced : T.cloudFailed);
  };

  const handleCloudLoad = async () => {
    setCloudSyncing(true);
    const cloudConfig = await cloudLoad();
    setCloudSyncing(false);
    if (cloudConfig) {
      const merged = { ...DEFAULT_CONFIG, ...cloudConfig, colors: { ...DEFAULT_CONFIG.colors, ...(cloudConfig.colors || {}) } };
      setConfig(merged);
      saveConfig(merged);
      applyThemeToDOM(merged);
      setCloudConnected(true);
      flash(T.cloudLoaded);
    } else {
      flash(T.cloudFailed);
    }
  };

  // Custom skin management
  const handleSaveCustomSkin = () => {
    if (!newSkinName.trim()) return;
    const skin: CustomSkin = {
      id: 'custom_' + Date.now().toString(36),
      name: newSkinName.trim(),
      icon: newSkinIcon,
      config: {
        hueShift: config.hueShift,
        saturation: config.saturation,
        brightness: config.brightness,
        glassOpacity: config.glassOpacity,
        glassBlur: config.glassBlur,
        radius: config.radius,
        playerSkin: config.playerSkin,
      },
      preview: {
        bg: oklchToHex(config.colors.primary),
        accent: oklchToHex(config.colors.accent),
        text: oklchToHex(config.colors['primary-fg']),
      },
      createdAt: new Date().toISOString(),
    };
    const updated = [...customSkins, skin];
    setCustomSkins(updated);
    saveCustomSkins(updated);
    setShowNewSkinDialog(false);
    setNewSkinName('');
    flash(T.saved);
  };

  const handleDeleteCustomSkin = (id: string) => {
    const updated = customSkins.filter(s => s.id !== id);
    setCustomSkins(updated);
    saveCustomSkins(updated);
  };

  // Share skin
  const handleShareSkin = async () => {
    const code = await shareSkin({
      name: newSkinName || 'D-Music Theme',
      config: {
        hueShift: config.hueShift, saturation: config.saturation, brightness: config.brightness,
        glassOpacity: config.glassOpacity, glassBlur: config.glassBlur, radius: config.radius,
        playerSkin: config.playerSkin,
      },
      preview: {
        bg: oklchToHex(config.colors.primary),
        accent: oklchToHex(config.colors.accent),
        text: oklchToHex(config.colors['primary-fg']),
      },
    });
    if (code) {
      setShareCode(code);
      setShowShareDialog(true);
    }
  };

  const handleImportShare = async () => {
    if (!importCode.trim()) return;
    const skin = await loadSharedSkin(importCode.trim().toUpperCase());
    if (skin?.config) {
      applySkin(skin.config);
      setImportCode('');
      flash(T.importSuccess);
    } else {
      flash(T.importFail);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dmusic-theme.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const imported = JSON.parse(reader.result as string);
            const merged = { ...DEFAULT_CONFIG, ...imported, colors: { ...DEFAULT_CONFIG.colors, ...(imported.colors || {}) } };
            setConfig(merged); saveConfig(merged); applyThemeToDOM(merged);
            flash(T.saved);
          } catch (_e) { /* ignore */ }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // ─── Skin section rendering ────────────────────
  const filteredPresets = SKIN_PRESETS.filter(s => skinFilter === 'all' || s.category === skinFilter);

  const renderSkins = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{T.skins}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowNewSkinDialog(true)} className="p-1 rounded-md text-white/25 hover:text-purple-300 hover:bg-purple-500/15 transition-all" title={T.saveCurrent}>
            <Plus className="w-3 h-3" />
          </button>
          <button onClick={handleShareSkin} className="p-1 rounded-md text-white/25 hover:text-blue-300 hover:bg-blue-500/15 transition-all" title={T.share}>
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap">
        {(['all', 'default', 'season', 'festival', 'custom'] as const).map(cat => (
          <button key={cat} onClick={() => setSkinFilter(cat)}
            className={`px-2 py-0.5 rounded-md text-[8px] font-bold transition-all border ${
              skinFilter === cat
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/25'
                : 'bg-white/[0.03] text-white/25 border-white/[0.04] hover:bg-white/[0.06]'
            }`}
          >
            {T[cat as keyof typeof T] as string}
          </button>
        ))}
      </div>

      {/* Import share code */}
      <div className="flex gap-1">
        <input value={importCode} onChange={e => setImportCode(e.target.value)}
          placeholder={language === 'zh' ? '输入分享码...' : 'Enter share code...'}
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-white/60 text-[9px] focus:outline-none focus:border-purple-500/30 placeholder:text-white/15"
        />
        <button onClick={handleImportShare} className="px-2 py-1 bg-blue-500/15 text-blue-300 text-[9px] font-bold rounded-lg border border-blue-500/20 hover:bg-blue-500/25 transition-all">
          <Link2 className="w-3 h-3" />
        </button>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {skinFilter !== 'custom' && filteredPresets.map(skin => (
          <motion.button key={skin.id} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => applySkin(skin.config)}
            className="p-2 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all text-center group relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${skin.preview.bg}, ${skin.preview.bg}cc)` }}
          >
            <motion.div initial={{ x: '-100%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.6 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
            <div className="text-base mb-1">{skin.icon}</div>
            <div className="text-[8px] font-bold truncate" style={{ color: skin.preview.text }}>{skin.name[language]}</div>
            <div className="w-full h-1 rounded-full mt-1.5 overflow-hidden bg-black/20">
              <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: skin.preview.accent }} />
            </div>
          </motion.button>
        ))}
        {(skinFilter === 'all' || skinFilter === 'custom') && customSkins.map(skin => (
          <motion.button key={skin.id} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => applySkin(skin.config)}
            className="p-2 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all text-center group relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${skin.preview.bg}, ${skin.preview.bg}cc)` }}
          >
            <div className="text-base mb-1">{skin.icon}</div>
            <div className="text-[8px] font-bold truncate" style={{ color: skin.preview.text }}>{skin.name}</div>
            <div className="w-full h-1 rounded-full mt-1.5 overflow-hidden bg-black/20">
              <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: skin.preview.accent }} />
            </div>
            {/* Delete button */}
            <button onClick={e => { e.stopPropagation(); handleDeleteCustomSkin(skin.id); }}
              className="absolute top-1 right-1 p-0.5 rounded bg-red-500/30 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </motion.button>
        ))}
      </div>

      {/* New skin dialog */}
      <AnimatePresence>
        {showNewSkinDialog && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl space-y-2"
          >
            <div className="text-white/50 text-[9px] font-bold uppercase">{T.saveCurrent}</div>
            <div className="flex gap-1.5">
              <input value={newSkinIcon} onChange={e => setNewSkinIcon(e.target.value)} maxLength={2}
                className="w-10 bg-white/[0.06] border border-white/[0.1] rounded-lg px-1.5 py-1 text-center text-sm focus:outline-none" />
              <input value={newSkinName} onChange={e => setNewSkinName(e.target.value)} placeholder={T.skinName}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-white/70 text-[10px] focus:outline-none focus:border-purple-500/30 placeholder:text-white/15" />
            </div>
            <div className="flex gap-1.5">
              <button onClick={handleSaveCustomSkin} className="flex-1 py-1.5 bg-purple-500/20 text-purple-300 text-[9px] font-bold rounded-lg border border-purple-500/25 hover:bg-purple-500/30 transition-all">
                {T.create}
              </button>
              <button onClick={() => setShowNewSkinDialog(false)} className="px-3 py-1.5 bg-white/[0.04] text-white/30 text-[9px] font-bold rounded-lg border border-white/[0.06] hover:bg-white/[0.08] transition-all">
                {T.cancel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout Presets (New) */}
      <div className="space-y-2 pt-2">
        <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-1">{language === 'zh' ? '布局预设' : 'Layout Presets'}</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1">
          {[
            { id: 'standard', name: 'Standard', zh: '标准布局' },
            { id: 'focused', name: 'Focused', zh: '极致焦点' },
            { id: 'classic', name: 'Classic', zh: '经典管理' },
            { id: 'minimalist', name: 'Minimalist', zh: '极简主义' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => {
                const modules = p.id === 'focused' ? 
                  { sidebar: false, visualizer: true, analytics: false, lyrics: true, spectrum: true } :
                  p.id === 'classic' ?
                  { sidebar: true, visualizer: false, analytics: true, lyrics: true, spectrum: true } :
                  p.id === 'minimalist' ?
                  { sidebar: false, visualizer: false, analytics: false, lyrics: false, spectrum: true } :
                  { sidebar: true, visualizer: true, analytics: true, lyrics: true, spectrum: true };
                updateConfig({ layoutPreset: p.id as any, visibleModules: modules });
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
                config.layoutPreset === p.id ? 'bg-blue-500/20 border-blue-500/40 text-blue-200' : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {language === 'zh' ? p.zh : p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Module Visibility (New: AI Controlled & Manual) */}
      <div className="space-y-2 pt-2">
        <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-1">{language === 'zh' ? '组件/模块控制' : 'Modules Control'}</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(config.visibleModules).map(([key, value]) => (
            <button
              key={key}
              onClick={() => updateConfig({ visibleModules: { ...config.visibleModules, [key]: !value } })}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                value ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 shadow-[0_4px_12px_rgba(168,85,247,0.15)]' : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              <span className="capitalize">{key === 'spectrum' ? (language === 'zh' ? '频谱' : 'Spectrum') : 
                                       key === 'visualizer' ? (language === 'zh' ? '可视化' : 'Visualizer') : 
                                       key === 'sidebar' ? (language === 'zh' ? '侧边栏' : 'Sidebar') :
                                       key === 'analytics' ? (language === 'zh' ? '统计分析' : 'Analytics') :
                                       key === 'lyrics' ? (language === 'zh' ? '歌词' : 'Lyrics') : key}</span>
              <div className={`w-2 h-2 rounded-full ${value ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-white/10'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderColorEditor = (key: string) => {
    const color = config.colors[key];
    if (!color) return null;
    const label = COLOR_LABELS[key]?.[language] || key;
    return (
      <div key={key} className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border border-white/20 flex-shrink-0 shadow-inner" style={{ backgroundColor: oklchToHex(color) }} />
          <span className="text-white/60 text-[10px] font-semibold flex-1 truncate">{label}</span>
          <span className="text-white/20 text-[8px] font-mono">{oklchToCSS(color).slice(6, -1)}</span>
        </div>
        {editingColor === key && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-1 pl-7">
            <SliderRow label={T.lightness} value={color.l} min={0} max={1} step={0.01}
              onChange={v => updateColor(key, { ...color, l: v })} color="from-gray-800 to-white" />
            <SliderRow label={T.chroma} value={color.c} min={0} max={0.4} step={0.005}
              onChange={v => updateColor(key, { ...color, c: v })} color="from-gray-500 to-purple-500" />
            <SliderRow label={T.hueAngle} value={color.h} min={0} max={360} step={1}
              onChange={v => updateColor(key, { ...color, h: v })}
              color="from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
          </motion.div>
        )}
      </div>
    );
  };

  const renderColors = () => (
    <div className="space-y-3">
      <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-1">{T.colors}</h3>
      <div className="flex gap-1 flex-wrap">
        {COLOR_GROUPS.map((grp, i) => (
          <button key={i} onClick={() => setActiveColorGroup(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all border ${
              activeColorGroup === i ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-white/[0.03] text-white/30 border-white/[0.05] hover:bg-white/[0.06]'
            }`}
          >{grp.title[language]}</button>
        ))}
      </div>
      <div className="space-y-1">
        {COLOR_GROUPS[activeColorGroup]?.keys.map(key => (
          <button key={key} onClick={() => setEditingColor(editingColor === key ? null : key)} className="w-full text-left">
            {renderColorEditor(key)}
          </button>
        ))}
      </div>
    </div>
  );

  // Player skin selector
  const renderPlayerSkin = () => (
    <div className="space-y-2">
      <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-1">{T.playerSkin}</h3>
      <div className="grid grid-cols-5 gap-1">
        {PLAYER_SKINS.map(ps => (
          <motion.button key={ps.id} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
            onClick={() => updateConfig({ playerSkin: ps.id })}
            className={`p-2 rounded-xl border text-center transition-all ${
              config.playerSkin === ps.id
                ? 'bg-purple-500/20 border-purple-500/30 ring-1 ring-purple-400/30'
                : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
            }`}
          >
            <div className="text-base mb-0.5">{ps.icon}</div>
            <div className={`text-[8px] font-bold ${config.playerSkin === ps.id ? 'text-purple-300' : 'text-white/40'}`}>
              {ps.name[language]}
            </div>
          </motion.button>
        ))}
      </div>
      <div className="text-white/20 text-[9px] px-1">
        {PLAYER_SKINS.find(p => p.id === config.playerSkin)?.desc[language]}
      </div>
    </div>
  );

  const renderEffects = () => (
    <div className="space-y-3">
      <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-1">{T.effects}</h3>
      <div className="space-y-2">
        <SliderRow label={T.hue} value={config.hueShift} min={0} max={360} step={1}
          onChange={v => updateConfig({ hueShift: v })}
          color="from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" showValue suffix="°" />
        <SliderRow label={T.saturation} value={config.saturation} min={0} max={200} step={1}
          onChange={v => updateConfig({ saturation: v })} color="from-gray-400 to-purple-500" showValue suffix="%" />
        <SliderRow label={T.brightness} value={config.brightness} min={50} max={150} step={1}
          onChange={v => updateConfig({ brightness: v })} color="from-gray-800 to-white" showValue suffix="%" />
      </div>
      <div className="h-px bg-white/[0.06]" />
      <h4 className="text-white/30 text-[9px] font-bold uppercase tracking-wider px-1">{T.glass}</h4>
      <div className="space-y-2">
        <SliderRow label={T.opacity} value={config.glassOpacity} min={0} max={0.6} step={0.01}
          onChange={v => updateConfig({ glassOpacity: v })} color="from-transparent to-purple-500/50" showValue decimals={2} />
        <SliderRow label={T.blur} value={config.glassBlur} min={0} max={80} step={1}
          onChange={v => updateConfig({ glassBlur: v })} color="from-gray-400 to-blue-400" showValue suffix="px" />
      </div>
      <div className="h-px bg-white/[0.06]" />
      <h4 className="text-white/30 text-[9px] font-bold uppercase tracking-wider px-1">{T.radius}</h4>
      <SliderRow label="rem" value={config.radius} min={0} max={2} step={0.125}
        onChange={v => updateConfig({ radius: v })} color="from-gray-500 to-purple-400" showValue decimals={3} />
      <div className="h-px bg-white/[0.06]" />
      <h4 className="text-white/30 text-[9px] font-bold uppercase tracking-wider px-1">{T.shadow}</h4>
      <div className="space-y-2">
        <SliderRow label="Y" value={config.shadowY} min={0} max={20} step={1}
          onChange={v => updateConfig({ shadowY: v })} color="from-gray-600 to-gray-300" showValue suffix="px" />
        <SliderRow label={T.blur} value={config.shadowBlur} min={0} max={40} step={1}
          onChange={v => updateConfig({ shadowBlur: v })} color="from-gray-600 to-gray-300" showValue suffix="px" />
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-3">
      <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-1">{T.typography}</h3>
      {[
        { key: 'fontSans', label: T.sans, icon: Type, preview: 'Aa Bb Cc 123', val: config.fontSans },
        { key: 'fontSerif', label: T.serif, icon: Type, preview: 'Aa Bb Cc 123', val: config.fontSerif },
        { key: 'fontMono', label: T.mono, icon: Type, preview: '0x1F 0b101', val: config.fontMono },
      ].map(item => (
        <div key={item.key} className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2">
            <item.icon className="w-3.5 h-3.5 text-purple-400/60" />
            <span className="text-white/50 text-[10px] font-bold uppercase">{item.label}</span>
          </div>
          <input type="text" value={item.val}
            onChange={e => updateConfig({ [item.key]: e.target.value } as any)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-white/70 text-[10px] font-mono focus:outline-none focus:border-purple-500/30" />
          <div className="text-white/30 text-sm truncate" style={{ fontFamily: item.val }}>{item.preview}</div>
        </div>
      ))}
    </div>
  );

  // ─── 3 Panel Layouts ──────────────────────────────

  const renderVisualLayout = () => (
    <div className="flex flex-col md:flex-row gap-3 flex-1 min-h-0">
      <div className="md:w-[45%] flex-shrink-0 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Live preview */}
        <div className="rounded-xl overflow-hidden border border-white/[0.08] relative"
          style={{ filter: `hue-rotate(${config.hueShift}deg) saturate(${config.saturation / 100}) brightness(${config.brightness / 100})` }}
        >
          <div className="absolute inset-0 bg-purple-900/25 backdrop-blur-xl" style={{ opacity: config.glassOpacity * 3 }} />
          <div className="relative z-10 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center border border-white/15">
                <Sparkles className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <div className="text-white text-sm font-bold">D-Music Preview</div>
                <div className="text-white/40 text-[10px]">{language === 'zh' ? '实时预览 · 播放器皮肤:' : 'Live Preview · Skin:'} {config.playerSkin}</div>
              </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white/15 rounded-lg text-white text-[10px] font-semibold border border-white/10">Button</div>
              <div className="px-3 py-1.5 bg-purple-500/25 rounded-lg text-purple-300 text-[10px] font-semibold border border-purple-500/30">Active</div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {['primary', 'secondary', 'accent', 'destructive', 'muted', 'ring'].map(k => (
                <div key={k} className="aspect-square rounded-md border border-white/10" style={{ backgroundColor: oklchToHex(config.colors[k]) }} title={k} />
              ))}
            </div>
          </div>
        </div>
        {renderPlayerSkin()}
        {renderSkins()}
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {renderEffects()}
        {renderColors()}
        {renderTypography()}
      </div>
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="space-y-3">
        {renderSkins()}
        {renderPlayerSkin()}
        {renderEffects()}
      </div>
      <div className="space-y-3">
        {renderColors()}
        {renderTypography()}
      </div>
    </div>
  );

  const [compactTab, setCompactTab] = useState(0);
  const compactTabs = [
    { label: T.skins, icon: Sparkles, render: () => <>{renderSkins()}{renderPlayerSkin()}</> },
    { label: T.colors, icon: Palette, render: renderColors },
    { label: T.effects, icon: Droplets, render: renderEffects },
    { label: T.typography, icon: Type, render: renderTypography },
  ];

  const renderCompactLayout = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex gap-1 mb-3 flex-shrink-0">
        {compactTabs.map((tab, i) => (
          <button key={i} onClick={() => setCompactTab(i)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-bold transition-all border ${
              compactTab === i ? 'bg-purple-500/20 text-purple-300 border-purple-500/25' : 'bg-white/[0.03] text-white/30 border-white/[0.05] hover:bg-white/[0.06]'
            }`}
          >
            <tab.icon className="w-3 h-3" />{tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {compactTabs[compactTab]?.render()}
      </div>
    </div>
  );

  // ─── Main Render ───────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="absolute inset-0 bg-purple-900/30 backdrop-blur-md z-40 rounded-3xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-0 sm:inset-3 md:inset-6 bg-purple-950/30 backdrop-blur-2xl sm:rounded-2xl border-0 sm:border border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '主题定制' : 'Theme Customizer'}
          >
            {/* BG animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-60 h-60 opacity-[0.03]"
                style={{ background: 'conic-gradient(from 0deg, rgba(168,85,247,0.5), rgba(59,130,246,0.3), rgba(236,72,153,0.3), rgba(168,85,247,0.5))', borderRadius: '50%' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 p-3 md:p-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/25 to-blue-500/15 border border-white/10 flex items-center justify-center">
                  <Paintbrush className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm tracking-wide">{T.title}</h2>
                  <p className="text-white/25 text-[9px]">{T.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Layouts */}
                {[
                  { mode: 'visual' as PanelLayout, icon: Eye, label: T.panelVisual },
                  { mode: 'grid' as PanelLayout, icon: Grid3x3, label: T.panelGrid },
                  { mode: 'compact' as PanelLayout, icon: SlidersHorizontal, label: T.panelCompact },
                ].map(pl => (
                  <button key={pl.mode} onClick={() => setPanelLayout(pl.mode)}
                    className={`p-1.5 rounded-lg transition-all border ${panelLayout === pl.mode ? 'bg-purple-500/20 text-purple-300 border-purple-500/25' : 'text-white/25 border-transparent hover:text-white/50'}`}
                    title={pl.label}
                  ><pl.icon className="w-3.5 h-3.5" /></button>
                ))}
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                {/* Cloud sync */}
                <button onClick={handleCloudSync} disabled={cloudSyncing}
                  className={`p-1.5 rounded-lg transition-all ${cloudConnected ? 'text-emerald-400/70 hover:text-emerald-300' : 'text-white/25 hover:text-white/60'} ${cloudSyncing ? 'animate-pulse' : ''}`}
                  title={T.cloudSync}>
                  {cloudConnected ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={handleCloudLoad} disabled={cloudSyncing}
                  className="p-1.5 text-white/25 hover:text-blue-400/70 transition-colors" title={language === 'zh' ? '从云端加载' : 'Load from cloud'}>
                  <Download className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <button onClick={handleExport} className="p-1.5 text-white/25 hover:text-white/60 transition-colors" title={T.export}>
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleImport} className="p-1.5 text-white/25 hover:text-white/60 transition-colors" title={T.import}>
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button onClick={resetToDefault} className="p-1.5 text-white/25 hover:text-amber-400/70 transition-colors" title={T.reset}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 flex-1 p-3 md:p-4 flex flex-col min-h-0">
              {panelLayout === 'visual' && renderVisualLayout()}
              {panelLayout === 'grid' && renderGridLayout()}
              {panelLayout === 'compact' && renderCompactLayout()}
            </div>

            {/* Toast */}
            <AnimatePresence>
              {showSaved && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-full text-green-300 text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> {savedMsg || T.saved}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Share dialog */}
            <AnimatePresence>
              {showShareDialog && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center rounded-2xl"
                  onClick={() => setShowShareDialog(false)}
                >
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-purple-950/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 w-72 space-y-3"
                  >
                    <h3 className="text-white font-bold text-sm">{T.shareTitle}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-white font-mono text-lg tracking-widest text-center">
                        {shareCode}
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText(shareCode); flash(T.copied); }}
                        className="p-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/25 hover:bg-purple-500/30 transition-all">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white/30 text-[10px]">{language === 'zh' ? '将此分享码发送给好友，即可共享皮肤方案' : 'Share this code with friends to share your skin'}</p>
                    <button onClick={() => setShowShareDialog(false)}
                      className="w-full py-2 bg-white/[0.06] text-white/50 text-xs font-semibold rounded-lg hover:bg-white/[0.1] transition-all"
                    >{T.cancel}</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Slider Row ─────────────────────────────────────

function SliderRow({ label, value, min, max, step, onChange, color, showValue, suffix = '', decimals = 0 }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; color: string; showValue?: boolean; suffix?: string; decimals?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/30 text-[8px] font-bold w-8 flex-shrink-0 uppercase">{label}</span>
      <div className="flex-1 relative h-5 flex items-center group">
        <div className="absolute inset-x-0 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
          <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer" />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-white/30 shadow-md pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 6px)` }} />
      </div>
      {showValue && (
        <span className="text-white/30 text-[8px] font-mono w-10 text-right flex-shrink-0">
          {decimals ? value.toFixed(decimals) : Math.round(value)}{suffix}
        </span>
      )}
    </div>
  );
}
