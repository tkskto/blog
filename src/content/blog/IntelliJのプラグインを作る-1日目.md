---
title: 'IntelliJのプラグインを作る-1日目'
publishDate: 2023-11-07
tags: ['エンジニアリング']
---

IntelliJというか、WebStormのプラグインを作りたくていろいろ調べながら進めているのでメモ。

追記ここから；

あれやりたいけどどうやってやればいいか分からない、とかが多発したけど、最初はどこをフックにして情報を探せばよいか検討がつかなかった。

プラグインの開発を始める前に[Explore the IntelliJ Platform API](https://plugins.jetbrains.com/docs/intellij/explore-api.html)を読んでおくとよいかもしれない。

読んだとしても、APIの使い方が簡単になるわけではないけど、とっかかりを掴むのには役立ちそう。

あと、全部は見てないけど、テスト周りの応用的な話がYouTubeに上がってたりしたのでメモとして書いておく。

*   [Busy Plugin Developers](https://www.youtube.com/playlist?list=PLQ176FUIyIUZRWGCFY7G9V5zaM00THymY)
*   [IntelliJ Idea Plugin Development EP01](https://www.youtube.com/watch?v=fVos38m3CU4)

：追記ここまで

## 公式のテンプレートを使う

まずはJetBrainsのGitHubに[intellij-platform-plugin-template](https://github.com/JetBrains/intellij-platform-plugin-template)があるので、まずはそのテンプレートを使ってプロジェクトを作りつつ、このGitHubリポジトリのREADME.mdにプロジェクトを作成した後の手順を見ながら変えないといけないところを変える。

テンプレートを使わない場合は[Plugin DevKit](https://plugins.jetbrains.com/plugin/22851-plugin-devkit)っていうプラグイン開発用のプラグインがあるので、こちらも使うとシンプルな構成新規プロジェクトを作成できる。

## plugin.xml

ここからは設定が済んでいる前提で、いくつかのコアな機能を深掘りしていく。今回はplugin.xmlについて深掘りする。

plugin.xmlはプラグインのメタ情報や、色々な処理のエントリーポイントを書くファイルなので、そのプラグインがどんな主要機能を提供しているかは、基本plugin.xmlを見ればなんとなくわかるようになる。たぶん。

plugin.xmlに記載する内容は[Configuration Structure Overview](https://plugins.jetbrains.com/docs/intellij/plugin-configuration-file.html#configuration-structure-overview)を見る。

プラグインの名前などの基本的なメタ情報以外で、いくつか取り上げてみよう。

## depends

このプラグインが依存しているモジュールを指定する。WebStorm向けのプラグインを作る場合は`JavaScript`の指定が必須。

```xml
<idea-plugin>
    <depends>JavaScript</depends>
</idea-plugin>
```

## resource-bundle

`resource-bundle`にはi18nを実現するためのファイルを指定する。アプリケーションのテキストメッセージやエラーメッセージなどの文字列を外部化しておいて、異なる言語に対応する。

言語ごとにファイルを作っておくと、ユーザーの使用言語にあったファイルを参照してくれる。はず。

## Actions

[アクション](https://plugins.jetbrains.com/docs/intellij/basic-action-system.html)はIDEのツールバーに拡張機能ようのメニューを追加して、クリックされた時に何かをするタイプの拡張機能。拡張機能の中でも実行タイミングが最もわかりやすい。

データを保存する時の注意点とか、アクションをグループ化してツールバー内でネストするとか、ラベルとか、ショートカットキーとかいろいろ考える必要ありそう。

右クリックした時のメニューにアクションを追加する時のサンプル。

```xml
<actions>
    <group
        id="org.intellij.sdk.action.CustomDefaultActionGroup"
        class="org.intellij.sdk.action.CustomDefaultActionGroup"
        popup="true">
        <add-to-group group-id="EditorPopupMenu" anchor="first"/>
    </group>
</actions>
```

## Listeners

[リスナー](https://plugins.jetbrains.com/docs/intellij/plugin-listeners.html)というのは、プラグインが配信されるイベントをサブスクライブする仕組み。

リスナーはアプリケーションレベル、もしくはプロジェクトレベルで定義することができる。

イベント（IntelliJではトピックというっぽい）の一覧は[Extension Point and Listener List](https://plugins.jetbrains.com/docs/intellij/extension-point-list.html#intellij-platform)に載っている。

### applicationListeners

`applicationListeners`はアプリケーションレベル、つまりIDE全体のイベント（IDEの起動や終了など）をサブスクライブする。

リスナーはプログラム内からも設定できるが、plugin.xmlを通して、宣言的に設定したほうがパフォーマンスがいいらしい。

```xml
<idea-plugin>
    <applicationListeners>
        <listener class="myPlugin.MyListenerClass" topic="BaseListenerInterface"/>
    </applicationListeners>
</idea-plugin>
```

### projectListeners

`projectListeners`はプロジェクトレベルのトピック（プロジェクトのオープン、ファイルの変更など）をサブスクライブする。

```xml
<idea-plugin>
    <projectListeners>
        <listener class="myPlugin.MyListenerClass" topic="BaseListenerInterface"/>
    </projectListeners>
</idea-plugin>
```

## Service

[Services](https://plugins.jetbrains.com/docs/intellij/plugin-services.html)は複数箇所で呼び出されても、スコープごとにインスタンスが1つであることが保証されるコンポーネント。

IntelliJでは、アプリケーションレベル、プロジェクトレベル、モジュールレベルの3タイプのサービスがある。（メモリの使用量が増えるので、モジュールレベルは使わないほうがいいらしい。）

### Light Service

単純な機能の場合は、アノテーションをつけておくだけで、オンデマンドでロードされる。このタイプのServiceをLight Serviceという。

```kt
// アプリケーションレベルのService
@Service
class MyAppService {
  fun doSomething(param: String) {
    // ...
  }
}

// プロジェクトレベルのService
@Service(Service.Level.PROJECT)
class MyProjectService(private val project: Project) {
  fun doSomething(param: String) {
    val projectName = project.name
    // ...
  }
}
```

### 非Light Service

サービスをAPIとして外部に公開したりするときは、plugin.xmlに登録する必要がある。

```kt
interface MyAppService {
  fun doSomething(param: String)
}

class MyAppServiceImpl : MyAppService {
  override fun doSomething(param: String) {
    // ...
  }
}
```

```xml
<idea-plugin>
    <extensions defaultExtensionNs="com.intellij">
        <applicationService serviceInterface="myPlugin.MyAppService" serviceImplementation="myPlugin.MyAppServiceImpl"/>
    </extensions>
</idea-plugin>
```

## Extensions

[`extensions`](https://plugins.jetbrains.com/docs/intellij/plugin-extensions.html)は比較的複雑な方法でIDEの機能を拡張する方法で、いくつかのパターンがある。

それは[Extension Point](https://plugins.jetbrains.com/docs/intellij/plugin-extension-points.html)と呼ばれていて、1500種類以上もあるらしい。やばすぎ。

どうやら拡張機能自体が、Extension Pointを定義することができて、別の拡張機能がそのExtension Pointを使うことができるようになっていて、数が増えているよう。もちろんSDKがデフォルトで提供しているExtension Pointもある。

[IntelliJ Platform Explorer](https://plugins.jetbrains.com/intellij-platform-explorer/extensions)を使うと、特定のExtension Pointsを使っているプラグインを探すこともできるし、プラグインが提供しているExtension Pointsを探すこともできるっぽい。

拡張機能をさらに拡張したくなった時にExtension Pointsがないかなーって感じで使うのかな、と思う。Extensionsだけでなく、Listenersも検索できるみたい。逆にExtension Pointsの名前がわかるなら、すでに使っているプラグインのコードを見にいけば使い方もなんとなく見えてくる。

[Extension Point and Listener List](https://plugins.jetbrains.com/docs/intellij/extension-point-list.html#intellij-platform)からいくつか紹介したいなーと思ったけど、とくにリファレンスっぽいものがあるわけではなく、Extension Pointsの実装へのリンクが貼ってあるだけっぽい。

リンク先のコードにエクステンションポイントのディスクリプションがコードコメントで書いてあるから、使いたいやつっぽいのを探して読んでいくしかなさそう。まぁまぁツラいな。

### toolWindow

[ToolWindowFactory](https://github.com/JetBrains/intellij-community/blob/idea/232.10203.10/platform/platform-api/src/com/intellij/openapi/wm/ToolWindowFactory.java)はいわゆるサイドバーに機能を置きたい拡張機能が使う。最近だとVSCodeのCopilot Chatとかが該当すると思う。

```xml
<idea-plugin>
    <extensions defaultExtensionNs="com.intellij">
        <toolWindow factoryClass="myPlugin.MyToolWindowFactory" id="MyToolWindow"/>
    </extensions>
</idea-plugin>
```

### appStarter

[ApplicationStarter](https://github.com/JetBrains/intellij-community/blob/idea/232.10203.10/platform/ide-core/src/com/intellij/openapi/application/ApplicationStarter.kt)はコマンドラインからプラグインを起動したいときにつかうエクステンションポイント。だと思う。

```xml
<idea-plugin>
    <extensions defaultExtensionNs="com.intellij">
        <appStarter implementation="myPlugin.MyAppStarter" />
    </extensions>
</idea-plugin>
```

MyAppStarterに`premain`と`main`を実装しておくと、それぞれプラグインの起動前と起動時に呼び出される。

### externalAnnotator

[ExternalAnnotator](https://github.com/JetBrains/intellij-community/blob/idea/232.10203.10/platform/analysis-api/src/com/intellij/lang/annotation/ExternalAnnotator.java)今回作ろうと思っているプラグインのメインとなりそうなExtension Pointsの1つ。

外部のアノテーションツール（リンターなど）を使用して言語ファイルを処理するために使う。外部のアノテーションプラグインはIDEの通常のアノテーションが完了した後に実行されるので、完了するのが遅い。

アノテーションは3つのステップで行われる。

*   ファイルに関するデータを収集
*   ツールを実行してハイライトデータを収集
*   最終的にハイライトデータをファイルに適用する

```xml
<idea-plugin>
    <extensions defaultExtensionNs="com.intellij">
        <externalAnnotator implementationClass="myPlugin.MyExternalAnnotator" language="HTML" />
    </extensions>
</idea-plugin>
```

## おまけ：コアエレメント

plugin.xmlには機能的な情報意外にも[プラグインのメタ情報](https://plugins.jetbrains.com/docs/marketplace/plugin-overview-page.html)を指定する。名前や説明文など、それぞれのプラクティスがまとまっているので読んでおくと良さそう。

*   プラグインの名前
*   プラグインの互換性情報
*   プラグインの説明文
*   プラグインのロゴ
*   プラグインのスクリーンショット、動画のURL
*   プラグインのタグ
*   プラグインのライセンス
*   プラグインの利用開始手順
*   プラグインの変更履歴
*   プラグインの問い合わせ先
*   ドネーションに関する設定
