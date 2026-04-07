import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Wifi, Shield, Cpu, Zap } from 'lucide-react';

interface Props {
  trackCount: number;
  isPlaying: boolean;
  language: 'zh' | 'en';
  lastSyncTime: string | null;
  isCloudSyncing: boolean;
}

export function NeuralStatusBar({ trackCount, isPlaying, language, lastSyncTime, isCloudSyncing }: Props) {
  const [time, setTime] = useState(new Date());
  const [cpuLoad, setCpuLoad] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setCpuLoad(Math.floor(15 + Math.random() * 20));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="w-full px-3 md:px-5 py-1.5 md:py-2 flex items-center justify-between gap-3 border-t border-white/[0.04] bg-black/30 backdrop-blur-sm select-none relative overflow-hidden">
      {/* Animated scan */}
      <motion.div
        animate={{ x: ['-100%', '300%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 w-[30%] bg-gradient-to-r from-transparent via-purple-500/[0.03] to-transparent pointer-events-none"
      />

      {/* Left: System status */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={isPlaying ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-white/20'}`}
          />
          <span className="text-[8px] md:text-[9px] font-mono font-semibold text-white/25 uppercase tracking-[0.15em]">
            {isPlaying ? (language === 'zh' ? '「ACTIVE」' : 'ACTIVE') : (language === 'zh' ? '「IDLE」' : 'IDLE')}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-white/15">
          <Cpu className="w-2.5 h-2.5" />
          <span className="text-[8px] font-mono font-medium">{cpuLoad}%</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-white/15">
          <Shield className="w-2.5 h-2.5" />
          <span className="text-[8px] font-mono font-medium">AES-256</span>
        </div>
      </div>

      {/* Center: Branding */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-purple-500/40" />
          <span className="text-[8px] md:text-[9px] font-mono font-black text-white/15 tracking-[0.2em] uppercase">
            D-Music
          </span>
          <span className="text-[7px] font-mono text-purple-500/30 ml-0.5">v2.6</span>
        </div>
        <span className="text-white/[0.06] text-[8px]">|</span>
        <span className="text-[7px] md:text-[8px] font-mono text-white/10 tracking-widest">
          {language === 'zh' ? '「六化一体」' : 'Neural · Core'}
        </span>
      </div>

      {/* Right: Metrics */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-white/15">
          <Activity className="w-2.5 h-2.5" />
          <span className="text-[8px] font-mono font-medium">{trackCount} {language === 'zh' ? '「曲」' : 'TRK'}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-white/15">
          <Wifi className={`w-2.5 h-2.5 ${isCloudSyncing ? 'text-blue-400/50 animate-pulse' : ''}`} />
          <span className="text-[8px] font-mono font-medium">
            {isCloudSyncing ? 'SYNC' : lastSyncTime ? 'OK' : 'LOCAL'}
          </span>
        </div>

        <span className="text-[8px] md:text-[9px] font-mono font-medium text-white/20 tabular-nums tracking-wider">
          {timeStr}
        </span>
      </div>
    </div>
  );
}
