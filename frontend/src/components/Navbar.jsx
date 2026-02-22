import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Users } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-glow-button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#030303]/90 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
              campusConnect
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-white/70 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <HoverButton
                glowColor="#FF6B6B"
                backgroundColor="transparent"
              >
                Log In
              </HoverButton>
            </Link>
            <Link to="/signup">
              <HoverButton
                glowColor="#FF6B6B"
                backgroundColor="transparent"
              >
                Sign Up
              </HoverButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white/70" />
            ) : (
              <Menu className="w-6 h-6 text-white/70" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-6 border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl rounded-b-2xl"
            >
              <div className="flex flex-col space-y-4 px-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors duration-200 font-medium py-3 px-4 rounded-xl hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-6 border-t border-white/5 px-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <HoverButton
                      className="w-full h-12"
                      backgroundColor="transparent"
                      hoverTextColor="#FFFFFF"
                    >
                      Log In
                    </HoverButton>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <HoverButton
                      className="w-full h-12"
                      glowColor="#FF6B6B"
                      hoverTextColor="#FFFFFF"
                      backgroundColor="rgba(255,107,107,0.1)"
                    >
                      Sign Up
                    </HoverButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
