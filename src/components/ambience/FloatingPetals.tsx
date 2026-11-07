import React, { useRef, useEffect, useState } from 'react';
import { Flower } from 'lucide-react';

interface FloatingPetalsProps {
  initialActive?: boolean;
  className?: string;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  flip: number;
  vFlip: number;
  swayPhase: number;
  swaySpeed: number;
  opacity: number;
  color: string;
}

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({
  initialActive = true,
  className = '',
}) => {
  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const ambientParticlesRef = useRef<AmbientParticle[]>([]);

  // Listen to window event when user enters celebration or lights the diya
  useEffect(() => {
    const handleDiyaLit = () => {
      setIsActive(true);
    };

    window.addEventListener('shubh-deep:diya-lit', handleDiyaLit);
    return () => {
      window.removeEventListener('shubh-deep:diya-lit', handleDiyaLit);
    };
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || !isActive) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

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

    // Natural Earthy Marigold & Mineral Petal Colors
    const petalColors = [
      '#D5A75B', // Warm Mustard / Turmeric (Genda)
      '#E09F3E', // Marigold Ochre
      '#B96543', // Warm Terracotta
      '#C85A32', // Baked Clay
      '#FAF6EE', // White Jasmine / Rice Flour
    ];

    // Warm Amber Micro-Particle Colors
    const ambientColors = [
      '#D5A75B',
      '#F7DF94',
      '#E09F3E',
    ];

    // Mobile optimization: strictly cap particle budget
    const isMobile = window.innerWidth < 640;
    const maxPetals = isMobile ? 14 : 22;
    const maxAmbient = isMobile ? 8 : 14;

    const createPetal = (startY?: number): Petal => {
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : -25 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.55 + Math.random() * 0.75, // Gentle slow fall
        size: 7 + Math.random() * 8, // Varied sizes: 7px to 15px
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.025,
        flip: Math.random() * Math.PI,
        vFlip: 0.015 + Math.random() * 0.025, // 3D tumbling rotation
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.018, // Sine wave breeze
        opacity: 0.55 + Math.random() * 0.3,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      };
    };

    const createAmbientParticle = (startY?: number): AmbientParticle => {
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : height + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.3 + Math.random() * 0.45), // Gentle upward drift
        size: 1.2 + Math.random() * 1.2,
        opacity: 0.3 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: ambientColors[Math.floor(Math.random() * ambientColors.length)],
      };
    };

    // Initialize dispersed arrays
    petalsRef.current = Array.from({ length: maxPetals }, () =>
      createPetal(Math.random() * height)
    );

    ambientParticlesRef.current = Array.from({ length: maxAmbient }, () =>
      createAmbientParticle(Math.random() * height)
    );

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Warm Ambient Particles
      for (let i = 0; i < ambientParticlesRef.current.length; i++) {
        const a = ambientParticlesRef.current[i];
        a.pulsePhase += a.pulseSpeed;
        a.x += a.vx + Math.sin(a.pulsePhase * 0.7) * 0.3;
        a.y += a.vy;

        if (a.y < -15) {
          ambientParticlesRef.current[i] = createAmbientParticle();
          continue;
        }

        const currentAlpha = a.opacity * (0.65 + Math.sin(a.pulsePhase) * 0.35);

        ctx.save();
        ctx.fillStyle = a.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Floating Marigold Petals
      for (let i = 0; i < petalsRef.current.length; i++) {
        const p = petalsRef.current[i];
        p.swayPhase += p.swaySpeed;
        p.rotation += p.vRot;
        p.flip += p.vFlip;

        // Gentle horizontal sine-wave breeze
        p.x += p.vx + Math.sin(p.swayPhase) * 0.75;
        p.y += p.vy;

        if (p.y > height + 25) {
          petalsRef.current[i] = createPetal();
          continue;
        }

        // 3D tumble compression
        const scaleX = Math.cos(p.flip);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Organic curved marigold petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(
          p.size * 0.65,
          -p.size * 0.5,
          p.size * 0.65,
          p.size * 0.5,
          0,
          p.size
        );
        ctx.bezierCurveTo(
          -p.size * 0.65,
          p.size * 0.5,
          -p.size * 0.65,
          -p.size * 0.5,
          0,
          -p.size
        );
        ctx.closePath();
        ctx.fill();

        // Subtle petal spine
        ctx.strokeStyle = '#FAF6EE';
        ctx.globalAlpha = p.opacity * 0.32;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.75);
        ctx.lineTo(0, p.size * 0.75);
        ctx.stroke();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Tab visibility handling: pause loop when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  return (
    <>
      {/* Floating Canvas across viewport */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-20 ${
          isActive ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000 ${className}`}
        aria-hidden="true"
      />

      {/* Floating Ambient Toggle Badge */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-sans font-medium transition-all shadow-soft backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            isActive
              ? 'bg-surface/95 border-primary/30 text-primary shadow-earthy'
              : 'bg-surface/75 border-secondary/20 text-secondary hover:text-primary hover:border-secondary/40'
          }`}
          aria-label={isActive ? 'पुष्प वर्षा बंद करें (Turn off Petals)' : 'पुष्प वर्षा चालू करें (Turn on Petals)'}
          title={isActive ? 'Pause Falling Marigold Petals' : 'Enable Falling Marigold Petals'}
        >
          <Flower
            className={`w-3.5 h-3.5 text-accent transition-transform duration-500 ${
              isActive ? 'rotate-45' : 'group-hover:rotate-12'
            }`}
          />
          <span className="font-serif-indian text-xs hidden sm:inline">
            {isActive ? 'पुष्प वर्षा' : 'पुष्प शांत'}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text/60 font-sans hidden md:inline">
            {isActive ? 'Petals On' : 'Petals Off'}
          </span>
        </button>
      </div>
    </>
  );
};
