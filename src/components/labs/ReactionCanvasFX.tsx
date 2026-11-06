import React, { useEffect, useRef } from 'react';
import { ChemEffectType } from '../../types/game';

interface Props {
  active: boolean;
  effect: ChemEffectType;
  primaryColor: string;
  secondaryColor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: string;
}

export const ReactionCanvasFX: React.FC<Props> = ({
  active,
  effect,
  primaryColor,
  secondaryColor = '#fde68a',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const particles: Particle[] = [];
    const isFountain = effect === 'foam_geyser' || effect === 'volcano_eruption';

    const spawn = () => {
      if (isFountain && particles.length < 130) {
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: 110 + (Math.random() - 0.5) * 18,
            y: 78,
            vx: (Math.random() - 0.5) * 2.7,
            vy: -3.2 - Math.random() * 3.8,
            r: 4 + Math.random() * 8,
            alpha: 0.95,
            color: Math.random() > 0.45 ? secondaryColor : primaryColor,
          });
        }
      } else if (!isFountain && particles.length < 45 && Math.random() > 0.4) {
        particles.push({
          x: 65 + Math.random() * 90,
          y: 195,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.9 - Math.random() * 1.4,
          r: 2.5 + Math.random() * 4.5,
          alpha: 0.9,
          color: Math.random() > 0.5 ? '#ffffff' : secondaryColor,
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (isFountain) {
          p.vy += 0.14; // gravity arc for soda/volcano foam fountain!
        }
        p.alpha -= 0.012;

        if (p.alpha <= 0 || p.y > 235) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight on foam bubble
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.28, p.y - p.r * 0.28, p.r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active, effect, primaryColor, secondaryColor]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={240}
      className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20"
    />
  );
};
