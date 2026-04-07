import { motion, AnimatePresence } from 'motion/react';
import { Music, Disc, Cpu } from 'lucide-react';
import dmLogoChrome from "figma:asset/f2b2841ba62d4df9e84f3d8b59fa48efd0972022.png";

interface Props {
  isPlaying: boolean;
  trackTitle: string;
  artist?: string;
  isActive: boolean;
}

export function FloatingCD({ isPlaying, trackTitle, artist, isActive }: Props) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="absolute top-20 right-5 z-[5] pointer-events-none hidden md:flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="relative">
            {/* Holographic Ring */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2.5 border border-dashed border-purple-500/15 rounded-full"
            />
            
            {/* Tech Decoration */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-purple-500/30 rounded-tl-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-blue-500/30 rounded-br-sm" />

            {/* CD Body */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-white/15 flex items-center justify-center relative shadow-lg overflow-hidden ring-2 ring-white/[0.04]"
            >
              {/* Brand logo as CD surface */}
              <img
                src={dmLogoChrome}
                alt=""
                className="absolute inset-0 w-full h-full rounded-full object-cover opacity-40"
              />
              {/* CD Texture / Vinyl Grooves */}
              <div className="absolute inset-0 opacity-20 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_2px,rgba(255,255,255,0.05)_3px,rgba(255,255,255,0.05)_4px)]" />
              
              {/* Center hole */}
              <div className="w-5 h-5 rounded-full bg-black/90 border border-white/10 flex items-center justify-center z-10 shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              </div>
            </motion.div>
            
            {/* Status Indicator */}
            <motion.div
              animate={{
                opacity: isPlaying ? [1, 0.4, 1] : 0.5,
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-black z-20 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
            />
          </div>

          <div className="flex flex-col gap-0.5 min-w-[80px] max-w-[140px]">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-2.5 h-2.5 text-purple-400/60 flex-shrink-0" />
              <span className="text-[7px] font-bold text-purple-400/50 uppercase tracking-[0.15em]">Neural Play</span>
            </div>
            <motion.p
              key={trackTitle}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/70 font-semibold text-xs tracking-tight truncate"
            >
              {trackTitle}
            </motion.p>
            <div className="flex items-center gap-1.5">
              <div className="h-[1px] w-3 bg-white/10" />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="text-white text-[8px] uppercase tracking-[0.15em] font-mono truncate"
              >
                {artist || 'D-MUSIC'}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}