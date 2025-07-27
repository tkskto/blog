---
title: 'IoTの知識地図'
publishDate: 2025-07-27
tags: ['エンジニアリング']
---

IoTの勉強を始めたかったので、まずは頭の中に地図を作ろうということで[IoTの知識地図](https://gihyo.jp/book/2024/978-4-297-14069-4)を読み始めた。ちなみに私にはIoTに関するバックグラウンドはほぼない。

何においてもそうではあるが、IoTに関してはとくにアイデアが大事だろうなぁと思う。

## M2M

IoTと似たような技術にM2M（Machine to Machine）があるが、これは機械同士を接続する技術を指す。IoTはインターネットを通じて、ものがつながる。

## IoTを構成する要素

*   デジタル化したい対象
*   デバイス：ラズパイとかArduinoとか。対象物からデータを取り出したり、対象を操作する
*   ネットワーク：LTE、5G、Sigfox、Bluetooth…
*   クラウド：AWS、Azure、GCP…データ溜めたり、バックエンド
*   UI：アプリケーション

## デバイスを構成する要素

*   センサー
*   アクチュエーター：モーターなどによって動作する装置の総称
*   コンピューティング機能
*   通信機能
*   変換機能：アナログ<->デジタル変換

## Arduinoとラズパイ

ワンボードマイコンとシングルボードコンピュータという分類があるらしい。わたしからすればぱっと見同じに見える。

### ワンボードマイコン

ArduinoやESP32などはワンボードマイコン。[Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%AF%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%89%E3%83%9E%E3%82%A4%E3%82%B3%E3%83%B3)に依れば、

> むき出しの一枚（ワン）のプリント基板（ボード）の上に、電子部品と最低限の入出力装置を付けただけの極めて簡素なマイクロコンピュータ

ということで、ワンボードマイコンというらしい。

*   組込みシステム用に設計された小型でコスト効率が高いデバイス。低消費電力
*   諸規模な自動化タスクに適している

### シングルボードコンピュータ

ワンボードとシングルボードってなにが違うんだ、とおもうが、1枚の基板にすべてのコンピュータ機能を搭載しているのがシングルボードコンピュータ。

*   ワンボードに比べて高い処理能力を持つ
*   小型サーバとしての使用も可能

## ファームウェア

ファームウェアとは、電子機器にあらかじめ組み込まれたソフトウェアのこと。

Arduinoでは[Arduino IDE](https://www.arduino.cc/en/software/)などをつかって、C/C++ベースでプログラムを書き込むが、ファームウェアにもいろいろ種類があるらしい。

*   ベアメタル：OSを介さずに直接ハードウェアにアクセスする。なんか難しそう。
*   RTOS：リアルタイムなアプリケーションの実装に向いている

ファームウェアがデバイスの起動や初期化を行い、OSがその上で動くようなイメージ。

## 通信

通信方法にはいろいろ種類がある。通信自体にも、単向、半二重、全二重通信の3種類がある。（[単向、半二重、全二重通信](https://www.lineeye.co.jp/html/term_tanko.html））

通信は、その速度だけでなく、配線の少なさ、手軽さ、同期/非同期通信などいろいろな要件によって最適な方法を決める。

### クラウド通信用プロトコル

これまでHTTPやWebSocketくらいしか知らなかったけど、ほかにもいくつかプロトコルがある。

*   MQTT（Message Queuing Telemetry Transport）：軽量で帯域効率が高いが、メッセージング機能が限られている。スマートホーム内のリアルタイムのデータモニタリングなど省電力が必要な環境でのセンサーデータ収集など。
*   AMQP（Advanced Message Queuing Protocol）：信頼性が高く、銀行間の取引などにも使われているらしい。産業的な複雑なシステム間通信など、デバイス間のメッセージングやデータ収集に利用される。
*   CoAP（Constrained Application Protocol）：RESTful APIを提供する。UDPベース。信頼性は低いが軽量で効率的。

### ローカル通信用プロトコル

インターネットを介さない、ローカル通信用のプロトコルもいくつかある。

#### I2C（Inter-Integrated Circuit）

2本の線（SDAとSCL）を使って、コントローラー/ターゲット方式で動作する。配線が簡単で少ないピン数で複数のデバイスと接続できる。半二重通信。

<iframe width="560" height="315" src="https://www.youtube.com/embed/uzqUR4y8r44?si=chtTqoduceMkGsBu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

#### SPI（Serial Peripheral Interface）

4本の線（クロック、コントローラ出力/ターゲット入力、コントローラ入力/ターゲット出力、ターゲットセレクト）を使用して、全二重通信を実現する。

<iframe width="560" height="315" src="https://www.youtube.com/embed/cWbxVa2U5yA?si=bARELjXisnTAfQPJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

#### UART（Universal Asynchronous Receiver/Transmitter）

点対点の非同期シリアル通信（データを1ビットずつ順番に送信する通信）プロトコル。単向、半二重、全二重通信を選ぶことができる

スタートビット -> データビット -> ストップビット -> パリティビットを使ってデータを送信する。

<iframe width="560" height="315" src="https://www.youtube.com/embed/haQw83lv5c0?si=r8qkogLv4M1ZCOoH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

#### 1-Wire

1本のワイヤーでデータ通信と電力供給を行う通信方式

### 無線通信プロトコル

ZigBee、Bluetooth Low Energy、Z-Waveなどは低消費電力で近距離のデータ通信に適している。

## 電力供給

デバイスの稼働期間、交換できるようにするのか、充電できるようにするのかなど、いろいろ考えることがある。

### 電池

*   1次電池（使い捨て電池）：使い終わったら交換する
*   2次電池（充電式電池）：デバイスを電源につないで充電すれば繰り返し使えるが、電池自体が劣化する
*   エネルギーハーベスティング：周囲のエネルギーを利用して電力を作るやり方
    *   太陽光
    *   振動
    *   熱
    *   PFI：無線電波エネルギーを受信し、電力に変換（RFIDなど）

### 電源断対策

急な停電などが発生した際にデータ損失やシステム障害を防ぐための対策も必要。

*   UPS（無停電電源装置）：バックアップ電源を提供し、デバイスが安全にシャットダウンできるようにする
*   キャパシタ：キャパシタは電気を保持できる部品。短時間であればデバイスが最低限の機能を維持できる

## センサー

この辺は実際にIoTデバイスを作ることになったらしっかり調べようと思うが、そもそもどういうセンサーがあるか（どういうデータをセンシングできるのか）を知らないと作れない。

*   温度センサー：サーミスタ、熱電対、RTD（Resistance Temperature Detector）、赤外線（IR）センサー、半導体温度センサー
*   湿度センサー：抵抗型湿度センサー、容量性湿度センサー、電解質型湿度センサー
*   加速度センサー：圧電型、静電容量型、ひずみゲージ型
*   気圧センサー：圧電抵抗型、容量性気圧型、光ファイバー
*   距離（測距）センサー：超音波、赤外線、レーザー、LiDAR（Light Ditection and Ranging）
*   方位（地磁気）センサー：AMR、GMR、TMR、ホール効果センサー
*   重量センサー：ひずみゲージ型荷重セル、圧電、容量性
*   角速度センサー：MEMSジャイロスコープ、光ファイバージャイロスコープ、リングレーザージャイロスコープ
*   光センサー：フォトレジスター、フォトダイオード、フォトトランジスター
*   GNSS（GPS）
*   ガスセンサー：半導体型、電気化学センサー、赤外線センサー、触媒燃焼型センサー



IoTを最大限やるにはデバイスを作る側に回りたい。もともとあるデバイスに後付けするようなやり方もあるみたいだが、やはりUXを考えるとデバイスとソフトウェア両方やれるビジネスがいい。
