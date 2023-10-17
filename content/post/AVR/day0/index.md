---
title: "AVR入門その０"
date: 2023-03-07T12:50:15+09:00
archives:
    - 2023-03
draft: false
categories: [Electronics]
tags:
    - AVR
    - C++
---

お久しぶりです～。xsuzです。

4Qの期末試験も終わり、春休みに入り、成績まで公開されちゃいました。

系所属点は上位３分の１ぐらいでした。なんだか、ぱっとしない成績ですね。

来年こそは、機械系で一桁に入れるように頑張る！


話は変わって、新歓で作業体験をやることになりました。

そこで、AVRの入門記事を書いたのですが、折角なので個人のブログでも公開しようかなぁと考えてます。

何か間違いを見つけたら、twitterで教えてもらえると嬉しいです。

---

# 目次

* 第0回 環境構築　←ここ
* [第1回](../day1/) Lチカ
* [第2回](../day2/) 7セグメントLED
* [第3回](../day3/) ダイナミック点灯
* [第4回](../day4/) タイマ割り込み
* [第5回](../day5/) サーミスタとAD変換
* [第6回](../day6/) UART
* [第7回](../day7/) I2C

---

## 1. AVRとは

今回使うマイコンはAVRというものです。Arduino UNOに使われているマイコンもAVRです。

![](img/fig1.jpg)
（秋月電子の販売ページより）

写真を見ると分かるように、マイコンにはピンがたくさんあります。小さいですが、CPUやメモリなどが全部入ってます。それだけでなくAD変換器やUARTなども組み込まれてます。

## 2. AVRマイコンのメモリ

AVRのメモリはプログラム用とデータ用に分かれています。

プログラム用メモリはCPUに命令を送るためのメモリであり、ROMが使われています。ここにデータを書き込むためにはライターが必要です。

データ用のメモリはCPUが読み書きできるメモリです。SRAMなどがあります。
SRAMは8bitのデータを持つレジスタからなります。このレジスタにも２種類あります。
データを保存するレジスタとマイコンを操作するためのレジスタです。ここでは詳しくは書きませんが、「レジスタを読み書きすることでマイコンを操作できる」ということを覚えておいてください。

## 3. 開発環境の構築

### 3.1. Arduinoをインストール

https://www.arduino.cc/en/software からArduino IDEをダウンロード&インストールしてください。


### 3.2. Board Managerを管理する

Arduino IDEを開いてPreferencesを開いてください。以下のような画面になると思います。
![](img/fig2.png)

写真のように、`Additional board manager URLs:`の欄に```https://mcudude.github.io/MiniCore/package_MCUdude_MiniCore_index.json```を追加してください。
終わったら`OK`を押します。

![](img/fig3.png)

次に右のボードのアイコンをクリックしてみましょう。上のようなものが出るはずです。`BOARD MANAGER`の欄に`MiniCore`と入力すると画像のように表示されるでしょう。
終わったら`INSTALL`を押してください。

### 3.3. コンパイラ、ライターの設定


まず、Tools > Board > MiniCore > ATmega88 と選択していってください。

![](img/fig4.png)

次に、画像のように、Tools > Clock > Internal 1MHz　と選び、クロック周波数を設定します。

![](img/fig5.png)

最後に、 Tools > Programmer > Arduino as ISP と選択してください。

![](img/fig6.png)



以上で環境構築は終わりです。[次回](../day1/)はLチカします。

---

## 4. AVRライターを用意する (おまけ)

AVRマイコンに書き込むためには、AVRライターというものが必要です。ここでは、Arduinoを使ってAVRライターを作ってみます。

### 4.1. ファームウェアを書き込む

まず、Arduino IDEを起動してください。

起動出来たら、以下の画像のように File > Examples > 11 ArduinoISP > ArduinoISP と選んでください。

![](img/fig7.png)

そうすると、ArduinoISPのスケッチが開かれると思います。今度はArduinoを接続し、このスケッチをArduinoに書き込みましょう。Ctrl+Uと押せば書き込まれます。

### 4.2. 配線する

ファームウェアを書き込んだArduinoとターゲット側のICが簡単に接続できるように、配線します。

|ピンの名前|Arduino側|ICSP端子側|
|-|-|-|
|GND|GND|4|
|VCC|5V|6|
|RST|D10|3|
|MISO|D11|1|
|MOSI|D12|5|
|SCK|D13|2|
---

## （参考）使うマイコンICについて

2023年のMeisterの作業体験ではATmega88というマイコンICを使います。Arduino UNOに使われているATmega328pの弟分みたいなやつですね。

データシート：[https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48_88_168_megaAVR-Data-Sheet-40002074.pdf](https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48_88_168_megaAVR-Data-Sheet-40002074.pdf)

半導体不足の今でも250円程度ととても安いです。

## [追記]

3/8 目次を書き換えました。