---
title: 'IntelliJのプラグインを作る-npmパッケージを動かすぞ編'
publishDate: 2024-06-04
tags: ['エンジニアリング']
---

※ この記事を書いた後にIntelliJ Platform Pluginのメジャーバージョンアップがあり、かなり大幅に変わっているので、もしかしたら参考にならないかもしれない。変更点は[JetBrains Plugin Developer Conf 2024](https://www.youtube.com/live/nsEGDXvnsa4?si=6aWGnx_6Deood7_C&t=1089)を見てもらえるとよいと思う。

以下の2記事がこれまでの記録。

*   [IntelliJのプラグインを作る-1日目](/blog/intellijのプラグインを作る-1日目/)
*   [IntelliJのプラグインを作る-Gradle編](/blog/intellijのプラグインを作る-Gradle編/)

今回はプラグインの中でnpmパッケージ、つまりNode.jsを動かすところまでやっていこう。

※ 正直なところプラグインの作り方は情報がまとまっておらず、進めるのが難しかったので、[accessibility-linter](https://github.com/pixelpark/accessibility-linter)を8割パクらせてもらっています。

## ファイルを置く

とりあえずはNode.jsのアプリケーションを作る時と同様に`package.json`をプロジェクト内に設置する。フォルダ構造は以下のようにした。

```
src/
└─ main/
   ├─ javascript/
   │  └─ src/
   │     ├─ node_modules/
   │     ├─ test/
   │     ├─ index.js
   │     └─ package.json
   ├─ kotlin/
   └─ resources/
```

`test`は必須ではない。`index.js`はCommonJSで書く必要があるので要注意。

## サンドボックス環境を作る

プラグインはJavaベースなので、Node.jsはそのまま動かせない。

プラグインのディストリビューションに外部ファイルを含める場合は、Gradle IntelliJ Pluginに含まれる[prepareSandbox](https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html#tasks-preparesandbox)を使う。

今回はnpmパッケージをまるまる外部ファイルとして含める。理由は2つ。

*   プラグインからユーザーのプロジェクト内に存在するnode_modules内のパッケージを参照する方法が単純に分からない
*   node_modulesがなくてもプラグインの基本機能は動作するように作りたい

`build.gradle.kts`に以下のように記述する。

```kts
tasks {
    prepareSandbox {
        val libraries = "${destinationDir}/myproject/lib/"

        copy {
            from("${project.projectDir}/src/main/javascript/node_modules")
            into("${libraries}/node_modules/")
        }
    }
}
```

ちなみに`copy`は[GradleのAPI](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.Copy.html)で、`from`でコピー元、`into`でコピー先を指定する。

これでビルドすると、`build/idea-sandbox/plugins/myproject/lib/`配下に`node_modules`がコピーされる。

## プラグインからJavaScriptの関数を呼び出す

1日目の記事で書いたとおり、`externalAnnotator`は以下のステップで動く。

1.  ファイルに関するデータを収集
1.  ツールを実行してハイライトデータを収集 
1.  最終的にハイライトデータをファイルに適用する

今回は2のステップでJavaScriptの関数を呼び出すことになるが、部分的に説明するのが難しいので1から説明しよう。

### ExternalAnnotator

現状のファイル構成は以下のようになっている。

```
src/
└─ main/
   └─ kotlin/
      └─ com.github.tkskto.myproject/
         ├─ annotators/
         │  ├─ AnnotatorBase.kt
         │  └─ HtmlAnnotator.kt
         └─ service/
            └─ LinterService.kt
```

今はHTMLファイルだけを対象としているけど、他の拡張子に対してもアノテーションできるようにするために、`AnnotatorBase.kt`を作っておき、他のファイルについても拡張しやすいように作る。

`AnnotatorBase.kt`は[ExternalAnnotator](https://github.com/JetBrains/intellij-community/blob/master/platform/analysis-api/src/com/intellij/lang/annotation/ExternalAnnotator.java)を継承し、以下のようなインターフェースになっている。

```kt
abstract class AnnotatorBase : ExternalAnnotator<CollectedInformation, List<CustomAnnotation>>() {
    /**
     * ツールの起動に必要な初期情報を収集する
     * @param file      アノテーションの対象になるファイルの情報
     * @param editor    ファイルのドキュメントが存在するエディタ
     * @param hasErrors 前の解析で検出されたエラーがファイルにあるかどうか
     * @return doAnnotateメソッドに渡す情報
     */
    override fun collectInformation(file: PsiFile, editor: Editor, hasErrors: Boolean): InitialInfoType {
        // 後述するServiceにファイルの内容を送信する
        val linterService = file.project.service<LinterService>()
        val lintResponse = linterService.runRequest(
            file.text,
            file.name,
        )
        
        return CollectedInformation(
            lintResponse,
        )
    }

    /**
    * アノテーションに必要なすべての情報を受け取る
    * 関数内ではインデックスやPSIへのアクセスを避けるか、チェックとロックを自分で行う必要がある
    * @param collectedInfo collectInformationによって収集された情報
    * @return annotations applyメソッドに渡す情報
    */
    override fun doAnnotate(collectedInformation: InitialInfoType?): AnnotationResultType {
    }

    /**
     * 作成したアノテーション用のデータをファイル上に反映する
    * @param file 現在IDEで開いているファイルのPSI Filesオブジェクト
    * @param annotationResult doAnnotateメソッドでreturnしたアノテーション情報のリスト
    * @param holder IDEにアノテーションを反映するためのオブジェクト
     */
    override fun apply(file: PsiFile, annotationResult: AnnotationResultType, holder: AnnotationHolder) {
    }
}
```

ざっくりとした流れは以下のようになる。

1.  `collectInformation`メソッドで現在IDEが開いてるファイルの情報を受け取り、その内容をnpmパッケージに渡して、npmパッケージ側で解析をして、結果を受け取る
1.  受け取った結果を`doAnnotate`メソッドに渡す
1.  `doAnnotate`メソッドでは、受け取ったデータをアノテーション用のオブジェクトに変換する
1.  変換した結果を`apply`メソッドに渡す
1.  `apply`メソッドでは、受け取ったデータもとにIDEに表示するツールチップ用のHTMLなどをつくってIDEに反映する

### LinterService

肝心のプラグインとnpmパッケージ間通信を実現するのが`JSLanguageServiceBase`と`JSLanguageServiceNodeStdProtocolBase`の2つのクラス。しかし、インターネットでは`JSLanguageServiceBase`に関するドキュメントを見つけられなかった。

ので、既存のプラグインの実装やクラスの実装を見て探っていくしかなさそう。この辺り詳しい人いたら教えてほしい。

`LinterService`は`AnnotatorBase`の`collectInformation`メソッドで受け取ったファイルの情報をもとに、npmパッケージを実行して、結果を受け取るクラスとして作る。

```kt
@Service(Service.Level.PROJECT)
class LinterService(project: Project): JSLanguageServiceBase(project) {
    // サービスの初期化的なもの
    override fun createLanguageServiceQueue(): JSLanguageServiceQueue {
        val protocol = ServiceProtocol(myProject, EmptyConsumer.getInstance<Any>())

        return JSLanguageServiceQueueImpl(myProject, protocol, myProcessConnector, myDefaultReporter, JSLanguageServiceDefaultCacheData())
    }

    override fun needInitToolWindow() = false

    /**
     * prepareSandboxでコピーしたindex.jsにHTMLテキストを送信する
     */
    fun runRequest(input: String, fileName: String): CompletableFuture<JSLanguageServiceAnswer?>? {
        // Node.jsに送信する
        return sendCommand(SimpleCommand(input, fileName)) { _, answer ->
            answer
        }
    }

    class SimpleCommand(val input: String, val fileName: String): JSLanguageServiceSimpleCommand, JSLanguageServiceObject {
        override fun getCommand() = "myProject"

        override fun toSerializableObject(): JSLanguageServiceObject {
            return this
        }
    }
}

class ServiceProtocol(project: Project, readyConsumer: Consumer<*>): JSLanguageServiceNodeStdProtocolBase(project, readyConsumer) {
    override fun createState(): JSLanguageServiceInitialState {
        val result = JSLanguageServiceInitialState()

        result.pluginName = "myProject"

        // prepareSandboxでコピーした先のパスを指定する
        val file = JSLanguageServiceUtil.getPluginDirectory(this.javaClass, "lib/index.js")
        result.pluginPath = LocalFilePath.create(file.absolutePath)

        return result
    }
}
```

正直なところかなりハマる。Node.js側で投げられた例外を受け取る方法とかもよくわからないので、その辺はこれから詰めていきたい。
