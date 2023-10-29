---
title: 'Nuxt.jsでBlogを作る'
publishDate: 2020-12-15
tags: ['エンジニアリング']
---

正直今更感はあるけど、ずっと下書きで残しておくのももったいないので公開しちゃう。公開せずに後悔するなら公開して後悔しよう。

このBlogはNuxt.jsの「[Full static generation](https://nuxtjs.org/blog/going-full-static)」を使って完全静的サイトとして作っている。前はページロード後にマークダウンファイルを読み込んで、マークダウンをHTMLに変換して…ということをブラウザ上でやっていたけど、ビルドするときにやらないとなぁとずっと思っていた。Nuxt.jsのFull static generationが普通に使えそうだったのでこれを機に適用した。

## 静的ページの吐き出し方

Nuxt.jsで静的サイトを出力する場合は`nuxt generate`を使う。実際に生成するHTMLはnuxt.config.jsの`generate`プロパティにroute指定するだけでOK。自分の場合は、記事一覧は外部JSONファイルで別管理しているので、JSON読み込んでルートを作る関数を指定している。以下はイメージ。

```javascript
{
    generate: {
        dir: 'public/',
        routes: (callback) => {
            callback(null, [
                {route: '/blog/page1/', payload: {title, content, date: new Date(date.split('/')), articles}}, // これが1ページ分のデータ
                {route: '/blog/page2/', payload: {title, content, date: new Date(date.split('/')), articles}}
            ]);
        },
        fallback: '',
    }
}
```

これで`generate`すると「/public/blog/page1/index.html」と「/public/blog/page2/index.html」が吐き出される。

`payload`には、各ページに渡したいデータを指定する。ここでは以下のデータを渡している。

- title: 記事のタイトル。JSONの中に書いてある。
- content: 記事の内容を[marked](https://github.com/markedjs/marked)でHTML化したテキスト。リポジトリに置いてあるマークダウンは${title}.mdにしていて、ビルド時に`fs.readFile`を実行している。
- date: 記事を書いた日付。JSONの中に書いてある。
- articles: ブログの全記事の情報。サイドナビに全てのページのリンクを表示するために渡している。

このデータを実際に受け取るのは、.vueファイル側の`asyncData`になる。

```javascript
asyncData(context) {
    const {articles, title, content, date} = context.payload;
    return {
        articles,
        title,
        content,
        date,
    };
},
```

`context.payload`の中に、`generate`実行時にごにょごにょしたデータが渡ってくるので、あとはそれをもとにレンダリングする処理を入れておけばいいだけ。ブログの全記事の情報を表す「`articles`」は、サイドナビのコンポーネントだけに渡すのが理想なんだけど、`asyncData`は`pages`ディレクトリ配下の.vueファイルでしか使えないのが個人的にはイマイチなところ。

どの.vueファイルをベースとするかは`route`によって決まる。たとえば「/blog/page1/」は「/blog/page1/index.vue」を見にいく。
ということは、ページごとに同じ.vueファイルを用意する必要があるのか？というとそうではない。

自分の場合、記事のURLは「/blog/${記事のタイトル}/」になるので、[動的なルーティング](https://ja.nuxtjs.org/docs/2.x/features/file-system-routing/#%E5%8B%95%E7%9A%84%E3%81%AA%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)を使う必要がある。とはいっても動的にルートを作る場合は`_slug`ディレクトリを作っておく必要がおけばいいだけ。「/blog/_slug/index.vue」を作っておけば「/blog/page1/」も「/blog/page2/」も同じ.vueファイルをベースにHTMLが生成される。

記事ページの他に、一応カテゴリページも用意しているので、それも一緒に`routes`にぶちこむ感じにしている。最終的には実際の「[nuxt.config.ts](https://github.com/tkskto/blog/blob/main/nuxt.config.ts)」を見てもらうのが早そう。

同じルーティングデータでsitemap.xmlを生成してくれる[sitemap-module](https://github.com/nuxt-community/sitemap-module)というパッケージもあるのだけど、sitemap.xml用のルートでは末尾の「/」あり、SSG用のルートでは末尾の「/」なしで渡さないといけないっぽい？ので若干冗長な感じになっているが、そんな頻繁に触る部分ではないので、とりあえず見てみぬふりをしている。

## Full static generation

実は、Nuxt.jsのFull static generationにはプロジェクトの.vueファイルをクロールして、勝手にルートを生成してくれる機能がある。

おそらく`<nuxt-link>`を見ているのだろうと思うけど、このBlogのように動的ルーティングしたり、`payload`をこねくり回す場合は多分自分でルーティングの設定をする必要がある、気がする。

静的サイトとして出力されるものの、Nuxt.jsの「[prefetchLinks](https://nuxtjs.org/docs/2.x/features/nuxt-components/#prefetchlinks)」がそのまま効くのはけっこう強いと思う。

例えば、スマホの時はページ一覧がページ下部に表示されるのだけど、以下のキャプチャの左下、リンクが画面に入ったタイミングで、リンク先の「payload.js」が動的にプリロードされて、リンクがクリックされたあとの遷移が超高速になる。

<div class="img"><img src="/blog/images/39/01.webp" alt=""></div>

しかもNuxt.js内部でネットワークの状況とかを考慮しながらプリフェッチ処理してくれるので、とても優秀。

## 余談

### 余談①

`VuePress`でよくない？と何度か自問自答したけど、なんだかんだコンポーネント自分で作ったりした方が柔軟性高くていいと思っている。関係ないけど、Nuxt.jsのVue3対応そろそろかなぁ。

### 余談②

今は記事の一覧を[JSON管理](https://github.com/tkskto/blog/blob/main/assets/articles.json)にしているが、マークダウンにFrontmatterでヘッダー書いて出力する感じにしようかなと思っているところ。結局データを別管理にして外に置いといたほうがいろいろ使いまわせるんだけど、勝手にデータが更新される方法の方がスマートだよね。

### 余談③

このBlogはAmazon S3 + Amazon CloudFrontで公開しているので、デプロイも[AWS CodePipeline](https://ap-northeast-1.console.aws.amazon.com/codesuite/codepipeline/start?region=ap-northeast-1)を使っている。
GitHubのWebフック経由でGitHubからソース引っ張ってきて、AWS CodeBuildでビルドして、Code DeployでS3に流すだけ。

AWSは正直よく分からなくても使えてしまうのだけど、料金も安いし、情報もたくさん落ちているので、今のところは満足している。
