import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Plus, SquarePen, Trash2, Languages, Sparkles, Shield, Brain, ChartPie, Scale, Heart, Target, Mic, Menu, X, Search, Minimize2, User, ChevronRight, Layers, MessageSquare, Paintbrush, Film, MonitorPlay, Cloud, RefreshCw, Star, Trophy, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { AIAssistant } from './AIAssistant';
import { SpaceTimeCall } from './SpaceTimeCall';
import { AudioVisualizer } from './AudioVisualizer';
import { StandardsPanel, type SystemMetrics } from './StandardsPanel';
import { SmartRecommendation, type PlayRecord } from './SmartRecommendation';
import { SmartAnalytics, type PlayEvent } from './SmartAnalytics';
import { NationalStandards } from './NationalStandards';
import { IncentiveSystem } from './IncentiveSystem';
import { UsabilityPlan } from './UsabilityPlan';
import { PracticeRoom } from './PracticeRoom';
import { SoundWaveBar } from './SoundWaveBar';
import { VoiceInput } from './VoiceInput';
import { ProfilePanel } from './ProfilePanel';
import { MiniPlayer, type MiniForm } from './MiniPlayer';
import { ThemeCustomizer, type PlayerSkin, loadConfig as loadThemeConfig, applyThemeToDOM } from './ThemeCustomizer';
import { MVPlayer } from './MVPlayer';
import { FloatingCD } from './FloatingCD';
import { AICreator } from './AICreator';
import { ParticleBackground } from './ParticleBackground';
import { HoloGrid } from './HoloGrid';
import { NeuralStatusBar } from './NeuralStatusBar';
import { MobileNavBar, PWAInstallPrompt, OfflineIndicator } from './MobileNavBar';
import { DeepSearch } from './DeepSearch';
import { StarPowerBoard } from './StarPowerBoard';
import { HotkeyOverlay, useHotkeyOverlay } from './HotkeyOverlay';

// Brand images
import dmLogoChrome from "figma:asset/f2b2841ba62d4df9e84f3d8b59fa48efd0972022.png";
import dmLogoRed from "figma:asset/cdb6898d69cc4e5ec95856624e6740a30b4ed169.png";
import dmLogoDi from "figma:asset/1d776e4d931e39ab6811569ef7332bc442b04dee.png";
import dmLogoGold from "figma:asset/f48b90018686a90dc84317ba5c2d07bb6da83e88.png";
// 董小姐 photos for vinyl carousel
import dongPhoto1 from "figma:asset/c1675ee4bab688004627342eb1a3d0a4cb8c1b51.png";
import dongPhoto2 from "figma:asset/c680e8f2600348aa39fe570e11957539b013854f.png";
import dongPhoto3 from "figma:asset/908c67cbeb6a3a51f6064dc5dc615d8486f56e62.png";

export interface Track {
  id: number;
  title: string;
  file?: File;
  url: string;
  albumId: string | null;
  isVideo?: boolean;
  videoUrl?: string;
  isPersistent?: boolean;
}

export interface MusicPlayerProps {
  mode: 'management' | 'immersive' | 'mini';
}

const DEVICE_ID_KEY = 'dmusic_device_id';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8196f310`;

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'dm_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov'];
const isVideoFile = (name: string) => VIDEO_EXTENSIONS.some(ext => name.toLowerCase().endsWith(ext));

export interface Album {
  id: string;
  name: string;
  trackIds: number[];
}

type Language = 'zh' | 'en';
type ViewMode = 'full' | 'mini' | 'immersive';

const TRANSLATIONS = {
  en: {
    library: "Library",
    createAlbum: "Create Album",
    rename: "Rename",
    delete: "Delete",
    addSong: "Add Song",
    addMV: "Add MV",
    deleteSelected: "Delete",
    songsCount: "songs",
    noSongs: "No songs in this",
    uploadPrompt: 'Click "Add Song" to upload local music or video files',
    enterAlbumName: "Enter album name:",
    confirmDeleteAlbum: "Are you sure you want to delete this album?",
    album: "album",
    library_context: "library",
    playing: "Now Playing"
  },
  zh: {
    library: "「音乐库」",
    createAlbum: "「新建专辑」",
    rename: "「重命名」",
    delete: "「删除」",
    addSong: "「添加歌曲」",
    addMV: "「添加 MV」",
    deleteSelected: "「删除选中」",
    songsCount: "「首歌曲」",
    noSongs: "「暂无歌曲」",
    uploadPrompt: '「点击「添加歌曲」上传本地音乐」',
    enterAlbumName: "「请输入「专辑名称」：」",
    confirmDeleteAlbum: "「确定要删除此「专辑」吗？」",
    album: "「专辑」",
    library_context: "「音乐库」",
    playing: "「正在播放」"
  }
};

// Enhanced animated button component
function GlowButton({ children, onClick, className = '', disabled = false, size = 'md', 'aria-label': ariaLabel }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}) {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.08, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${sizeClasses[size]} ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!disabled && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
      {children}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════
// D-MUSIC BRAND LOGO — uses official D★Music image assets
// ═══════════════════════════════════════════════════════

function DMusicLogo3D({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cfg = {
    sm:  { text: 'text-xs', subText: 'text-[5px]', gap: 'gap-1.5', offset: '0.5px' },
    md:  { text: 'text-sm', subText: 'text-[6px]', gap: 'gap-1.5', offset: '0.8px' },
    lg:  { text: 'text-xl', subText: 'text-[8px]', gap: 'gap-2', offset: '1.2px' },
  }[size];

  return (
    <span className={`inline-flex items-center ${cfg.gap} select-none`}>
      {/* Chrome D-Music logo badge */}
      <span className="relative flex items-center justify-center flex-shrink-0">
        <img
          src={dmLogoChrome}
          alt="D-Music"
          className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg object-cover shadow-[0_0_12px_rgba(139,92,246,0.15)]`}
        />
      </span>
      {/* 3D stereo text stack */}
      <span className="relative inline-flex flex-col leading-none min-w-0">
        <span className="relative">
          <span aria-hidden="true" className={`absolute top-0 left-0 ${cfg.text} font-extrabold tracking-tight text-red-500/20 blur-[0.3px]`}
            style={{ transform: `translate(-${cfg.offset}, ${cfg.offset})` }}>D-Music</span>
          <span aria-hidden="true" className={`absolute top-0 left-0 ${cfg.text} font-extrabold tracking-tight text-cyan-400/20 blur-[0.3px]`}
            style={{ transform: `translate(${cfg.offset}, -${cfg.offset})` }}>D-Music</span>
          <span className={`relative ${cfg.text} font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent`}
            style={{ textShadow: 'none' }}>D-Music</span>
        </span>
        <span className={`flex items-center ${cfg.subText} font-mono font-semibold tracking-[0.25em] text-purple-400/30 uppercase mt-0.5`}>
          <span className="w-0.5 h-0.5 rounded-full bg-purple-500/40 mr-1" />
          Neural
          <span className="text-white/10 mx-0.5">·</span>
          Library
        </span>
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// VINYL CD CAROUSEL — 董小姐 auto-rotating disc showcase
// ═══════════════════════════════════════════════════════

const DONG_PHOTOS = [dongPhoto1, dongPhoto2, dongPhoto3];
const DONG_LABELS = ['「董小姐·录音室」', '「董小姐·钢琴曲」', '「董小姐·创作中」'];

function VinylCarousel({ language }: { language: 'zh' | 'en' }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % DONG_PHOTOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Vinyl disc */}
      <div className="relative w-52 h-52 md:w-64 md:h-64">
        {/* Outer glow */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 30px 6px rgba(139,92,246,0.08), 0 0 60px 12px rgba(59,130,246,0.04)',
              '0 0 50px 12px rgba(139,92,246,0.15), 0 0 80px 20px rgba(59,130,246,0.08)',
              '0 0 30px 6px rgba(139,92,246,0.08), 0 0 60px 12px rgba(59,130,246,0.04)',
            ]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full"
        />

        {/* Spinning disc body */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Vinyl groove rings */}
          {[20, 28, 36, 44, 52, 60, 68, 76, 84].map((pct, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/[0.03]"
              style={{ inset: `${(100 - pct) / 2}%` }}
            />
          ))}

          {/* Iridescent sheen */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.15) 10%, transparent 20%, rgba(59,130,246,0.1) 35%, transparent 50%, rgba(236,72,153,0.08) 65%, transparent 80%, rgba(168,85,247,0.12) 90%, transparent 100%)',
            }}
          />

          {/* Center photo area */}
          <div className="absolute inset-[22%] rounded-full overflow-hidden border-2 border-white/10 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIdx}
                src={DONG_PHOTOS[activeIdx]}
                alt="董小姐"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Inner ring overlay */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/30" />
          </div>

          {/* Center spindle */}
          <div className="absolute inset-[46%] rounded-full bg-black/80 border border-white/15 z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          </div>
        </motion.div>

        {/* Orbiting particles */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            animate={{ rotate: [deg, deg + 360] }}
            transition={{ repeat: Infinity, duration: 8 + i * 2, ease: 'linear' }}
            className="absolute inset-[-10px]"
            style={{ transformOrigin: 'center' }}
          >
            <div className={`absolute w-1.5 h-1.5 rounded-full ${
              i === 0 ? 'bg-purple-400/50' : i === 1 ? 'bg-blue-400/40' : 'bg-pink-400/30'
            } shadow-[0_0_6px_currentColor]`} style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
          </motion.div>
        ))}
      </div>

      {/* Label & dots */}
      <div className="flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-white/30 text-[11px] font-semibold tracking-wide"
          >
            {language === 'zh' ? DONG_LABELS[activeIdx] : `Miss Dong · ${activeIdx + 1}`}
          </motion.p>
        </AnimatePresence>
        {/* Carousel indicator dots */}
        <div className="flex items-center gap-2">
          {DONG_PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-5 h-1.5 bg-purple-500/60'
                  : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FEATURE HUB: Full-overlay tech command center
// ═══════════════════════════════════════════════════════
function FeatureHub({ isOpen, onClose, onOpenPanel, language }: {
  isOpen: boolean; onClose: () => void;
  onOpenPanel: (panel: string) => void; language: Language;
}) {
  const categories = [
    {
      title: language === 'zh' ? '「🤖 AI 与创作」' : '🤖 AI & Creation',
      items: [
        { panel: 'ai', icon: Sparkles, label: language === 'zh' ? '「Muse AI 助手」' : 'Muse AI', desc: language === 'zh' ? '「智能对话·词曲工坊·分析」' : 'Chat · Workshop · Analysis', color: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/20', text: 'text-purple-300', glow: 'shadow-purple-500/10' },
        { panel: 'voice', icon: Search, label: language === 'zh' ? '「语音搜索」' : 'Voice Search', desc: language === 'zh' ? '「语音识别·听歌识曲」' : 'Voice · Song Recognition', color: 'from-green-500/20 to-emerald-500/10', border: 'border-green-500/20', text: 'text-green-300', glow: 'shadow-green-500/10' },
        { panel: 'deepsearch', icon: Search, label: language === 'zh' ? '「深度检索」' : 'Deep Search', desc: language === 'zh' ? '「多维搜索·威尔逊评分」' : 'Multi-dim · Wilson Score', color: 'from-cyan-500/20 to-teal-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', glow: 'shadow-cyan-500/10' },
      ]
    },
    {
      title: language === 'zh' ? '「📊 数据与洞察」' : '📊 Data & Insights',
      items: [
        { panel: 'recommend', icon: Brain, label: language === 'zh' ? '「智能推荐」' : 'Smart Rec', desc: language === 'zh' ? '「个性化推荐引擎」' : 'Personalized Recommendations', color: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/20', text: 'text-pink-300', glow: 'shadow-pink-500/10' },
        { panel: 'analytics', icon: ChartPie, label: language === 'zh' ? '「数据分析」' : 'Analytics', desc: language === 'zh' ? '「播放统计·行为分析」' : 'Play Stats · Behavior', color: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', glow: 'shadow-cyan-500/10' },
        { panel: 'incentive', icon: Heart, label: language === 'zh' ? '「激励系统」' : 'Incentives', desc: language === 'zh' ? '「M❤️值·星力·成就」' : 'M❤️ · Stars · Achievements', color: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/20', text: 'text-rose-300', glow: 'shadow-rose-500/10' },
        { panel: 'starpower', icon: Trophy, label: language === 'zh' ? '「星力排行榜」' : 'Star Rankings', desc: language === 'zh' ? '「Wilson评分·星力经济·VIP」' : 'Wilson Score · Star Economy · VIP', color: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/20', text: 'text-amber-300', glow: 'shadow-amber-500/10' },
      ]
    },
    {
      title: language === 'zh' ? '「🛡 标准与合规」' : '🛡 Standards & Compliance',
      items: [
        { panel: 'standards', icon: Shield, label: language === 'zh' ? '「规范中心」' : 'Standards', desc: language === 'zh' ? '「系统规范·质量监控」' : 'System Standards · QA', color: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/20', text: 'text-emerald-300', glow: 'shadow-emerald-500/10' },
        { panel: 'national', icon: Scale, label: language === 'zh' ? '「国标体系」' : 'National Std', desc: language === 'zh' ? '「国标·行标·国际标准」' : 'GB · Industry · ISO', color: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/20', text: 'text-amber-300', glow: 'shadow-amber-500/10' },
        { panel: 'usability', icon: Target, label: language === 'zh' ? '「可用性方案」' : 'Usability', desc: language === 'zh' ? '「用户体验·可访问性」' : 'UX · Accessibility', color: 'from-teal-500/20 to-cyan-500/10', border: 'border-teal-500/20', text: 'text-teal-300', glow: 'shadow-teal-500/10' },
      ]
    },
    {
      title: language === 'zh' ? '「🎵 音乐与社交」' : '🎵 Music & Social',
      items: [
        { panel: 'spacetime', icon: MessageSquare, label: language === 'zh' ? '「时空喊话」' : 'SpaceTime', desc: language === 'zh' ? '「时间胶囊·跨时空互动」' : 'Time Capsule · Interaction', color: 'from-blue-500/20 to-indigo-500/10', border: 'border-blue-500/20', text: 'text-blue-300', glow: 'shadow-blue-500/10' },
        { panel: 'practice', icon: Mic, label: language === 'zh' ? '「练习室」' : 'Practice', desc: language === 'zh' ? '「演练·3D可视化」' : 'Rehearsal · 3D Visual', color: 'from-lime-500/20 to-green-500/10', border: 'border-lime-500/20', text: 'text-lime-300', glow: 'shadow-lime-500/10' },
        { panel: 'mv', icon: MonitorPlay, label: language === 'zh' ? '「MV 播放器」' : 'MV Player', desc: language === 'zh' ? '「音乐视频·全屏·画中画」' : 'Music Video · Fullscreen · PiP', color: 'from-indigo-500/20 to-violet-500/10', border: 'border-indigo-500/20', text: 'text-indigo-300', glow: 'shadow-indigo-500/10' },
      ]
    },
    {
      title: language === 'zh' ? '「🎨 个性化定制」' : '🎨 Customization',
      items: [
        { panel: 'theme', icon: Paintbrush, label: language === 'zh' ? '「主题工坊」' : 'Theme Studio', desc: language === 'zh' ? '「皮肤·色彩·字体·特效」' : 'Skins · Colors · Fonts · FX', color: 'from-fuchsia-500/20 to-purple-500/10', border: 'border-fuchsia-500/20', text: 'text-fuchsia-300', glow: 'shadow-fuchsia-500/10' },
        { panel: 'profile', icon: User, label: language === 'zh' ? '「个人资料」' : 'Profile', desc: language === 'zh' ? '「头像·偏好·数据」' : 'Avatar · Preferences · Stats', color: 'from-sky-500/20 to-blue-500/10', border: 'border-sky-500/20', text: 'text-sky-300', glow: 'shadow-sky-500/10' },
        { panel: 'hotkeys', icon: Keyboard, label: language === 'zh' ? '「快捷键」' : 'Shortcuts', desc: language === 'zh' ? '「键盘热键速查表」' : 'Keyboard Shortcut Guide', color: 'from-slate-500/20 to-gray-500/10', border: 'border-slate-500/20', text: 'text-slate-300', glow: 'shadow-slate-500/10' },
      ]
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#06050e]/70 backdrop-blur-xl z-40 rounded-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-0 sm:inset-3 md:inset-6 bg-[#0a0816]/90 backdrop-blur-2xl sm:rounded-2xl border-0 sm:border border-purple-500/10 z-50 flex flex-col overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.08)]"
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '功能中心' : 'Feature Hub'}
          >
            {/* Animated grid background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <motion.div
                animate={{ x: [0, 30], y: [0, 30] }}
                transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                className="absolute inset-[-30px] opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}
              />
              {/* Corner glow accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[50px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 md:p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-base md:text-lg tracking-wide flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  {language === 'zh' ? '「功能中心」' : 'Feature Hub'}
                </h2>
                <p className="text-white/30 text-[10px] md:text-xs mt-0.5">{language === 'zh' ? '「D-Music 六化融合智能平台」' : 'D-Music Integrated Smart Platform'}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all" aria-label={language === 'zh' ? '关闭' : 'Close'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto p-3 md:p-5 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full">
              {categories.map((cat, ci) => (
                <div key={ci}>
                  <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{cat.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {cat.items.map((item, ii) => (
                      <motion.button
                        key={item.panel}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ci * 0.08 + ii * 0.04 }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { onOpenPanel(item.panel); onClose(); }}
                        className={`text-left p-3 md:p-4 rounded-xl bg-gradient-to-br ${item.color} border ${item.border} hover:shadow-lg ${item.glow} transition-all group relative overflow-hidden`}
                      >
                        {/* Shimmer line */}
                        <motion.div
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '200%' }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none"
                        />
                        <div className="flex items-start gap-3 relative z-10">
                          <div className={`w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors`}>
                            <item.icon className={`w-4 h-4 ${item.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-bold ${item.text} truncate`}>{item.label}</div>
                            <div className="text-white/25 text-[9px] mt-0.5 leading-tight">{item.desc}</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors flex-shrink-0 mt-0.5" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer status bar */}
            <div className="relative z-10 px-4 py-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/25 text-[9px] font-mono">{language === 'zh' ? '「系统运行中」' : 'System Online'}</span>
                </div>
              </div>
              <div className="text-white/15 text-[9px] font-mono">D-Music v2.0 · {language === 'zh' ? '「���化一体」' : '6-in-1 Integration'}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN MUSIC PLAYER COMPONENT
// ═══════════════════════════════════════════════════════

export function MusicPlayer({ mode }: MusicPlayerProps) {
  const [language, setLanguage] = useState<Language>('zh');
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(new Set());
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editingAlbumName, setEditingAlbumName] = useState('');
  
  // View mode synced with prop
  const [viewMode, setViewMode] = useState<ViewMode>(mode === 'mini' ? 'mini' : 'full');
  
  // Sync viewMode with mode prop
  useEffect(() => {
    if (mode === 'mini') setViewMode('mini');
    else if (mode === 'immersive') setViewMode('immersive');
    else setViewMode('full');
  }, [mode]);

  // Listen for track addition from other components (AI Creator, etc)
  useEffect(() => {
    const handleAdd = (e: any) => {
      fileInputRef.current?.click();
    };
    window.addEventListener('dm-add-track-trigger', handleAdd);
    return () => window.removeEventListener('dm-add-track-trigger', handleAdd);
  }, []);
  const [miniForm, setMiniForm] = useState<MiniForm>('capsule');

  // Theme configuration state
  const [themeConfig, setThemeConfig] = useState(loadThemeConfig);

  // Listen for AI Global Commands (MuseAICore → MusicPlayer routing)
  useEffect(() => {
    const handleCommand = (e: any) => {
      const { action } = e.detail;
      switch (action) {
        // ─── 面板打开指令 ───
        case 'open-ai': openPanel('ai'); break;
        case 'open-creator': openPanel('creator'); break;
        case 'open-spacetime': openPanel('spacetime'); break;
        case 'open-standards': openPanel('standards'); break;
        case 'open-recommend': openPanel('recommend'); break;
        case 'open-analytics': openPanel('analytics'); break;
        case 'open-practice': openPanel('practice'); break;
        case 'open-theme': openPanel('theme'); break;
        case 'open-deepsearch': openPanel('deepsearch'); break;
        case 'open-starpower': openPanel('starpower'); break;
        case 'open-national': openPanel('national'); break;
        case 'open-incentive': openPanel('incentive'); break;
        case 'open-usability': openPanel('usability'); break;
        case 'open-profile': openPanel('profile'); break;
        case 'open-mv': openPanel('mv'); break;
        case 'open-hub': openPanel('hub'); break;
        case 'open-hotkeys': openPanel('hotkeys'); break;
        // ─── 播放控制指令 ───
        case 'player-play': setIsPlaying(true); break;
        case 'player-pause': setIsPlaying(false); break;
        case 'player-next': handleNextRef.current(); break;
        case 'player-prev': handlePreviousRef.current(); break;
        // ─── 模式切换指令 ───
        case 'mode-mini': setViewMode('mini'); break;
        case 'mode-full': setViewMode('full'); break;
        case 'mode-immersive': setViewMode('immersive'); break;
      }
    };
    window.addEventListener('dm-command', handleCommand);
    return () => window.removeEventListener('dm-command', handleCommand);
  }, []);

  // Update local theme config state
  const handleConfigChange = useCallback((newCfg: any) => {
    setThemeConfig(prev => {
      if (prev === newCfg) return prev;
      if (JSON.stringify(prev) === JSON.stringify(newCfg)) return prev;
      return newCfg;
    });
    setPlayerSkin(prev => prev === newCfg.playerSkin ? prev : newCfg.playerSkin);
  }, []);

  // Persistence states
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isIDBReady, setIsIDBReady] = useState(false);

  // Mobile states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileVolumeOpen, setIsMobileVolumeOpen] = useState(false);
  
  // Mobile nav & PWA states
  const [mobileActiveTab, setMobileActiveTab] = useState<'library' | 'hub' | 'play' | 'ai' | 'profile'>('library');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pwaPromptEvent, setPwaPromptEvent] = useState<any>(null);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  
  // Panel states
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSpaceTimeOpen, setIsSpaceTimeOpen] = useState(false);
  const [isStandardsOpen, setIsStandardsOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isNationalStdOpen, setIsNationalStdOpen] = useState(false);
  const [isIncentiveOpen, setIsIncentiveOpen] = useState(false);
  const [isUsabilityOpen, setIsUsabilityOpen] = useState(false);
  const [isPracticeRoomOpen, setIsPracticeRoomOpen] = useState(false);
  const [isVoiceInputOpen, setIsVoiceInputOpen] = useState(false);
  const [isFeatureHubOpen, setIsFeatureHubOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMVOpen, setIsMVOpen] = useState(false);
  const [isDeepSearchOpen, setIsDeepSearchOpen] = useState(false);
  const [isStarPowerOpen, setIsStarPowerOpen] = useState(false);
  const { isHotkeyOpen, setIsHotkeyOpen } = useHotkeyOverlay();
  const [playerSkin, setPlayerSkin] = useState<PlayerSkin>(() => {
    try { const c = loadThemeConfig(); return c.playerSkin || 'glass'; } catch (_e) { return 'glass'; }
  });
  
  // Play tracking for smart features
  const [playRecords, setPlayRecords] = useState<PlayRecord[]>([]);
  const [playEvents, setPlayEvents] = useState<PlayEvent[]>([]);
  const playStartTimeRef = useRef<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevVolumeRef = useRef(0.7);

  // Stable refs for handleNext/handlePrevious — avoids stale closures in event handlers (fixes exhaustive-deps)
  const handleNextRef = useRef<() => void>(() => {});
  const handlePreviousRef = useRef<() => void>(() => {});

  // Track whether any panel is open (for Escape handler optimization)
  const anyPanelOpen = isAIOpen || isCreatorOpen || isSpaceTimeOpen || isStandardsOpen ||
    isRecommendOpen || isAnalyticsOpen || isNationalStdOpen || isIncentiveOpen ||
    isUsabilityOpen || isPracticeRoomOpen || isVoiceInputOpen || isFeatureHubOpen ||
    isProfileOpen || isThemeOpen || isMVOpen || isDeepSearchOpen || isStarPowerOpen;
  const anyPanelOpenRef = useRef(anyPanelOpen);
  anyPanelOpenRef.current = anyPanelOpen;

  const t = TRANSLATIONS[language];

  // Responsive detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // System metrics (simulated real-time)
  const [systemMetrics] = useState<SystemMetrics>({
    uptime: 99.95,
    apiResponseTime: 87,
    activeErrors: 0,
    totalRequests: 12847,
    cacheHitRate: 94.2,
    memoryUsage: 62,
    contentQualityScore: 92,
    securityScore: 96
  });

  // PWA Injection
  useEffect(() => {
    if (!document.querySelector('meta[name="theme-color"]')) {
      const metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      metaTheme.content = '#7c3aed';
      document.head.appendChild(metaTheme);
    }
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaVP = document.createElement('meta');
      metaVP.name = 'viewport';
      metaVP.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(metaVP);
    }
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const m1 = document.createElement('meta');
      m1.name = 'apple-mobile-web-app-capable';
      m1.content = 'yes';
      document.head.appendChild(m1);
      const m2 = document.createElement('meta');
      m2.name = 'apple-mobile-web-app-status-bar-style';
      m2.content = 'black-translucent';
      document.head.appendChild(m2);
    }
    if (!document.querySelector('link[rel="manifest"]')) {
      const linkManifest = document.createElement('link');
      linkManifest.rel = 'manifest';
      linkManifest.href = '/manifest.json';
      document.head.appendChild(linkManifest);
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .catch(error => console.log('SW registration failed:', error));
    }
  }, []);

  // PWA install prompt & offline detection
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaPromptEvent(e);
      const dismissed = localStorage.getItem('dmusic_pwa_dismissed');
      if (!dismissed) setShowPWAPrompt(true);
    };
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePWAInstall = async () => {
    if (pwaPromptEvent) {
      pwaPromptEvent.prompt();
      const result = await pwaPromptEvent.userChoice;
      if (result.outcome === 'accepted') setShowPWAPrompt(false);
      setPwaPromptEvent(null);
    }
  };

  const handlePWADismiss = () => {
    setShowPWAPrompt(false);
    localStorage.setItem('dmusic_pwa_dismissed', 'true');
  };

  // Restore saved theme on mount
  useEffect(() => {
    try {
      const cfg = loadThemeConfig();
      applyThemeToDOM(cfg);
    } catch (_e) { /* ignore */ }
  }, []);

  // Get tracks for current view
  const displayTracks = selectedAlbumId === null 
    ? allTracks 
    : allTracks.filter(track => albums.find(a => a.id === selectedAlbumId)?.trackIds.includes(track.id));

  const currentTrack = currentTrackId !== null ? allTracks.find(t => t.id === currentTrackId) : null;

  // Track play behavior
  const recordPlayStart = useCallback(() => {
    playStartTimeRef.current = Date.now();
  }, []);

  const recordPlayEnd = useCallback((trackId: number) => {
    if (playStartTimeRef.current === 0) return;
    const listenDuration = (Date.now() - playStartTimeRef.current) / 1000;
    const completionRate = duration > 0 ? Math.min(listenDuration / duration, 1) : 0.5;
    
    setPlayRecords(prev => {
      const existing = prev.find(r => r.trackId === trackId);
      if (existing) {
        return prev.map(r => r.trackId === trackId ? {
          ...r, playCount: r.playCount + 1, totalDuration: r.totalDuration + listenDuration,
          lastPlayed: Date.now(), completionRate: (r.completionRate * r.playCount + completionRate) / (r.playCount + 1)
        } : r);
      }
      return [...prev, { trackId, playCount: 1, totalDuration: listenDuration, lastPlayed: Date.now(), completionRate }];
    });
    setPlayEvents(prev => [...prev, { trackId, timestamp: Date.now(), duration: listenDuration }]);
    playStartTimeRef.current = 0;
  }, [duration]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
        recordPlayStart();
      } else {
        audioRef.current.pause();
        if (currentTrackId !== null) recordPlayEnd(currentTrackId);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
        recordPlayStart();
      }
    }
  }, [currentTrackId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Load local data on mount
  useEffect(() => {
    const loadData = async () => {
      // 1. Load albums from localStorage
      const savedAlbums = localStorage.getItem('dmusic_albums');
      if (savedAlbums) setAlbums(JSON.parse(savedAlbums));

      // 2. Load records and events
      const savedRecords = localStorage.getItem('dmusic_play_records');
      if (savedRecords) setPlayRecords(JSON.parse(savedRecords));
      
      const savedEvents = localStorage.getItem('dmusic_play_events');
      if (savedEvents) setPlayEvents(JSON.parse(savedEvents));

      // 3. Load tracks metadata and files from IDB
      try {
        const metadata = localStorage.getItem('dmusic_tracks_metadata');
        if (metadata) {
          const parsedMetadata = JSON.parse(metadata) as Track[];
          const tracksWithBlobs: Track[] = [];
          
          for (const t of parsedMetadata) {
            const blob = await idbGet(`track_file_${t.id}`);
            if (blob) {
              const url = URL.createObjectURL(blob);
              tracksWithBlobs.push({
                ...t,
                url,
                file: new File([blob], t.title, { type: t.isVideo ? 'video/mp4' : 'audio/mpeg' }),
                videoUrl: t.isVideo ? url : undefined,
                isPersistent: true
              });
            } else {
              tracksWithBlobs.push(t); // Missing blob
            }
          }
          setAllTracks(tracksWithBlobs);
          if (tracksWithBlobs.length > 0) setCurrentTrackId(tracksWithBlobs[0].id);
        }
      } catch (e) {
        console.error('Failed to load from IDB:', e);
      }
      setIsIDBReady(true);
    };
    loadData();
  }, []);

  // Save to localStorage whenever critical data changes
  useEffect(() => {
    if (isIDBReady) {
      localStorage.setItem('dmusic_albums', JSON.stringify(albums));
      localStorage.setItem('dmusic_play_records', JSON.stringify(playRecords));
      localStorage.setItem('dmusic_play_events', JSON.stringify(playEvents));
      
      const metadata = allTracks.map(t => ({
        id: t.id,
        title: t.title,
        albumId: t.albumId,
        isVideo: t.isVideo,
        url: '', // Don't save blob URLs
      }));
      localStorage.setItem('dmusic_tracks_metadata', JSON.stringify(metadata));
    }
  }, [albums, allTracks, playRecords, playEvents, isIDBReady]);

  const syncToCloud = async () => {
    setIsCloudSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/library/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          tracks: allTracks.map(t => ({ id: t.id, title: t.title, albumId: t.albumId, isVideo: t.isVideo })),
          albums
        }),
      });
      if (res.ok) {
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Cloud sync failed:', e);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    setIsCloudSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/library/load/${getDeviceId()}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.albums) {
          setAlbums(data.albums);
          // Note: Tracks from cloud won't have the audio/video blobs 
          // unless they are already in local IDB. We just sync the structure.
        }
      }
    } catch (e) {
      console.error('Cloud load failed:', e);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newTracks: Track[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = file.type.startsWith('video/') || isVideoFile(file.name);
        if (file.type.startsWith('audio/') || isVid) {
          const trackId = Date.now() + i;
          const objUrl = URL.createObjectURL(file);
          
          // Store in IDB
          await idbSet(`track_file_${trackId}`, file);
          
          newTracks.push({
            id: trackId,
            title: file.name.replace(/\.\w+$/, ''),
            file,
            url: objUrl,
            albumId: selectedAlbumId,
            isVideo: isVid,
            videoUrl: isVid ? objUrl : undefined,
            isPersistent: true
          });
        }
      }
      setAllTracks(prev => [...prev, ...newTracks]);
      if (selectedAlbumId !== null) {
        setAlbums(prev => prev.map(album => album.id === selectedAlbumId ? { ...album, trackIds: [...album.trackIds, ...newTracks.map(t => t.id)] } : album));
      }
      if (currentTrackId === null && newTracks.length > 0) setCurrentTrackId(newTracks[0].id);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveSelectedTracks = async () => {
    if (selectedTrackIds.size === 0) return;
    
    // Remove from IDB
    for (const id of selectedTrackIds) {
      await idbDel(`track_file_${id}`);
    }

    setAllTracks(prev => prev.filter(track => !selectedTrackIds.has(track.id)));
    setAlbums(prev => prev.map(album => ({ ...album, trackIds: album.trackIds.filter(id => !selectedTrackIds.has(id)) })));
    setSelectedTrackIds(new Set());
    if (currentTrackId !== null && selectedTrackIds.has(currentTrackId)) { setCurrentTrackId(null); setIsPlaying(false); }
  };

  const handleToggleTrackSelection = (trackId: number) => {
    setSelectedTrackIds(prev => { const n = new Set(prev); n.has(trackId) ? n.delete(trackId) : n.add(trackId); return n; });
  };

  const handleCreateAlbum = () => {
    const albumName = prompt(t.enterAlbumName);
    if (albumName && albumName.trim()) {
      setAlbums(prev => [...prev, { id: Date.now().toString(), name: albumName.trim(), trackIds: [] }]);
    }
  };

  const handleCreatePlaylistFromAI = (name: string, trackIds: number[]) => {
    const newAlbum: Album = { id: Date.now().toString(), name, trackIds };
    setAlbums(prev => [...prev, newAlbum]);
    setSelectedAlbumId(newAlbum.id);
  };

  const handleRenameAlbum = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    setEditingAlbumId(albumId);
    setEditingAlbumName(album.name);
  };

  const handleSaveAlbumName = () => {
    if (editingAlbumId && editingAlbumName.trim()) {
      setAlbums(prev => prev.map(album => album.id === editingAlbumId ? { ...album, name: editingAlbumName.trim() } : album));
    }
    setEditingAlbumId(null); setEditingAlbumName('');
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (confirm(t.confirmDeleteAlbum)) {
      setAlbums(prev => prev.filter(album => album.id !== albumId));
      if (selectedAlbumId === albumId) setSelectedAlbumId(null);
    }
  };

  const handlePrevious = () => {
    if (currentTrackId !== null) recordPlayEnd(currentTrackId);
    const currentIndex = displayTracks.findIndex(t => t.id === currentTrackId);
    if (currentIndex > 0) setCurrentTrackId(displayTracks[currentIndex - 1].id);
    else if (displayTracks.length > 0) setCurrentTrackId(displayTracks[displayTracks.length - 1].id);
  };

  const handleNext = () => {
    if (currentTrackId !== null) recordPlayEnd(currentTrackId);
    const currentIndex = displayTracks.findIndex(t => t.id === currentTrackId);
    if (currentIndex < displayTracks.length - 1) setCurrentTrackId(displayTracks[currentIndex + 1].id);
    else if (displayTracks.length > 0) setCurrentTrackId(displayTracks[0].id);
  };

  // Keep refs in sync so event handlers always call the latest version
  handleNextRef.current = handleNext;
  handlePreviousRef.current = handlePrevious;

  const handleTrackEnd = () => { if (currentTrackId !== null) recordPlayEnd(currentTrackId); handleNext(); };

  const handleTrackSelect = (trackId: number) => {
    if (currentTrackId !== null && currentTrackId !== trackId) recordPlayEnd(currentTrackId);
    setCurrentTrackId(trackId); setIsPlaying(true); setIsMobileSidebarOpen(false);
  };

  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const newTime = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width)) * duration;
      audioRef.current.currentTime = newTime; setCurrentTime(newTime);
    }
  };

  const handleSeekPercent = (percent: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = Math.max(0, Math.min(1, percent)) * duration;
      audioRef.current.currentTime = newTime; setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setVolume(Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width))); setIsMuted(false);
  };

  const handleVolumeSet = (v: number) => { setVolume(Math.max(0, Math.min(1, v))); setIsMuted(false); };

  const toggleMute = () => {
    if (isMuted) { setIsMuted(false); setVolume(prevVolumeRef.current); }
    else { prevVolumeRef.current = volume; setIsMuted(true); }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    return `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'zh' ? 'en' : 'zh');

  const closeAllPanels = () => {
    setIsAIOpen(false); setIsCreatorOpen(false); setIsSpaceTimeOpen(false); setIsStandardsOpen(false);
    setIsRecommendOpen(false); setIsAnalyticsOpen(false); setIsNationalStdOpen(false);
    setIsIncentiveOpen(false); setIsUsabilityOpen(false); setIsPracticeRoomOpen(false);
    setIsVoiceInputOpen(false); setIsFeatureHubOpen(false); setIsProfileOpen(false); setIsThemeOpen(false); setIsMVOpen(false);
    setIsDeepSearchOpen(false); setIsStarPowerOpen(false);
  };

  const openPanel = (panel: string) => {
    closeAllPanels();
    switch (panel) {
      case 'ai': setIsAIOpen(true); break;
      case 'creator': setIsCreatorOpen(true); break;
      case 'spacetime': setIsSpaceTimeOpen(true); break;
      case 'standards': setIsStandardsOpen(true); break;
      case 'recommend': setIsRecommendOpen(true); break;
      case 'analytics': setIsAnalyticsOpen(true); break;
      case 'national': setIsNationalStdOpen(true); break;
      case 'incentive': setIsIncentiveOpen(true); break;
      case 'usability': setIsUsabilityOpen(true); break;
      case 'practice': setIsPracticeRoomOpen(true); break;
      case 'voice': setIsVoiceInputOpen(true); break;
      case 'profile': setIsProfileOpen(true); break;
      case 'hub': setIsFeatureHubOpen(true); break;
      case 'theme': setIsThemeOpen(true); break;
      case 'mv': setIsMVOpen(true); break;
      case 'deepsearch': setIsDeepSearchOpen(true); break;
      case 'starpower': setIsStarPowerOpen(true); break;
      case 'hotkeys': setIsHotkeyOpen(true); break;
    }
  };

  // Mobile tab navigation handler (must be after openPanel & currentTrack)
  const handleMobileTabChange = (tab: 'library' | 'hub' | 'play' | 'ai' | 'profile') => {
    setMobileActiveTab(tab);
    switch (tab) {
      case 'library': setIsMobileSidebarOpen(true); break;
      case 'hub': openPanel('hub'); break;
      case 'play': if (currentTrack) setViewMode('immersive'); break;
      case 'ai': openPanel('ai'); break;
      case 'profile': openPanel('profile'); break;
    }
  };

  // ═══ GLOBAL HOTKEY SYSTEM ═══
  // Space=播放/暂停  ←→=切歌  ↑↓=音量  M=静音  Ctrl+K=AI  Ctrl+F=搜索  Esc=关闭面板
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = (e.target as HTMLElement)?.isContentEditable;
      const isInputFocused = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable;

      // Ctrl/Cmd+K → 「AI 助手」
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openPanel('ai');
        return;
      }
      // Ctrl/Cmd+F → 「深度搜索」
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        openPanel('deepsearch');
        return;
      }
      // 以下热键仅在非输入聚焦时生效
      if (isInputFocused) return;

      // Space → 全局播放/暂停
      if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
      // ← → 切换上一首/下一首
      if (e.key === 'ArrowLeft' && !e.shiftKey) {
        e.preventDefault();
        handlePreviousRef.current();
      }
      if (e.key === 'ArrowRight' && !e.shiftKey) {
        e.preventDefault();
        handleNextRef.current();
      }
      // ↑ ↓ 音量调节（步进5%）
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolume(prev => Math.min(1, prev + 0.05));
        setIsMuted(false);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolume(prev => Math.max(0, prev - 0.05));
      }
      // M → 静音切换
      if (e.key === 'm' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleMute();
      }
      // Escape → 关闭所有面板
      if (e.key === 'Escape' && anyPanelOpenRef.current) {
        e.preventDefault();
        closeAllPanels();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalPlays = playRecords.reduce((sum, r) => sum + r.playCount, 0);
  const totalMinutes = Math.floor(playRecords.reduce((sum, r) => sum + r.totalDuration, 0) / 60);

  // ═══ IMMERSIVE MODE RENDERING ══���
  if (viewMode === 'immersive') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full bg-[#06050e] md:rounded-3xl overflow-hidden relative flex flex-col items-center justify-center p-6 md:p-8"
        // Mobile: swipe down to close
        drag={isMobile ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_e, info) => { if (info.offset.y > 100) setViewMode('full'); }}
      >
        <ParticleBackground active={true} />
        <HoloGrid intensity={0.4} className="z-0" />
        <div className="absolute inset-0 z-[1] opacity-30">
          <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />
        </div>
        
        {/* Ambient gradient */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_60%)]" />
        </div>

        {/* Mobile: back button + pull-down indicator */}
        <div className="absolute top-3 left-0 right-0 flex justify-center z-20 md:hidden safe-top">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setViewMode('full')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            aria-label={language === 'zh' ? '返回' : 'Back'}
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/40 rotate-180" />
            <span className="text-[10px] text-white/40 font-semibold tracking-wide">{language === 'zh' ? '「返回」' : 'Back'}</span>
          </motion.button>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-2xl w-full">
          {/* Rotating disc with holographic ring */}
          <div className="relative">
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-44 h-44 md:w-56 md:h-56 rounded-full relative group"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={isPlaying ? {
                  boxShadow: [
                    '0 0 30px 8px rgba(139,92,246,0.15), 0 0 60px 16px rgba(59,130,246,0.08)',
                    '0 0 50px 16px rgba(139,92,246,0.25), 0 0 80px 24px rgba(59,130,246,0.12)',
                    '0 0 30px 8px rgba(139,92,246,0.15), 0 0 60px 16px rgba(59,130,246,0.08)',
                  ]
                } : {}}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 rounded-full"
              />
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/15" />
              <div className="absolute inset-2 rounded-full border border-white/[0.06]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/8 via-transparent to-blue-500/8" />
              <div className="absolute inset-8 rounded-full bg-[#0a0816] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                <img
                  src={dmLogoGold}
                  alt="D-Music"
                  className="w-full h-full object-contain scale-110 opacity-30"
                  style={{ filter: 'brightness(1.5) contrast(1.2)' }}
                />
              </div>
              {/* Groove lines */}
              <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-6 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-16 rounded-full border border-white/[0.03]" />
            </motion.div>

            {/* Orbiting dots */}
            {isPlaying && [0, 120, 240].map((deg, i) => (
              <motion.div
                key={i}
                animate={{ rotate: [deg, deg + 360] }}
                transition={{ repeat: Infinity, duration: 6 + i, ease: 'linear' }}
                className="absolute inset-[-12px]"
                style={{ transformOrigin: 'center' }}
              >
                <div className={`absolute w-1.5 h-1.5 rounded-full ${
                  i === 0 ? 'bg-purple-400/60' : i === 1 ? 'bg-blue-400/50' : 'bg-fuchsia-400/40'
                } shadow-[0_0_8px_currentColor]`}
                  style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
                />
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{currentTrack?.title || 'D-Music'}</h1>
            <p className="text-purple-400/40 uppercase tracking-[0.4em] text-[9px] font-semibold font-mono">
              {isPlaying ? 'Now Playing' : 'Paused'}
            </p>
          </div>

          <div className="w-full max-w-sm space-y-3 px-4 md:px-0">
             <div className="flex items-center justify-between text-white/30 text-[10px] md:text-[11px] font-mono tabular-nums">
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
             </div>
             {/* Touch-friendly progress bar — taller hit area on mobile */}
             <div className="relative py-2 -my-2 cursor-pointer" onClick={handleSeek} onTouchStart={handleSeek}>
               <div className="h-1 md:h-1 w-full bg-white/[0.06] rounded-full relative overflow-hidden group-hover:h-1.5 transition-all">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500 rounded-full" style={{ width: `${duration > 0 ? (currentTime/duration)*100 : 0}%` }}>
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
               </div>
             </div>
          </div>

          {/* Mobile volume slider */}
          <div className="w-full max-w-[200px] flex items-center gap-3 md:hidden px-4">
            <button onClick={toggleMute} className="text-white/40 active:text-white p-1">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden" onClick={handleVolumeChange} onTouchStart={handleVolumeChange}>
              <div className="h-full bg-white/50 rounded-full" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-10 md:gap-8">
            <motion.button whileTap={{ scale: 0.85 }} onClick={handlePrevious} aria-label={language === 'zh' ? '上一首' : 'Previous'} className="text-white/30 hover:text-white/80 active:text-white transition-colors p-2"><SkipBack className="w-7 h-7" /></motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? (language === 'zh' ? '暂停' : 'Pause') : (language === 'zh' ? '播放' : 'Play')}
              className={`w-16 h-16 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-[0_0_40px_rgba(139,92,246,0.4)]'
                  : 'bg-white/90 text-[#0a0816] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
              }`}
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleNext} aria-label={language === 'zh' ? '下一首' : 'Next'} className="text-white/30 hover:text-white/80 active:text-white transition-colors p-2"><SkipForward className="w-7 h-7" /></motion.button>
          </div>
        </div>

        <button onClick={() => setViewMode('full')} className="absolute top-[max(1.5rem,env(safe-area-inset-top))] right-4 md:right-6 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/70 hover:bg-white/[0.08] active:bg-white/10 transition-all z-20">
          <Minimize2 className="w-5 h-5" />
        </button>

        {/* Bottom system info */}
        <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.04]">
            <div className="w-1 h-1 rounded-full bg-purple-500/50 animate-pulse" />
            <span className="text-[8px] font-mono text-white/15 tracking-widest uppercase">{language === 'zh' ? '「沉浸模式」' : 'Immersive'} · Neural Audio Engine</span>
          </div>
        </div>
        {/* 「热键提示浮层」— 沉浸模式下也可用 */}
        <HotkeyOverlay language={language} isOpen={isHotkeyOpen} onClose={() => setIsHotkeyOpen(false)} />
      </motion.div>
    );
  }

  // ═══ MINI MODE RENDERING ═══
  if (viewMode === 'mini') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="w-full h-full flex items-center justify-center relative"
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-600/8 rounded-full blur-[60px]" />
        </div>

        {/* Audio element */}
        {currentTrack && (
          <audio
            ref={audioRef} src={currentTrack.url} crossOrigin="anonymous"
            onEnded={handleTrackEnd} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}
          />
        )}

        <MiniPlayer
          currentTrack={currentTrack ? { id: currentTrack.id, title: currentTrack.title } : null}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onPrev={handlePrevious}
          onNext={handleNext}
          onSeek={handleSeekPercent}
          onVolumeChange={handleVolumeSet}
          onToggleMute={toggleMute}
          onExpand={() => setViewMode('full')}
          formatTime={formatTime}
          miniForm={miniForm}
          onChangeForm={setMiniForm}
          language={language}
        />
        {/* 「热键提示浮层」— 迷你模式下也可用 */}
        <HotkeyOverlay language={language} isOpen={isHotkeyOpen} onClose={() => setIsHotkeyOpen(false)} />
      </motion.div>
    );
  }

  // ═══ FULL MODE RENDERING ═══
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      data-dm-player
      data-skin={playerSkin}
      className={`w-full h-full md:w-[1120px] md:h-[720px] md:rounded-2xl overflow-hidden flex flex-col border relative transition-all duration-500 ${
        playerSkin === 'neon' ? 'bg-[#08061a]/95 backdrop-blur-3xl border-purple-500/25 shadow-[0_0_60px_rgba(139,92,246,0.12)]' :
        playerSkin === 'minimal' ? 'bg-[#0a0a12]/90 backdrop-blur-3xl border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.6)]' :
        playerSkin === 'retro' ? 'bg-[#0e0a04]/90 backdrop-blur-3xl border-amber-500/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)]' :
        playerSkin === 'aurora' ? 'bg-[#040e0a]/90 backdrop-blur-3xl border-emerald-500/12 shadow-[0_8px_40px_rgba(0,0,0,0.5)]' :
        'bg-[#0a0816]/90 backdrop-blur-3xl border-purple-500/10 shadow-[0_8px_60px_rgba(139,92,246,0.08)]'
      }`}
    >
      {/* Hidden audio element */}
      {currentTrack && (
        <audio ref={audioRef} src={currentTrack.url} crossOrigin="anonymous" onEnded={handleTrackEnd} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} />
      )}
      <input ref={fileInputRef} key="global-file-input" type="file" accept="audio/*,video/mp4,video/webm,video/*" multiple onChange={handleFileSelect} className="hidden" />

      {/* Futuristic Scanline + Edge Glow */}
      <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden md:rounded-2xl">
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/15 to-transparent"
        />
        {/* Corner accent marks */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-purple-500/15 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-purple-500/15 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-purple-500/10 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-purple-500/10 rounded-br-2xl" />
      </div>
      {/* ── Panels (absolutely positioned) ── */}
      <FeatureHub isOpen={isFeatureHubOpen} onClose={() => setIsFeatureHubOpen(false)} onOpenPanel={openPanel} language={language} />

      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
        totalTracks={allTracks.length}
        totalPlays={totalPlays}
        totalMinutes={totalMinutes}
        onLanguageToggle={toggleLanguage}
        tracks={allTracks.map(t => ({ id: t.id, title: t.title, albumId: t.albumId, isVideo: t.isVideo }))}
        playRecords={playRecords}
        onOpenPanel={openPanel}
      />

      <AIAssistant 
        isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} 
        tracks={allTracks} onPlayTrack={handleTrackSelect}
        onCreatePlaylist={handleCreatePlaylistFromAI} language={language}
      />
      
      <SpaceTimeCall isOpen={isSpaceTimeOpen} onClose={() => setIsSpaceTimeOpen(false)} language={language} />
      <StandardsPanel isOpen={isStandardsOpen} onClose={() => setIsStandardsOpen(false)} language={language} systemMetrics={systemMetrics} />
      <SmartRecommendation isOpen={isRecommendOpen} onClose={() => setIsRecommendOpen(false)} language={language} tracks={allTracks} playRecords={playRecords} currentTrackId={currentTrackId} onPlayTrack={handleTrackSelect} onCreatePlaylist={handleCreatePlaylistFromAI} />
      <SmartAnalytics isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} language={language} tracks={allTracks} playRecords={playRecords} playEvents={playEvents} />
      <NationalStandards isOpen={isNationalStdOpen} onClose={() => setIsNationalStdOpen(false)} language={language} />
      <IncentiveSystem isOpen={isIncentiveOpen} onClose={() => setIsIncentiveOpen(false)} language={language} totalTracks={allTracks.length} totalPlayCount={totalPlays} totalListenMinutes={totalMinutes} playRecords={playRecords} onOpenStarPower={() => openPanel('starpower')} />
      <UsabilityPlan isOpen={isUsabilityOpen} onClose={() => setIsUsabilityOpen(false)} language={language} />
      <PracticeRoom isOpen={isPracticeRoomOpen} onClose={() => setIsPracticeRoomOpen(false)} language={language} playRecords={playRecords} totalTracks={allTracks.length} />
      <AICreator isOpen={isCreatorOpen} onClose={() => setIsCreatorOpen(false)} language={language} />
      <VoiceInput isOpen={isVoiceInputOpen} onClose={() => setIsVoiceInputOpen(false)} language={language} tracks={allTracks} onPlayTrack={handleTrackSelect} />
      <DeepSearch
        isOpen={isDeepSearchOpen}
        onClose={() => setIsDeepSearchOpen(false)}
        language={language}
        tracks={allTracks}
        albums={albums}
        playRecords={playRecords}
        onPlayTrack={handleTrackSelect}
        onOpenVoice={() => openPanel('voice')}
      />
      <StarPowerBoard
        isOpen={isStarPowerOpen}
        onClose={() => setIsStarPowerOpen(false)}
        language={language}
        tracks={allTracks}
        playRecords={playRecords}
        totalPlayCount={totalPlays}
        totalListenMinutes={totalMinutes}
        onPlayTrack={handleTrackSelect}
        onOpenIncentive={() => openPanel('incentive')}
      />
      <ThemeCustomizer 
        isOpen={isThemeOpen} 
        onClose={() => setIsThemeOpen(false)} 
        language={language} 
        onPlayerSkinChange={setPlayerSkin}
        onConfigChange={handleConfigChange}
      />
      <MVPlayer
        isOpen={isMVOpen}
        onClose={() => setIsMVOpen(false)}
        language={language}
        mvTrack={currentTrack?.isVideo ? { id: currentTrack.id, title: currentTrack.title, videoUrl: currentTrack.videoUrl! } : null}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSeek={handleSeekPercent}
        onVolumeChange={handleVolumeSet}
        onToggleMute={toggleMute}
        onPrev={handlePrevious}
        onNext={handleNext}
        formatTime={formatTime}
      />
    

      {/* ══════ MOBILE SIDEBAR OVERLAY ══════ */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-purple-950/60 backdrop-blur-sm z-[60] md:hidden" />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-purple-950/30 backdrop-blur-2xl border-r border-white/15 z-[61] flex flex-col md:hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between safe-top">
                <div className="flex items-center gap-2.5">
                  <img src={dmLogoRed} alt="D-Music" className="h-7 w-7 object-contain" style={{ filter: 'brightness(1.3) drop-shadow(0 1px 4px rgba(220,38,38,0.15))' }} />
                  <h2 className="text-white/90 font-bold text-base tracking-widest">{t.library}</h2>
                </div>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white/60"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-0">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setSelectedAlbumId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full px-5 py-3.5 flex items-center gap-3 transition-all text-left ${selectedAlbumId === null ? 'bg-white/15' : 'active:bg-white/10'}`}
                >
                  <DMusicLogo3D size="sm" />
                  <span className="ml-auto text-white/30 text-xs">{allTracks.length}</span>
                </motion.button>
                {albums.map(album => (
                  <motion.button key={album.id} whileTap={{ scale: 0.97 }} onClick={() => { setSelectedAlbumId(album.id); setIsMobileSidebarOpen(false); }}
                    className={`w-full px-5 py-3.5 flex items-center gap-3 transition-all text-left ${selectedAlbumId === album.id ? 'bg-white/15' : 'active:bg-white/10'}`}
                  >
                    <Music className={`w-5 h-5 ${selectedAlbumId === album.id ? 'text-purple-400' : 'text-white/60'}`} />
                    <span className={`text-sm font-medium truncate flex-1 ${selectedAlbumId === album.id ? 'text-white' : 'text-white/80'}`}>{album.name}</span>
                    <span className="ml-auto text-white/30 text-xs">{album.trackIds.length}</span>
                  </motion.button>
                ))}
              </div>
              <div className="p-3 pt-2.5 border-t border-white/[0.06] space-y-2.5 safe-bottom">
                {/* Section label */}
                <p className="text-white/15 text-[8px] font-bold uppercase tracking-[0.2em] px-0.5">{language === 'zh' ? '「模式切换」' : 'Modes'}</p>
                {/* Mode switchers — segmented control style */}
                <div className="flex gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                  {[
                    { mode: 'immersive' as ViewMode, icon: MonitorPlay, label: language === 'zh' ? '沉浸' : 'Immerse', color: 'from-indigo-500 to-violet-600' },
                    { mode: 'mini' as ViewMode, icon: Minimize2, label: language === 'zh' ? '迷你' : 'Mini', color: 'from-cyan-500 to-blue-600' },
                  ].map(item => (
                    <motion.button key={item.mode} whileTap={{ scale: 0.93 }}
                      onClick={() => { setViewMode(item.mode); setIsMobileSidebarOpen(false); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                        viewMode === item.mode
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-white/40 active:bg-white/[0.06]'
                      }`}
                      aria-label={item.label}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </motion.button>
                  ))}
                  <motion.button whileTap={{ scale: 0.93 }}
                    onClick={() => { openPanel('creator'); setIsMobileSidebarOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-semibold text-amber-300/80 active:bg-amber-500/10 transition-all"
                    aria-label={language === 'zh' ? '创作' : 'Create'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {language === 'zh' ? '创作' : 'Create'}
                  </motion.button>
                </div>

                {/* Quick actions — horizontal scroll chips */}
                <p className="text-white/15 text-[8px] font-bold uppercase tracking-[0.2em] px-0.5">{language === 'zh' ? '「快捷入口」' : 'Quick Access'}</p>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [&::-webkit-scrollbar]:h-0">
                  {[
                    { panel: 'hub', icon: Layers, label: language === 'zh' ? '功能' : 'Hub', color: 'text-purple-300 border-purple-500/15 bg-purple-500/[0.06]' },
                    { panel: 'deepsearch', icon: Search, label: language === 'zh' ? '搜索' : 'Search', color: 'text-cyan-300 border-cyan-500/15 bg-cyan-500/[0.06]' },
                    { panel: 'ai', icon: Sparkles, label: language === 'zh' ? 'AI' : 'AI', color: 'text-violet-300 border-violet-500/15 bg-violet-500/[0.06]' },
                    { panel: 'starpower', icon: Trophy, label: language === 'zh' ? '星力' : 'Stars', color: 'text-amber-300 border-amber-500/15 bg-amber-500/[0.06]' },
                    { panel: 'profile', icon: User, label: language === 'zh' ? '我的' : 'Me', color: 'text-blue-300 border-blue-500/15 bg-blue-500/[0.06]' },
                  ].map(item => (
                    <motion.button key={item.panel} whileTap={{ scale: 0.92 }}
                      onClick={() => { openPanel(item.panel); setIsMobileSidebarOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-semibold border whitespace-nowrap transition-all active:scale-95 ${item.color}`}
                    >
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                {/* Create album */}
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { handleCreateAlbum(); setIsMobileSidebarOpen(false); }}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500/10 to-violet-500/10 active:from-purple-500/20 active:to-violet-500/20 rounded-xl text-white/80 text-xs font-semibold transition-all border border-white/[0.06] flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />{t.createAlbum}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      {/* ══════ DESKTOP LIBRARY SIDEBAR ══════ */}
      {themeConfig.visibleModules.sidebar && (
        <div className="hidden md:flex w-[250px] bg-[#08061a]/60 border-r border-purple-500/[0.06] flex-col relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.03] via-transparent to-blue-500/[0.02] pointer-events-none" />
          <div className="p-4 border-b border-white/[0.04] flex items-center justify-center">
            <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.04]">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('deepsearch')} className="p-2 text-white/25 hover:text-purple-400 hover:bg-white/[0.04] rounded-lg transition-all" title={language === 'zh' ? '「深度检索」' : 'Deep Search'}>
                <Search className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('ai')} className="p-2 text-white/25 hover:text-purple-400 hover:bg-white/[0.04] rounded-lg transition-all">
                <Sparkles className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('starpower')} className="p-2 text-white/25 hover:text-amber-400 hover:bg-white/[0.04] rounded-lg transition-all" title={language === 'zh' ? '「星力排行榜」' : 'Star Rankings'}>
                <Trophy className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('profile')} className="p-2 text-white/25 hover:text-blue-400 hover:bg-white/[0.04] rounded-lg transition-all">
                <User className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('theme')} className="p-2 text-white/25 hover:text-fuchsia-400 hover:bg-white/[0.04] rounded-lg transition-all">
                <Paintbrush className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleLanguage} className="p-2 text-white/25 hover:text-cyan-400 hover:bg-white/[0.04] rounded-lg transition-all" title={language === 'zh' ? '「切换语言」' : 'Language'}>
                <Languages className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        
        <div className="flex-1 overflow-y-auto py-1">
            <motion.button whileHover={{ x: 3 }} onClick={() => setSelectedAlbumId(null)}
              className={`w-full px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.04] transition-all text-left group relative ${selectedAlbumId === null ? 'bg-purple-500/[0.06]' : ''}`}
            >
              {selectedAlbumId === null && <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />}
              <DMusicLogo3D size="sm" />
            </motion.button>

          <AnimatePresence>
            {albums.map(album => (
              <motion.div key={album.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}>
                {editingAlbumId === album.id ? (
                  <div className="px-5 py-3 flex items-center gap-3 bg-purple-500/[0.06]">
                    <Music className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <input type="text" value={editingAlbumName} onChange={(e) => setEditingAlbumName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAlbumName(); if (e.key === 'Escape') { setEditingAlbumId(null); setEditingAlbumName(''); } }}
                      onBlur={handleSaveAlbumName} autoFocus
                      className="flex-1 bg-purple-500/10 text-white text-xs px-2.5 py-1.5 rounded-lg border border-purple-500/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                    />
                  </div>
                ) : (
                  <motion.button whileHover={{ x: 3 }} onClick={() => setSelectedAlbumId(album.id)}
                    className={`w-full px-5 py-3 flex items-center gap-3 hover:bg-white/[0.04] transition-all text-left group relative ${selectedAlbumId === album.id ? 'bg-purple-500/[0.06]' : ''}`}
                  >
                    {selectedAlbumId === album.id && <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.4)]" />}
                    <Music className={`w-3.5 h-3.5 transition-colors ${selectedAlbumId === album.id ? 'text-purple-400' : 'text-white/25 group-hover:text-white/60'}`} />
                    <span className={`text-xs font-medium truncate flex-1 transition-colors ${selectedAlbumId === album.id ? 'text-white/90' : 'text-white/40 group-hover:text-white/70'}`}>{album.name}</span>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar bottom: Feature Hub + Album Management */}
        <div className="p-4 border-t border-white/[0.04] space-y-2 bg-black/20">
          {/* Feature Hub Button */}
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => openPanel('hub')}
            className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 bg-purple-500/[0.06] border-purple-500/10 hover:border-purple-500/25 text-purple-300/80 group relative overflow-hidden"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400/70" />
            {language === 'zh' ? '「功能中心」' : 'Feature Hub'}
          </motion.button>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleCreateAlbum}
            className="w-full px-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] rounded-xl text-white/60 text-xs font-medium transition-all border border-white/[0.06] flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />{t.createAlbum}
          </motion.button>
          
          <AnimatePresence>
            {selectedAlbumId !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-2">
                <motion.button whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.92 }} onClick={() => handleRenameAlbum(selectedAlbumId)}
                  className="px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-xs font-medium transition-all border border-white/10 flex items-center justify-center gap-2">
                  <SquarePen className="w-3.5 h-3.5" />{t.rename}
                </motion.button>
                <motion.button whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.92 }} onClick={() => handleDeleteAlbum(selectedAlbumId)}
                  className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-200/70 text-xs font-medium transition-all border border-red-500/20 flex items-center justify-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" />{t.delete}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cloud Sync */}
          <div className="flex gap-1.5 pt-1">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={syncToCloud} disabled={isCloudSyncing}
              className="flex-1 px-2 py-1.5 rounded-lg text-[9px] font-mono font-medium bg-white/[0.03] hover:bg-white/[0.06] text-white/25 hover:text-white/50 border border-white/[0.04] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40">
              <Cloud className={`w-3 h-3 ${isCloudSyncing ? 'animate-pulse' : ''}`} />
              {isCloudSyncing ? 'SYNC...' : (language === 'zh' ? '「上传」' : 'Push')}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={loadFromCloud} disabled={isCloudSyncing}
              className="flex-1 px-2 py-1.5 rounded-lg text-[9px] font-mono font-medium bg-white/[0.03] hover:bg-white/[0.06] text-white/25 hover:text-white/50 border border-white/[0.04] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40">
              <RefreshCw className={`w-3 h-3 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              {language === 'zh' ? '「同步」' : 'Pull'}
            </motion.button>
          </div>
          {/* Brand watermark */}
          <div className="flex justify-center pt-2 opacity-[0.04]">
            <img src={dmLogoDi} alt="" className="h-5 object-contain" style={{ filter: 'brightness(4)' }} />
          </div>
        </div>
      </div>
      )}
      
      {/* ══════ SONGS SECTION (Main Content Area) ══════ */}
      <div className="flex-1 bg-transparent flex flex-col relative overflow-hidden">
        <FloatingCD 
          isActive={!!currentTrack} 
          isPlaying={isPlaying} 
          trackTitle={currentTrack?.title || ''} 
          artist={currentTrack?.isVideo ? 'MUSIC VIDEO' : 'LOCAL AUDIO'}
        />
        {themeConfig.visibleModules.visualizer && (
          <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
            <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />
          </div>
        )}
        {/* Ambient glow orbs */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] right-[10%] w-48 md:w-80 h-48 md:h-80 bg-purple-600/[0.05] rounded-full blur-[60px] md:blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[5%] left-[5%] w-32 md:w-56 h-32 md:h-56 bg-blue-600/[0.04] rounded-full blur-[50px] md:blur-[80px] pointer-events-none"
        />

        {/* Header */}
        <div className="px-4 py-3 md:px-8 md:py-6 border-b border-white/[0.04] z-10 flex items-center md:items-end justify-between bg-gradient-to-b from-white/[0.02] to-transparent relative safe-top">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-2 -ml-1 text-white/70 active:text-white active:bg-white/10 rounded-xl transition-colors">
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 md:flex-none min-w-0 mx-2 md:mx-0">
            {selectedAlbumId === null ? (
              <div className="flex flex-col">
                <DMusicLogo3D size="lg" />
                <div className="flex items-center gap-2 mt-1 ml-0.5">
                  <div className="w-1 h-1 rounded-full bg-purple-500/50" />
                  <p className="text-[9px] md:text-[10px] text-white/20 font-medium uppercase tracking-[0.2em] font-mono">{displayTracks.length} {t.songsCount}</p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-white font-bold text-lg md:text-xl truncate tracking-tight">
                  {albums.find(a => a.id === selectedAlbumId)?.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1 h-1 rounded-full bg-purple-500/50" />
                  <p className="text-[9px] md:text-[10px] text-white/20 font-medium uppercase tracking-[0.2em] font-mono">{displayTracks.length} {t.songsCount}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Mobile utility buttons */}
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('deepsearch')}
              className="p-2 text-white/60 hover:text-violet-400 active:text-violet-400 transition-colors md:hidden rounded-xl"><Search className="w-[18px] h-[18px]" /></motion.button>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={() => openPanel('ai')}
              className="p-2 text-white/60 hover:text-purple-400 active:text-purple-400 transition-colors md:hidden rounded-xl"><Sparkles className="w-[18px] h-[18px]" /></motion.button>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={toggleLanguage}
              className="p-2 text-white/60 hover:text-white active:text-white transition-colors md:hidden rounded-xl"><Languages className="w-4 h-4" /></motion.button>

            {/* Minimize to mini player */}
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={() => setViewMode('mini')}
              className="p-2 text-white/40 hover:text-white/80 transition-colors rounded-xl hidden md:block" title={language === 'zh' ? '「迷你模式」' : 'Mini Mode'}>
              <Minimize2 className="w-4 h-4" />
            </motion.button>
            
            {/* Switch to Immersive player */}
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={() => setViewMode('immersive')}
              className="p-2 text-white/40 hover:text-purple-400 transition-colors rounded-xl hidden md:block" title={language === 'zh' ? '「沉浸模式」' : 'Immersive Mode'}>
              <MonitorPlay className="w-5 h-5" />
            </motion.button>

            {/* Add song button */}
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-purple-500/10 backdrop-blur-md rounded-lg text-purple-300 text-[11px] md:text-xs font-medium transition-all border border-purple-500/15 flex items-center gap-1.5 group hover:bg-purple-500/15 hover:border-purple-500/25">
              <Plus className="w-3 md:w-3.5 h-3 md:h-3.5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">{t.addSong}</span><span className="sm:hidden">+</span>
            </motion.button>
            
            <AnimatePresence>
              {selectedTrackIds.size > 0 && (
                <motion.button initial={{ opacity: 0, scale: 0.8, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.8, width: 0 }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={handleRemoveSelectedTracks}
                  className="px-3 py-2 md:px-5 md:py-2.5 bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 rounded-full text-red-100 text-xs md:text-sm font-semibold transition-all border border-red-500/20 shadow-lg flex items-center gap-1.5 md:gap-2 overflow-hidden">
                  <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t.deleteSelected} ({selectedTrackIds.size})</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Track List */}
        <div className="flex-1 overflow-y-auto z-10 p-1.5 md:p-3">
          {displayTracks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full px-4">
              <VinylCarousel language={language} />
              <div className="flex flex-col items-center gap-3 text-center mt-6">
                <p className="text-white/25 text-xs font-semibold tracking-wide">{language === 'zh' ? '「暂无歌曲」' : 'No tracks yet'}</p>
                <p className="text-[9px] text-white/10 font-mono uppercase tracking-[0.2em] max-w-[260px] leading-relaxed">{t.uploadPrompt}</p>
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-6 py-2.5 bg-purple-500/[0.08] hover:bg-purple-500/15 border border-purple-500/15 hover:border-purple-500/25 rounded-xl text-purple-300/60 text-[10px] font-semibold uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.addSong}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-[2px]">
              {displayTracks.map((item, index) => {
                const isSelected = selectedTrackIds.has(item.id);
                const isCurrent = currentTrackId === item.id;
                const record = playRecords.find(r => r.trackId === item.id);
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
                    whileHover={{ x: 2 }}
                    className={`group w-full p-2 md:p-2.5 rounded-lg flex items-center gap-2.5 md:gap-3 hover:bg-white/[0.04] transition-all border border-transparent relative overflow-hidden ${
                      isCurrent ? 'bg-purple-500/[0.08] border-purple-500/10' : isSelected ? 'bg-white/[0.03] border-white/[0.04]' : ''
                    }`}
                  >
                    {isCurrent && (
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/[0.04] to-transparent skew-x-12 pointer-events-none"
                      />
                    )}
                    <div className="pl-1 md:pl-2">
                      <input type="checkbox" checked={isSelected} onChange={() => handleToggleTrackSelection(item.id)}
                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-colors" />
                    </div>
                    <button onClick={() => handleTrackSelect(item.id)} className="flex-1 flex items-center gap-3 md:gap-4 text-left min-w-0">
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 relative overflow-hidden ${
                        isCurrent && isPlaying ? 'bg-purple-500/20 ring-1 ring-purple-500/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]' : 'bg-white/[0.04] group-hover:bg-white/[0.06]'
                      }`}>
                        {isCurrent && isPlaying ? (
                          <div className="flex gap-0.5 items-end h-4 pb-1">
                            <motion.span animate={{ height: [4, 12, 6, 14, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                            <motion.span animate={{ height: [10, 5, 14, 7, 12] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                            <motion.span animate={{ height: [6, 14, 8, 12, 5] }} transition={{ repeat: Infinity, duration: 0.55 }} className="w-1 bg-white rounded-full" />
                          </div>
                        ) : item.isVideo ? (
                          <Film className={`w-5 h-5 md:w-6 md:h-6 ${isCurrent ? 'text-white' : 'text-indigo-400/70'}`} />
                        ) : (
                          <Music className={`w-5 h-5 md:w-6 md:h-6 ${isCurrent ? 'text-white' : 'text-white/60'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div className={`font-medium text-xs md:text-sm truncate transition-colors ${isCurrent ? 'text-purple-300' : 'text-white/70 group-hover:text-white/90'}`}>{item.title}</div>
                          {item.isVideo && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-bold rounded border border-indigo-500/25">MV</span>
                          )}
                        </div>
                        {isCurrent ? (
                          <div className="text-[10px] md:text-xs text-white/50 mt-0.5 font-medium uppercase tracking-wider">{t.playing}{item.isVideo ? ' · MV' : ''}</div>
                        ) : record && record.playCount > 0 ? (
                          <div className="text-[10px] md:text-xs text-white/30 mt-0.5">{record.playCount} {language === 'zh' ? '「次播放」' : 'plays'}</div>
                        ) : null}
                      </div>
                    </button>
                    {item.isVideo && isCurrent && (
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => openPanel('mv')}
                        className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/30 transition-all flex-shrink-0"
                        title="MV"
                      >
                        <MonitorPlay className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* ══════ CONTROLS SECTION ══════ */}
      <div className={`p-3 md:px-6 md:py-5 border-t z-20 relative transition-all duration-500 ${
        playerSkin === 'neon' ? 'bg-[#08061a]/80 border-purple-500/15' :
        playerSkin === 'minimal' ? 'bg-[#0a0a12]/60 border-white/[0.04]' :
        playerSkin === 'retro' ? 'bg-[#0e0a04]/60 border-amber-500/10' :
        playerSkin === 'aurora' ? 'bg-[#040e0a]/60 border-emerald-500/10' :
        'bg-[#08061a]/60 border-purple-500/[0.06]'
      }`}>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(139,92,246,0.04),transparent_60%)] pointer-events-none" />
          <div className="mb-2 md:mb-4 px-0.5">
            <div className="h-[3px] md:h-1 bg-white/[0.06] rounded-full cursor-pointer group relative hover:h-1.5 transition-all duration-300" onClick={handleSeek} onTouchStart={handleSeek}>
              <motion.div className={`h-full rounded-full relative bg-gradient-to-r ${
                playerSkin === 'neon' ? 'from-purple-400 via-fuchsia-400 to-cyan-400' :
                playerSkin === 'retro' ? 'from-amber-500 via-orange-400 to-yellow-400' :
                playerSkin === 'aurora' ? 'from-emerald-400 via-teal-400 to-cyan-400' :
                'from-purple-500 via-violet-400 to-blue-500'
              }`} style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}>
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-0 group-hover:scale-100 transition-transform duration-200" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-1 md:mt-1.5 text-[9px] md:text-[10px] font-mono text-white/25 tabular-nums">
              <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
              <GlowButton onClick={handlePrevious} disabled={displayTracks.length === 0} className="text-white/70 hover:text-white disabled:opacity-30" size="md" aria-label={language === 'zh' ? '上一首' : 'Previous'}>
                <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
              </GlowButton>
              <motion.button
                whileHover={currentTrack ? { scale: 1.05 } : {}}
                whileTap={currentTrack ? { scale: 0.93 } : {}}
                onClick={() => setIsPlaying(!isPlaying)} disabled={!currentTrack}
                aria-label={isPlaying ? (language === 'zh' ? '暂停' : 'Pause') : (language === 'zh' ? '播放' : 'Play')}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden ${(() => {
                  if (isPlaying) {
                    if (playerSkin === 'neon') return 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.4)]';
                    if (playerSkin === 'retro') return 'bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]';
                    if (playerSkin === 'aurora') return 'bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)]';
                    if (playerSkin === 'minimal') return 'bg-white/15 text-white';
                    return 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]';
                  }
                  if (playerSkin === 'minimal') return 'bg-white/80 text-gray-900';
                  return 'bg-white/90 text-[#0a0816] shadow-[0_0_15px_rgba(255,255,255,0.08)]';
                })()}`}
              >
                {isPlaying ? <Pause className="w-[18px] h-[18px] md:w-5 md:h-5 fill-current relative z-10" /> : <Play className="w-[18px] h-[18px] md:w-5 md:h-5 fill-current ml-0.5 relative z-10" />}
              </motion.button>
              <GlowButton onClick={handleNext} disabled={displayTracks.length === 0} className="text-white/70 hover:text-white disabled:opacity-30" size="md" aria-label={language === 'zh' ? '下一首' : 'Next'}>
                <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
              </GlowButton>
            </div>

            <div className="flex-1 flex items-center gap-2 md:gap-3 min-w-0 px-1 md:px-4">
              <div className="flex-shrink min-w-0 max-w-[100px] sm:max-w-[140px] md:max-w-[180px]">
                {currentTrack ? (
                  <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} key={currentTrack.id}>
                    <div className="text-white/80 font-medium truncate text-[11px] md:text-sm tracking-tight">{currentTrack.title}</div>
                    <div className="text-purple-400/40 text-[7px] md:text-[9px] font-mono uppercase tracking-wider mt-0.5">{currentTrack.isVideo ? 'MV' : 'Audio'}</div>
                  </motion.div>
                ) : (
                  <div className="text-white/20 text-[10px] md:text-xs font-mono tracking-wide">D-Music</div>
                )}
              </div>
              <div className="hidden sm:flex flex-1 min-w-0">
                <SoundWaveBar audioRef={audioRef} isPlaying={isPlaying} compact={isMobile} />
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              {/* Mini mode toggle (mobile) */}
              <GlowButton onClick={() => setViewMode('mini')} className="text-white/40 hover:text-white/80 transition-colors md:hidden" size="sm">
                <Minimize2 className="w-4 h-4" />
              </GlowButton>

              {/* MV button - shown when current track has video */}
              {currentTrack?.isVideo && (
                <GlowButton onClick={() => openPanel('mv')} className="text-indigo-400/70 hover:text-indigo-300 transition-colors" size="sm">
                  <MonitorPlay className="w-4 h-4 md:w-5 md:h-5" />
                </GlowButton>
              )}

              <GlowButton onClick={() => openPanel('deepsearch')} className="text-white/50 hover:text-violet-400 transition-colors hidden md:block" size="sm">
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </GlowButton>

              <div className="hidden md:flex items-center gap-2 w-32 lg:w-40 justify-end">
                <GlowButton onClick={toggleMute} className="text-white/70 hover:text-white" size="sm">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </GlowButton>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group relative overflow-hidden" onClick={handleVolumeChange}>
                  <div className="h-full bg-gradient-to-r from-white/60 to-white/90 rounded-full relative transition-all" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}>
                    <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>

              <div className="relative md:hidden">
                <GlowButton onClick={() => setIsMobileVolumeOpen(!isMobileVolumeOpen)} className="text-white/60 active:text-white" size="sm">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </GlowButton>
                <AnimatePresence>
                  {isMobileVolumeOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full right-0 mb-2 p-3 bg-purple-950/90 backdrop-blur-xl rounded-xl border border-white/15 shadow-2xl w-40 z-50">
                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className="text-white/60 active:text-white p-1">
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        <div className="flex-1 h-2 bg-white/10 rounded-full cursor-pointer relative overflow-hidden" onClick={handleVolumeChange} onTouchStart={handleVolumeChange}>
                          <div className="h-full bg-gradient-to-r from-white/60 to-white/90 rounded-full" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                        </div>
                        <span className="text-white/40 text-[9px] font-mono w-6 text-right">{Math.round((isMuted ? 0 : volume) * 100)}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

      {/* Neural Status Bar — desktop only */}
      <div className="hidden md:block">
        <NeuralStatusBar
          trackCount={allTracks.length}
          isPlaying={isPlaying}
          language={language}
          lastSyncTime={lastSyncTime}
          isCloudSyncing={isCloudSyncing}
        />
      </div>

      {/* ══════ MOBILE-ONLY: Bottom safe-area spacer for bottom nav ══════ */}
      <div className="md:hidden h-[calc(3.75rem+env(safe-area-inset-bottom))]" />

      {/* ══════ MOBILE: Bottom Nav ══════ */}
      <MobileNavBar
        activeTab={mobileActiveTab}
        onTabChange={handleMobileTabChange}
        isPlaying={isPlaying}
        hasTrack={!!currentTrack}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        language={language}
      />

      {/* PWA Install Prompt */}
      <AnimatePresence>
        <PWAInstallPrompt
          isVisible={showPWAPrompt}
          onInstall={handlePWAInstall}
          onDismiss={handlePWADismiss}
          language={language}
        />
      </AnimatePresence>

      {/* Offline Indicator */}
      <AnimatePresence>
        <OfflineIndicator isOffline={isOffline} language={language} />
      </AnimatePresence>

      {/* 「热键提示浮层」— 首次使用自动弹出，按 ? 键唤出 */}
      <HotkeyOverlay
        language={language}
        isOpen={isHotkeyOpen}
        onClose={() => setIsHotkeyOpen(false)}
      />
    </motion.div>
  );
}
