import { useState, useEffect } from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { MuseAICore } from './components/MuseAICore';
import { HoloGrid } from './components/HoloGrid';
import { loadConfig } from './components/ThemeCustomizer';
import { motion, AnimatePresence } from 'motion/react';
import dmLogoChrome from "figma:asset/f2b2841ba62d4df9e84f3d8b59fa48efd0972022.png";

export type AppMode = 'management' | 'immersive' | 'mini';

// Map playerSkin to ambient background gradients for page-level differentiation
const SKIN_AMBIENT: Record<string, { bg: string; glow1: string; glow2: string }> = {
  glass:   { bg: '#06050e', glow1: 'rgba(124,58,237,0.08)',  glow2: 'rgba(59,130,246,0.05)'  },
  neon:    { bg: '#03010a', glow1: 'rgba(6,182,212,0.10)',   glow2: 'rgba(139,92,246,0.08)'  },
  minimal: { bg: '#09090f', glow1: 'rgba(180,170,150,0.04)', glow2: 'rgba(100,100,120,0.03)' },
  retro:   { bg: '#0a0804', glow1: 'rgba(245,158,11,0.06)', glow2: 'rgba(234,88,12,0.04)'  },
  aurora:  { bg: '#030a08', glow1: 'rgba(45,212,191,0.08)', glow2: 'rgba(34,211,238,0.05)' },
};

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('management');
  const [isLoading, setIsLoading] = useState(true);
  const [skinId, setSkinId] = useState<string>('glass');
  const [isStandalone, setIsStandalone] = useState(false);

  // Track skin changes from ThemeCustomizer
  useEffect(() => {
    const saved = loadConfig();
    if (saved.playerSkin) setSkinId(saved.playerSkin);

    const observer = new MutationObserver(() => {
      const v = document.documentElement.style.getPropertyValue('--dm-player-skin')?.trim();
      if (v && v !== skinId) setSkinId(v);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  // Listen for global mode switching commands from AI
  useEffect(() => {
    const handleCommand = (e: any) => {
      const { action } = e.detail;
      if (action === 'mode-mini') setAppMode('mini');
      if (action === 'mode-management' || action === 'mode-full') setAppMode('management');
      if (action === 'mode-immersive') setAppMode('immersive');
    };
    window.addEventListener('dm-command', handleCommand);
    return () => window.removeEventListener('dm-command', handleCommand);
  }, []);

  // Boot sequence animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // PWA standalone detection
  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsStandalone(mq.matches || (navigator as any).standalone === true);
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const ambient = SKIN_AMBIENT[skinId] || SKIN_AMBIENT.glass;

  return (
    <div
      className="w-full h-dvh md:h-screen flex items-center justify-center overflow-hidden relative transition-colors duration-1000"
      style={{ backgroundColor: ambient.bg }}
      data-pwa-standalone={isStandalone || undefined}
      role="application"
      aria-label="D-Music"
    >
      {/* Theme-aware ambient background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at top, ${ambient.glow1}, transparent 60%), radial-gradient(ellipse at bottom right, ${ambient.glow2}, transparent 60%)`,
        }}
      />
      
      {/* HoloGrid background */}
      <HoloGrid intensity={appMode === 'immersive' ? 0.5 : 0.8} className="z-0" />

      {/* Boot sequence */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 z-[9999] bg-[#06050e] flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              {/* Chrome liquid D-Music logo */}
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-6px] border border-purple-500/15 rounded-full border-dashed"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-14px] border border-white/[0.04] rounded-full border-dotted"
                />
                <img
                  src={dmLogoChrome}
                  alt="D-Music"
                  className="w-20 h-20 rounded-full object-cover shadow-[0_0_60px_rgba(139,92,246,0.25)]"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-white/60 text-xs font-semibold tracking-[0.3em] uppercase">D-Music</span>
              <span className="text-white/20 text-[9px] font-mono tracking-[0.2em]">「Neural Core Initializing...」</span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
              className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          <MusicPlayer mode={appMode} />
        </motion.div>
      </AnimatePresence>

      {/* Muse AI: The Global Control Core */}
      <MuseAICore />
    </div>
  );
}