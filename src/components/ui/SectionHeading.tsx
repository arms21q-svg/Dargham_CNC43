"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, transition } from "@/lib/animations";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, className, centered = true }: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={transition}
      className={cn(centered && "text-center", "mb-14", className)}
    >
      <span className="inline-block glass px-5 py-1.5 rounded-full font-label text-gold mb-5 border border-gold/20 tracking-widest">
        DIRGHAM · ضرغام
      </span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mt-8">
        <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
        <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(201,162,39,0.6)]" />
        <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50" />
      </div>
    </motion.div>
  );
}
