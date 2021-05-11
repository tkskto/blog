3/31に報告された「[y18n](https://www.npmjs.com/package/y18n)」のDependabot Alertのメモ。

この脆弱性はv3.2.1以前、v4.0.0以前、v5.0.4以前にて発生している。それぞれv3.2.2、v4.0.1、v5.0.5にアップグレードすることが推奨されている。

カテゴリは「high severity」。記事執筆時点での最新バージョンはv5.0.8。

GitHub Advisory Database番号は「[CVE-2020-7774](https://github.com/advisories/GHSA-c4w7-xm78-47vh)」。

## y18nとは

y18nは[yargs](http://yargs.js.org/)で使われている国際化ライブラリ。i18nのyargs版だからyargsなんだと思う。多分。

y18nは例えば、以下のような2つのjsonファイルを用意したとする。

en.json

```json
{
  "hello": "hello",
  "world": "world"
}
```

ja.json

```json
{
  "hello": "こんにちは",
  "world": "世界"
}
```

で、これを以下のように使う。

```JavaScript
const y18n = require('y18n');
const __ = y18n({
  locale: 'en',
  directory: './locales'
}).__;

console.log(`${__`hello`} ${__`world`}`); // localeが`en`なら「hello world」で`ja`なら「こんにちは 世界」と出力される
```

逆に、jsonに文字を出力することもできるので、プログラムを通して言語ごとの辞書を作ることもできる。

## 脆弱性について

y18nに存在していた脆弱性は`Prototype Pollution`と呼ばれるJavaScriptの`__proto__`プロパティに関連したもの。

日本語では、プロトタイプ汚染と呼ばれていて「[Node.jsにおけるプロトタイプ汚染攻撃とは何か](https://jovi0608.hatenablog.com/entry/2018/10/19/083725)」という記事が分かりやすい。

y18nでは`setLocale`の引数に`__proto__`を渡すと任意のキーバリューオブジェクトを`__proto__`にセットできるようになっていたようだ。

元々のクラスのソースコードを一部抜粋。

```JavaScript
class Y18N {
    // ...
    setLocale(locale) {
        this.locale = locale;
    }
    updateLocale(obj) {
        // ...
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                this.cache[this.locale][key] = obj[key];
            }
        }
    }
    // ...
}
```

`this.cache`の初期値が単純なオブジェクト（`{}`）だったため、`setLocale`の引数に`__proto__`を渡したあと、`updateLocale`にキーバリューオブジェクトを渡すと、

```JavaScript
this.cache['__proto__'][key] = obj[key];
```

が実行されることになり、結局はグローバルオブジェクトを含む全てのオブジェクトの下に`{key: value}`がセットされる。

修正後は`this.cache`の初期値を`Object.create(null)`にしたことで、プロトタイプチェーンから切り離したオブジェクトを作成されるようになっていた。

とても勉強になりました。
