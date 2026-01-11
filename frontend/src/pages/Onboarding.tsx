import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  PenTool,
  RefreshCw,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import Logo from "@/components/icons/Logo";
import LearningCycle from "@/components/onboarding/LearningCycle";
import FeatureCard from "@/components/onboarding/FeatureCard";
import { Button } from "@/components/ui/button";
import GetStartedButton from "@/components/onboarding/GetStartedButton";
import BackgroundElements from "@/components/BackgroundElements";

const features = [
  {
    icon: FileText,
    title: "Upload Your Notes",
    description:
      "Simply drag and drop your PDF lecture notes, textbooks, or study materials. The AI understands complex STEM content including equations and diagrams.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Watch as AI analyzes your materials and generates personalized exam questions tailored to your specific curriculum and learning goals.",
  },
  {
    icon: PenTool,
    title: "Take Your Exam",
    description:
      "Experience a clean, distraction-free testing environment with multiple question types: multiple choice, short answer, and complex mathematical problems.",
  },
  {
    icon: RefreshCw,
    title: "Adaptive Learning",
    description:
      "The magic happens here. TESTEM remembers your mistakes and weak areas. Future exams focus on these gaps, ensuring you truly master every concept.",
    isAdapt: true,
  },
];

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    // Changed bg to include relative positioning for the z-index stacking
    <div className="relative min-h-screen bg-background selection:bg-primary/20">
      {/* --- Inserted Background Component --- */}
      <BackgroundElements />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            {/* Log In Button: Subtle, Clean */}
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-transparent font-medium"
              >
                Log in
              </Button>
            </Link>

            {/* Get Started Button: The "Star" */}
            <GetStartedButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium shadow-[0_0_15px_-5px_var(--primary)]">
              <GraduationCap className="w-4 h-4" />
              AI-Powered Learning for STEM Students
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Your Personal
            {/* Animated Gradient Text */}
            <motion.span
              className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              AI Exam Proctor
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Transform your study materials into personalized exams. Practice
            smarter, not harder, with AI that adapts to your learning journey.
          </motion.p>

          {/* Added visual anchor/separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-1 h-24 bg-gradient-to-b from-border to-transparent mx-auto rounded-full"
          />
        </div>
      </section>

      {/* Cycle of Learning Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Cycle of Learning
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              A continuous loop that identifies your weak spots and transforms
              them into strengths
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Animated Cycle */}
            <div className="order-2 lg:order-1 relative">
              {/* Add a glow behind the cycle component */}
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform scale-90 -z-10" />
              <LearningCycle activeStep={activeStep} />
            </div>

            {/* Feature Cards */}
            <div className="order-1 lg:order-2 grid sm:grid-cols-2 gap-5">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  stepNumber={index + 1}
                  isActive={activeStep === index}
                  onHover={() => setActiveStep(index)}
                  onLeave={() => setActiveStep(null)}
                  isAdapt={feature.isAdapt}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative z-10">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            // Enhanced Card Styling: Glassmorphism + stronger borders
            className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-3xl p-12 border border-primary/20 shadow-2xl shadow-primary/5"
          >
            {/* CTA Background Decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full" />

            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
              Ready to Transform Your Study Habits?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto relative z-10">
              Join thousands of STEM students who are studying smarter with
              AI-powered exam generation.
            </p>

            <Link to="/signup">
              <Button
                size="lg"
                className="relative z-10 gap-2 text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Your First Exam
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground mt-8 relative z-10">
              No credit card required • Free to start
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 bg-background/50 backdrop-blur-sm z-10 relative">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TESTEM. Built for students, by
            students.
          </p>
        </div>
      </footer>
    </div>
  );
}
