/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            backgroundColor: {
                'light': '#ffffff',
                'dark': '#1a1a1a',
            },
            textColor: {
                'light': '#000000',
                'dark': '#ffffff',
            }
        },
    },
    plugins: [],
} 