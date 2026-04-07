import { motion } from 'motion/react';
import {
  Layers, Play, Pause, Sparkles, User, Music, SkipForward,
  Disc3, Download, WifiOff, Headphones
} from 'lucide-react';

// ═══════════════════════════════════════════════════════
// D-MUSIC 「底部导航栏」— v2 重构
// 5 等宽 Tab · pill 指示器 · 顶部光带 · 无中央浮起播放键
// ═══════════════════════════════════════════════════════

type Tab = 'library' | 'hub' | 'play' | 'ai' | 'profile';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isPlaying: boolean;
  hasTrack: boolean;
  onPlayPause: () => void;
  language: 'zh' | 'en';
}

/* 
 * 「播放」Tab 现在用 Headphones 图标，仅做导航跳转
 * 不再有独立的 Play/Pause 控制，消除与底部播控栏的「双播放键」冲突
 */
const TAB_CONFIG: { id: Tab; icon: any; label: { zh: string; en: string } }[] = [
  { id: 'library', icon: Music,       label: { zh: '音乐库', en: 'Library' } },
  { id: 'hub',     icon: Layers,      label: { zh: '发现',   en: 'Explore' } },
  { id: 'play',    icon: Headphones,  label: { zh: '播放',   en: 'Player' } },
  { id: 'ai',      icon: Sparkles,    label: { zh: 'AI',     en: 'AI' } },
  { id: 'profile', icon: User,        label: { zh: '我的',   en: 'Me' } },
];

export function MobileNavBar({ activeTab, onTabChange, language }: Props) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[55]"
      role="navigation"
      aria-label={language === 'zh' ? 'D-Music 底部导航' : 'D-Music bottom navigation'}
    >
      <div className="relative" style={{ background: 'rgba(10,8,24,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        {/* Top border + glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />

        <nav
          className="flex items-stretch justify-around px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="tablist"
          aria-label={language === 'zh' ? '主导航' : 'Main navigation'}
        >
          {TAB_CONFIG.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center py-2 flex-1 min-w-0"
                role="tab"
                aria-selected={active}
                aria-label={tab.label[language]}
              >
                {/* Active background pill */}
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-x-1.5 inset-y-0 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                  />
                )}

                {/* Active top indicator dot */}
                {active && (
                  <motion.div
                    layoutId="nav-active-dot"
                    className="absolute -top-0.5 w-1 h-1 rounded-full bg-purple-400"
                    style={{ boxShadow: '0 0 6px rgba(168,85,247,0.6)' }}
                    transition={{ type: 'spring', damping: 22, stiffness: 320 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  className="relative z-10 transition-colors duration-200"
                  style={{
                    width: 20, height: 20,
                    color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)',
                  }}
                />

                {/* Label */}
                <span
                  className="relative z-10 text-[9px] font-semibold mt-1 tracking-wide transition-colors duration-200"
                  style={{ color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)' }}
                >
                  {tab.label[language]}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// MOBILE NOW-PLAYING BAR — Spotify 风格紧凑播控条
// ═══════════════════════════════════════════════════════

interface NowPlayingBarProps {
  trackTitle: string | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onNext: () => void;
  onTap: () => void;
  language: 'zh' | 'en';
}

export function MobileNowPlayingBar({ trackTitle, isPlaying, progress, onPlayPause, onNext, onTap, language }: NowPlayingBarProps) {
  if (!trackTitle) return null;

  return (
    <div
      className="md:hidden fixed left-2.5 right-2.5 z-[54]"
      style={{ bottom: 'calc(3.75rem + env(safe-area-inset-bottom, 0px))' }}
      role="region"
      aria-label={language === 'zh' ? '正在播放' : 'Now Playing'}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="relative overflow-hidden"
        style={{
          background: 'rgba(20,16,42,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 2, background: 'rgba(255,255,255,0.04)' }}>
          <motion.div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(to right, #a855f7, #8b5cf6)',
              borderRadius: 9999,
            }}
            layout
          />
        </div>

        <div className="flex items-center gap-3 px-3.5 py-2.5" onClick={onTap}>
          {/* Mini album art */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(26,16,48,1), rgba(59,130,246,0.15))',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(168,85,247,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </motion.div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>{trackTitle}</p>
            <p className="text-[9px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'rgba(168,85,247,0.3)' }}>
              {isPlaying ? (language === 'zh' ? '正在播放' : 'Now Playing') : (language === 'zh' ? '已暂停' : 'Paused')}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ color: 'rgba(255,255,255,0.9)' }}
              aria-label={isPlaying ? (language === 'zh' ? '暂停' : 'Pause') : (language === 'zh' ? '播放' : 'Play')}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onNext}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              aria-label={language === 'zh' ? '下一首' : 'Next track'}
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// PWA 安装提示
// ═══════════════════════════════════════════════════════

interface PWAPromptProps {
  isVisible: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  language: 'zh' | 'en';
}

export function PWAInstallPrompt({ isVisible, onInstall, onDismiss, language }: PWAPromptProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[200] safe-top"
    >
      <div className="mx-3 mt-[max(0.75rem,env(safe-area-inset-top))] bg-gradient-to-r from-purple-500/15 via-violet-500/10 to-blue-500/15 backdrop-blur-2xl rounded-2xl border border-purple-500/20 shadow-[0_8px_40px_rgba(139,92,246,0.15)] p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-sm font-bold tracking-tight">
              {language === 'zh' ? '「安装 D-Music」' : 'Install D-Music'}
            </p>
            <p className="text-white/40 text-[11px] mt-0.5 leading-tight">
              {language === 'zh'
                ? '「添加至主屏幕，获得原生应用体验」'
                : 'Add to home screen for a native app experience'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onInstall}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/25"
            >
              {language === 'zh' ? '「安装」' : 'Install'}
            </motion.button>
            <button
              onClick={onDismiss}
              className="p-2 text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// ═══════════════════════════════════════════════════════
// 离线状态指示器
// ═══════════════════════════════════════════════════════

export function OfflineIndicator({ isOffline, language }: { isOffline: boolean; language: 'zh' | 'en' }) {
  if (!isOffline) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      className="fixed top-[max(0.5rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[199]"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 backdrop-blur-2xl rounded-full border border-amber-500/20">
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-amber-300 text-[11px] font-bold">
          {language === 'zh' ? '「离线模式」' : 'Offline Mode'}
        </span>
      </div>
    </motion.div>
  );
}
