import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import MatomoTracker from "@/components/analytics/MatomoTracker";
import { ToastProvider } from "@/components/providers/ToastProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lumen Creativo 💡 | Marketing Digital con Propósito",
  description: "Marketing digital de alta gama con esencia católica para instituciones y causas con propósito. El orden no mata la inspiración. La hace habitable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-lumen-clarity font-sans antialiased text-lumen-structure",
        cormorant.variable,
        inter.variable,
        cinzel.variable
      )}>
        <MatomoTracker
          siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID || ""}
          matomoUrl={process.env.NEXT_PUBLIC_MATOMO_URL || ""}
        />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

