import Navbar from "@/components/Navbar";
import HeroSection from "@/app/LandingPage/sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import Footer from "@/components/Footer";
import LibrasFAB from "@/components/LibrasFAB";
import FeaturesSection from "./sections/FeaturesSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import CTASection from "./CTASection";

export default function Homepage() {
  return (
    <div>
      <Navbar />
      <div>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </div>
      <Footer />
      <LibrasFAB />
    </div >)
}