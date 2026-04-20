import React from "react";
import { cn } from "@/lib/utils"; # We'll create this helper in a second

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className, hoverGlow }) => {
  return (
    <div className={cn(
      "glass-panel ghost-border rounded-2xl overflow-hidden transition-all duration-300",
      hoverGlow && "hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]",
      className
    )}>
      {children}
    </div>
  );
};
