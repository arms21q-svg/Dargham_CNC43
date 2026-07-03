import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-navy-700 to-navy-600 text-white hover:from-navy-600 hover:to-navy-500 shadow-lg shadow-navy-900/40 hover:shadow-navy-600/40 hover:scale-[1.03] border border-white/10",
      secondary:
        "bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:from-gold-light hover:to-white shadow-lg shadow-gold/20 hover:scale-[1.03]",
      outline:
        "glass border-white/30 text-foreground hover:bg-white/10 hover:border-white/50 hover:scale-[1.02]",
      ghost: "text-foreground hover:glass rounded-xl",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-semibold overflow-hidden",
          "transition-all duration-400 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
