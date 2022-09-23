import { readFileSync } from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import { renderer } from './marked.js';
const articles = JSON.parse(readFileSync(path.join(__dirname, './assets/articles.json'), 'utf-8')).reverse();

marked.use({ renderer });

const generateIndexRoute = (forSitemap) => {
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
const generateArticlesRoutes = (forSitemap) => {
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
const generateCategoriesRoutes = (forSitemap) => {
  const categories = {};
  const len = articles.length;

  for (let i = 0; i < len; i++) {
    const item = articles[i];
    const {title, category} = item;

    if (Object.prototype.hasOwnProperty.call(categories, category)) {
      categories[category].push({
        title,
        id: i + 1,
      });
    } else {
      categories[category] = [{
        title,
        id: i + 1,
      }];
    }
  }

  const routes = [];

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

const generateDynamicRoutes = (callback) => {
  const index = [generateIndexRoute(false)];
  const articles = generateArticlesRoutes(false);
  const categories = generateCategoriesRoutes(false);

  const routes = index.concat(articles, categories);

  callback(null, routes);
};

const generateDynamicRoutesForSitemap = (callback) => {
  const index = [generateIndexRoute(true)];
  const articles = generateArticlesRoutes(true);
  const categories = generateCategoriesRoutes(true);

  const routes = index.concat(articles, categories);

  callback(null, routes);
};

export default {
  target: 'static',

  head: {
    htmlAttrs: {
      lang: 'ja'
    },
    title: 'Takeshi Kato',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'This is takeshi kato\'s Web blog.' },
    ],
    link: [
      { rel: 'manifest', type: 'manifest', href: '/blog/manifest.json' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/css/main.css',
  ],

  plugins: [
    {
      src: '~/plugins/init.js', ssr: false,
    },
  ],

  components: true,

  buildModules: [
    '@nuxt/postcss8',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sitemap'
  ],

  router: {
    trailingSlash: false,
  },

  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    extractCSS: true,
    filenames: {
      app: ({ isDev }) => isDev ? 'js/[name].js' : 'js/[name].js',
      chunk: ({ isDev }) => isDev ? 'js/[name].js' : 'js/[name].js',
      css: ({ isDev }) => isDev ? 'css/[name].css' : 'css/[name].css',
    },
    publicPath: '/blog/common/'
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
    id: 'UA-71464541-3',
  },

  sitemap: {
    path: '/blog/sitemap.xml',
    hostname: 'https://tkskto.me',
    routes: generateDynamicRoutesForSitemap,
  },
};
