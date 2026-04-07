import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X, ArrowDown, Volume2, VolumeX, Play, SkipBack, SkipForward, Search, Sparkles, Minimize2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// D-MUSIC 「热键提示浮层」
// 首次使用时自动显示，支持「?」键唤出，桌面端专属
// ═══════════════════════════════════════════════════════

const HOTKEY_DISMISSED_KEY = 'dmusic_hotkey_dismissed';
const HOTKEY_FIRST_SHOWN_KEY = 'dmusic_hotkey_first_shown';

interface HotkeyOverlayProps {
  language: 'zh' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

interface HotkeyItem {
  keys: string[];
  icon: React.ReactNode;
  label: string;
  category: string;
}

const TRANSLATIONS = {
  zh: {
    title: '「键盘快捷键」',
    subtitle: '「高效操控 D-Music 的秘钥」',
    playback: '「播放控制」',
    navigation: '「面板导航」',
    volume: '「音量控制」',
    system: '「系统操作」',
    dismiss: '「知道了」',
    dontShowAgain: '「不再提示」',
    pressToOpen: '「按 ? 键随时查看」',
    space: '空格',
    or: '或',
  },
  en: {
    title: 'Keyboard Shortcuts',
    subtitle: 'Master D-Music at Your Fingertips',
    playback: 'Playback',
    navigation: 'Panel Navigation',
    volume: 'Volume Control',
    system: 'System',
    dismiss: 'Got it',
    dontShowAgain: "Don't show again",
    pressToOpen: 'Press ? anytime to view',
    space: 'Space',
    or: 'or',
  }
};

function KbdKey({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center ${large ? 'min-w-[3rem] px-2' : 'min-w-[1.75rem] px-1.5'} h-7 rounded-lg bg-white/[0.06] border border-white/10 text-white/70 text-[11px] font-mono font-semibold shadow-[0_2px_0_rgba(255,255,255,0.04)] whitespace-nowrap`}>
      {children}
    </span>
  );
}

export function HotkeyOverlay({ language, isOpen, onClose }: HotkeyOverlayProps) {
  const t = TRANSLATIONS[language];

  // Escape key to close — self-contained accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
    };
    window.addEventListener('keydown', handleEsc, true);
    return () => window.removeEventListener('keydown', handleEsc, true);
  }, [isOpen, onClose]);

  const hotkeyGroups: { title: string; items: HotkeyItem[] }[] = [
    {
      title: t.playback,
      items: [
        { keys: [t.space], icon: <Play className="w-3 h-3" />, label: language === 'zh' ? '「播放 / 暂停」' : 'Play / Pause', category: 'playback' },
        { keys: ['←'], icon: <SkipBack className="w-3 h-3" />, label: language === 'zh' ? '「上一首」' : 'Previous Track', category: 'playback' },
        { keys: ['→'], icon: <SkipForward className="w-3 h-3" />, label: language === 'zh' ? '「下一首」' : 'Next Track', category: 'playback' },
      ]
    },
    {
      title: t.volume,
      items: [
        { keys: ['↑'], icon: <Volume2 className="w-3 h-3" />, label: language === 'zh' ? '「音量 +5%」' : 'Volume Up (+5%)', category: 'volume' },
        { keys: ['↓'], icon: <ArrowDown className="w-3 h-3" />, label: language === 'zh' ? '「音量 -5%」' : 'Volume Down (-5%)', category: 'volume' },
        { keys: ['M'], icon: <VolumeX className="w-3 h-3" />, label: language === 'zh' ? '「静音切换」' : 'Toggle Mute', category: 'volume' },
      ]
    },
    {
      title: t.navigation,
      items: [
        { keys: ['Ctrl', 'K'], icon: <Sparkles className="w-3 h-3" />, label: language === 'zh' ? '「AI 助手」' : 'AI Assistant', category: 'navigation' },
        { keys: ['Ctrl', 'F'], icon: <Search className="w-3 h-3" />, label: language === 'zh' ? '「深度搜索」' : 'Deep Search', category: 'navigation' },
      ]
    },
    {
      title: t.system,
      items: [
        { keys: ['Esc'], icon: <Minimize2 className="w-3 h-3" />, label: language === 'zh' ? '「关闭当前面板」' : 'Close Panel', category: 'system' },
        { keys: ['?'], icon: <Keyboard className="w-3 h-3" />, label: language === 'zh' ? '「显示快捷键」' : 'Show Shortcuts', category: 'system' },
      ]
    },
  ];

  const handleDismiss = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem(HOTKEY_DISMISSED_KEY, 'true');
    }
    onClose();
  };

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleDismiss(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-[#0c0a1a]/95 backdrop-blur-2xl rounded-2xl border border-purple-500/15 shadow-[0_24px_80px_rgba(139,92,246,0.12)] overflow-hidden" role="dialog" aria-modal="true" aria-label={language === 'zh' ? '键盘快捷键' : 'Keyboard Shortcuts'}>
              {/* Header */}
              <div className="relative px-6 pt-5 pb-4 border-b border-white/[0.06]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <Keyboard className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-white/90 font-bold text-sm tracking-wide">{t.title}</h2>
                      <p className="text-white/25 text-[10px] font-mono mt-0.5">{t.subtitle}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDismiss(false)}
                    className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                {hotkeyGroups.map((group, gi) => (
                  <div key={gi}>
                    <h3 className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.15em] mb-2">{group.title}</h3>
                    <div className="space-y-1.5">
                      {group.items.map((item, ii) => (
                        <motion.div
                          key={ii}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: gi * 0.08 + ii * 0.04 }}
                          className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-purple-400/60 group-hover:text-purple-400/80 transition-colors">{item.icon}</span>
                            <span className="text-white/60 text-xs font-medium group-hover:text-white/80 transition-colors">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, ki) => (
                              <span key={ki} className="flex items-center gap-1">
                                {ki > 0 && <span className="text-white/15 text-[9px] mx-0.5">+</span>}
                                <KbdKey large={key === t.space || key === 'Esc'}>
                                  {key === 'Ctrl' ? modKey : key}
                                </KbdKey>
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                <button
                  onClick={() => handleDismiss(true)}
                  className="text-white/20 hover:text-white/40 text-[10px] font-medium transition-colors"
                >
                  {t.dontShowAgain}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-white/15 text-[9px] font-mono">{t.pressToOpen}</span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDismiss(false)}
                    className="px-4 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-semibold hover:bg-purple-500/25 transition-all"
                  >
                    {t.dismiss}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook: 管理热键浮层的显示逻辑
 * - 首次访问自动显示（延迟2秒）
 * - 按「?」键手动唤出
 * - 用户选择「不再提示」后永久关闭首次弹出
 */
export function useHotkeyOverlay() {
  const [isHotkeyOpen, setIsHotkeyOpen] = useState(false);

  useEffect(() => {
    // 首次使用检测：如果未曾展示过且未永久关闭，延迟弹出
    const dismissed = localStorage.getItem(HOTKEY_DISMISSED_KEY);
    const shown = localStorage.getItem(HOTKEY_FIRST_SHOWN_KEY);
    
    if (!dismissed && !shown) {
      const timer = setTimeout(() => {
        setIsHotkeyOpen(true);
        localStorage.setItem(HOTKEY_FIRST_SHOWN_KEY, 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // 「?」键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = (e.target as HTMLElement)?.isContentEditable;
      const isInputFocused = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable;

      if (isInputFocused) return;

      if ((e.key === '?' || (e.key === '/' && e.shiftKey)) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsHotkeyOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isHotkeyOpen, setIsHotkeyOpen };
}