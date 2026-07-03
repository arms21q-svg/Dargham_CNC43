"use client";

import { AnimatedStars } from "./AnimatedStars";

export function SiteBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-navy-mesh"
      aria-hidden
    >
      <div className="absolute inset-0 navy-grid opacity-40 dark:opacity-30" />
      <AnimatedStars />
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 12% 0%, rgba(201,162,39,0.1), transparent 55%)",
            "radial-gradient(ellipse 55% 45% at 88% 100%, rgba(30,77,140,0.12), transparent 50%)",
            "radial-gradient(ellipse 45% 35% at 72% 12%, rgba(166,124,82,0.07), transparent 45%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
