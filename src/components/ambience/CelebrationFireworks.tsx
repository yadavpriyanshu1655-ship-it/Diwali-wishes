import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
}

interface CelebrationFireworksProps {
  active?: boolean;
  className?: string;
}

export const CelebrationFireworks: React.FC<CelebrationFireworksProps> = ({
  active = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const burstCountRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Earthy Indian Minimalist festive celebration palette
  const particleColors = [
    '#D5A75B', // Warm Mustard / Turmeric
    '#B96543', // Terracotta Clay
    '#F7DF94', // Golden Wheat
    '#FAF6EE', // Soft Ivory Rice
    '#E09F3E', // Marigold Ochre
    '#78805B', // Muted Olive Spark
  ];

  const createBurst = (originX: number, originY: number) => {
    // 25 to 32 particles per burst (lightweight & elegant)
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.8 + Math.random() * 2.8;

      particlesRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 1.8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: 0.95,
        decay: 0.012 + Math.random() * 0.015,
        gravity: 0.045,
        drag: 0.965,
      });
    }
  };

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const startAnimationLoop = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      const render = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= p.drag;
          p.vy *= p.drag;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;

          // Delicate sparkling point
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.alpha > 0.4 ? 1 : p.alpha / 0.4), 0, Math.PI * 2);
          ctx.fill();

          // Subtle faint tail spark
          if (p.alpha > 0.5) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
            ctx.stroke();
          }

          ctx.restore();
        }

        // If active or particles remain, continue loop; otherwise sleep
        if (particlesRef.current.length > 0) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          isRunningRef.current = false;
        }
      };

      animFrameRef.current = requestAnimationFrame(render);
    };

    // When activated, schedule small, serene, celebratory bursts (3-4 bursts over 3.5s)
    if (active) {
      burstCountRef.current = 0;

      const triggerBurstSequence = () => {
        if (burstCountRef.current >= 4) return;

        // Position bursts harmoniously across upper canvas
        const burstX = width * (0.25 + Math.random() * 0.5);
        const burstY = height * (0.18 + Math.random() * 0.28);
        createBurst(burstX, burstY);
        burstCountRef.current++;

        startAnimationLoop();

        // Schedule next burst with natural delay
        if (burstCountRef.current < 4) {
          timerRef.current = setTimeout(triggerBurstSequence, 750 + Math.random() * 650);
        }
      };

      triggerBurstSequence();
    }

    // Tab visibility handling: pause when tab hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        isRunningRef.current = false;
      } else if (particlesRef.current.length > 0) {
        startAnimationLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      isRunningRef.current = false;
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-30 ${className}`}
      aria-hidden="true"
    />
  );
};
