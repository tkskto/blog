/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/content/blog/*.md",
        "./src/**/*.astro"
    ],
    theme: {
        screens: {
            'md': {'max': '768px'},
        },
        extend: {
            maxWidth: {
                prose: '160ch',
            },
        }
    },
};
