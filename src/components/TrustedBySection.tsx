import { motion } from "framer-motion";

const TrustedBySection = () => {
  const universities = [
    { name: "MIT", logo: "🎓" },
    { name: "Stanford", logo: "🏛️" },
    { name: "Harvard", logo: "🎯" },
    { name: "Berkeley", logo: "🌟" },
    { name: "Yale", logo: "🔥" },
    { name: "Princeton", logo: "⚡" },
  ];

  return (
    <section className="py-16 bg-[#030303]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-white/60 mb-8 tracking-wider uppercase">
            Trusted by Students at Top Universities
          </h2>
        </motion.div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
  {universities.map((university, index) => (
    <motion.div
      key={university.name}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl transition-all duration-300 border-white/[0.08] bg-white/[0.03] group hover:scale-105 hover:bg-white/[0.06]"
    >
      <div className="text-4xl mb-2 flex items-center justify-center">{university.logo}</div>
      <span className="text-sm font-semibold text-white/80">{university.name}</span>
    </motion.div>
  ))}
</div>


        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white/60">
            Join <span className="font-semibold text-indigo-300">50,000+</span> students already connecting
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBySection;