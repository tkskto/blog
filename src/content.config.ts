import {defineCollection, z} from 'astro:content';

// 2. コレクションを定義
const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        publishDate: z.date(),
        tags: z.array(z.union([
            z.literal('小言'),
            z.literal('本'),
            z.literal('イベント'),
            z.literal('旅行'),
            z.literal('エンジニアリング'),
            z.literal('マネジメント'),
            z.literal('サウナ'),
            z.literal('音楽'),
            z.literal('映画'),
            z.literal('ボイスメモ'),
        ])),
        draft: z.boolean().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
};
