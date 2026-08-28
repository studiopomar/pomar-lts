'use client';

import React, { useEffect, useRef } from 'react';

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
  type: 'leaf' | 'petal' | 'fruit' | 'spore';
  color: string;
  opacity: number;
}

export default function OrchardBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color palette matching Studio Pomar: olive, lime, warm terra, and amber
    const colors = [
      'rgba(100, 114, 32, ',   // olive #647220
      'rgba(94, 107, 34, ',    // deep olive #5e6b22
      'rgba(180, 210, 60, ',   // soft lime
      'rgba(215, 140, 90, ',   // warm fruit terracotta
      'rgba(225, 185, 75, ',   // golden sun/pollen
    ];

    const particleTypes: ('leaf' | 'petal' | 'fruit' | 'spore')[] = [
      'leaf',
      'leaf',
      'petal',
      'fruit',
      'spore',
    ];

    // Responsive particle count - subtle and pleasant
    const particleCount = Math.min(Math.floor(window.innerWidth / 50), 24);

    const createParticle = (initialY?: number): Particle => {
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      const opacity = type === 'spore' ? 0.15 + Math.random() * 0.15 : 0.06 + Math.random() * 0.09;

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size: type === 'leaf' ? 12 + Math.random() * 10 : type === 'fruit' ? 8 + Math.random() * 6 : 3 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 0.25 + 0.15,
        speedY: 0.25 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        swaySpeed: 0.006 + Math.random() * 0.01,
        swayOffset: Math.random() * Math.PI * 2,
        type,
        color: baseColor,
        opacity,
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
      // Left curve
      ctx.bezierCurveTo(size * 0.6, -size * 0.4, size * 0.6, size * 0.4, 0, size);
      // Right curve
      ctx.bezierCurveTo(-size * 0.6, size * 0.4, -size * 0.6, -size * 0.4, 0, -size);
      ctx.fill();

      // Delicate leaf center vein
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

      // Fruit body
      ctx.fillStyle = `${col}${op})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Little leaf on top of the fruit
      ctx.fillStyle = `rgba(94, 107, 34, ${op * 1.3})`;
      ctx.beginPath();
      ctx.ellipse(size * 0.25, -size * 0.65, size * 0.35, size * 0.18, Math.PI / 4, 0, Math.PI * 2);
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
        // Organic horizontal swaying (wind in the orchard)
        const currentSway = Math.sin(time * p.swaySpeed + p.swayOffset) * 0.85;
        p.x += p.speedX + currentSway;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around borders
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
        opacity: 0.6,
      }}
    />
  );
}
