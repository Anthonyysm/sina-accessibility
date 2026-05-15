import Navbar from "@/components/Navbar";
import HeroSection from "@/app/LandingPage/sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import Footer from "@/components/Footer";
import LibrasFAB from "@/components/LibrasFAB";

export default function Homepage() {
  return (
    <div>
      <Navbar />
      <div>
        <HeroSection />
        <ProblemSection />
      </div>
      <Footer />
      <LibrasFAB />
    </div >)
}