---
title: 'Flipperとは何か'
publishDate: 2018-11-18
tags: ['エンジニアリング']
draft: true
---

React Nativeで開発をしたことがある人なら聞いたことがあるであろう「[Flipper](https://github.com/facebook/flipper)」はFacebookが開発しているデバッグツールだ。

聞いたことがあると書いたのは、自分は聞いたことがあるけど何者なのか知らなかったからである。（恥ずかしい）

アプリを作ってる時にどうしてもビルドがうまくいかなくて「Flipperのバージョンがよくない」とか「Flipper無効にしたら動く」とか、何者かも知らないやつに振り回されていた。しかもFlipperの機能全く使ってなかったし。

一応書いておくと、Androidではgradle.propertiesに、iOSでPodfileにそれぞれFlipperのバージョンを記載するが、React NativeはPackage.jsonに書くので、それぞれの依存関係は担保できず気づかずに開発しているとハマってしまうのである。

実際、Flipperはアプリ側で有効にする必要があり、[Set up your React Native App](https://fbflipper.com/docs/getting-started/react-native)によればReact Native 0.62以降、`react-native init`コマンドで作成されたプロジェクトにはデフォルトでFlipper SDKが含まれるらしい。

もちろんそれはデバッグするためであり、SDKを埋め込むだけでは意味がない。専用のデバッグアプリを<https://fbflipper.com/>からダウンロードして開発マシンにインストールし、SDKを埋め込んだアプリがインストールされたデバイスをつなぐといろんな情報が取れる。

## Flipperとは？

もう少し具体的に書くとFlipperはただのプラットフォームであり、実際に動いているのはすべてプラグインである。つまりプラグインを統合してみやすくする、それがFlipperである。

どんなプラグインがあるかといえば

*   [アプリ内のDBを見るプラグイン](https://fbflipper.com/docs/features/plugins/databases)
*   [デバイスのログをみやすくするプラグイン](https://fbflipper.com/docs/features/plugins/device-logs/)
*   [アプリのレイアウトを木構造で見れるプラグイン](https://fbflipper.com/docs/features/plugins/inspector)
*   [アプリのネットワーク送受信データを見れるプラグイン](https://fbflipper.com/docs/features/plugins/network)

Flipperを統合したまま公開しているようなアプリであれば、デバイスをつなげばどんな情報をDBに保存しているか、どこと通信しているのかなどを基本見れてしまう。
