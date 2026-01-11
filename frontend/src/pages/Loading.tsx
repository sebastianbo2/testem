import { motion } from "framer-motion";
import Logo from "@/components/icons/Logo";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl transition-all">
      <div className="relative flex items-center justify-center">
        {/* 1. Outer Glowing Gradient Ring (Slow Rotation) */}
        <motion.div
          className="absolute w-32 h-32 rounded-full opacity-50"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--primary))",
            maskImage:
              "radial-gradient(closest-side, transparent 75%, black 76%)", // Creates a hollow ring
            WebkitMaskImage:
              "radial-gradient(closest-side, transparent 75%, black 76%)",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* 2. Inner Dashed Ring (Fast Counter-Rotation) */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-dashed border-primary/40"
          animate={{ rotate: -360 }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* 3. Central Pulsing Core / Logo */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-16 h-16 bg-background rounded-full shadow-lg shadow-primary/10 border border-primary/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* If you have a Logo component, put it here. Otherwise use this icon: */}
          <div className="w-8 h-8 text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        </motion.div>

        {/* 4. Ambient Background Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-20 animate-pulse" />
      </div>

      {/* Loading Text with Ellipsis Animation */}
      <motion.div
        className="mt-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-medium text-foreground tracking-tight">
          Loading TESTEM
        </h3>
        <p className="text-sm text-muted-foreground animate-pulse">
          Just a sec...
        </p>
      </motion.div>
    </div>
  );
}
