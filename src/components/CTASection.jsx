import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-glow-button";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-[#030303]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium text-indigo-300">Join the Campus Revolution</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            
            <span className="bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
             Ready to{" "} Transform Your Campus Experience?
            </span>{" "}
            
          </h2>

          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are already building meaningful connections, 
            finding mentors, and creating lasting friendships through campusConnect.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <HoverButton
              glowColor="#a855f7"
              backgroundColor="#6366F1"
              className="text-lg rounded-xl group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline" />
            </HoverButton>
            
            <HoverButton
              backgroundColor="transparent"
              glowColor="#8b5cf6"
              className="text-lg rounded-xl border-2 border-white/20"
              hoverTextColor="#FFF"
            >
              Watch Demo
            </HoverButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-indigo-300 mb-2">50K+</div>
              <div className="text-white/60">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-300 mb-2">500+</div>
              <div className="text-white/60">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-300 mb-2">1M+</div>
              <div className="text-white/60">Connections Made</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
