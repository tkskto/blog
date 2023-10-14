/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.astro",
    ],
    theme: {
        screens: {
            'md': {'max': '768px'},
        },
    },
};
