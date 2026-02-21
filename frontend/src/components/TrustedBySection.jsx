import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";

const TrustedBySection = () => {
  const universities = [
    { 
      name: "IIT Madras", 
      logo: (
        <span className="text-4xl flex items-center justify-center">
          <img 
            src="https://i.ibb.co/4wSzkq35/Chat-GPT-Image-Aug-16-2025-02-04-16-PM.png" 
            alt="IIT Madras Logo" 
            className="w-12 h-12 object-contain"
          />
        </span>
      ),
      glowColor: "blue",
    },
    { 
      name: "IIT Kharagpur",  
      logo: (
        <span className="text-4xl flex items-center justify-center">
          <img 
            src="https://i.ibb.co/7JmnLjS5/da239e12-1bdb-42da-9926-0f09f3d1051c.png" 
            alt="IIT Kharagpur Logo" 
            className="w-12 h-12 object-contain"
          />
        </span>
      ),
      glowColor: "orange",
    },
    { 
      name: "NIT Jamshedpur",
      logo: (
        <span className="text-4xl flex items-center justify-center">
          <img 
            src="https://i.ibb.co/VYGJMnLv/download-5.jpg" 
            alt="NIT Jamshedpur Logo" 
            className="w-12 h-12 object-contain"
          />
        </span>
      ),
      glowColor: "purple",
    },
    { 
      name: "VIT", 
      logo: (
        <span className="text-4xl flex items-center justify-center">
          <img 
            src="https://i.ibb.co/LXnS9Cj0/download-3.png" 
            alt="VIT Logo" 
            className="w-12 h-12 object-contain"
          />
        </span>
      ),
      glowColor: "blue",
    },
    { 
      name: "LPU",
      logo: (
        <span className="text-4xl flex items-center justify-center">
          <img 
            src="https://i.ibb.co/FbWbx7bM/images.png" 
            alt="LPU Logo" 
            className="w-12 h-12 object-contain"
          />
        </span>
      ),
      glowColor: "red",
    },
    { 
      name: "KIIT", 
      logo: (
        <span className="text-4xl flex items-center justify-center">
          <img 
            src="https://i.ibb.co/Gj4Jt0c/8aa65933-1e33-4438-ba91-6de054f4bca4.png" 
            alt="KIIT Logo" 
            className="w-12 h-12 object-contain"
          />
        </span>
      ),
      glowColor: "purple",
    },
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
            <GlowCard
              key={university.name}
              className="h-full p-4 transition-transform duration-300 hover:scale-105"
              glowColor={university.glowColor}
              customSize={true}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="mb-2 flex items-center justify-center h-12 w-12">{university.logo}</div>
                <span className="text-sm font-semibold text-white/80 mt-2">{university.name}</span>
              </motion.div>
            </GlowCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white/60 mb-2">
            Join <span className="font-semibold text-indigo-300">50,000+</span> students from top colleges
          </p>
          <p className="text-white/60">
            — and more colleges are joining every day!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBySection;
