import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: 'https://tkskto.me',
    base: '/blog',
    outDir: './dist/blog',
    trailingSlash: 'never',
    integrations: [tailwind({
        config: {
            path: './tailwind.config.cjs'
        }
    }), sitemap({
        serialize(item) {
            if (!item.url.endsWith('/')) {
                item.url = `${item.url}/`
            }
            return item;
        },
    })],
    vite: {
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: 'common/css/app[extname]',
                },
            },
        },
    },
});