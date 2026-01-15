import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import CaseStudies from "@/components/sections/CaseStudies";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import FAQ from "@/components/sections/FAQ";
import CTAFinal from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <main className="min-h-screen bg-lumen-clarity">
      <Navbar />

      {/* Sección 1: Hero con galería rotativa */}
      <Hero />

      {/* Sección 2: Problema - Identificación con dolor */}
      <Problem />

      {/* Sección 3: Solución - Método Lumen */}
      <Solution />

      {/* Sección 4: Casos de éxito - Prueba social */}
      <CaseStudies />

      {/* Sección 5: Proceso - Cómo trabajamos */}
      <Process />

      {/* Sección 6: Servicios - Sin precios */}
      <Services />

      {/* Sección 7: FAQ - Manejo de objeciones */}
      <FAQ />

      {/* Sección 8: CTA Final con formulario */}
      <CTAFinal />

      <Footer />
    </main>
  );
}
