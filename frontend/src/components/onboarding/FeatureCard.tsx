import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  isAdapt?: boolean;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  stepNumber,
  isActive,
  onHover,
  onLeave,
  isAdapt = false,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: stepNumber * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full transition-all duration-300 cursor-pointer border-2 overflow-hidden",
          isActive
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-transparent hover:border-border hover:shadow-md"
        )}
      >
        <CardContent className="p-6 flex flex-col h-full">
          {/* Icon with step number */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                "relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isAdapt && isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary/50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform duration-300",
                  isActive && "scale-110",
                  isActive && isAdapt && "animate-spin"
                )}
                style={isActive && isAdapt ? { animationDuration: "3s" } : {}}
              />
            </div>

            <span
              className={cn(
                "text-4xl font-bold transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground/30"
              )}
            >
              {stepNumber}
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-lg font-semibold mb-2 transition-colors duration-300",
              isActive ? "text-foreground" : "text-foreground"
            )}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
            {description}
          </p>

          {/* Accent bar */}
          <motion.div
            className="h-1 rounded-full bg-primary mt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
