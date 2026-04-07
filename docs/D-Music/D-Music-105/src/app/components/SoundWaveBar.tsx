import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  compact?: boolean;
}

export function SoundWaveBar({ isPlaying, compact = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const barsRef = useRef<number[]>([]);
  const targetBarsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barCount = compact ? 24 : 36;

    // Initialize bars
    if (barsRef.current.length !== barCount) {
      barsRef.current = new Array(barCount).fill(0.15);
      targetBarsRef.current = new Array(barCount).fill(0.15);
    }

    const resize = () => {
      if (!canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || 100;
      const h = rect?.height || 30;
      ctx.clearRect(0, 0, w, h);

      const t = timeRef.current;
      const gap = compact ? 1.2 : 1.8;
      const totalGaps = (barCount - 1) * gap;
      const barW = Math.max(1.5, (w - totalGaps - 4) / barCount);
      const centerY = h / 2;

      // Update target bars
      if (t % 3 === 0) {
        for (let i = 0; i < barCount; i++) {
          if (isPlaying) {
            // Music-responsive simulation: bass, mid, treble ranges
            const freq = i / barCount;
            const bass = freq < 0.25 ? 0.5 + Math.random() * 0.5 : 0;
            const mid = freq >= 0.25 && freq < 0.65 ? 0.3 + Math.random() * 0.6 : 0;
            const treble = freq >= 0.65 ? 0.2 + Math.random() * 0.4 : 0;
            const pulse = Math.sin(t * 0.08 + i * 0.4) * 0.15;
            targetBarsRef.current[i] = Math.max(0.08, bass + mid + treble + pulse);
          } else {
            // Idle wave
            const wave = Math.sin(t * 0.02 + i * 0.35) * 0.12 + 0.15;
            targetBarsRef.current[i] = Math.max(0.05, wave);
          }
        }
      }

      // Smoothly lerp toward targets
      for (let i = 0; i < barCount; i++) {
        const speed = isPlaying ? 0.18 : 0.06;
        barsRef.current[i] += (targetBarsRef.current[i] - barsRef.current[i]) * speed;
      }

      // Background scan line effect
      const scanPhase = (t * 0.012) % 1;
      const scanX = scanPhase * w;
      const scanGrad = ctx.createLinearGradient(scanX - 15, 0, scanX + 15, 0);
      scanGrad.addColorStop(0, 'rgba(168, 85, 247, 0)');
      scanGrad.addColorStop(0.5, `rgba(168, 85, 247, ${isPlaying ? 0.06 : 0.03})`);
      scanGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < barCount; i++) {
        const amplitude = barsRef.current[i];
        const barH = amplitude * (h * 0.85);
        const x = 2 + i * (barW + gap);

        // Color: purple → violet → blue spectrum
        const hue = 270 + (i / barCount) * 50;
        const saturation = 65 + amplitude * 35;
        const lightness = 45 + amplitude * 30;
        const alpha = isPlaying ? (0.35 + amplitude * 0.65) : (0.15 + amplitude * 0.35);

        // Draw mirrored bar from center
        const y1 = centerY - barH / 2;
        const grad = ctx.createLinearGradient(x, y1, x, y1 + barH);
        grad.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.2})`);
        grad.addColorStop(0.2, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.8})`);
        grad.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${alpha})`);
        grad.addColorStop(0.8, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.8})`);
        grad.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.2})`);

        ctx.fillStyle = grad;
        const r = Math.min(barW / 2, 2);

        // Rounded rect
        ctx.beginPath();
        ctx.moveTo(x + r, y1);
        ctx.lineTo(x + barW - r, y1);
        ctx.quadraticCurveTo(x + barW, y1, x + barW, y1 + r);
        ctx.lineTo(x + barW, y1 + barH - r);
        ctx.quadraticCurveTo(x + barW, y1 + barH, x + barW - r, y1 + barH);
        ctx.lineTo(x + r, y1 + barH);
        ctx.quadraticCurveTo(x, y1 + barH, x, y1 + barH - r);
        ctx.lineTo(x, y1 + r);
        ctx.quadraticCurveTo(x, y1, x + r, y1);
        ctx.fill();

        // Glow for active bars
        if (isPlaying && amplitude > 0.45) {
          ctx.save();
          ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.5)`;
          ctx.shadowBlur = 4;
          ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${(amplitude - 0.4) * 0.4})`;
          ctx.fillRect(x, centerY - 0.5, barW, 1);
          ctx.restore();
        }

        // Peak dots for desktop
        if (!compact && isPlaying && amplitude > 0.55) {
          const dotR = 1.2;
          ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${amplitude * 0.7})`;
          ctx.beginPath();
          ctx.arc(x + barW / 2, y1 - 2, dotR, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + barW / 2, y1 + barH + 2, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Center line
      const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0, 'rgba(168, 85, 247, 0)');
      lineGrad.addColorStop(0.15, `rgba(168, 85, 247, ${isPlaying ? 0.15 : 0.06})`);
      lineGrad.addColorStop(0.5, `rgba(139, 92, 246, ${isPlaying ? 0.2 : 0.08})`);
      lineGrad.addColorStop(0.85, `rgba(59, 130, 246, ${isPlaying ? 0.15 : 0.06})`);
      lineGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, centerY - 0.3, w, 0.6);

      // Traveling light particle
      const pSpeed = isPlaying ? 2.0 : 0.8;
      const pX = ((t * pSpeed) % (w + 30)) - 15;
      const pAlpha = isPlaying ? 0.35 : 0.12;
      const particleGrad = ctx.createRadialGradient(pX, centerY, 0, pX, centerY, 10);
      particleGrad.addColorStop(0, `rgba(255, 255, 255, ${pAlpha})`);
      particleGrad.addColorStop(0.4, `rgba(168, 85, 247, ${pAlpha * 0.5})`);
      particleGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = particleGrad;
      ctx.fillRect(pX - 10, centerY - 10, 20, 20);

      // Second particle (opposite direction, only when playing)
      if (isPlaying) {
        const p2X = w - ((t * 1.3) % (w + 30)) + 15;
        const p2Grad = ctx.createRadialGradient(p2X, centerY, 0, p2X, centerY, 8);
        p2Grad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        p2Grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = p2Grad;
        ctx.fillRect(p2X - 8, centerY - 8, 16, 16);
      }

      timeRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const resizeObs = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObs.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObs.disconnect();
    };
  }, [isPlaying, compact]);

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${compact ? 'h-5 min-w-[50px]' : 'h-7 min-w-[80px]'} flex-1 mx-0.5 md:mx-1`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/[0.04] via-violet-500/[0.06] to-blue-500/[0.04] border border-white/[0.05]" />
      <canvas ref={canvasRef} className="w-full h-full rounded-full" />
      <div className="absolute left-0 top-0 bottom-0 w-2 md:w-3 bg-gradient-to-r from-purple-500/8 to-transparent rounded-l-full pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-2 md:w-3 bg-gradient-to-l from-blue-500/8 to-transparent rounded-r-full pointer-events-none" />
    </motion.div>
  );
}
