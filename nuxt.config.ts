import { NuxtConfig } from '@nuxt/types';
import { readFileSync } from 'fs';
import * as path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import marked from 'marked';
const articles = JSON.parse(readFileSync(path.join(__dirname, './assets/articles.json'), 'utf-8')).reverse();
const generateIndexRoute = (forSitemap: boolean): {route:string, payload: {}} => {
    const newest = articles[0];
    const {title, date} = newest;
    const content = marked(readFileSync(`./assets/articles/${title}.md`, {encoding: 'utf-8'}));
    return {
        route: forSitemap ? '/blog/' : '/blog',
        payload: {
            articles,
            title,
            content,
            date: new Date(date.split('/'))
        }
    }
}
const generateArticlesRoutes = (forSitemap: boolean): {route:string, payload: {}}[] => {
    return articles.map(item => {
        const {date, title} = item;
        const content = marked(readFileSync(`./assets/articles/${title}.md`, {encoding: 'utf-8'}));
        return {
            route: forSitemap ? `/blog/${title}/` : `/blog/${title}`,
            payload: {
                articles,
                title,
                content,
                date: new Date(date.split('/'))
            },
        };
    });
}
const generateCategoriesRoutes = (forSitemap: boolean): {route:string, payload: {}}[] => {
    const categories = {};
    const len = articles.length;

    for (let i = 0; i < len; i++) {
        const item = articles[i];
        const {title, category, id} = item;

        if (Object.prototype.hasOwnProperty.call(categories, category)) {
            categories[category].push({
                title,
                id,
            });
        } else {
            categories[category] = [{
                title,
                id,
            }];
        }
    }

    const routes: {route:string, payload: {}}[] = [];

    for (const key in categories) {
        routes.push({
            route: forSitemap ? `/blog/category/${key}/` : `/blog/category/${key}`,
            payload: {
                articles,
                categoryName: key,
                categoryData: categories[key],
            },
        })
    }

    return routes;
}

const generateDynamicRoutes = (callback): void => {
    const index: {}[] = [generateIndexRoute(false)];
    const articles = generateArticlesRoutes(false);
    const categories = generateCategoriesRoutes(false);

    const routes = index.concat(articles, categories);

    callback(null, routes);
};

const generateDynamicRoutesForSitemap = (callback): void => {
    const index: {}[] = [generateIndexRoute(true)];
    const articles = generateArticlesRoutes(true);
    const categories = generateCategoriesRoutes(true);

    const routes = index.concat(articles, categories);

    callback(null, routes);
};

const config: NuxtConfig = {
    ssr: true,
    target: 'static',
    env: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    },
    head: {
        htmlAttrs: {
            lang: 'ja'
        },
        title: 'Takeshi Kato',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'This is takeshi kato\'s Web blog.' },
            { hid: 'http-equiv', name: 'http-equiv', content: 'IE=edge' },
        ],
        link: [
            { rel: 'manifest', type: 'manifest', href: '/blog/manifest.json' },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: false,
    loadingIndicator: false,
    /*
    ** Build configuration
    */
    build: {
        extractCSS: true,
        filenames: {
            app: ({ isDev }): string => isDev ? 'js/[name].js' : 'js/[name].js',
            chunk: ({ isDev }): string => isDev ? 'js/[name].js' : 'js/[name].js',
            css: ({ isDev }): string => isDev ? 'css/[name].css' : 'css/[name].css',
        },
        publicPath: '/blog/common/'
    },
    modules: [
        '@nuxtjs/google-analytics',
        '@nuxtjs/sitemap'
    ],
    plugins: [
        {
            src: '~/plugins/init.js', ssr: false,
        },
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    router: {
        trailingSlash: false,
        prefetchLinks: false,
    },
    static: {
        prefix: false,
    },
    generate: {
        dir: 'public',
        routes: generateDynamicRoutes,
        fallback: '',
        crawler: false,
    },
    'google-analytics': {
        id: 'UA-71464541-3'
    },
    sitemap: {
        path: '/blog/sitemap.xml',
        hostname: 'https://tkskto.me',
        routes: generateDynamicRoutesForSitemap,
    },
};

export default config;
