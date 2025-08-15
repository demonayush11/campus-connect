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
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-8 tracking-wider uppercase">
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
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-feature-border hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-2">{university.logo}</div>
              <span className="text-sm font-semibold text-foreground">{university.name}</span>
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
          <p className="text-muted-foreground">
            Join <span className="font-semibold text-primary">50,000+</span> students already connecting
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBySection;