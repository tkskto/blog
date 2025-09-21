---
title: "does not have member field 'org.gradle.jvm.toolchain.JvmVendorSpec IBM_SEMERU'"
publishDate: 2025-09-21
tags: ['エンジニアリング']
draft: true
---

JetBrainsのコード品質ツールである[Qodana](https://www.jetbrains.com/ja-jp/qodana/)を使い、Kotlin/Gradleプロジェクトの静的解析を自動化しようとした際にビルドエラーに遭遇したのでメモ。

一応私の環境は以下。

*   OS: macOS 15.6.1 (Darwin 24.6.0) x86_64
*   JDK: OpenJDK 17.0.8.1 (LTS)
*   Gradle: 9.1.0 (Wrapper)
*   IntelliJ IDEA: 2025.2.1 (build 252.*)
*   Kotlin: 2.1.20

## 発生したエラー

Qodana（[JetBrains/qodana-action](https://github.com/JetBrains/qodana-action)）をGitHub Actionsで実行した際、Workflowログに以下のようなエラーが出た。

```
Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field 'org.gradle.jvm.toolchain.JvmVendorSpec IBM_SEMERU'
...
Caused by: java.lang.NoSuchFieldError: Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field 'org.gradle.jvm.toolchain.JvmVendorSpec IBM_SEMERU'
	at org.gradle.toolchains.foojay.DistributionsKt.<clinit>(distributions.kt:20)
```

ローカルでは再現せず、GitHub Actionsでのみ失敗していたので、よくわからなかった。

## IBM_SEMERU

IBM_ SEMERUはIBM社が開発しているJDK（Java Development Kit）ディストリビューション。

[Gradleのユーザーガイド](https://docs.gradle.org/current/userguide/upgrading_version_8.html#ibm_semeru_should_not_be_used)を見ていたら以下のように書かれていた。

> The enum constant JvmVendorSpec.IBM_SEMERU is now deprecated and will be removed in Gradle 9.0.0.
> 
> Please replace it by its equivalent JvmVendorSpec.IBM to avoid warnings and potential errors in the next major version release.

どうやらGradle 9以降はIBM_SEMERUは非推奨らしい。

自分はこのJDKは使ってなかったけど、`foojay-resolver-convention`が、古いバージョンだとこの定数に依存していたっぽい。

## foojay-resolver-convention

foojayはどのベンダー（Adoptium、Oracle、Azulなど）が、どのバージョン、どのアーキテクチャで提供しているかを一覧にしている[Disco API](https://github.com/foojayio/discoapi)を公開しています。

Gradleのプラグインであるorg.gradle.toolchains.foojay-resolverは、このDisco APIを使ってツールチェーンの候補を取得し、「要件に合うJDKをダウンロードして使う」設定を自動でやってくれる。

[@gradle/foojay-toolchains](https://github.com/gradle/foojay-toolchains)のREADMEにも

> IBM_SEMERU is deprecated in Gradle for a while and removed in Gradle 9+.

と書かれていて、`@gradle/foojay-toolchains`のバージョンが古いとビルドが落ちるので、`settings.gradle.kts` のプラグインバージョンを明示的に1.0.0以降に更新すればビルドが通るようになった。

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}
```
