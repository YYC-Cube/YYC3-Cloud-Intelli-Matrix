import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Music, Maximize2, ChevronLeft, ChevronRight, Disc3,
  Waves, Hexagon, Orbit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import dmLogoRed from "figma:asset/cdb6898d69cc4e5ec95856624e6740a30b4ed169.png";
import dmLogoChrome from "figma:asset/f2b2841ba62d4df9e84f3d8b59fa48efd0972022.png";

export type MiniForm = 'capsule' | 'vinyl' | 'spectrum' | 'nebula' | 'holocard';

interface Props {
  currentTrack: { id: number; title: string } | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  onExpand: () => void;
  formatTime: (t: number) => string;
  miniForm: MiniForm;
  onChangeForm: (form: MiniForm) => void;
  language: 'zh' | 'en';
}

const FORMS: MiniForm[] = ['capsule', 'vinyl', 'spectrum', 'nebula', 'holocard'];
const FORM_LABELS: Record<string, Record<MiniForm, string>> = {
  zh: { capsule: '「胶囊」', vinyl: '「黑胶」', spectrum: '「频谱」', nebula: '「星云」', holocard: '「全息」' },
  en: { capsule: 'Capsule', vinyl: 'Vinyl', spectrum: 'Spectrum', nebula: 'Nebula', holocard: 'Holo' },
};
const FORM_ICONS: Record<MiniForm, React.ComponentType<any>> = {
  capsule: Waves, vinyl: Disc3, spectrum: Waves, nebula: Orbit, holocard: Hexagon,
};

export function MiniPlayer(props: Props) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    onPlayPause, onPrev, onNext, onSeek, onVolumeChange, onToggleMute,
    onExpand, formatTime, miniForm, onChangeForm, language,
  } = props;

  const progress = duration > 0 ? currentTime / duration : 0;
  const [showFormPicker, setShowFormPicker] = useState(false);

  const cycleForm = (dir: 1 | -1) => {
    const idx = FORMS.indexOf(miniForm);
    const next = (idx + dir + FORMS.length) % FORMS.length;
    onChangeForm(FORMS[next]);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Form picker overlay */}
      <AnimatePresence>
        {showFormPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl rounded-3xl" onClick={() => setShowFormPicker(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-2xl max-w-[380px] w-full mx-4"
            >
              <p className="text-white/40 text-[10px] font-semibold mb-5 uppercase tracking-[0.25em] text-center">
                {language === 'zh' ? '「选择播放器形态」' : 'Player Form'}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {FORMS.map(f => {
                  const Icon = FORM_ICONS[f];
                  const active = miniForm === f;
                  return (
                    <motion.button
                      key={f}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { onChangeForm(f); setShowFormPicker(false); }}
                      className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                        active
                          ? 'bg-purple-500/20 border-purple-400/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[8px] font-bold tracking-wide">{FORM_LABELS[language][f]}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form switcher tab */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5">
        <button onClick={() => cycleForm(-1)} className="p-1.5 text-white/20 hover:text-white/50 transition-colors">
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={() => setShowFormPicker(true)}
          className="px-4 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/30 text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-white/[0.08] hover:text-white/50 transition-all"
        >
          {FORM_LABELS[language][miniForm]}
        </button>
        <button onClick={() => cycleForm(1)} className="p-1.5 text-white/20 hover:text-white/50 transition-colors">
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Expand button */}
      <button
        onClick={onExpand}
        className="absolute top-3 right-3 z-40 p-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
        title={language === 'zh' ? '「展开」' : 'Expand'}
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>

      {/* ═══ FORM RENDERERS ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={miniForm}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="w-full flex items-center justify-center"
        >
          {miniForm === 'capsule' && (
            <CapsuleForm
              track={currentTrack} isPlaying={isPlaying} progress={progress}
              currentTime={currentTime} duration={duration}
              onPlayPause={onPlayPause} onPrev={onPrev} onNext={onNext}
              onSeek={onSeek} formatTime={formatTime}
            />
          )}
          {miniForm === 'vinyl' && (
            <VinylForm
              track={currentTrack} isPlaying={isPlaying} progress={progress}
              onPlayPause={onPlayPause} onPrev={onPrev} onNext={onNext}
              formatTime={formatTime} currentTime={currentTime} duration={duration}
              onSeek={onSeek}
            />
          )}
          {miniForm === 'spectrum' && (
            <SpectrumForm
              track={currentTrack} isPlaying={isPlaying} progress={progress}
              onPlayPause={onPlayPause} onPrev={onPrev} onNext={onNext}
              onSeek={onSeek} formatTime={formatTime}
              currentTime={currentTime} duration={duration}
            />
          )}
          {miniForm === 'nebula' && (
            <NebulaForm
              track={currentTrack} isPlaying={isPlaying} progress={progress}
              onPlayPause={onPlayPause} onPrev={onPrev} onNext={onNext}
              formatTime={formatTime} currentTime={currentTime} duration={duration}
              onSeek={onSeek}
            />
          )}
          {miniForm === 'holocard' && (
            <HoloCardForm
              track={currentTrack} isPlaying={isPlaying} progress={progress}
              onPlayPause={onPlayPause} onPrev={onPrev} onNext={onNext}
              onSeek={onSeek} formatTime={formatTime}
              currentTime={currentTime} duration={duration}
              volume={volume} isMuted={isMuted}
              onVolumeChange={onVolumeChange} onToggleMute={onToggleMute}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Shared: Draggable progress bar (Spotify / Apple Music style)
// ═══════════════════════════════════════════════════════════
function ProgressSlider({ progress, onSeek, className = '', gradient = 'from-purple-500 to-violet-400' }: {
  progress: number; onSeek: (p: number) => void; className?: string; gradient?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const seek = useCallback((clientX: number) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(p);
  }, [onSeek]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      seek(x);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, seek]);

  return (
    <div
      ref={barRef}
      className={`relative cursor-pointer group ${className}`}
      onMouseDown={(e) => { setDragging(true); seek(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); seek(e.touches[0].clientX); }}
    >
      <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden group-hover:h-1.5 transition-all">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full relative`}
          style={{ width: `${progress * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
        </div>
      </div>
      {/* Thumb dot */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] scale-0 group-hover:scale-100 transition-transform"
        style={{ left: `calc(${progress * 100}% - 6px)` }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM 1: CAPSULE — Spotify-style bottom dock bar
// Inspired by: Spotify, YouTube Music bottom sheet
// ═══════════════════════════════════════════════════════════
function CapsuleForm({ track, isPlaying, progress, currentTime, duration, onPlayPause, onPrev, onNext, onSeek, formatTime }: any) {
  return (
    <div className="w-full max-w-[440px] px-4">
      {/* Main capsule container */}
      <div className="relative bg-gradient-to-r from-[#1a1030]/95 to-[#12081e]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,92,246,0.05)] overflow-hidden">
        {/* Top progress bar — thin line like Spotify's queue bar */}
        <div className="h-[2px] bg-white/[0.04]">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-violet-400"
            style={{ width: `${progress * 100}%` }}
            layout
          />
        </div>

        <div className="p-3.5 flex items-center gap-3.5">
          {/* Album art — D-Music brand logo */}
          <motion.div
            animate={isPlaying ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
          >
            <img
              src={dmLogoChrome}
              alt="Album"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Equalizer bars overlay when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="flex gap-[3px] items-end h-5">
                  {[0.6, 1, 0.75, 0.9, 0.5].map((d, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['30%', `${60 + Math.random() * 40}%`, '30%'] }}
                      transition={{ repeat: Infinity, duration: 0.4 + d * 0.3, ease: 'easeInOut' }}
                      className="w-[3px] bg-white/80 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Shimmer on playing */}
            {isPlaying && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            )}
          </motion.div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate leading-tight">
              {track?.title || 'D-Music'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/25 text-[10px] font-mono tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-violet-400 rounded-full transition-all duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-white/25 text-[10px] font-mono tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button onClick={onPrev} className="p-2 text-white/40 hover:text-white active:scale-90 transition-all">
              <SkipBack className="w-4 h-4" />
            </button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onPlayPause}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-white text-[#1a1030]'
                  : 'bg-white text-[#1a1030]'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-[18px] h-[18px] fill-current" />
              ) : (
                <Play className="w-[18px] h-[18px] fill-current ml-0.5" />
              )}
            </motion.button>
            <button onClick={onNext} className="p-2 text-white/40 hover:text-white active:scale-90 transition-all">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM 2: VINYL — Realistic turntable with tonearm
// Inspired by: Vinyl record players, Technics SL-1200
// ═══════════════════════════════════════════════════════════
function VinylForm({ track, isPlaying, progress, onPlayPause, onPrev, onNext, formatTime, currentTime, duration, onSeek }: any) {
  const discSize = 210;
  const center = discSize / 2;
  const progressRadius = 98;
  const circumference = 2 * Math.PI * progressRadius;

  return (
    <div className="flex flex-col items-center gap-5 pt-6">
      {/* Turntable platter */}
      <div className="relative" style={{ width: discSize + 20, height: discSize + 20 }}>
        {/* Platter base ring */}
        <div className="absolute inset-0 rounded-full border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent" />

        {/* SVG progress ring */}
        <svg className="absolute inset-0" viewBox={`0 0 ${discSize + 20} ${discSize + 20}`}>
          <circle cx={center + 10} cy={center + 10} r={progressRadius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
          <circle
            cx={center + 10} cy={center + 10} r={progressRadius} fill="none"
            stroke="url(#vinylProgressGrad)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform={`rotate(-90 ${center + 10} ${center + 10})`}
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="vinylProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Spinning vinyl disc */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          className="absolute inset-[10px] rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle, #0d0a18 0%, #1a1530 35%, #0f0c1a 50%, #1a1530 65%, #0d0a18 100%)',
          }}
        >
          {/* Groove rings — realistic */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                inset: `${12 + i * 6}px`,
                borderColor: i % 3 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
              }}
            />
          ))}

          {/* Center label — chrome logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-violet-900/60 border border-purple-500/15 flex items-center justify-center shadow-inner overflow-hidden">
              <img src={dmLogoChrome} alt="D-Music" className="w-12 h-12 rounded-full object-cover" />
            </div>
          </div>

          {/* Light reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)',
            }}
          />
        </motion.div>

        {/* Tonearm */}
        <motion.div
          animate={{ rotate: isPlaying ? -8 + progress * 20 : -15 }}
          transition={{ type: 'spring', stiffness: 40, damping: 20 }}
          className="absolute z-20"
          style={{ top: -6, right: 20, transformOrigin: 'top right', width: 100, height: 100 }}
        >
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border border-white/20 shadow-lg" />
          <div
            className="absolute top-3 right-1.5 w-1 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full origin-top"
            style={{ height: 80, transform: 'rotate(20deg)' }}
          />
          <div className="absolute bottom-0 left-4 w-2.5 h-4 bg-gradient-to-b from-gray-500 to-gray-300 rounded-b-sm" />
        </motion.div>

        {/* Play overlay on click */}
        <button
          onClick={onPlayPause}
          className="absolute inset-[10px] rounded-full flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            {isPlaying ? <Pause className="w-6 h-6 text-white fill-current" /> : <Play className="w-6 h-6 text-white fill-current ml-0.5" />}
          </div>
        </button>
      </div>

      {/* Track info */}
      <div className="text-center max-w-[280px]">
        <p className="text-white text-sm font-bold truncate">{track?.title || 'D-Music'}</p>
        <p className="text-white/20 text-[10px] font-mono mt-1 tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex items-center gap-5">
        <button onClick={onPrev} className="p-2.5 text-white/30 hover:text-white/70 active:scale-90 transition-all">
          <SkipBack className="w-5 h-5" />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPlayPause}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all ${
            isPlaying
              ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-purple-500/30'
              : 'bg-white text-[#0a0816]'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </motion.button>
        <button onClick={onNext} className="p-2.5 text-white/30 hover:text-white/70 active:scale-90 transition-all">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM 3: SPECTRUM — SoundCloud-inspired waveform card
// Inspired by: SoundCloud player, Audius, Pro audio DAWs
// ═══════════════════════════════════════════════════════════
function SpectrumForm({ track, isPlaying, progress, onPlayPause, onPrev, onNext, onSeek, formatTime, currentTime, duration }: any) {
  const bars = 48;
  const barRef = useRef<HTMLDivElement>(null);

  // Generate static waveform shape (seeded by track name for consistency)
  const waveform = useRef<number[]>([]);
  if (waveform.current.length === 0) {
    const seed = (track?.title || 'default').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    waveform.current = Array.from({ length: bars }, (_, i) => {
      const x = (i + seed) * 2.37;
      return 0.25 + 0.75 * Math.abs(Math.sin(x) * Math.cos(x * 0.7) * Math.sin(x * 0.3 + 1.2));
    });
  }

  const handleWaveClick = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const p = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, p)));
  };

  return (
    <div className="w-full max-w-[400px] px-4">
      <div className="bg-gradient-to-b from-[#0e0a1a]/95 to-[#08061a]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-[0_10px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header with track info */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-black/30">
            <img src={dmLogoRed} alt="D-Music" className="w-10 h-10 object-contain" style={{ filter: 'brightness(1.4) drop-shadow(0 2px 6px rgba(220,38,38,0.2))' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{track?.title || 'D-Music'}</p>
            <p className="text-white/20 text-[10px] font-medium mt-0.5">
              {isPlaying ? 'Playing' : 'Paused'}
            </p>
          </div>
        </div>

        {/* Waveform visualization — SoundCloud style */}
        <div
          ref={barRef}
          className="h-16 flex items-end gap-[1.5px] px-4 pb-1 cursor-pointer relative"
          onClick={handleWaveClick}
        >
          {waveform.current.map((h, i) => {
            const barPos = i / bars;
            const isPast = barPos < progress;
            const isCurrent = Math.abs(barPos - progress) < 1 / bars;
            const animH = isPlaying ? h * (0.7 + Math.random() * 0.3) : h;

            return (
              <motion.div
                key={i}
                animate={{ height: `${animH * 100}%` }}
                transition={{ duration: isPlaying ? 0.15 : 0.6 }}
                className={`flex-1 rounded-full transition-colors duration-150 min-h-[3px] ${
                  isCurrent
                    ? 'bg-white'
                    : isPast
                      ? 'bg-gradient-to-t from-purple-500/80 to-purple-400/60'
                      : 'bg-white/[0.08]'
                }`}
              />
            );
          })}
          {/* Playhead line */}
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-white/60 z-10 pointer-events-none"
            style={{ left: `calc(${progress * 100}% + 16px - ${progress * 32}px)` }}
          />
        </div>

        {/* Time + Controls */}
        <div className="px-4 pb-3.5 pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-white/25 text-[10px] font-mono tabular-nums">{formatTime(currentTime)}</span>
            <span className="text-white/25 text-[10px] font-mono tabular-nums">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-5">
            <button onClick={onPrev} className="p-1.5 text-white/30 hover:text-white/70 active:scale-90 transition-all">
              <SkipBack className="w-4 h-4" />
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onPlayPause}
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isPlaying
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/25'
                  : 'bg-white text-[#0a0816]'
              }`}
            >
              {isPlaying ? <Pause className="w-[18px] h-[18px] fill-current" /> : <Play className="w-[18px] h-[18px] fill-current ml-0.5" />}
            </motion.button>
            <button onClick={onNext} className="p-1.5 text-white/30 hover:text-white/70 active:scale-90 transition-all">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM 4: NEBULA — Apple Music spatial/ambient player
// Inspired by: Apple Music Now Playing, ambient mode
// ═══════════════════════════════════════════════════════════
function NebulaForm({ track, isPlaying, progress, onPlayPause, onPrev, onNext, formatTime, currentTime, duration, onSeek }: any) {
  return (
    <div className="flex flex-col items-center gap-6 pt-6 relative">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={isPlaying ? {
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          } : {}}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute top-8 left-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px]"
        />
        <motion.div
          animate={isPlaying ? {
            x: [0, -25, 15, -5, 0],
            y: [0, 15, -25, 20, 0],
            scale: [1, 0.8, 1.3, 0.9, 1],
          } : {}}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          className="absolute bottom-16 right-1/4 w-36 h-36 bg-blue-600/8 rounded-full blur-[50px]"
        />
        <motion.div
          animate={isPlaying ? {
            x: [0, 20, -15, 0],
            y: [0, -15, 10, 0],
          } : {}}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-28 h-28 bg-pink-500/6 rounded-full blur-[40px]"
        />
      </div>

      {/* Central artwork — ambient pulsing orb */}
      <div className="relative w-44 h-44">
        {/* Outer pulse ring */}
        <motion.div
          animate={isPlaying ? { scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] } : { scale: 1, opacity: 0.1 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border border-purple-400/20"
        />
        <motion.div
          animate={isPlaying ? { scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] } : { scale: 1, opacity: 0.05 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
          className="absolute inset-2 rounded-full border border-violet-400/15"
        />

        {/* Main orb */}
        <motion.div
          animate={isPlaying ? { scale: [1, 1.04, 1] } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute inset-5 rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(168,85,247,0.25), rgba(59,130,246,0.15), rgba(236,72,153,0.08), rgba(10,8,22,0.9))',
          }}
        >
          {/* Inner noise texture */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.08), transparent 60%)' }} />

          {/* Center — brand logo with equalizer overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={dmLogoChrome} alt="D-Music" className="absolute w-16 h-16 rounded-full object-cover opacity-25" />
            {isPlaying ? (
              <div className="flex gap-[3px] items-end h-8 relative z-10">
                {[0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.65].map((d, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', `${50 + d * 50}%`, '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.5 + d * 0.4, ease: 'easeInOut', delay: i * 0.07 }}
                    className="w-[2.5px] bg-white/60 rounded-full"
                  />
                ))}
              </div>
            ) : (
              <Music className="w-8 h-8 text-white/20 relative z-10" />
            )}
          </div>
        </motion.div>

        {/* Orbiting particle ring */}
        {isPlaying && [0, 72, 144, 216, 288].map((deg, i) => (
          <motion.div
            key={i}
            animate={{ rotate: [deg, deg + 360] }}
            transition={{ repeat: Infinity, duration: 8 + i * 1.5, ease: 'linear' }}
            className="absolute inset-[-4px]"
            style={{ transformOrigin: 'center' }}
          >
            <div
              className={`absolute w-1.5 h-1.5 rounded-full ${
                i % 3 === 0 ? 'bg-purple-400/50' : i % 3 === 1 ? 'bg-blue-400/40' : 'bg-pink-400/35'
              }`}
              style={{ top: 0, left: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 6px currentColor' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Track title */}
      <div className="text-center max-w-[280px] relative z-10">
        <p className="text-white text-base font-bold truncate">{track?.title || 'D-Music'}</p>
        <p className="text-purple-300/25 text-[10px] font-mono mt-1.5 uppercase tracking-[0.2em]">
          {isPlaying ? 'Now Playing' : 'Paused'}
        </p>
      </div>

      {/* Progress + time */}
      <div className="w-full max-w-[280px] relative z-10">
        <ProgressSlider progress={progress} onSeek={onSeek} gradient="from-purple-500 via-violet-400 to-blue-400" />
        <div className="flex justify-between mt-1.5 text-[10px] font-mono text-white/20 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 relative z-10">
        <button onClick={onPrev} className="p-2 text-white/25 hover:text-white/60 active:scale-90 transition-all">
          <SkipBack className="w-5 h-5" />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPlayPause}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-white/10 text-white border border-white/15 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.15)]'
              : 'bg-white text-[#0a0816] shadow-[0_0_20px_rgba(255,255,255,0.08)]'
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </motion.button>
        <button onClick={onNext} className="p-2 text-white/25 hover:text-white/60 active:scale-90 transition-all">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM 5: HOLOCARD — Futuristic HUD card with data readouts
// Inspired by: Cyberpunk 2077 UI, Iron Man HUD, sci-fi interfaces
// ═══════════════════════════════════════════════════════════
function HoloCardForm({ track, isPlaying, progress, onPlayPause, onPrev, onNext, onSeek, formatTime, currentTime, duration, volume, isMuted, onVolumeChange, onToggleMute }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 10, y: -x * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, rotateY: -15 }}
      animate={{ opacity: 1, rotateY: 0 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.12s ease-out',
      }}
      className="w-[360px] relative"
    >
      {/* Holographic shimmer overlay */}
      <div
        className="absolute inset-0 z-[5] rounded-2xl pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(${120 + tilt.y * 8}deg, rgba(168,85,247,0.3), transparent 30%, rgba(59,130,246,0.2) 50%, transparent 70%, rgba(236,72,153,0.15))`,
        }}
      />

      {/* Scan line */}
      <motion.div
        animate={{ y: ['-100%', '300%'] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent z-[6] pointer-events-none rounded-2xl"
      />

      {/* Card body */}
      <div className="relative z-10 bg-[#0a0816]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_1px_rgba(139,92,246,0.2)]">
        {/* HUD top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-white/15'}`} />
            <span className="text-[9px] font-mono font-bold text-white/25 uppercase tracking-[0.2em]">
              {isPlaying ? 'STREAM ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <div className="text-[9px] font-mono text-white/15 tabular-nums">
            {Math.round(progress * 100).toString().padStart(3, '0')}%
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 space-y-3.5">
          {/* Track header */}
          <div className="flex items-center gap-3.5">
            {/* Holographic album art — brand logo */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <img src={dmLogoChrome} alt="D-Music" className="absolute inset-0 w-full h-full object-cover" />
              {isPlaying && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="absolute inset-0"
                  style={{ background: 'conic-gradient(from 0deg, rgba(139,92,246,0.2), transparent 30%, rgba(59,130,246,0.15) 60%, transparent)' }}
                />
              )}
              {/* Corner HUD brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/30 z-10" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/30 z-10" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/30 z-10" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/30 z-10" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{track?.title || 'D-Music'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-cyan-400/40 text-[9px] font-mono uppercase tracking-wider">
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Data readout */}
            <div className="text-right flex-shrink-0">
              <div className="text-white/50 text-xs font-mono tabular-nums">{formatTime(currentTime)}</div>
              <div className="text-white/15 text-[9px] font-mono tabular-nums">{formatTime(duration)}</div>
            </div>
          </div>

          {/* Progress bar with HUD styling */}
          <div className="space-y-1">
            <div
              className="h-1.5 bg-white/[0.04] rounded-full cursor-pointer relative overflow-hidden group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onSeek((e.clientX - rect.left) / rect.width);
              }}
            >
              <div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)',
                }}
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between pt-0.5">
            {/* Volume */}
            <div className="flex items-center gap-1.5 w-24">
              <button onClick={onToggleMute} className="p-1 text-white/25 hover:text-white/60 transition-colors">
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <div
                className="flex-1 h-[3px] bg-white/[0.06] rounded-full cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onVolumeChange(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                }}
              >
                <div className="h-full bg-white/30 rounded-full" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-3">
              <button onClick={onPrev} className="p-1.5 text-white/30 hover:text-white/70 active:scale-90 transition-all">
                <SkipBack className="w-4 h-4" />
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onPlayPause}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                  isPlaying
                    ? 'bg-cyan-500/15 border-cyan-400/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-white/10 border-white/15 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </motion.button>
              <button onClick={onNext} className="p-1.5 text-white/30 hover:text-white/70 active:scale-90 transition-all">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Spacer for symmetry */}
            <div className="w-24" />
          </div>
        </div>

        {/* HUD bottom bar */}
        <div className="flex items-center justify-center gap-3 px-4 py-2 border-t border-white/[0.03] bg-white/[0.01]">
          <div className="w-1 h-1 rounded-full bg-purple-500/30" />
          <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.3em]">Neural Audio Engine · D-Music</span>
          <div className="w-1 h-1 rounded-full bg-blue-500/30" />
        </div>
      </div>

      {/* Corner glow accents */}
      <div className="absolute top-0 left-0 w-12 h-12 bg-purple-500/8 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-cyan-500/6 rounded-full blur-xl pointer-events-none" />
    </motion.div>
  );
}

// Shimmer animation for progress bars
const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
.animate-shimmer {
  animation: shimmer 3s linear infinite;
}
`;

// Inject shimmer styles
if (typeof document !== 'undefined') {
  const styleEl = document.getElementById('mini-player-styles') || document.createElement('style');
  styleEl.id = 'mini-player-styles';
  styleEl.textContent = shimmerStyle;
  if (!styleEl.parentNode) document.head.appendChild(styleEl);
}