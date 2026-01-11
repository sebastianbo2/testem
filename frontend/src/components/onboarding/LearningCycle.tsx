import { motion } from "framer-motion";
import { FileText, Sparkles, PenTool, RefreshCw } from "lucide-react";
import CycleStep from "./CycleStep";

const steps = [
  { icon: FileText, title: "Upload" },
  { icon: Sparkles, title: "Generate" },
  { icon: PenTool, title: "Test" },
  { icon: RefreshCw, title: "Adapt" },
];

export default function LearningCycle({
  activeStep,
}: {
  activeStep: number | null;
}) {
  const RADIUS = 200; // Adjusted for a tighter, cleaner look
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Logic: If activeStep is 0 (first item), we show 25% of the circle.
  // If activeStep is 1 (second item), we show 50%, etc.
  // If null, we show 0 (or you could keep the last position, but 0 is cleaner).
  const fillPercentage = activeStep !== null ? (activeStep + 1) / 4 : 0;

  return (
    <div className="relative w-[360px] h-[360px] mx-auto flex items-center justify-center select-none">
      {/* 1. BACKGROUND TRACK (The Grey Circle) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-full h-full rotate-[-90deg] overflow-visible"
          viewBox="0 0 400 400"
        >
          {/* Dashed Passive Ring connecting all points */}
          <circle
            cx="200"
            cy="200"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/20"
            strokeDasharray="8 8"
          />

          {/* 2. ACTIVE PROGRESS RING */}
          {/* Framer Motion automatically tween's the 'strokeDashoffset' from previous value to new value */}
          <motion.circle
            cx="200"
            cy="200"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary drop-shadow-md"
            // The total length of the stroke is CIRCUMFERENCE.
            // strokeDasharray defines the pattern (draw, gap).
            // We want one long draw of the full circle.
            strokeDasharray={CIRCUMFERENCE}
            // strokeDashoffset controls how much is hidden.
            // offset = circumference * (1 - percentage)
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{
              strokeDashoffset: CIRCUMFERENCE * (1 - fillPercentage),
              opacity: activeStep !== null ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 40,
              damping: 15, // Smooth, non-bouncy transition
              opacity: { duration: 0.2 },
            }}
          />
        </svg>
      </div>

      {/* 3. CENTER TEXT (Replacing the generic blob) */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <motion.div
          className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-background border border-border shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            The
          </span>
          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            Cycle
          </span>
        </motion.div>
      </div>

      {/* 4. THE STEPS (Icons) */}
      <div className="relative z-10 w-full h-full pointer-events-none top-3">
        {steps.map((step, index) => (
          <CycleStep
            key={index}
            index={index}
            icon={step.icon}
            title={step.title}
            isActive={activeStep === index}
            angle={index * 90} // 0, 90, 180, 270 degrees
            radius={RADIUS}
          />
        ))}
      </div>
    </div>
  );
}
