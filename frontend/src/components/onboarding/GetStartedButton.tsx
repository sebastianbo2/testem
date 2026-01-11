import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function GetStartedButton() {
  return (
    <Link to="/signup">
      <motion.button
        className="relative px-6 py-2.5 rounded-full font-semibold text-white overflow-hidden group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated Background Layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%]"
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Shine Effect (Optional, adds a glass sheen) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-b from-white to-transparent transition-opacity duration-300" />

        {/* Text Content */}
        <span className="relative z-10 flex items-center gap-2">
          Get Started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </motion.button>
    </Link>
  );
}
