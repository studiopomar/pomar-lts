'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme, SeasonTheme } from './ThemeContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  swaySpeed: number;
  swayOffset: number;
  type: 'leaf' | 'petal' | 'fruit' | 'spore' | 'firefly';
  color: string;
  opacity: number;
  glow?: boolean;
}

export default function OrchardBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef<SeasonTheme>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const getThemeConfig = (currentTheme: SeasonTheme) => {
      if (currentTheme === 'autumn') {
        return {
          colors: [
            'rgba(217, 119, 6, ',    // amber
            'rgba(180, 83, 9, ',     // deep amber/rust
            'rgba(234, 88, 12, ',    // vibrant orange
            'rgba(185, 28, 28, ',    // autumn crimson
            'rgba(245, 158, 11, ',   // golden leaf
          ],
          particleTypes: ['leaf', 'leaf', 'fruit', 'petal', 'spore'] as const,
          speedMult: 1.2,
          opacityMult: 1.1,
        };
      }
      if (currentTheme === 'night') {
        return {
          colors: [
            'rgba(215, 255, 63, ',   // neon lime
            'rgba(0, 242, 255, ',    // electric cyan
            'rgba(183, 166, 255, ',  // ethereal lavender
            'rgba(255, 255, 255, ',  // starlight
          ],
          particleTypes: ['firefly', 'firefly', 'spore', 'leaf'] as const,
          speedMult: 0.7,
          opacityMult: 1.4,
        };
      }
      // Summer default
      return {
        colors: [
          'rgba(100, 114, 32, ',   // olive #647220
          'rgba(94, 107, 34, ',    // deep olive #5e6b22
          'rgba(180, 210, 60, ',   // soft lime
          'rgba(215, 140, 90, ',   // warm fruit terracotta
          'rgba(225, 185, 75, ',   // golden sun/pollen
        ],
        particleTypes: ['leaf', 'leaf', 'petal', 'fruit', 'spore'] as const,
        speedMult: 1.0,
        opacityMult: 1.0,
      };
    };

    const particleCount = Math.min(Math.floor(window.innerWidth / 50), 24);

    const createParticle = (initialY?: number): Particle => {
      const cfg = getThemeConfig(themeRef.current);
      const type = cfg.particleTypes[Math.floor(Math.random() * cfg.particleTypes.length)];
      const baseColor = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
      const opacity =
        type === 'firefly'
          ? (0.25 + Math.random() * 0.35) * cfg.opacityMult
          : type === 'spore'
          ? (0.15 + Math.random() * 0.15) * cfg.opacityMult
          : (0.07 + Math.random() * 0.09) * cfg.opacityMult;

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size:
          type === 'leaf'
            ? 12 + Math.random() * 10
            : type === 'fruit'
            ? 8 + Math.random() * 6
            : type === 'firefly'
            ? 3 + Math.random() * 3
            : 3 + Math.random() * 4,
        speedX: ((Math.random() - 0.5) * 0.25 + 0.15) * cfg.speedMult,
        speedY: (0.2 + Math.random() * 0.35) * cfg.speedMult,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        swaySpeed: 0.006 + Math.random() * 0.012,
        swayOffset: Math.random() * Math.PI * 2,
        type,
        color: baseColor,
        opacity,
        glow: type === 'firefly',
      };
    };

    const particles: Particle[] = Array.from({ length: particleCount }, () => createParticle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const drawLeaf = (x: number, y: number, size: number, rot: number, col: string, op: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = `${col}${op})`;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.6, -size * 0.4, size * 0.6, size * 0.4, 0, size);
      ctx.bezierCurveTo(-size * 0.6, size * 0.4, -size * 0.6, -size * 0.4, 0, -size);
      ctx.fill();

      ctx.strokeStyle = `${col}${op * 1.4})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.85);
      ctx.lineTo(0, size * 0.85);
      ctx.stroke();

      ctx.restore();
    };

    const drawFruit = (x: number, y: number, size: number, rot: number, col: string, op: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.fillStyle = `${col}${op})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(94, 107, 34, ${op * 1.3})`;
      ctx.beginPath();
      ctx.ellipse(size * 0.25, -size * 0.65, size * 0.35, size * 0.18, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawFirefly = (x: number, y: number, size: number, col: string, op: number, t: number) => {
      ctx.save();
      const pulse = 0.7 + Math.sin(t * 0.05 + x) * 0.3;
      const currentOp = op * pulse;

      // Outer glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      grad.addColorStop(0, `${col}${currentOp})`);
      grad.addColorStop(0.5, `${col}${currentOp * 0.3})`);
      grad.addColorStop(1, `${col}0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `#ffffff`;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawSpore = (x: number, y: number, size: number, col: string, op: number) => {
      ctx.save();
      ctx.fillStyle = `${col}${op})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        const currentSway = Math.sin(time * p.swaySpeed + p.swayOffset) * 0.85;
        p.x += p.speedX + currentSway;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 40) {
          particles[i] = createParticle(-30);
        }
        if (p.x > width + 40) {
          p.x = -30;
        } else if (p.x < -40) {
          p.x = width + 30;
        }

        if (p.type === 'leaf' || p.type === 'petal') {
          drawLeaf(p.x, p.y, p.size, p.rotation, p.color, p.opacity);
        } else if (p.type === 'fruit') {
          drawFruit(p.x, p.y, p.size, p.rotation, p.color, p.opacity);
        } else if (p.type === 'firefly') {
          drawFirefly(p.x, p.y, p.size, p.color, p.opacity, time);
        } else {
          drawSpore(p.x, p.y, p.size, p.color, p.opacity);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: theme === 'night' ? 0.85 : 0.6,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
}
