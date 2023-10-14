import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: 'https://tkskto.me',
    base: '/blog',
    outDir: './dist/blog',
    trailingSlash: 'always',
    integrations: [
        tailwind({
            configFile: './tailwind.config.cjs',
            applyBaseStyles: true,
        }),
        sitemap({
            serialize(item) {
                if (!item.url.endsWith('/')) {
                    item.url = `${item.url}/`;
                }
                return item;
            },
        }),
    ],
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
