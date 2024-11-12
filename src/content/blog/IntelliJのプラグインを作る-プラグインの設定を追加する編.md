---
title: 'IntelliJのプラグインを作る-npmパッケージを動かすぞ編'
publishDate: 2024-06-04
tags: ['エンジニアリング']
---

このタイミングでIntelliJ Platform Pluginのバージョンをv2にアップデートした。主にbuild.gradle.ktsの記載の仕方が変わったがこの記事では触れない。

以下の記事がこれまでの記録。

*   [IntelliJのプラグインを作る-1日目](/blog/intellijのプラグインを作る-1日目/)
*   [IntelliJのプラグインを作る-Gradle編](/blog/intellijのプラグインを作る-Gradle編/)
*   [IntelliJのプラグインを作る-npmパッケージを動かすぞ編](/blog/intellijのプラグインを作る-npmパッケージを動かすぞ編/)

世界中の開発者が開発してくれているプラグインは、いろいろな設定を提供してくれているケースが多く、自作のプラグインでも設定ファイルを自動で検知するか、自分でパスを指定するかの設定を追加したい。

これはユーザ側が明示的に設定できるという利点もあるが、単にパスが明示的である方がプラグイン全体の設計も楽になるので実装したい。

正直ドキュメント見てもなんのこっちゃという感じなので、JetBrainsのGitHubに上がっている[tslint](https://github.com/JetBrains/intellij-plugins/tree/master/tslint)をつまみ食いしながら実際に動かしてみることをおすすめしたい。

ある程度作ってみたあとで、ドキュメント（[Settings](https://plugins.jetbrains.com/docs/intellij/settings.html)）に立ち戻ることにしよう。

## 設定の2つのレベル

[IDEの設定](https://www.jetbrains.com/help/idea/configuring-project-and-ide-settings.html)は以下の2つのレベルに分かれる。

*   グローバルレベル：IDEのテーマや通知設定などプロジェクトによらず共通の設定
*   プロジェクトレベル：バージョン管理システム、コードスタイルなどプロジェクトによって変わる可能性がある設定

この記事で記録するのはプラグインの設定をプロジェクトレベルで保存する内容となる。

## 設定の基本となるPersistence Model

IDEの設定で変更した内容は[Persistence Model](https://plugins.jetbrains.com/docs/intellij/persistence.html)に従って保存される。Persistence Modelはさらに以下の2種類に分かれている。

*   Persisting State of Components
*   Persisting Sensitive Data

### Persisting State of Components

IDEの再起動時にコンポーネントやサービスの状態を永続化するためのAPIを提供する。

サービスを永続化させるには以下のステップが必要になる。

*   [PersistentStateComponent](https://github.com/JetBrains/intellij-community/tree/idea/242.23726.103/platform/projectModel-api/src/com/intellij/openapi/components/PersistentStateComponent.java)インターフェースを実装したサービスクラスを実装する
*   状態クラスを定義する
*   [@State](https://github.com/JetBrains/intellij-community/tree/idea/242.23726.103/platform/projectModel-api/src/com/intellij/openapi/components/State.java)アノテーションを使って状態を保存する場所を指定する

#### サービスクラス

自作プラグインの設定はESLintの設定をある程度踏襲しようと思っており、JSのリンターの設定を保存するための`JSLinterConfiguration`という抽象クラスがあるのでこれを使う。

ちなみに`JSLinterConfiguration`クラスは`PersistentStateComponent`クラスを実装している。

実装だけ省いて書くとこんな感じになるはず。。

```kt
@Service(Service.Level.PROJECT)
@State(name = "MyPluginConfiguration", storages = [Storage("jsLinters/MyPlugin.xml")])
class MyPluginConfiguration(
    @NotNull project: Project,
) : JSLinterConfiguration<MyPluginSettingState>(project) {
	override fun savePrivateSettings(state: MyPluginSettingState) {}

	override fun loadPrivateSettings(state: MyPluginSettingState): MyPluginSettingState {}

	override fun toXml(state: MyPluginSettingState): Element {}

	override fun getInspectionClass(): Class<out JSLinterInspection> {}

	override fun fromXml(element: Element): MyPluginSettingState {}
}
```

#### 状態クラス

`JSLinterConfiguration`で扱う状態クラスは`JSNpmLinterState`を継承する必要がある。

```kt
class MyPluginSettingState(
	nodePackageRef: NodePackageRef,
	customConfigFileUsed: Boolean,
	customConfigFilePath: String? = null,
) : JSNpmLinterState<MyPluginSettingState> {
	override fun getNodePackageRef(): NodePackageRef {}

	override fun withLinterPackage(nodePackageRef: NodePackageRef): MyPluginSettingState {}

	override fun equals(other: Any?): Boolean {}

	override fun hashCode(): Int {}

	override fun toString(): String {}
}
```

詳細はわからんけどXMLにシリアライズして保存してるっぽい。各メソッドが何をするかはメソッド名でなんとなく察する。

ちなみに永続化できるのは以下のデータのみ。

*   numbers (int, Integerなどを含む)
*   booleans
*   strings
*   collections
*   maps
*   enums

※ 他のタイプを永続化したい場合は[Converter](https://github.com/JetBrains/intellij-community/tree/idea/242.23726.103/platform/util/src/com/intellij/util/xmlb/api.kt)を使うといいらしい。ここでは触れない。

#### アノテーション

サービスクラスに以下のようにアノテーションを書く

```kt
@State(name = "MyPluginConfiguration", storages = [Storage("jsLinters/MyPlugin.xml")])
```

*   name: 状態の名前。XMLのルートタグ名になる。必須。
*   Storage: 格納場所の指定。プロジェクトレベルのサービスの時は任意。
*   reloadable: XMLファイルが外部から変更された時、状態が変更されたときにリロードが必要かどうか（`false`にするとプロジェクトを完全にリロードする必要がある）

#### おまけ：SettingSyncによる設定の同期

IntelliJにはSettingSyncという機能が標準で備わっており、異なるマシンでもIDEの設定を同期することができる。

さきに書いた設定をSettingSyncの対象にするには記述するアノテーションにいくつか条件がある。

*   `RoamingType`が`@Storage`に対して定義されていて、値が`DISABLED`になっていないこと
*   `SettingsCategory`が定義されていて、値が`OTHER`になっていないこと
*   同じXMLファイルに格納されるデータが複数ある場合、`RoamingType`がすべて一致していること

### Persisting Sensitive Data

パスワードやサーバURLなどの機密性の高いユーザーデータ（Persisting Sensitive Data）を安全に保存する場合はThe Credentials Store APIを使う。

[How to Use](https://plugins.jetbrains.com/docs/intellij/persisting-sensitive-data.html#how-to-use)に簡単な使い方が書いてあったのでここでは触れない。

## Configurableクラスをplugin.xmlに記述する

カスタム設定の実装は、設定用のエクステンションポイントを使ってplugin.xmlに記述することで、その存在をIDEに伝えることができる。

```xml
<extensions defaultExtensionNs="com.intellij">
  <projectConfigurable
      parentId="tools"
      instance="com.example.MyPluginConfigurable"
      id="com.example.MyPluginConfigurable"
      displayName="My Project Settings"
      nonDefaultProject="true"/>
</extensions>
```

`parentId`はIDEの数ある設定カテゴリのどこに設定を表示するかを指定することになる。IDEに標準で用意されているカテゴリの[IDは決まっている](https://plugins.jetbrains.com/docs/intellij/settings-guide.html#values-for-parent-id-attribute)のでそこから選ぶことになる。

設定グループの親子関係を作成するには[Custom Settings Groups](https://plugins.jetbrains.com/docs/intellij/settings-groups.html)を読むとよい。

プログラムで親子関係定義することもできるけど、実行時だとパフォーマンスが悪いので、設定に限らずだけどplugin.xmlで定義しておけるものは定義しておくのがベストプラクティスっぽい。

`projectConfigurable`エントリポイントに指定する実装は[Configurableクラス](https://plugins.jetbrains.com/docs/intellij/settings-guide.html#the-configurable-interface)か[ConfigurableProviderクラス](https://github.com/JetBrains/intellij-community/tree/idea/242.23726.103/platform/ide-core/src/com/intellij/openapi/options/ConfigurableProvider.java)のどちらかになる。

Configurableクラスは`instance`に指定し、ConfigurableProviderクラスは`provider`に指定する。

ConfigurableはJavaDoc読むことをおすすめすると書いてある。

とりあえず箇条書きのメモ。

*   IDEの設定ダイアログで実装した設定項目がクリックしたタイミングで、Configurableクラスのコンスタラクタが呼び出される
*   IDEの設定ダイアログを閉じたタイミングでインスタンスは終了する
    *   終了するタイミングで`Configurable.disposeUIResources()`が呼び出される
*   プログラムから設定ダイアログを開きたい場合は[ShowSettingsUtil](https://github.com/JetBrains/intellij-community/blob/idea/242.23726.103/platform/platform-api/src/com/intellij/openapi/options/ShowSettingsUtil.java)を使うと便利

今回のプラグインではESLintの設定を踏襲するために`JSLinterConfigurable`というクラスを継承して作る。

```kt
class MyPluginConfigurable(
	project: Project,
) : JSLinterConfigurable<MyPluginSettingState>(project, MyPluginConfiguration::class.java, true) {
	override fun createView(): JSLinterView<MyPluginSettingState> {
		return MyPluginSettingsView(myProject, displayName, MyPluginSettingsComponent(project, isFullModeDialog, false))
	}

	override fun getId(): String {
		return "com.example.MyPluginConfigurable"
	}

	override fun getDisplayName(): String {
		return "My Project Settings"
	}

	private class MyPluginSettingsView(
		project: Project,
		displayName: String,
		panel: MyPluginSettingsComponent,
	) : NewLinterView<MyPluginSettingState>(
        project,
        displayName,
        panel.getPanel(),
    ) {
		private val myPanel: MyPluginSettingsComponent = panel

		override fun getStateWithConfiguredAutomatically(): MyPluginSettingState {
			return MyPluginSettingState.DEFAULT.withLinterPackage(AutodetectLinterPackage.INSTANCE)
		}

		override fun handleEnabledStatusChanged(enabled: Boolean) {
			myPanel.handleEnableStatusChanged(enabled)
		}

		override fun setState(state: MyPluginSettingState) {
			myPanel.setState(state)
		}

		override fun getState(): MyPluginSettingState {
			return myPanel.getState()
		}
	}
}
```

実際に設定ダイアログに何を表示するかは、上記のコードで言うと`MyPluginSettingsView`クラスに書かれている。

`MyPluginSettingsView`ではKotlinでUIを宣言するための[Kotlin UI DSL](https://plugins.jetbrains.com/docs/intellij/kotlin-ui-dsl-version-2.html)を使って書いていくことになる。

Kotlin UI DSLについては自分でも少しまとめるつもりだが、別の方の記事で[IntelliJ Platform Pluginの開発にて、Kotlin UI DSL Version 2 や Swing を使って、ToolWindow上にコンポーネントを表示してみた](https://thinkami.hatenablog.com/entry/2024/02/25/173458)という記事がコード、キャプチャ両方セットでまとめてくれていたのでわかりやすいとおもう。

正直ここまで文章を書いている自分以外には、うまく伝わらないことだらけな気がするが、、とりあえずいつか自分で見返す時が来た時のために、IDEとカスタム設定のタッチポイントの記録ということで…。

## おまけのおまけ

1つだけハマりポイントがあったのでメモ。作成した設定を変更して「apply」しようとすると、

> Can't find tools for "MyPlugin" in the profile "Project Default"

というエラーがでて変更した設定が反映されなかった。

静的コード解析に関する設定を追加する際はどうやら[Code Inspections](https://plugins.jetbrains.com/docs/intellij/code-inspections.html)に関する設定も追加する必要があるらしい。

### コード・インスペクション

コード・インスペクションは静的コード解析用に設計されたツール群で、編集中のファイルを走査して問題のある構文を検査したり、クイックフィックス機能を提供することができる。

WebStormにおけるインスペクション機能について知りたい場合は[Code inspections](https://www.jetbrains.com/help/webstorm/running-inspections.html)を見るとよいと思う。

各インスペクションツールの設定は「プロファイル」としてグループ化されていて、ツールごとに検査するファイルの範囲や重大度の変更ができるようになっている。

今回作成しているプラグインも静的コード解析ツールなので、同様にプロファイルを提供する必要があるが、デフォルトのプロファイルである「Project Default」にその設定がないことでエラーになっていたようだ。

ちなみに、言語ごとに提供されているインスペクション機能は[New Inspections in This Release | Inspectopedia Documentation](https://www.jetbrains.com/help/inspectopedia/WhatIsNewInspections.html)を見るとよい。

### インスペクション機能の実装

インスペクション機能を提供するには、以下の2種類のエクステンションポイントのどちらかを使う。

*   localInspection：一度に1つのファイルを動作するインスペクションに使用する
*   globalInspection：複数のファイルにまたがって動作するインスペクションに使用する

今回は場合は1つのファイルに対して動作するので`localInspection`を使う。

指定できる各属性は[comparing_string_references_inspection](https://github.com/JetBrains/intellij-sdk-code-samples/blob/main/comparing_string_references_inspection/src/main/resources/META-INF/plugin.xml#L43-L57)というサンプルツールのコードを見るのがわかりやすいと思う。（というか他にドキュメントっぽいのが見当たらなかった）

```xml
<extensions defaultExtensionNs="com.intellij">
    <localInspection language="JAVA"
         bundle="messages.InspectionBundle"
         key="inspection.comparing.string.references.display.name"
         groupPath="Java"
         groupBundle="messages.InspectionsBundle"
         groupKey="group.names.probable.bugs"
         enabledByDefault="true"
         level="WARNING"
         implementationClass="org.intellij.sdk.codeInspection.ComparingStringReferencesInspection"/>
</extensions>
```

`implementationClass`に指定するクラスはどの言語を扱うかによって参照するスーパークラスが変わってくるみたいだが、今回は`JSLinterInspection`というクラスを継承したクラスを指定した。

実装を除いたコードは以下のような感じ。

```kt
class MyCustomInspection : JSLinterInspection() {
    override fun chooseSeverity(
        fromError: HighlightSeverity,
        inspectionSeverity: HighlightSeverity,
    ): HighlightSeverity {}
    
    override fun getOptionsPane(): OptPane {}
    
    override fun ensureServiceStopped(project: Project) {}
    
    override fun getBatchSuppressActions(element: PsiElement?): Array<SuppressQuickFix> {}
    
    override fun getGroupDisplayName(): String {}
    
    override fun getSettingsPath(): List<String> {}
}
```

各インスペクション機能には、機能を説明するためのHTMLファイルをセットで用意する必要がある。

resourcesフォルダ内にinspectionDescriptionsフォルダを作ってその中にHTMLファイル作成するが、その時のファイル名は`JSLinterInspection`クラスを継承したクラスから「Inspection」をとったものになる。

先ほどのサンプルコードの場合は「MyCustom.html」を作って、その中に説明文を書く。

HTMLのファイル名を変更したい場合は`getShortName`メソッドをオーバーライドして、ファイル名を指定することもできる。ただし、その場合はplugin.xmlにも`shortName`を指定することが推奨されている。plugin.xmlに書くことで、クラスを参照するよりも前にIDEがHTMLファイルを検知でき、パフォーマンスがよい。
