import {defineCollection, z} from 'astro:content';

// 2. コレクションを定義
const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        publishDate: z.date(),
        tags: z.array(z.string()),
        draft: z.boolean().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
};
