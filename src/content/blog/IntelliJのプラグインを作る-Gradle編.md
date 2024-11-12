---
title: 'IntelliJのプラグインを作る-Gradle編'
publishDate: 2023-12-03
tags: ['エンジニアリング']
---

※ この記事を書いた後にIntelliJ Platform Pluginのメジャーバージョンアップがあり、かなり大幅に変わっているので、もしかしたら参考にならないかもしれない。変更点は[JetBrains Plugin Developer Conf 2024](https://www.youtube.com/live/nsEGDXvnsa4?si=6aWGnx_6Deood7_C&t=1089)を見てもらえるとよいと思う。

[前回](/blog/intellijのプラグインを作る-1日目/)に続いてWebStormのプラグインを作るまでの道のり第二弾。これまでどうにか避けては通ってきたGradle（グレードル）について。

Androidのアプリ作る時も依存関係の設定やビルドをするのにGradleを使っている。おもにJava、Kotlinのプロジェクトに使われている気がする。

IntelliJのプラグインもJava/Kotlinベースであり、Gradleも使うことになる。全容は[Gradle IntelliJ Plugin](https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html)を見てもらうと良いと思う。

今回関係するファイルは大きく分けて4つ。1つずつ見ていこう。

## build.gradle.kts

Gradleでどのようなビルドをするのかをbuild.gradle.ktsに書くことになる。前までは[Groovy](https://groovy-lang.org/)という動的プログラミング言語で書かれていたけど、[2023年5月にKotlin DSLがデフォルトになった](https://blog.jetbrains.com/ja/kotlin/2023/05/kotlin-dsl-is-the-default-for-new-gradle-builds/)。

Kotlinは静的型付け言語なので、実行時にエラーがでるのではなくエディタ上でもコンパイル時にもエラーがでる。

[IntelliJのプラグインテンプレート](https://github.com/JetBrains/intellij-platform-plugin-template/blob/main/build.gradle.kts)には最初から以下のブロックが定義されている。

*   `plugins`：ビルドプロセスに追加の機能やタスクを追加するためのプラグインを指定するが、内容は別ファイル（[libs.versions.toml](#libsversionstoml)）で管理している
*   `repositories`：プラグインが格納されているリポジトリを指定する
*   `dependencies`：プロジェクトが依存している外部のモジュールを指定する
*   `kotlin`：kotlinプラグインの設定でJVMで使用されるKotlinのバージョンとかを指定する
*   `intellij`：[Gradle IntelliJ Plugin](https://lp.jetbrains.com/gradle-intellij-plugin/)の設定でプラグインの名前とかバージョンを指定するが、内容は別ファイル（[gradle.properties](#gradleproperties)）で管理している
*   `changelog`：[gradle-changelog-plugin](https://github.com/JetBrains/gradle-changelog-plugin)の設定で開発しているプラグインのCHANGELOG.mdを自動生成するための情報を指定するが、内容は別ファイル（[gradle.properties](#gradleproperties)）で管理している
*   `qodana`：[Gradle Qodana Plugin](https://github.com/JetBrains/gradle-qodana-plugin)の設定を指定する（qodanaについてはまたの機会に…）
    *   ただしGradle Qodana Pluginはread-only状態になっており、[qodana-action](https://github.com/JetBrains/qodana-action)というGitHub Actionsに移行することが推奨されているっぽい
*   `koverReport`：[Gradle Kover Plugin](https://github.com/Kotlin/kotlinx-kover)の設定でKotlinのコードカバレッジを計測するための情報を指定する
*   `tasks`：ビルドで何をするかのタスクを1つ1つ指定する

核となるのは`tasks`で、プラグインごとに書き方が定義されているので、それに沿って書いていく感じになる。

たとえば`publishPlugin`タスクはGradle IntelliJ Pluginのタスクで[ドキュメント](https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html#tasks-publishplugin)を見ながら設定していく。

## libs.versions.toml

[IntelliJのプラグインテンプレート](https://github.com/JetBrains/intellij-platform-plugin-template/blob/main/build.gradle.kts)ではbuild.gradle.ktsの`plugins`は以下のようになっている。

```kts
plugins {
    id("java") // Java support
    alias(libs.plugins.kotlin) // Kotlin support
    alias(libs.plugins.gradleIntelliJPlugin) // Gradle IntelliJ Plugin
    alias(libs.plugins.changelog) // Gradle Changelog Plugin
    alias(libs.plugins.qodana) // Gradle Qodana Plugin
    alias(libs.plugins.kover) // Gradle Kover Plugin
}
```

ビルドに使うプラグインを設定しているのだが、本来はここに以下のようにバージョンを直接書くらしい。

```kts
plugins {
    java
    id("org.jetbrains.kotlin.jvm") version "1.9.10"
    id("org.jetbrains.intellij") version "1.16.0"
    id("org.jetbrains.changelog") version "2.2.0"
    id("org.jetbrains.qodana") version "0.1.13"
    id("org.jetbrains.kotlinx.kover") version "0.7.3"
}
```

それを/gradle/libs.versions.tomlというファイルにまとめて管理してある感じ。

## gradle.properties

gradle.propertiesはGradleプロジェクトで使用されるプロパティをまとめて定義しておくファイル。

```properties
# プロジェクトのバージョン
projectVersion=1.0.0

# 依存ライブラリのバージョン
libraryVersion=2.3.1

# プロジェクト名
projectName=MyProject
```

これを用意しておくと、Gradleのビルドスクリプト内から参照できるようになる。

```kts
properties("projectVersion")
properties("libraryVersion")
properties("projectName")
```

## settings.gradle.kts

名前の通りだが、Gradleの設定を書く。この辺りで「なんか設定ファイル多いな…」と思い始めたけど「待てよ、フロントエンドでも似たようなものか」と思い直した。

ちなみに現状このファイルに書いているのは以下のみ。

```kts
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.7.0"
}

rootProject.name = "myProject"
```

プロジェクトの名前 = プラグインの名前だから、gradle.propertiesと二重管理になっているのが若干気にはなるものの、そんなに頻繁に変更するものでもないし、変更するとしたら作り直すだろうから無視する。

ここで指定されている`plugins`はGradleのツールチェーンに関するものらしく「[Gradle 8.0 におけるツールチェーンリポジトリの変更](https://blog1.mammb.com/entry/2023/02/21/195806)」という記事がわかりやすかった。

## おまけ「Gradle Wrapper」

今回とは直接関係しないが、プロジェクトで使用するGradleのバージョン自体を管理するための[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)というものがある。

Gradleのバージョンとかが書いてある/gradle/wrapper/gradle-wrapper.propertiesというファイルと、プロジェクトのルートにおいてあるgradlew（おそらくgradle wrapperの略）というスクリプトを使って、Gradle自体を管理するようにしてあるみたい。

ちゃんと調べると仕組み自体はそんなに難しいものではないが、ちゃんと調べることをいつまでも避けて通っていると、簡単なのか難しいのか、それすらも分からない。そんな当たり前のことを気付かされました。

