import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
            colors: {
                lumen: {
                    dark: "#1A237E",   // Primary Text/Titles, Strategic Accents
                    main: "#00838F",   // CTA, Details, Primary Accent
                    energy: "#F7931E", // Hover, Energy
                    black: "#212121",  // Secondary Text, Footer BG
                    light: "#F5F5F5",  // Hero BG, Borders
                    white: "#FFFFFF",  // Section BG
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            borderRadius: {
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        },
    },
    plugins: [],
};
export default config;
