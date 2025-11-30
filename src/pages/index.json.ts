import type {Fetcher, Ai} from '@cloudflare/workers-types';

interface Env {
    ASSETS: Fetcher;
    AI: Ai
}

export async function GET(context) {
    const {env} = context.locals.runtime;

    try {
        const {response} = await env.AI.autorag('ai-blog-generator').aiSearch({
            query: `あなたは、すでに読み込まれている複数のMarkdown記事の著者と同じ視点・文体で文章を書くエンジニア兼ライターです。組織マネジメントにも興味関心があります。
以下の条件を満たす、新しい記事を1本作成してください。

[目的]
-   読み込まれている記事の「テーマ傾向・語り口・構成のパターン」を参考にしつつ、まだ書かれていないが、この著者が次に書きそうなトピックの記事を書く。

[出力フォーマット]
-   レスポンスは必ず、余計な文字を一切含まない内容だけにしてください。

[記事の形式]
-   bodyにはHTML文字列のみを入れてください。
-   記事タイトルを<h2>要素で書き始めてください。
    例: <h2>タイトル</h2>
-   見出しや段落などを用いて、日本語の一般的なWeb記事として自然な文書構造にしてください。
-   文章量はおおよそ1,000文字前後にしてください（多少前後してもかまいません）。

[スタイル・内容]
-   既存の記事の文や段落をそのままコピーせず、新規の内容になるようにしてください。
-   読者にとって実務で役立つ、具体的なノウハウや視点を1つ以上含めてください。
-   結論やまとめの段落を入れ、読み終わったときに「学びが1つ整理されている」状態になるようにしてください。
`,
            max_num_results: 1,
        });

        return new Response(response, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        return new Response('AIによる記事生成に失敗しました', {
            status: 500,
            statusText: 'NG',
        });
    }
}
