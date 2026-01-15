import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lumen Creativo 💡 | Marketing Digital Digital con Propósito",
  description: "Marketing digital de alta gama con esencia católica para instituciones y causas con propósito.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        playfair.variable,
        inter.variable
      )}>
        {children}
      </body>
    </html>
  );
}
