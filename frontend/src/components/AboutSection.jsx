import { motion } from "framer-motion";
import { Users, Target, Heart, Lightbulb } from "lucide-react";

const AboutSection = () => {
    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description:
                "To break down barriers between students across academic years, fostering a culture of open knowledge sharing, mentorship, and genuine connection on every campus.",
        },
        {
            icon: Heart,
            title: "Community First",
            description:
                "We believe that real growth happens together. Every feature we build is designed to bring students closer — not just online, but in real life too.",
        },
        {
            icon: Lightbulb,
            title: "Student-Built",
            description:
                "campusConnect was born in a dorm room. We understand what students need because we are students — and we build with that perspective every day.",
        },
    ];

    const stats = [
        { value: "50K+", label: "Active Students" },
        { value: "500+", label: "Universities" },
        { value: "1M+", label: "Connections Made" },
        { value: "4.9★", label: "Average Rating" },
    ];

    return (
        <section id="about" className="py-16 md:py-24 bg-[#030303] relative overflow-hidden">
            {/* Subtle background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/[0.04] rounded-full blur-3xl opacity-50 md:opacity-100" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/[0.04] rounded-full blur-3xl opacity-50 md:opacity-100" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <Users className="w-4 h-4 text-indigo-300" />
                        <span className="text-sm font-medium text-indigo-300">Who We Are</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
                            Built by Students, for Students
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed px-4">
                        campusConnect started as a simple idea: what if seniors and juniors
                        could actually talk to each other? Today, it's a thriving network
                        connecting students across hundreds of universities.
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 md:mb-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                        >
                            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-rose-300 bg-clip-text text-transparent mb-1">
                                {stat.value}
                            </div>
                            <div className="text-white/50 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12 }}
                            className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20 border border-white/[0.08] flex items-center justify-center mb-5 group-hover:from-indigo-500/30 group-hover:to-rose-500/30 transition-all duration-300">
                                <value.icon className="w-6 h-6 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                            <p className="text-white/55 leading-relaxed">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
