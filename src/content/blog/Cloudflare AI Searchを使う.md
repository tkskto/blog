---
title: 'Cloudflare AI Searchを使って記事を書く実験'
publishDate: 2025-11-30
tags: ['エンジニアリング']
---

このブログの[TOPページ](/)を[Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)を使って記事を自動生成するようにしてみた。

リロードするたびに新しい記事が生成される。同じ記事はおそらく二度と生成されないはず。

Cloudflare AI SearchはRAGを簡単に構築する仕組みで、もともとは検索用の機能を提供するサービスなので、本来生成に使うべきものではない気がするけど、まぁいいだろう。ちなみにAI Searchはまだベータ機能らしい。

ざっくりとした流れは以下のような感じ。

1.  これまで書いてきた記事（Markdown）をGitHub Actionsで[Cloudflare R2](https://developers.cloudflare.com/r2/)にアップロードする
1.  Cloudflareの管理画面からAI Search用のRAGを作成する
1.  AI Searchを使うCloudflare Workerを実装する
1.  TOPページの記事部分だけサーバアイランドにして、裏側でCloudflare Workerを呼び出し、まるっとレンダリングする

## R2にMarkdownを集約

MarkdownはGitHub ActionsでR2にアップロードする。

mainブランチにプッシュされたときに、Astro Contents形式のMarkdownファイルがすべてまるっとR2に同期される。R2は10GB/月のストレージ無料枠があり、エグレス料金も無料。

CloudflareのサービスはR2にかぎらず、個人利用にはかなり優しい。なんかいろいろ、逆に心配になる。

R2のアップロードには[ryand56/r2-upload-action](https://github.com/ryand56/r2-upload-action)を使っている。

## RAGを作成する

Cloudflareの管理画面から、AI Searchを開いて、RAGを作成する。あとから気づいたが、わざわざR2にMarkdownを保存しなくても、[MicrosoftのNLWeb](https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/)を使うこともできたらしい。

ためしてないからわからないけど、おそらくサイトをクロールして、インデックス&埋め込み処理をしてくれるんだと思う。

RAGを作る時に、R2を指定すると、[Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)にインデックスが作成される。作成が完了するとすぐ使えるようになる。

## AI Searchを使うCloudflare Worker

このBlog自体、Cloudflare Workerでホスティングしているので、そのままwrangler.jsoncにAI機能をバインディングを追加する。

```
    "ai": {
        "binding": "AI",
        "remote": true
    }
```

`remote: true`は、ローカルサーバでもリモート接続しますよ（お金がかかりますよ）ということを明示的に書いているだけで、特に指定しなくても動く。消すと警告は出るけど。

Astroの[Endpoint](https://docs.astro.build/ja/guides/endpoints/)は[Cloudflareのランタイム](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#cloudflare-runtime)にアクセスができるので、そこからAI Searchを動かす。

```typescript
// index.json.ts
import type {Ai} from '@cloudflare/workers-types';

interface Env {
    AI: Ai
}

export async function GET(context) {
    const {env} = context.locals.runtime;

    try {
        const {response} = await env.AI.autorag('ai-blog-generator').aiSearch({
            query: `ここにプロンプトを書く`,
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
```

[モデルもいろいろ指定できる](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/)みたいだが、Workers AIのモデルならAPIキーとかいらないので、楽でいい。

## TOPページをAIに変更

これまでのTOPは最新の記事を表示していたが、さっきのエンドポイントから記事を受け取って、出力するサーバアイランドを作ることにした。

```markdown
---
let ArticleBody = '';

try {
    const response = await fetch(new URL('/index.json', Astro.url));
    const body = await response.text();

    ArticleBody = body;
} catch (error) {
    ArticleBody = `<h2>記事の生成に失敗しました。</h2><p>${error.message}</p>`;
}
---

<p><strong>この記事はAIに書かせています。リロードすると別の内容に書き換えられます。信ぴょう性もないですし、URLをだれかに共有しても内容自体の共有はできないのでご注意ください。</strong></p>

<Fragment set:html={ArticleBody}/>
```

生成にはそれなりに時間がかかる。できればストリームにして、タイピング風のレンダリングにしたかったが、Astroのサーバアイランド標準機能ではそれは難しかった（多分）ので、やめた。

ぱっと見AIが書いたのかどうか、分からないので、冒頭に固定の注意文を書いておくようにした。

## 注意点

一度のリクエストにかかるコストはかなり小さい（$0.001くらい）が、ゼロではない。[Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)で上限を設定したりできるので、一応やっておいた。

Cloudflareは[AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/)機能を使うと、いろいろなAIクローラのアクセスをブロックしてくれる（robots.txtを生成してくれる）。

クローラーにコスト消費されるのもなんか嫌なので、これまではスルーしてたけど、ブロックすることにした。

SSRということは、AIがどんなコンテンツを出力するか、承認するステップがないので、若干の怖さはある。いちおうプロンプトに出力禁止要素を含めつつ、要素をホワイトリスト形式でサニタイズする処理も入れてある。

書いていて思うけど、AIが勝手に出力したとして、それは私の責任ではありません、なんて言えるわけないわと思う。自分で実装してるし。

## 感想

リロードするたびにコンテンツが変わる記事コンテンツにどんな価値があるのか、作ってみながら考えようと思ったけど、まだあまりピンときてない。

個人的にはURLを他人に共有することは、自分が見ているものを共有することを自然と期待していたけど、期待通りにならないコンテンツも出てくるかもしれない（AI以前も同じものを共有できていたのか、確証はないが）。

毎日AIに記事を書かせてコミットさせて、それをまたAIが読み込んでコンテンツ生成して…という循環が行き着く先を見てみたいような気もする。

とにかくCloudflareすげーな、と思う。
