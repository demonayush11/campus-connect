import { motion } from "framer-motion";
import { Users, MessageCircle, Calendar, Star, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Connect Across Years",
      description: "Bridge the gap between seniors and juniors with our smart matching system based on interests, majors, and career goals.",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: MessageCircle,
      title: "Mentorship Hub",
      description: "Find mentors and mentees easily. Share experiences, get advice, and build lasting relationships that matter.",
      gradient: "from-secondary to-blue-400",
    },
    {
      icon: Calendar,
      title: "Campus Events",
      description: "Discover and organize campus events, study groups, and social activities. Never miss out on what's happening.",
      gradient: "from-accent to-green-400",
    },
    {
      icon: Star,
      title: "Skill Exchange",
      description: "Trade skills and knowledge with fellow students. Teach what you know, learn what you need.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Verified student-only platform with robust privacy controls and community guidelines for a safe experience.",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Career Boost",
      description: "Get insights into career paths, internships, and job opportunities from students who've been there.",
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#030303]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
          
            <span className="bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
                Everything You Need to{" "} Connect & Thrive
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover powerful features designed specifically for college students to build meaningful connections and grow together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-white/[0.08] bg-white/[0.03] group hover:scale-105 hover:bg-white/[0.06]">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/60 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;