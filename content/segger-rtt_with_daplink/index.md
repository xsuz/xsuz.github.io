---
title: SEGGER RTTをDAPLinkで使う
description: JLink経由でしか使えなかったSEGGER RTTをDAPLinkからでも使えるようにするためのメモ
date: 2025-10-16
slug: segger-rtt_with_daplink
tags: [debug, c++, rust, development, raspberrypi-pico, stm32]
draft: true
category: embedded
updatedDate: 2025-10-19
---

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=true} -->
<!-- code_chunk_output -->

1. [目次](#目次)
2. [SEGGER RTTとは](#segger-rttとは)
3. [SEGGER RTTの使い方](#segger-rttの使い方)
4. [DAPLinkでSEGGER RTTを使う](#daplinkでsegger-rttを使う)
    1. [方法1:probe-rs](#方法1probe-rs)
    2. [方法2:pyocd](#方法2pyocd)
    3. [方法3:openocd](#方法3openocd)
5. [おわりに](#おわりに)
6. [追記(2025/10/19)](#追記20251019)

<!-- /code_chunk_output -->

---

## SEGGER RTTとは

開発をやっていると，何か処理した結果をその都度確認したいことがあるかと思います．

組み込みでない普通の開発であれば，そのようなときprintf()を使ってコンソールに出力することが多いと思います．

組み込み開発ではディスプレイなどないので，PCへデバッグ情報を送って確認することになります．

よく使われるのはUARTを使ったシリアル通信です．_write()関数を実装するとprintf()の出力をUARTに流すことができます．例えばSTM32であれば，HAL_UART_Transmit()を呼び出すような実装になります．

```cpp
int _write(int file, char *ptr, int len) {
    HAL_UART_Transmit(&huart2, (uint8_t *)ptr, len, HAL_MAX_DELAY);
    return len;
}
```

しかし，いつもUARTが余っているとは限りません．また，clockの設定が狂っていた場合など，UARTが正しく動作しない場合にデバッグできなくなってしまいます．

この解決策として[ITM](https://arm-software.github.io/CMSIS_6/v6.0.0/Core/group__ITM__Debug__gr.html)を使う方法があります．Cortex-M3以降のコアであれば，ITMを使えば，SWOピンを介してデバッグ情報を送ることができます．printf()の出力をITMに流すには，以下のように実装すればOKです．

```cpp
int _write(int file, char *ptr, int len) {
    for (int i = 0; i < len; i++) {
        ITM_SendChar((*ptr++));
    }
    return len;
}
```

ITMはUARTと違って，クロック設定が狂っていても動作します．また，SWOピン1本で済むので，ピン数の節約にもなります．

SEGGER RTTは，ITMのようにデバッグ情報を送るための仕組みですが，ITMよりも高速にデバッグ情報を送ることができるらしいです．さらにSWOピンも不要で，Cortex-M0コアでも使うことができます．

> ![](https://www.segger.com/fileadmin/_processed_/6/5/csm_RTT_SpeedComparison_8ee242b5ae.webp)
> 図1 SEGGER RTTの速度比較 (出典: [SEGGER](https://www.segger.com/products/debug-probes/j-link/technology/about-real-time-transfer/))

## SEGGER RTTの使い方

SEGGER RTTを使うには，SEGGERの提供する[RTTライブラリ](https://www.segger.com/products/debug-probes/j-link/technology/about-real-time-transfer/)をプロジェクトに組み込みます．

基本的には，`SEGGER_RTT.h`，`SEGGER_RTT_Conf.h`，`SEGGER_RTT.c`の3つのファイルをプロジェクトに追加すればOKです．

実際に使うときは，`SEGGER_RTT_Init()`でRTTを初期化し，`SEGGER_RTT_WriteString()`でデバッグ情報を送ります．

```cpp
#include "SEGGER_RTT.h"

int main(void) {
    // ... 省略 ...
    SEGGER_RTT_Init();
    // ... 省略 ...
    while (1) {
        SEGGER_RTT_WriteString(0, "Hello, RTT!\n");
        HAL_Delay(1000);
    }
}
```

さらに，`SEGGER_RTT_printf.c`をプロジェクトに追加すれば，`SEGGER_RTT_printf()`を使ってprintfライクにデバッグ情報を送ることもできます．

```cpp
#include "SEGGER_RTT.h"
#include "SEGGER_RTT_printf.h"

int main(void) {
    // ... 省略 ...
    SEGGER_RTT_Init();
    // ... 省略 ...
    while (1) {
        SEGGER_RTT_printf(0, "Counter: %d\n", counter++);
        HAL_Delay(1000);
    }
}
```

SEGGER RTTで送ったデバッグ情報を確認するには，SEGGERの提供する[JLink RTT Viewer](https://www.segger.com/products/debug-probes/j-link/tools/rtt-viewer/)を使います．JLink RTT Viewerを起動し，ターゲットに接続すると，RTTで送られたデバッグ情報が表示されます．

しかし，SEGGER RTTを使うには本来はJLinkデバッガが必要です．JLinkデバッガは高価ですが，Raspberry Pi PicoやSTM32などのマイコンボードに搭載されているDAPLinkでもSEGGER RTTを使うことができます．

## DAPLinkでSEGGER RTTを使う

ここからが本題です．本来はJLinkデバッガが必要なSEGGER RTTをDAPLinkで使う方法について説明します．

SEGGER RTTを使っている時，マイコンがやっていることは，メモリ上にリングバッファを作成し，そこにデータを書き込むだけです．一方，デバッガ側はターゲットのメモリを読み取ってリングバッファからデータを取得しPCに送ることをやっています．

つまり，デバッガを変えても，デバッガがマイコンのメモリを読み取ることができれば理論上はSEGGER RTTを使うことができます．

DAPLinkはCMSIS-DAPプロトコルを使ってマイコンのメモリを読み取ることができます．したがって，DAPLinkを使ってSEGGER RTTを使うことができるはずです．

ただ，JLink RTT ViewerはJLinkデバッガ専用のソフトウェアなので，DAPLinkでは使えません．そこで，DAPLinkでSEGGER RTTを使うためには，PC側を何とかする必要があります．

### 方法1:probe-rs

Rustで組み込み開発をすると，[probe-rs](https://probe.rs/)というライブラリを使ってデバッグやフラッシュ書き込みを行うことができます．さらに，defmtというライブラリを組み合わせるとRTTを使うことができます．
同様にSEGGER RTTもprobe-rsで読み取れるのではないかと思い，試してみたところ，問題なく読み取ることができました．

まず，probe-rsをインストールします．[ここ](https://probe.rs/docs/getting-started/installation/)を参考にしてください．cargoコマンドでインストールする場合は以下のコマンドを実行します．

```bash
cargo install probe-rs-tools
```

probe-rsには`attach`というコマンドがあり，これを使ってターゲットに接続します．例えば，Raspberry Pi Picoに接続する場合は以下のように実行します．

```bash
probe-rs attach --chip RP2040 ./firmware.elf
```

注意点として，書き込んだELFファイルを指定する必要があります．probe-rsがメモリ上のRTTバッファの位置を特定するために必要なのだろうと思います．

実行すると，RTTの内容が表示されます．コマンドを実行している間はRTTの内容がリアルタイムで表示され続けます．

### 方法2:pyocd

probe-rsの他に，[pyocd](https://github.com/pyocd/pyOCD)を使ってもSEGGER RTTのメッセージを読み取ることができました．pyocdはPythonで書かれたCMSIS-DAPデバッガで，pipでインストールすることができます．

```bash
pip install pyocd
```

pyocdには`rtt`というコマンドがあり，これを使ってターゲットのRTTメッセージを読み取ることができます．例えば，Raspberry Pi Picoに接続する場合は以下のように実行します．

```bash
pyocd rtt --chip RP2040 ./firmware.elf
```

こちらも，コマンドを実行している間はRTTの内容がリアルタイムで表示され続けます．

### 方法3:openocd

[この記事](https://qiita.com/yasuhiro-k/items/b8aa77d83b979c0edbb0)によると，OpenOCDでもSEGGER RTTのメッセージを読み取ることができるようです．OpenOCDを使う場合は，以下のように実行します．

```
openocd -f interface/cmsis-dap.cfg -f target/rp2040.cfg
```

その後，gdb上で以下のコマンドを実行します．

```
eval "monitor rp2040.core0 rtt setup %p 1024 SEGGER\\ RTT", &_SEGGER_RTT
monitor rp2040.core0 rtt start
monitor rtt server start 5555 0
```

すると，5555番ポートでRTTサーバが起動するので，telnetなどで接続してRTTの内容を確認することができます．

## おわりに

SEGGER RTTは本来JLinkデバッガ専用の仕組みですが，DAPLinkでも使うことができました．probe-rsやpyocdを使えば，DAPLink経由でSEGGER RTTのメッセージを読み取ることができます．
かなり便利なので，DAPLinkを使っている人はぜひ試してみてください．

## 追記(2025/10/19)

VSCode上だとopenocd使うのが一番よさそう[^1]

[^1]:[僕が考えた最強のSTM32開発環境構築 (Windows)](../stm32-development-environment/)