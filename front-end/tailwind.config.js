/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: '#059669', // Emerald 600
                secondary: '#ecfdf5', // Emerald 50
                accent: '#10b981', // Emerald 500
                'gold': '#FFD700',
                'deep-green': '#064e3b',
                // Keep old ones just in case
                "background-light": "#f6f8f7",
                "background-dark": "#112217",
                "text-main": "#111714",
                "text-sub": "#648772",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ["Spline Sans", "sans-serif"]
            },
            borderRadius: {
                DEFAULT: "1rem",
                lg: "2rem",
                xl: "3rem",
                full: "9999px",
                'custom': '8px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 7s ease-in-out infinite 1s',
                'float-slow': 'float 8s ease-in-out infinite 0.5s',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'pulse-soft': 'pulseSoft 3s infinite',
                'scroll': 'scroll 25s linear infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            backgroundImage: {
                'mesh': 'radial-gradient(at 40% 20%, hsla(148,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340,100%,76%,0) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(356,100%,81%,0) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,0) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,0) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,0) 0px, transparent 50%)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
