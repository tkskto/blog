---
title: '作って学ぶブラウザのしくみ-HTTP、HTML、CSS、JavaScriptの裏側'
publishDate: 2025-02-01
tags: ['本']
---

ChromiumもWebkitもGeckoも、WHATWGやW3Cによって定められたWeb標準仕様に書かれている「ブラウザにはこういう機能が備わっていて、その機能はこのように動作すべき」という定義に則って作られている。

Web制作がなんとなくおもしろいな、と個人的に思うのはその仕様をWebサイトを作る人も見ているという点で、ブラウザをどう動かしたいかを考えれば、どの機能を使えばいいか分かるようになっている。

ゲームの説明書なんかに近いのかな？Aボタンを押せばパンチをくりだすように作られているゲームで、ユーザーはパンチを出したいならAボタンを押す。みたいな？あまりいい例えじゃないな。

ゲームの場合はゲームを作る人とゲームで遊ぶ人の2役がいるが、Webサイトの場合はWebサイトが動く場所を作る人、Webサイトを作る人、Webサイトを使う人という3役いる。

いや、ゲームの場合も、ゲームが動く筐体を作る人がいるので、ゲームを作る人が参照している仕様もあったりするのか…？

まぁそれはどうでもよくて、なんというか仕様を見ながらWebサイトを作って、思い通りにうごいた時に、ブラウザと自分がちゃんと意思疎通できているような気持ちよさが、私にとってはWebサイトを作っているときのおもしろさの1つかなと思う。

ただ、それぞれの機能や動作がどのようなロジックで動いているかまでは仕様から読み取れない。ブラウザエンジンごとに異なる言語、異なるアーキテクチャで作られていて、最終的にブラウザ上でのレンダリングや見かけ上の動作は同じであっても、そこに至るまでの過程は違う。

私たちが書いたソースコードをブラウザがどのように読みとって、どのように処理をして、どのように構造化して、どのように描画するのか、それは仕様からは読み取れない。だた、本当はそれを知った上でコードを書くことが理想であり、最適化と呼べるものなんじゃないかと思う。

ブラウザの上でぬるぬる動くような高いパフォーマンスのWebサイトを作りたいなら、ブラウザに寄り添ったコードを書くのがいいに決まってる。

ロジックを把握するためには、実際のロジックを見る必要があるが、それぞれ何千万行もあるようなソースコードを見ていくのは現実的ではないので、想像するしかない。

けど、何も知らない状態で想像したとしても意味はないので作ってみることにした。

ということで呼んでみたのが[［作って学ぶ］ブラウザのしくみ | プログラミング・システム開発,その他プログラミング・システム開発 | Gihyo Direct](https://direct.gihyo.jp/view/item/000000003560)である。前段が長すぎる。

## 感想

他の方が書いた[「[作って学ぶ] ブラウザのしくみ」を読んだ - 覚書](https://satoru-takeuchi.hatenablog.com/entry/2024/11/13/203913)を読んでもらえれば、内容はなんとなく掴めると思う。

ちょうどよくJetBrainsのRust用IDEである[RustRover](https://www.jetbrains.com/ja-jp/rust/)が非商用利用なら無料で使えるようになったので使ってみた。普段からJetBrains系のIDEを使っていたので操作しやすかったのもあるが、コード補完は効くし、内部コードへのアクセスも楽なので、学習速度にも好影響だったような気がする。

AIに聞きながら進めていったけど、よく言われているように学習速度は速くなるというか、つまづいたところがどうしても分からなくて途中離脱するのは減るのかなーという感覚がある。まずはAIに聞くことで自分が何を調べれば良いのか、そのとっかかりを得るような感じかな。

正直なところ最初に書いていたようなブラウザに寄り添ったコードを書けるかというと微妙かなーと思う。どちらかと言うとRustの勉強ができた、ということのほうが自分にとっては大きな成果かなと感じている。

適宜仕様へのリンクが張ってあり、仕様を見ながらコードに落としこむことで、仕様の読み方をなんとなくが何となく分かったような気持ちにはなれような気がする。個人的には[ECMAScriptのBNF](https://tc39.es/ecma262/#sec-grammar-summary)に関する学びが多かった。

テストコードもセットで書いていく感じで、書いたコードがどう動くのかのイメージもしやすかった。

Rustでアプリ作ってみないとまたすぐ忘れそうなので[OXC](https://oxc-project.github.io/javascript-parser-in-rust/docs/intro)のチュートリアルとかをちょっとやってみようかと思う。

## 調べたこと

Rustはほとんど初めてだったので、知らなかったことが多かった。メモ。ブラウザの仕組みは関係ない。

### Cargo

CargoはRustのパッケージマネージャー兼ビルドツール。Rustの公式ツールチェーンに含まれていて、Rustのプロジェクト管理ができる

*   `cargo new my_project`: 新しいプロジェクトを作る
*   `cargo add serde`: Rustのライブラリ（クレート）を追加する
*   `cargo update`: 依存ライブラリのバージョンをアップデートする
*   `cargo build`: ビルドする
*   `cargo run`: 実行する
*   `cargo test`: テストを実行する
*   `cargo doc`: ドキュメントを作成する

### cargo.toml

Cargo.tomlは、Rustプロジェクトの設定ファイルで、プロジェクトのメタ情報・依存関係・ビルドオプションなどを定義するために使用する。

例：

```toml
[package]
name = "my_project" # パッケージ名（プロジェクト名）
version = "0.1.0" # バージョン（SemVerに従う）
edition = "2021" # Rustのエディション（2015, 2018, 2021 など）
authors = ["Your Name <your@email.com>"] # 作者情報
description = "This is my Rust project" # 説明
license = "MIT OR Apache-2.0" # ライセンス
repository = "https://github.com/user/my_project" # GitHubリポジトリ
default-run = "hoge" # cargo run を実行すると、"hoge"というバイナリを実行する

[dependencies]
serde = "1.0"  # 1.0 の最新版を使用
rand = "0.8"   # 0.8 の最新版を使用
noli = { git = "https://github.com/hikalium/wasabi.git", branch = "for_saba", optional = true } # gitの特定のブランチから落としてくる

[features]
default = ["serde"] # デフォルトで有効化される機能
advanced = ["serde", "tokio"] # cargo build --features advanced で有効化可能
```

[Cargo.toml](https://github.com/d0iasm/sababook/blob/main/ch7/saba/Cargo.toml)

### rust-toolchain.toml

Rustのツールチェーン（コンパイラや関連ツールのバージョン）を指定するための設定ファイル。

プロジェクトのルートディレクトリに置いておくと、Rustのツール（cargoやrustcなど）がこの設定を参照し、指定されたツールチェーンを自動的に使用する。

[rust-toolchain.toml](https://github.com/d0iasm/sababook/blob/main/ch7/saba/rust-toolchain.toml)

```toml
[toolchain]
channel = "nightly-2024-01-01" # 使用するRustのバージョン
components = [ "rustfmt", "rust-src" ] # 追加でインストールするRustのコンポーネント
targets = [ "x86_64-unknown-linux-gnu" ] # コンパイル対象のプラットフォーム
profile = "default" # Rustツールチェーンのインストール方法（minimalとかcompleteとかがある）
```

### Rc<T>とRefCell<T>

[`Rc<T>`](https://doc.rust-jp.rs/book-ja/ch15-04-rc.html)と[`RefCell<T>`](https://doc.rust-jp.rs/book-ja/ch15-05-interior-mutability.html)はスマートポインタと呼ばれるもの。

`Rc<T>`（Reference Counted Smart Pointer）は、データを複数の所有者で共有するために使用される。ただし可変ではないので`mut`は不可。

`RefCell<T>`は可変参照の制約をランタイムでチェックするスマートポインタで、`Rc<T>`内のような`mut`が使えない状況でも、データを変更できるようになる。

```rust
use std::cell::RefCell;

fn main() {
    let x = RefCell::new(5);

    *x.borrow_mut() += 1; // `borrow_mut()` を使えば値を変更できる

    println!("x = {:?}", x.borrow()); // `borrow()` で値を取得
}
```

不変な`Rc<T>`を使いながら、`RefCell<T>`で可変性を確保するのが一般的なパターンらしい。

### Option<T>、Some(T)、None、unwrap()、unwrap_or()

Rustでは「値が存在しない」という概念を安全に扱うために`Option<T>`型が提供されている。

*   `Option<T>`: 値が「ある or ない」状態を表す型
*   `Some(T)`: 値が存在する場合に使うラッパー
*   `None`: 値がないことを明示的に示す

以下のような関係になる。

```rust
enum Option<T> {
    Some(T), // 値があるとき
    None,    // 値がないとき
}
```

`Option<T>`から値を取り出すには`unwrap()`を使う：

```rust
let x: Option<i32> = Some(10);
println!("{}", x.unwrap()); // Output: 10
```

`None`に対して`unwrap()`するとクラッシュするので`unwかんけいせいap_or()`を使うこともできる。

```rust
let y: Option<i32> = None;
println!("{}", y.unwrap_or(0)); // Output: 0
```

Rustでは`match`で安全に処理するのが基本らしい。

```rust
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None // 0 で割るのはエラーなので None を返す
    } else {
        Some(a / b)
    }
}

fn main() {
    let result = divide(10, 2);

    // resultに値があるかどうかを確かめてから処理する
    match result {
        Some(value) => println!("結果: {}", value),
        None => println!("エラー: 0で割ることはできません"),
    }
}
```

`if let`でシンプルに書くこともできる。

```rust
let x: Option<i32> = Some(42);

// xに値がある場合は値を`value`という名前で取り出す
if let Some(value) = x {
    println!("値: {}", value); // 42
} else {
    println!("値がありません");
}
```

### ResultとOkとErr

Rustでは、関数の実行結果が成功するか失敗するかを`Result<T, E>`型で表すことができる。

`Result<T, E>`は2つの状態のいずれかを持つ。

*   成功(`Ok(T)`): T型の値を含む
*   失敗(`Err(E)`) → E型のエラー情報を含む

以下のような関係になる。

```Rust
enum Result<T, E> {
    Ok(T),  // 成功（成功時の値を持つ）
    Err(E), // 失敗（エラーの情報を持つ）
}
```

`Option`と同様に`Result`の値は`unwrap()`で取り出す。`switch`文で安全に取り出すのが基本。

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("0で割ることはできません".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    let result = divide(10, 0);

    match result {
        Ok(value) => println!("成功: {}", value),
        Err(err) => println!("エラー: {}", err),
    }
}
```
