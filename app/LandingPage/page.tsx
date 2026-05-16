import Navbar from "@/components/Navbar";
import HeroSection from "@/app/LandingPage/sections/HeroSection";
import ProblemSection from "@/app/LandingPage/sections/ProblemSection";
import Footer from "@/components/Footer";
import LibrasFAB from "@/components/LibrasFAB";
import FeaturesSection from "@/app/LandingPage/sections/FeaturesSection";
import HowItWorksSection from "@/app/LandingPage/sections/HowItWorksSection";
import CTASection from "@/app/LandingPage/sections/CTASection";

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