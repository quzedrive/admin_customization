module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./public/**/*.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)",
                icon: "var(--color-icon)",
            },
            screens: {
                'xs': "23rem", // 368
                'sm': '40rem',   // 640px
                'md': '48rem',   // 768px
                'lg': '64rem',   // 1024px
                'xl': '80rem',   // 1280px
                '2xl': '85rem',  // 1360px
                '3xl': '100rem', // 1600px
                '4xl': '120rem', // 1920px
            },
        },
    },
    plugins: [],
}
