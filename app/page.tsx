import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Purpose from "@/components/sections/Purpose";
import Services from "@/components/sections/Services";
import SaasTeaser from "@/components/sections/SaasTeaser";
import ContactForm from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Purpose />
      <Services />
      <SaasTeaser />
      <ContactForm />
      <Footer />
    </main>
  );
}
