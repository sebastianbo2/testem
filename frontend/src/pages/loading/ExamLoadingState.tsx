import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Cpu, Search, Database } from "lucide-react";
import Logo from "../../components/icons/Logo";

const loadingSteps = [
  "Identifying core concepts...",
  "Mapping knowledge relations...",
  "Optimizing question variety...",
  "Ensuring academic rigor...",
  "Tailoring difficulty parameters...",
  "Processing semantic structures...",
  "Refining assessment logic...",
];

export const ExamLoadingState = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="text-center space-y-10 max-w-md w-full relative">
        
        {/* Logo at the top */}
        <div className="flex justify-center mb-4">
          <Logo />
        </div>

        {/* Central Animated Graphic */}
        <div className="relative flex justify-center items-center">
          {/* Pulsing Outer Rings */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-40 h-40 border-2 border-primary rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute w-40 h-40 border border-primary rounded-full"
          />

          {/* Rotating Orbitals */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-48 h-48"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="bg-background border border-primary/30 p-2 rounded-full shadow-xl">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="bg-background border border-primary/30 p-2 rounded-full shadow-xl">
                <Search className="w-4 h-4 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Main Brain Icon */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-primary text-primary-foreground p-6 rounded-3xl shadow-[0_0_40px_rgba(var(--primary),0.3)]"
          >
            <Brain className="w-12 h-12" />
          </motion.div>
        </div>

        {/* Dynamic Text Section */}
        <div className="space-y-4">
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadingSteps[stepIndex]}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-primary font-medium"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xl tracking-tight">{loadingSteps[stepIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
            Our AI is deep-diving into your materials to build a custom assessment.
          </p>
        </div>

        {/* Indeterminate Looping "Wave" Loader */}
        <div className="relative w-48 mx-auto h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ 
              left: ["-50%", "150%"] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>

      </div>
    </div>
  );
};