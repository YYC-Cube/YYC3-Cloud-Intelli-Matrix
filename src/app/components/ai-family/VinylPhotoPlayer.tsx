/**
 * @file: VinylPhotoPlayer.tsx
 * @description: VinylPhotoPlayer.tsx description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-07
 * @updated: 2026-04-07
 * @status: active
 * @tags: [component]
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Film, Disc3 } from "lucide-react";
import { DMUSIC_PHOTOS } from "../../lib/dmusic-resources";

interface VinylPhotoPlayerProps {
  photos: string[];
  coverUrl?: string;
  isPlaying: boolean;
  audioEnergy: number;
  trackTitle?: string;
  artist?: string;
  hasVideo: boolean;
  onOpenVideo: () => void;
}

export function VinylPhotoPlayer({
  photos,
  coverUrl,
  isPlaying,
  audioEnergy,
  trackTitle,
  artist,
  hasVideo,
  onOpenVideo,
}: VinylPhotoPlayerProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [_imageLoaded, setImageLoaded] = useState(false);
  const [showVideoHint, setShowVideoHint] = useState(false);

  const displayPhotos = photos.length > 0 ? photos : DMUSIC_PHOTOS;
  const currentPhoto = coverUrl || displayPhotos[photoIndex % displayPhotos.length];

  useEffect(() => {
    if (!isPlaying) {return;}
    const interval = setInterval(() => {
      setPhotoIndex(prev => (prev + 1) % displayPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, displayPhotos.length]);

  const rotationDeg = isPlaying ? 360 : 0;

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-5 group"
      style={{
        background: `radial-gradient(circle at center, rgba(30,10,60,0.95) 0%, rgba(4,10,22,0.98) 70%)`,
        border: "1px solid rgba(168,85,247,0.15)",
      }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: isPlaying
            ? `inset 0 0 40px rgba(168,85,247,${0.05 + audioEnergy * 0.1}), 0 0 30px rgba(168,85,247,${0.03 + audioEnergy * 0.08})`
            : "inset 0 0 20px rgba(168,85,247,0.03)",
        }}
      />

      {/* Ambient particles */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-400/20"
              style={{
                left: `${20 + i * 13}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, -80],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2.5 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Vinyl Record Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: rotationDeg }}
          transition={isPlaying ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
          className="relative"
          style={{ width: "85%", height: "85%" }}
        >
          {/* Vinyl base */}
          <div className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `conic-gradient(from 0deg, #0a0612 0deg, #1a0a28 30deg, #0a0612 60deg, #12081f 90deg, #0a0612 120deg, #1a0a28 150deg, #0a0612 180deg, #12081f 210deg, #0a0612 240deg, #1a0a28 270deg, #0a0612 300deg, #12081f 330deg, #0a0612 360deg)`,
              boxShadow: `0 0 60px rgba(168,85,247,${0.1 + audioEnergy * 0.15}), inset 0 0 50px rgba(0,0,0,0.8)`,
            }}
          >
            {/* Vinyl grooves */}
            {[...Array(12)].map((_, i) => {
              const size = 25 + i * 5.5;
              return (
                <div
                  key={i}
                  className="absolute rounded-full border border-white/[0.03]"
                  style={{
                    width: `${size}%`,
                    height: `${size}%`,
                    top: `${(100 - size) / 2}%`,
                    left: `${(100 - size) / 2}%`,
                  }}
                />
              );
            })}

            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full opacity-[0.04]"
              style={{
                background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
              }}
            />
          </div>

          {/* Photo area (center of vinyl) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: rotationDeg }}
              transition={isPlaying ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
              className="relative"
              style={{ width: "52%", height: "52%" }}
            >
              {/* Photo container with clipped circle */}
              <div className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-white/[0.08] shadow-2xl shadow-black/50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt={trackTitle || "董小姐"}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = displayPhotos[0];
                    }}
                  />
                </AnimatePresence>
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* Center spindle hole */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] h-[18%] rounded-full z-10"
                style={{
                  background: "linear-gradient(135deg, #1a0a28 0%, #0a0612 50%, #12081f 100%)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(168,85,247,0.2)",
                  border: "2px solid rgba(168,85,247,0.25)",
                }}
              >
                {/* Spindle center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-500/80"
                  style={{
                    boxShadow: isPlaying ? "0 0 10px rgba(168,85,247,0.8), 0 0 20px rgba(168,85,247,0.4)" : "none",
                  }}
                />
              </div>

              {/* Playing indicator pulse */}
              {isPlaying && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Video button overlay */}
      {hasVideo && (
        <button
          onClick={onOpenVideo}
          onMouseEnter={() => setShowVideoHint(true)}
          onMouseLeave={() => setShowVideoHint(false)}
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all z-20"
          title="播放 MV"
        >
          <Film className="w-4 h-4" />
          <AnimatePresence>
            {showVideoHint && (
              <motion.span
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-purple-300 bg-black/60 px-2 py-1 rounded"
              >
                MV
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}

      {/* Status badge */}
      <div className="absolute bottom-3 left-3 z-20">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/[0.06]">
          <Disc3 className={`w-3 h-3 ${isPlaying ? "text-purple-400" : "text-white/30"}`}
            style={isPlaying ? { animation: "spin 3s linear infinite" } : {}}
          />
          <span className="text-[rgba(168,85,247,0.7)]" style={{ fontSize: "0.55rem" }}>
            {isPlaying ? "D-VINYL" : "PAUSED"}
          </span>
        </div>
      </div>

      {/* Track info overlay at bottom of vinyl */}
      {(trackTitle || artist) && (
        <div className="absolute bottom-14 left-0 right-0 text-center pointer-events-none z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${trackTitle}-${photoIndex}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
            >
              {trackTitle && (
                <p className="text-white/80 font-medium truncate px-4" style={{ fontSize: "0.72rem" }}>
                  {trackTitle}
                </p>
              )}
              {artist && (
                <p className="text-white/30 truncate px-4 mt-0.5" style={{ fontSize: "0.58rem" }}>
                  {artist}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface MVPlayerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  trackTitle: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (pct: number) => void;
  formatTime: (t: number) => string;
}

export function MVPlayerOverlay({
  isOpen, onClose, videoUrl, trackTitle,
  isPlaying, currentTime, duration, onSeek, formatTime,
}: MVPlayerOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) {return;}
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, videoUrl]);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) {return;}
    const diff = Math.abs(videoRef.current.currentTime - currentTime);
    if (diff > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, videoUrl]);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-24 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 z-[70] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-white/10 flex items-center justify-center">
                  <Film className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{trackTitle}</h3>
                  <p className="text-white/30 text-[10px]">D-Music MV</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]">
                ✕
              </button>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
              {videoUrl ? (
                <video
                  ref={videoRef as React.RefObject<HTMLVideoElement>}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  playsInline
                  loop
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/30 gap-3">
                  <Film className="w-16 h-16 opacity-20" />
                  <p className="text-sm">暂无 MV 视频</p>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="px-4 pt-3 pb-2 border-t border-white/[0.04]">
              <div
                className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500 rounded-full relative"
                  style={{ width: `${progressPct}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-white/30 text-[10px] font-mono">{formatTime(currentTime)}</span>
                <span className="text-white/30 text-[10px] font-mono">{formatTime(duration)}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useRef } from "react";
