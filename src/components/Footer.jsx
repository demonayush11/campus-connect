import { motion } from "framer-motion";
import { Users, Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Demo", "Updates"],
    Company: ["About Us", "Careers", "Blog", "Press"],
    Resources: ["Help Center", "Community", "Guides", "API"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" }

  ];

  return (
    <footer className="bg-[#030303] border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
                campusConnect
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mb-6 max-w-sm"
            >
              Connecting college students across years to build meaningful relationships, 
              share knowledge, and grow together.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-12 w-12 flex items-center justify-center text-center rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:shadow-xl group transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white group-hover:text-primary" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (categoryIndex * 0.1) + (linkIndex * 0.05) }}
                  >
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © 2024 campusConnect. All rights reserved.
          </p>

          <p className="text-white/60 text-sm mb-4 md:mb-0">
  made with  <span className="text-red-500">❤️</span> by campusConnect
</p>

          
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-white/60 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-indigo-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-indigo-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
