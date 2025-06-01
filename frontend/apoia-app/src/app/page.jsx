"use client";
import ApoiaChatbot from '../components/ApoiaChatbot';
import AboutUs from "./components/AboutUs";
import FeaturedCauses from "./components/FeaturedCauses";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PartnersSection from "./components/PartnersSection";
import SignupCTA from "./components/SignupCTA";
import TestimonialSection from "./components/TestimonialSection";
import FormDoacao from './components/FormDoacao';


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
      <FormDoacao />
      <Footer />
      <ApoiaChatbot/>
    </main>
  );
}
