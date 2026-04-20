import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  variant?: "default" | "alert" | "active" | "minimal";
}

const variantStyles = {
  default: "bg-white/5 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]",
  alert: "bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]",
  active: "bg-primary/5 border-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.1)]",
  minimal: "bg-transparent border-transparent shadow-none"
};

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className, 
  hoverGlow, 
  variant = "default" 
}) => {
  return (
    <div className={cn(
      "glass-panel rounded-2xl overflow-hidden transition-all duration-300",
      variantStyles[variant],
      hoverGlow && "hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]",
      className
    )}>
      {children}
    </div>
  );
};
