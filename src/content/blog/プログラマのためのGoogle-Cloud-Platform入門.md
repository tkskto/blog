---
title: 'プログラマのためのGoogle Cloud Platform入門'
publishDate: 2018-11-18
tags: ['本']
draft: true
---

GoogleのExpert資格をとるべく、とりあえず最初に読んだ本。GCPの、特に仮想環境（GCE、GKE、GAE）まわりの話が包括的に解説されている。

[プログラマのためのGoogle Cloud Platform入門 サービスの全体像からクラウドネイティブアプリケーション構築まで](https://www.amazon.co.jp/dp/B0721JNVGT/)

おきまりのアカウント作成とかは飛ばして読みつつ、Chapter2ではHTTP通信の仕組みやデータベースの基礎など、
GCP云々の前に一般的な情報も書いてあり、一般的な情報を解説しつつ、GCPではその技術がどのように使われているのかなどが関連づけて書かれていて、
復習しつつ学習することができたのがよかった。

また、結構前から勉強しようと思っていたコンテナ（Docker）とコンテナオーケストレーションツール（kubernetes）も
サンプルを実行しながら順をおって開設されているので、とっかかりにはちょうどいいと思う。

以下、チャプターごとのメモ。

## Chapter2 Webアプリケーション実行基盤を構築しよう

### 仮想化技術の違い

仮想化技術には大きく分けて、ホスト型、ハイパーバイザー型、コンテナ型の3つの仮想化タイプがある。

### データストアとストレージの違い

### 仮想マシンインスタンスの設定は変更できるか

GCP上で仮想マシンインスタンスを作成する手順が丁寧に説明されていたが、
丁寧すぎてあとで設定を変更できるのかどうかが気になった。
調べてみたら、

### ローカルディスクからCloud SQLへのデータ移行

v1.0 -> v2.0にアップデートする際に、データをローカルディスクに保存していたのを、Cloud SQLに変更するという例が扱われている。
ここで気になったのはローカルディスクのデータをそのまま持っていけるのかどうかという点。

あと、DBの設定もあとで変更できるのかも気になったので調べた。

### アプリケーションのアップデート

v1.0 -> v2.0にアップデートする際に、

> v1.0のアプリケーションを停止して、v2.0のアプリケーションをデプロイ

と書いてあるが、停止している間のアプリケーションの状態が気になった。あと、v2.0にアップデート後、データはCloud SQLのDBに保存されることになったが、実際に保存されている様子を確認する手段も説明してもらえるとありがたかった。

## あらかじめ知っておいた方が良さそうなこと

- QWIKLABSに[Googleのサブドメイン](https://google.qwiklabs.com/)があるので、先にやっておくとすんなり入門できそう。
- 各OSの特徴とか簡単な知識
- 簡単なSSHコマンドと知識

## 誤植まとめ

- p.67: 仮想マシンインスタン -> 仮想マシンインスタンス
