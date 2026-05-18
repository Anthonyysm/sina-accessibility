import Navbar from "@/components/Navbar";
import HeroSection from "@/app/LandingPage/sections/HeroSection";
import ProblemSection from "@/app/LandingPage/sections/ProblemSection";
import Footer from "@/components/Footer";
import FeaturesSection from "@/app/LandingPage/sections/FeaturesSection";
import HowItWorksSection from "@/app/LandingPage/sections/HowItWorksSection";
import BeforeAfterSection from "@/app/LandingPage/sections/BeforeAfter";
import CTASection from "@/app/LandingPage/sections/CTASection";
import VLibras from "@/components/VLibras/VLibras";

export default function Homepage() {
  return (
    <div>
      <VLibras />
      <div>
        <Navbar />
        <div>
          <HeroSection />
          <ProblemSection />
          <FeaturesSection />
          <HowItWorksSection />
          <BeforeAfterSection />
          <CTASection />
        </div>
        <Footer />
      </div>
    </div>
  )
}
