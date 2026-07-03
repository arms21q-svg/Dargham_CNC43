"use client";

import { useEffect, useRef } from "react";
import { BRAND } from "@/lib/brand";
import { usePageActive, usePrefersReducedMotion } from "@/hooks/usePageActive";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
  color: string;
}

const STAR_COLORS = [
  BRAND.colors.navy[600],
  BRAND.colors.navy[400],
  BRAND.colors.gold.DEFAULT,
  BRAND.colors.gold.light,
];

export function AnimatedStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = usePageActive();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId = 0;
    const stars: Star[] = [];
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const STAR_COUNT = isMobile ? 35 : 55;
    let lastFrame = 0;
    const frameInterval = isMobile ? 50 : 33; // ~20fps mobile, ~30fps desktop

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 1.6 + 0.35,
          speed: Math.random() * 0.2 + 0.04,
          opacity: Math.random() * 0.35 + 0.1,
          phase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    };

    const draw = (time: number) => {
      if (!active) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      if (time - lastFrame < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = window.innerHeight + 5;
          star.x = Math.random() * window.innerWidth;
        }

        const twinkle = Math.sin(time * 0.001 + star.phase) * 0.25 + 0.75;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    animationId = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      createStars();
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [active, reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
