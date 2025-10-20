---
title: "Xfoilをpythonで利用する"
date: 2022-09-19T09:06:27+09:00
description: "2次元翼型解析ソフトであるxfoilをpythonから使えるようにする方法"
tags:
    - aerodynamics
    - python
    - xfoil
    - c++
    - 鳥人間
heroImage: img/xfoil_logo.gif
category: analysis
---

こんにちは、xsuzです！

初めての投稿ですが、ちょっとマニアックなテーマだったかもしれないです。

今回は、2次元翼型解析ソフトであるxfoilをpythonから使えるようにする方法について書きます。

---

## xfoilとは？？

![xfoil](img/xfoil_logo.gif)

鳥人間界隈でよく使われるXFLR5に搭載されている2次元翼型の解析プログラムです。

MITのMark Drela教授がFortranで開発しました。

xfoilの使い方を簡単に説明すると、

トップレベルから「OPER」、「GDES」、「MDES」、「QDES」の各々のサブルーチンに移ってコマンドを実行します。

* OPER : 翼型を解析します
* GDES : 翼型の外形を直接編集します。
* MDES : 速度分布から逆問題を解き、翼を設計します。
* QDES :大体MDESと同じです。（多分）

使い方が分からなくなったら、`?<CR>`でヘルプを見れます。（英語で辛いけど…）

詳しくはここに書いてあります。

[https://web.mit.edu/drela/Public/web/xfoil/xfoil_doc.txt](https://web.mit.edu/drela/Public/web/xfoil/xfoil_doc.txt)


ただ、翼型解析ソフトとして最強のこのXFOILですが、CUIでとっつきにくいです。

そこで、C++で再実装して３次元翼の解析などの機能を加えたものがXFLR5です。

FortranはPythonで扱いにくいので、今回はXFLR5のソースコードを使うことにします。

## 今回作ったもの

僕が書いたコードはGitHubにあげておきました。（**これ重要**）

以下の手順が面倒なら、これをダウンロードして使うのが楽です。

コードは **[ここ](https://github.com/xsuz/xfoil-py)** です！

というか、**何も問題がなかったらこれ使いましょう！！**

## xfoilをpythonで利用するための流れ

以下の手順で、xfoilをpythonで使えるようにしました。

1. pybind11のリポジトリをダウンロードする
1. xflr5のソースコードをダウンロード
1. xflr5のコードを一部書き換える
1. xfoilのwrapper(c++)を書く
1. xfoilのwrapper(python)を書く
1. pipでインストール

では、それぞれ説明していきます。

### １．pybind11のリポジトリをダウンロードする

　[pybind11](https://github.com/pybind/pybind11) はC++で書かれたコードをPythonから簡単に使えるようにしたものです。

今回は[ここ](https://github.com/pybind/python_example)を参考にしたいと思います。
これはpython標準のビルドツールでC++のコードを使えるようにした例です。

はじめに、[https://github.com/pybind/python_example](https://github.com/pybind/python_example)をダウンロードしてください。

次にこれを展開します。こんな構成になってると思います。

```
├─.github
│  └─workflows
├─conda.recipe
├─docs
├─src
└─tests
```

.githubとtestsというディレクトリは消して問題ないです。
（これはCIのためのものです。）

### ２．xflr5のソースコードをダウンロード

xflr5のソースコードは[ここ](https://sourceforge.net/p/xflr5/code/HEAD/tree/trunk/xflr5/)からダウンロードできます。

`Download snapshot`をクリックすることで、表示されているファイル群をダウンロードできます。

今回使うのは`XFoil-lib`と`xflr5v6/xdirect/analysis`だけで十分です。

まあ、僕は全部ダウンロードしましたが。

### ３．xflr5のコードを一部書き換える

xfoilの核の部分は`XFoil-lib/xfoil.cpp`、`XFoil-lib/xfoil.h`、`XFoil-lib/xfoil_params.cpp`に書かれています。

これらをうまく編集して、標準ライブラリだけでxfoilが動作するようにします。

あ、、今まで嘘ついてました。

今回の内容でできるのは、xfoilのOPERをPythonで使えるようにすることです。

GDESとかは、まだやってないです。

話を元に戻すと、これらのコードで標準ライブラリでないもの（GUI系）を排除するのがここでやることです。

これは、僕の書いたものと本家のコードを見比べてもらえれば、何となく分かるかと思います。

書き換えたコードは２．の`src/`下に配置してください。

### ４．xfoilのwrapper(c++)を書く

３．で書き換えたコードだけではどうすれば翼型を解析できるかが分かりにくいと思います。

ここの処理を解析に使えるようにするためのコードが本家では`xflr5v6/xdirect/analysis/xfoiltask.cpp`に書いてあります。

特に、

```cpp
bool XFoilTask::initializeXFoilTask(Foil const*pFoil, Polar *pPolar, bool bViscous, bool bInitBL, bool bFromZero)

bool XFoilTask::alphaSequence()

bool XFoilTask::iterate()
```

あたりを見るとどうすればいいのかが分かりやすいと思います。

これらの関数と参考にしつつ、pythonのコード中で使いやすいようにC++でwrapperを書くことがここでやることです。

ちなみに、C++の

```cpp
std::vector<T>
std::tuple<T,U>
```

は、Pythonではそれぞれリストとタプルとして扱われます。

書き換えたコードは３．と同様に２．の`src/`下に配置してください。

### ５．xfoilのwrapper(python)を書く

ここまでくればほぼ完成です。あとは`pyproject.toml`と`setup.py`で

* モジュール名をdefaultから変える
* コンパイルするc++のファイル名を書き換える
* モジュールの説明を書く

をすれば、終了です。

### ６．pipでインストール

２．のフォルダに移動して

```shell
pip install .
```

とすれば、xfoilをPythonで使えるようになります！

お疲れさまでした！！

## 最後に

これ調べながらやってるときはPythonもC++もどっちも自信なくしましたが、なんだかんだで力がついた気がします。

ただ、まだ一部の機能しか実装できていないので機能追加が今後の課題になりそうです、、

後輩やってくれないかな、、

では、良い Python & XFoil ライフを！！

[xfoil]:https://web.mit.edu/drela/Public/web/xfoil/