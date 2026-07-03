import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 relative overflow-hidden",
        hover && "glass-hover",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// alias for backward compatibility
export function Card({ children, className, hover = false }: GlassCardProps) {
  return <GlassCard className={className} hover={hover}>{children}</GlassCard>;
}
