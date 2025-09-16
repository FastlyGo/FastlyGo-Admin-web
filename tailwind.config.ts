/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fffc',
                    100: '#ccfef7',
                    200: '#99fcef',
                    300: '#5ef5e4',
                    400: '#2de9d3',
                    500: '#00D4AA',
                    600: '#1EEBC7',
                    700: '#00a087',
                    800: '#006b5a',
                    900: '#004d40',
                    950: '#002e26',
                },
                teal: {
                    400: '#00D4AA',
                    500: '#1EEBC7',
                },
            },
        },
    },
    plugins: [],
}