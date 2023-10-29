import {z, defineCollection} from 'astro:content';
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
