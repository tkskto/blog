---
title: 'WebStormからVSCodeに移行する'
publishDate: 2021-01-16
tags: ['エンジニアリング']
---

今年やることの1つ目、「エディターをWebStormからVS Codeに変更する」ために、インストールしたものなど。

## [Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)

なにはともあれ、まずは設定を同期するための設定を行う。複数環境で同じ操作をするのは時間がもったいない。同期するにはMicrosoftのアカウントが必要になる。

## [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)

コードなのか、画面なのかわからないけど、複数人で共有できる機能。ペアプロとかに向いている。

## [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager)

WebStormはプロジェクトごとに環境設定ができたりしていたけど、VSCodeはただのエディターなので、プロジェクトを管理する機能は入ってない。

## [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

WebStormでは標準で入っていた。設定ファイルをいい感じに読み込んでくれるのか少し不安。

## [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

WebStormでは標準で入っていた。設定ファイルをいい感じに読み込んでくれるのか少し不安。

## [Gremlins tracker for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=nhoizey.gremlins)

これは仕事で何度か問題になっていたゼロ幅スペースを検知してくれるためのエクステンション。

## [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

一番不安に感じているGit関連。取りあえず定番っぽいGitLensを入れて様子をみてみようと思う。

## [Local History](https://marketplace.visualstudio.com/items?itemName=xyz.local-history)

WebStormで大変重宝したローカルヒストリー機能。

Gitでミスって変更破棄しちゃった時に絶望してしまうので、ファイルのローカルヒストリーは残しておきたい。

プロジェクト内に「.history」フォルダが作成されてしまうため、.gitignore_globalに追加した。

## [favorites](https://marketplace.visualstudio.com/items?itemName=howardzuo.vscode-favorites)

超巨大プロジェクトの一部にアサインされた時に毎回ファイルを探すのが辛いので一応入れておいた。使わないかも。

## キーマップを変更した

キーマップをWebStormの頃のものに変更した。Live Shareとか使えば、ほかの人とエディターの設定を共有することはなくなる気がするので、自分が慣れているキーマップに変更した。

- Alt + Cmd + I : 選択している行をリインデント
- Alt + J : 同じ単語を選択
- Cmd + D : 行を複製
- Cmd + Shift + C : GitのSource Controlにフォーカス（前はコミットのダイアログを出していた）
- Cmd + Shift + P : GitのCommitにフォーカス（前はプッシュのダイアログを出していた）
- Cmd + Shift + @ : GitのBranchesにフォーカス（前はブランチのダイアログを出していた）
- Cmd + Shift + ↑ | ↓ : 現在の行を上下に移動
- Cmd + Shift + ↑ | ↓ : 現在の行を上下に移動
- F12 : ターミナルを開く

### リソースルートの設定

検証はしたがわからん。

https://github.com/microsoft/vscode/issues/14907

### デプロイ

FTP系の設定探っているが、まだ未検証。

### APIの定義へジャンプ

未検証

WebStormではメソッドをCmd + クリックするだけでWeb APIなどの定義ファイルに遷移することができていた。

### コードヒントの精度

未検証

WebStormではNode.jsインテグレーションがあって、インストールしたパッケージないのインターフェースもコードヒントとして出してくれていた。
