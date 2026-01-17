import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                lumen: {
                    'clarity': '#F5F5F5',      // Claridad, aire, luz
                    'structure': '#212121',    // Estructura, sobriedad
                    'creative': '#00838F',     // Creatividad confiable
                    'vision': '#1A237E',       // Profundidad, visión
                    'energy': '#F7931E',       // Energía, acción
                },
            },
            fontFamily: {
                serif: ['var(--font-serif)'],
                sans: ['var(--font-sans)'],
                display: ['var(--font-display)'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.8s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
export default config
