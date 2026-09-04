"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; started: number };

export default function ClickFeedback({ children }: { children: React.ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = canvas.current;
    const context = target?.getContext("2d");
    if (!target || !context) return;
    const ripples: Ripple[] = [];
    let frame = 0;
    const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      target.width = Math.round(window.innerWidth * ratio);
      target.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (now: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const styles = getComputedStyle(document.documentElement);
      const coral = styles.getPropertyValue("--coral").trim() || "#d57d65";
      const accent = styles.getPropertyValue("--accent").trim() || "#237663";
      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        const progress = Math.min((now - ripple.started) / 720, 1);
        if (progress >= 1) {
          ripples.splice(index, 1);
          continue;
        }
        const radius = 8 + progress * 28;
        context.globalAlpha = 0.8 * (1 - progress);
        context.strokeStyle = coral;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = accent;
        for (let spark = 0; spark < 3; spark += 1) {
          const angle = -Math.PI / 2 + spark * (Math.PI * 2 / 3);
          const distance = 8 + progress * 30;
          context.beginPath();
          context.arc(ripple.x + Math.cos(angle) * distance, ripple.y + Math.sin(angle) * distance, 2.5 * (1 - progress), 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
      frame = ripples.length ? window.requestAnimationFrame(draw) : 0;
    };
    const onClick = (event: MouseEvent) => {
      if (reducedMotion()) return;
      ripples.push({ x: event.clientX, y: event.clientY, started: performance.now() });
      if (!frame) frame = window.requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick, true);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="click-feedback-host">
    {children}
    <div className="click-feedback" aria-hidden="true"><canvas ref={canvas} /></div>
  </div>;
}
