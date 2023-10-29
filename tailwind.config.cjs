/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/*.md",
        "./src/**/*.astro"
    ],
    theme: {
        screens: {
            'md': {'max': '768px'},
        },
    },
};
