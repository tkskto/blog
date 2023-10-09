import {createClient, MicroCMSQueries} from 'microcms-js-sdk';

const client = createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: import.meta.env.MICROCMS_API_KEY,
});

export type Article = {
    id: string;
    title: string;
    content: string;
    publishDate: string;
    tag: string;
}

export type Meta = {
    contents: Article[];
}

export type Category = {
    id: string;
    name: string;
    description: string;
};

export type CategoryMeta = {
    contents: Category[];
}

export const getArticles = async (queries?: MicroCMSQueries): Promise<Meta> => {
    const data = await client.get<Meta>({ endpoint: 'blogs', queries });

    return data;
};

export const getBlogDetail = async(id: string): Promise<Article> => {
    const data = await client.get<Article>({
        endpoint: `blogs`,
        contentId: id,
    });

    return data;
};

export const getCategories = async (): Promise<CategoryMeta> => {
    const categories = await client.get<CategoryMeta>({
        endpoint: 'categories',
    });

    return categories;
};
