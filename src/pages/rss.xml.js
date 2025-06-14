import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';
import {marked} from 'marked';

export async function GET(context) {
    const blogPost = await getCollection('blog', ({data}) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    });

    const sortedBlogPost = blogPost.sort((post1, post2) => new Date(post2.data.publishDate).getTime() - new Date(post1.data.publishDate).getTime());

    return rss({
        title: 'So What!?',
        description: 'This is takeshi kato\'s Web blog.',
        site: context.site,
        image: {
            url: '/ogp.png',
        },
        items: sortedBlogPost.map((post) => ({
            title: post.data.title,
            pubDate: post.data.publishDate,
            link: `/${post.data.title}/`,
            content: marked.parse(post.body?.replaceAll('src="/', `src="${context.site}/`).replaceAll('href="/', `href="${context.site}/`) || ''),
        })),
        customData: '<language>ja-jp</language>',
    });
}
