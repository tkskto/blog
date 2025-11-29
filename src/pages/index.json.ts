import type {Fetcher, Ai} from '@cloudflare/workers-types';

interface Env {
    ASSETS: Fetcher;
    AI: Ai
}

export async function GET(context) {
    const {env} = context.locals.runtime;
    const result = {title: '', body: ''};

    try {
        const {response} = await env.AI.autorag('ai-blog-generator').aiSearch({
            query: `この著者が次に書きそうな新しい記事を文書構造を意識して作成してください。フォーマットは次のJSONフォーマットにしてください。{"title": "記事のタイトル", "body": "本文（HTML形式）"}`,
        });

        result.title = response.title;
        result.body = response.body;

        return new Response(JSON.stringify(result), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch {
        result.title = 'AIによる記事生成に失敗しました';
        result.body = 'AIによる記事生成に失敗しました';

        return new Response(JSON.stringify(result), {
            status: 500,
            statusText: 'NG',
        });
    }
}
