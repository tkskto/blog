/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./dist/blog/**/*.html",
    ],
    theme: {
        extend: {},

        screens: {
            'md': {'max': '768px'},
        },
    },
    plugins: [],
};
