import AboutUs from "./components/AboutUs";
import FeaturedCauses from "./components/FeaturedCauses";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PartnersSection from "./components/PartnersSection";
import SignupCTA from "./components/SignupCTA";
import TestimonialSection from "./components/TestimonialSection";

export default function Home() {
  return (
    <main className="font">
      <Hero />
      <HowItWorks />
      <FeaturedCauses />
      <AboutUs />
      <TestimonialSection />
      <PartnersSection />
      <SignupCTA />
    </main>
  );
}
