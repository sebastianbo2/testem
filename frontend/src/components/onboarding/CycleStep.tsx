import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CycleStepProps {
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  angle: number;
  radius: number;
  index: number;
}

export default function CycleStep({
  icon: Icon,
  title,
  isActive,
  angle,
  radius,
  index,
}: CycleStepProps) {
  // Convert degrees to radians (subtract 90 to start at 12 o'clock)
  const radian = (angle - 90) * (Math.PI / 180);
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      // Position logic handled by framer-motion x/y
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
    >
      {/* Centering Wrapper */}
      <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-24">
        {/* ICON CIRCLE */}
        <motion.div
          className={cn(
            "relative flex items-center justify-center w-20 h-20 rounded-full border-2 transition-all duration-300 bg-card", // bg-card ensures it's white/light
            isActive
              ? "border-primary text-primary shadow-lg shadow-primary/20 scale-110 z-20"
              : "border-muted-foreground/20 text-muted-foreground z-10"
          )}
        >
          <Icon className="w-6 h-6" />

          {/* Active Pulse Ring */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border border-primary"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* LABEL */}
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider transition-colors duration-300 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {title}
        </span>
      </div>
    </motion.div>
  );
}
