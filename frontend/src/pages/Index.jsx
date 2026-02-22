import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import Navbar from "@/components/Navbar";
import TrustedBySection from "@/components/TrustedBySection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroGeometric
        badge="campusConnect"
        title1="Connect. Learn."
        title2="Grow Together"
      />
      <TrustedBySection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
