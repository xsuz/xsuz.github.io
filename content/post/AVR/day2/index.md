---
title: AVR入門その２
date: 2023-03-11T22:35:28+09:00
archives:
    - 2023-03
draft: false
categories: [Electronics]
tags:
    - AVR
---


[前回](../day1/)の続きです。今回は７セグで数字を表示します。

---

# 目次

* [第0回](../day0/) 環境構築
* [第1回](../day1/) Lチカ
* 第2回 7セグメントLED　←ここ
* [第3回](../day3/) ダイナミック点灯
* [第4回](../day4/) タイマ割り込み
* [第5回](../day5/) サーミスタとAD変換
* [第6回](../day6/) UART
* [第7回](../day7/) I2C

---

## 10. 7セグメントLEDとは

まず、今回扱う７セグメントLEDについて説明します。

![](img/fig1.jpg)

７セグメントLEDとは上の画像のようなLEDを使った表示器のことをいいます。７個のLEDを使い一桁の数字を表すことから、その名前がつきました。

下の図のように、それぞれの辺ごとにLEDが配置されています。例えば、「7」と表示したければ、AとBとCのLEDを点灯すれば良いわけです。

<img src="img/fig2.png" width="200px"></img>

７セグでは、それぞれの桁で、LEDのカソード側（-側）もしくはアノード(+側)がくっついています。カソード側がくっついたものを**カソードコモン**、アノード側がくっついたものを**アノードコモン**といいます。今回はカソードコモンを使います。

![](img/fig3.png)

7セグの回路図です。今回は、DIG1とGNDの接続をPC0の出力で決めます。PC0をHIGHにすると繋がるような回路にします。以下が７セグを制御するための回路図です。

## 11. プログラム

前回と10.の内容を参考にして、0~9までを1秒ごとにカウントアップするプログラムを書いてみましょう。

↓ プログラム例

<details>

```cpp
#include<avr/io.h>
#include <stdint.h>
#include<util/delay.h>


void display(int);

int main(void){
	DDRD=0xFF;
	PORTD=0b00000000;
	DDRC=0x01;
	PORTC=0x01;
	int d=0;
	while(1){
		display(d);
		_delay_ms(1000);
		d=(d+1)%10;
	}
	return 0;
}

void display(int d){
	/*ピンの接続:
	 * PORTD:
	 * 	0 -> A		
	 * 	1 -> B		    A
	 * 	2 -> C		  +---+
	 * 	3 -> D		F | G |B
	 * 	4 -> E		  +---|
	 * 	5 -> F		E |   |C
	 * 	6 -> G		  +---+ .
	 * 	7 -> DP		    D   DP
	 * */
	const unsigned char digit[]={0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F};
	if(0<=d && d<=9){
		PORTD=digit[d];
	}
}
```

</details>

今回はこれで終了です。[次回](../day3)は4桁全てを点灯させてみます。