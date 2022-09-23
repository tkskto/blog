/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./assets/articles/*.md",
        "./components/**/*.vue",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./marked.js",
    ],
    theme: {
        extend: {},

        screens: {
            'md': {'max': '768px'},
            // => @media (max-width: 767px) { ... }
        },
    },
    plugins: [],
}
