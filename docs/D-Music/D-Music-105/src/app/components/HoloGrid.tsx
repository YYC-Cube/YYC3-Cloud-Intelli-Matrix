import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface Props {
  intensity?: number;
  className?: string;
}

export function HoloGrid({ intensity = 1, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const t = timeRef.current;

      // Animated grid
      const gridSize = 60;
      const offsetX = (t * 0.15) % gridSize;
      const offsetY = (t * 0.1) % gridSize;

      ctx.strokeStyle = `rgba(139, 92, 246, ${0.04 * intensity})`;
      ctx.lineWidth = 0.5;

      for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Intersection glow dots
      for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
        for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
          const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);
          const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
          const alpha = (1 - dist / maxDist) * 0.3 * intensity;
          if (alpha > 0.02) {
            const pulse = Math.sin(t * 0.03 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(168, 85, 247, ${alpha * pulse})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Horizontal scan line
      const scanY = ((t * 0.8) % (h + 100)) - 50;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(139, 92, 246, 0)');
      scanGrad.addColorStop(0.5, `rgba(139, 92, 246, ${0.08 * intensity})`);
      scanGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, w, 60);

      // Corner accent beams
      const beamAlpha = 0.06 * intensity;
      // Top-left
      const tl = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.4);
      tl.addColorStop(0, `rgba(124, 58, 237, ${beamAlpha * 1.5})`);
      tl.addColorStop(0.5, `rgba(124, 58, 237, ${beamAlpha * 0.5})`);
      tl.addColorStop(1, 'rgba(124, 58, 237, 0)');
      ctx.fillStyle = tl;
      ctx.fillRect(0, 0, w * 0.5, h * 0.5);

      // Bottom-right
      const br = ctx.createRadialGradient(w, h, 0, w, h, w * 0.35);
      br.addColorStop(0, `rgba(59, 130, 246, ${beamAlpha})`);
      br.addColorStop(0.5, `rgba(59, 130, 246, ${beamAlpha * 0.3})`);
      br.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = br;
      ctx.fillRect(w * 0.5, h * 0.5, w * 0.5, h * 0.5);

      timeRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const obs = new ResizeObserver(resize);
    obs.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      obs.disconnect();
    };
  }, [intensity]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Ambient glow orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] right-[20%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-purple-600/[0.07] rounded-full blur-[80px] md:blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] left-[15%] w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-blue-600/[0.06] rounded-full blur-[60px] md:blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -10, 20, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[50%] left-[50%] w-[100px] h-[100px] md:w-[250px] md:h-[250px] bg-fuchsia-600/[0.04] rounded-full blur-[50px] md:blur-[80px]"
      />
    </div>
  );
}
