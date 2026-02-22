import { motion } from "framer-motion";
import { Users, MessageCircle, Calendar, Star, Shield, Zap } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Connect Across Years",
      description: "Bridge the gap between seniors and juniors with our smart matching system based on interests, majors, and career goals.",
      glowColor: "purple",
    },
    {
      icon: MessageCircle,
      title: "Mentorship Hub",
      description: "Find mentors and mentees easily. Share experiences, get advice, and build lasting relationships that matter.",
      glowColor: "blue",
    },
    {
      icon: Calendar,
      title: "Campus Events",
      description: "Discover and organize campus events, study groups, and social activities. Never miss out on what's happening.",
      glowColor: "green",
    },
    {
      icon: Star,
      title: "Skill Exchange",
      description: "Trade skills and knowledge with fellow students. Teach what you know, learn what you need.",
      glowColor: "orange",
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Verified student-only platform with robust privacy controls and community guidelines for a safe experience.",
      glowColor: "red",
    },
    {
      icon: Zap,
      title: "Career Boost",
      description: "Get insights into career paths, internships, and job opportunities from students who've been there.",
      glowColor: "purple",
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#030303]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
              Everything You Need to Connect & Thrive
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto px-4">
            Discover powerful features designed specifically for college students to build meaningful connections and grow together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowCard
                key={feature.title}
                className="h-full transition-transform duration-300 hover:scale-105"
                glowColor={feature.glowColor}
                customSize={true}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.1] flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
