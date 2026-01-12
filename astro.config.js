import {defineConfig} from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sentry from '@sentry/astro';
import rehypeKatex from 'rehype-katex';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    site: 'https://blog.tkskto.me',
    outDir: './dist',
    trailingSlash: 'always',
    output: 'static',

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
        sentry({
            dsn: 'https://db2a59df687893a5bc3e0086441b58b8@o4507225095340032.ingest.us.sentry.io/4507225098354688',
            sourceMapsUploadOptions: {
                project: 'javascript-astro',
                authToken: process.env.SENTRY_AUTH_TOKEN,
            },
        }),
    ],

    markdown: {
        rehypePlugins: [
            (...args) => rehypeKatex({
                ...args,
                output: 'mathml',
            }),
        ],
    },

    vite: {
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: 'common/css/app[extname]',
                },
            },
        },
    },

    build: {
        inlineStylesheets: 'always',
    },

    adapter: cloudflare({
        platformProxy: {
            enabled: true,
        },
        imageService: 'cloudflare',
    }),
});
