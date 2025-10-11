---
title: "ATmega4809の紹介"
date: 2022-12-11T14:59:20+09:00
archives:
    - 2022-12
    - 2022
draft: false
categories: [Electronics]
tags:
    - AVR
    - megaAVR
    - Arduino
---

こんにちは！xsuzです。

最近は鳥人間関係で忙しくてなかなか更新できませんでした。忙しいのはまだまだ続きそうですが、少しずつこのブログ更新していきたいと思います。

今回はマイコンATmega4809についての紹介記事です。

---

## ATmega4809とは

Atmega4809とは2018年に登場した比較的新しいAVRマイコンです。Arduino Nano EveryやArduino Uno WiFi Rev2にも搭載されていたりします。
Arduino Uno上に搭載されているATmega328pとの比較表は以下の通りです。

（QFP版ではピン数的にATmega328と置き換えることが可能であるATmega4808の情報も載せました。）

<div style="overflow-x: auto; white-space: nowrap">

|製品名|ATmega328p-PU|ATmega4809-PF|ATmega328p-AU|ATmega4808-AUR|
|:-:|:-:|:-:|:-:|:-:|
|コア|megaAVR|megaAVR|megaAVR|megaAVR|
|価格|340|300|370|-|
|コアサイズ|8bit|8bit|8bit|8bit|
|クロック|16MHz|20MHz|16MHz|20MHz|
|Flashメモリ|32kB|48kB|32kB|48kB|
|SRAM|2kB|6kB|2kB|6kB|
|EEPROM|1kB|256B|1kB|256B|
|ピン数|28|40|32|32|
|パッケージ|DIP28|DIP40|QFP32|QFP32|
|タイマ|3ch|5ch|3Ch|4ch|
|UART/USART|1Ch|4Ch|1ch|3Ch|
|ADC|6Ch|16Ch|8Ch|12Ch|
|GPIO|23|33|23|27|
|PWM|6|5|6|5|
|I2C|1|1|1|1|
|SPI|1|1|1|1|
|書き込み方法|ISP|UPDI|ISP|UPDI|

</div>

上の表のようにPWMのピン数が1本少なかったり、EEPROMの容量が少ないことを考えると使い分ける必要がありそうです。
でも、これだけ性能が高いのに値段が安いのがとてもいいですね！
また、上の表にはないですが、ATmega4809やATmega4808ではレジスタ周りも整理されていて使いやすく感じました。

## ATmega4809の使い方


### UPDI

ATmega4809を導入するとに一番の障壁となるのはUPDI関連だと思います。
まずはUPDIライタをArduinoで作りましょう。


1. [https://github.com/ElTangas/jtag2updi](https://github.com/ElTangas/jtag2updi)からソースコードをダウンロードしてください。
2. 展開したあと、`jtag2updi`の中にある`jtag2updi.ino`をArduino IDEで開いてください。
3. Arduinoを接続し、スケッチを書き込んでください。

これでUPDIライタができました。
次に、作ったUPDIライタを使ってプログラムを書き込みましょう。
以下は、COM6に接続されたUPDIライタを使い`main.cpp`を書き込む場合の手順です。

1. コードをコンパイルする。これはatmega328pと同様に以下を実行すればよいです。
```
avr-gcc main.cpp -mmcu=atmega4809 -o main.elf
```
2. ROMに書き込める形式に変換する。Intel形式に変換して、マイコンのROMに書き込めるようにします。
```
avr-objcopy -O ihex main.elf main.hex
```
3. マイコンに書き込むための回路を組む。jtag2updiのREADMEにもあるように、以下の回路を組みます。
<pre>
                                            V_prog                 V_target
                                              +-+                     +-+
                                               |                       |
 +----------+          +---------------------+ |                       | +--------------------+
 | PC       |          | Programmer          +-+                       +-+  Target            |
 | avrdude  |          |                     |      +----------+         |                    |
 |       TX +----------+ RX              PD6 +------+   4k7    +---------+ UPDI               |
 |          |          |                     |      +----------+         |                    |
 |       RX +----------+ TX                  |                           |                    |
 |          |          |                     |                           |                    |
 |          |          |                     |                           |                    |
 |          |          |                     +--+                     +--+                    |
 +----------+          +---------------------+  |                     |  +--------------------+
             JTAGICE MkII                      +-+     UPDI          +-+
             Protocol                          GND     Protocol      GND

</pre>
4. マイコンに書き込む
```
avrdude -c jtag2updi -p atmega4809 -P COM6 -U flash:w:main.hex
```


最後まで読んでいただきありがとうございます。
ATmega4809のデジタル入出力やPWM、I2Cなどの使い方などはそのうち書こうと思います。そちらもぜひ読んでみてください！