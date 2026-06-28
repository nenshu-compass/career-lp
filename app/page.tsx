import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PainSection from "@/components/sections/PainSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import FAQSection from "@/components/sections/FAQSection";
import CtaSection from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PainSection />
        <FeaturesSection />
        <AchievementsSection />
        <FAQSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
