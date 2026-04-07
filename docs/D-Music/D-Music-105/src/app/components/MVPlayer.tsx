import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Play, Pause, Maximize2, Minimize2, Volume2, VolumeX,
  Film, SkipBack, SkipForward, Repeat, Repeat1, PictureInPicture2,
  MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'zh' | 'en';

interface MVTrack {
  id: number;
  title: string;
  videoUrl: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  mvTrack: MVTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  onPrev: () => void;
  onNext: () => void;
  formatTime: (t: number) => string;
}

const T = {
  zh: {
    title: 'MV 播放器',
    noMV: '暂无 MV',
    noMVDesc: '当前歌曲没有关联的 MV 视频',
    dragDrop: '拖放视频文件到此处',
    fullscreen: '全屏',
    pip: '画中画',
    loop: '循环',
    loopOne: '单曲循环',
    visualizer: '可视化',
  },
  en: {
    title: 'MV Player',
    noMV: 'No MV',
    noMVDesc: 'Current track has no associated music video',
    dragDrop: 'Drag & drop video file here',
    fullscreen: 'Fullscreen',
    pip: 'Picture-in-Picture',
    loop: 'Loop',
    loopOne: 'Loop One',
    visualizer: 'Visualizer',
  },
};

export function MVPlayer({
  isOpen, onClose, language, mvTrack,
  isPlaying, currentTime, duration, volume, isMuted,
  onPlayPause, onSeek, onVolumeChange, onToggleMute,
  onPrev, onNext, formatTime,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loopMode, setLoopMode] = useState<'none' | 'all' | 'one'>('none');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();
  const t = T[language];

  // Sync video with audio playback state
  useEffect(() => {
    if (!videoRef.current || !mvTrack) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, mvTrack]);

  // Sync time
  useEffect(() => {
    if (!videoRef.current || !mvTrack) return;
    const diff = Math.abs(videoRef.current.currentTime - currentTime);
    if (diff > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, mvTrack]);

  // Sync volume
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = isMuted ? 0 : volume;
    videoRef.current.muted = true; // MV video is muted; audio comes from the main player
  }, [volume, isMuted]);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (_e) { /* ignore */ }
  };

  // PiP toggle
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (_e) { /* ignore */ }
  };

  // Progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, pct)));
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Canvas-based visualizer effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!showVisualizer || !isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const draw = () => {
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      // Draw ambient reactive bars
      const bars = 32;
      const barW = w / bars;
      const time = Date.now() / 1000;
      for (let i = 0; i < bars; i++) {
        const freq = Math.sin(time * 2 + i * 0.3) * 0.3 + Math.sin(time * 3.7 + i * 0.7) * 0.2 + 0.5;
        const barH = freq * h * 0.6;
        const hue = 270 + i * 3;
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.3)`;
        ctx.fillRect(i * barW, h - barH, barW - 2, barH);
        // Mirror top
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.1)`;
        ctx.fillRect(i * barW, 0, barW - 2, barH * 0.3);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [showVisualizer, isPlaying]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-purple-900/30 backdrop-blur-md z-40 rounded-3xl"
          />
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`absolute ${isFullscreen ? 'inset-0' : 'inset-0 sm:inset-2 md:inset-4'} bg-black/90 backdrop-blur-2xl sm:rounded-2xl border-0 sm:border border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl`}
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? 'MV 播放器' : 'MV Player'}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseMove}
          >
            {/* Video area */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              {mvTrack ? (
                <>
                  <video
                    ref={videoRef}
                    src={mvTrack.videoUrl}
                    className="w-full h-full object-contain"
                    playsInline
                    muted
                    loop={loopMode === 'one'}
                    onClick={onPlayPause}
                  />
                  {/* Visualizer overlay */}
                  {showVisualizer && (
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
                    />
                  )}
                  {/* Play overlay on pause */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                        onClick={onPlayPause}
                      >
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <Play className="w-10 h-10 text-white fill-current ml-1" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/40 space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <Film className="w-12 h-12 opacity-40" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white/60">{t.noMV}</p>
                    <p className="text-sm text-white/30 mt-1">{t.noMVDesc}</p>
                  </div>
                </div>
              )}

              {/* Top overlay: title + close */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-b from-black/60 to-transparent z-10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/20 border border-white/10 flex items-center justify-center">
                        <MonitorPlay className="w-4 h-4 text-purple-300" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-sm tracking-wide">
                          {mvTrack ? mvTrack.title : t.title}
                        </h2>
                        <p className="text-white/30 text-[9px]">D-Music MV</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowVisualizer(!showVisualizer)}
                        className={`p-1.5 rounded-lg transition-colors ${showVisualizer ? 'text-purple-300 bg-purple-500/20' : 'text-white/30 hover:text-white/60'}`}
                        title={t.visualizer}
                      >
                        <Film className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={togglePiP} className="p-1.5 text-white/40 hover:text-white/80 transition-colors" title={t.pip}>
                        <PictureInPicture2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={toggleFullscreen} className="p-1.5 text-white/40 hover:text-white/80 transition-colors" title={t.fullscreen}>
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom overlay: controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"
                  >
                    {/* Progress bar */}
                    <div
                      className="w-full h-1 bg-white/15 rounded-full cursor-pointer group hover:h-2 transition-all mb-3 relative"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500 rounded-full relative"
                        style={{ width: `${progressPct}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-0 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-white/40 text-[10px] font-mono w-10">{formatTime(currentTime)}</span>
                        <button onClick={onPrev} className="p-1.5 text-white/60 hover:text-white transition-colors">
                          <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={onPlayPause}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all border border-white/10"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" />
                          ) : (
                            <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-current ml-0.5" />
                          )}
                        </button>
                        <button onClick={onNext} className="p-1.5 text-white/60 hover:text-white transition-colors">
                          <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <span className="text-white/40 text-[10px] font-mono w-10">{formatTime(duration)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLoopMode(loopMode === 'none' ? 'all' : loopMode === 'all' ? 'one' : 'none')}
                          className={`p-1.5 rounded-lg transition-colors ${loopMode !== 'none' ? 'text-purple-300 bg-purple-500/20' : 'text-white/30 hover:text-white/60'}`}
                        >
                          {loopMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                        </button>
                        <button onClick={onToggleMute} className="p-1.5 text-white/50 hover:text-white transition-colors">
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <div className="w-20 h-1 bg-white/10 rounded-full cursor-pointer hidden md:block"
                          onClick={e => {
                            const r = e.currentTarget.getBoundingClientRect();
                            onVolumeChange(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
                          }}
                        >
                          <div className="h-full bg-white/50 rounded-full" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}