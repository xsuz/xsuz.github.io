---
title: "解析力学 1"
date: 2023-10-10T05:33:19+09:00
archives:
    - 2023-10
categories: [Aerodynamics]
tags:
    - Physics
    - Numerical Calculation
    - Computer Science
draft: false
---

お久しぶりです。xsuzです。

今年の夏は壮絶でした。

本番二週間前に、尾翼が大破し主翼桁が折れて、一時は出場が絶望的になりました。
しかし、奇跡の復活を遂げ、第45回鳥人間コンテストではMeisterは約3.8km飛び続けました。

プラットフォーム上から見たあの光景は一生忘れないと思います。

夏休みに入ると、来年飛ぶ24代の機体の製作が始まりました。
今年こそは、電操班主任として信頼性の高い操舵を絶対に作ってみせます。

そして、免許合宿では修了検定に落ちて4日延泊しました。終わりです。

今回は、解析力学を思い出すために自分なりにまとめてみました。

---

## 変分原理

ある問題を**変分問題**として置き換えることを考える。すなわち$f$の変分$\delta f$が0になる$x$を求める問題に言い換えることを考える。
$$
\delta f(x)=0
$$

物理の基本原理が停留値問題として定式化されている場合、その原理を**変分原理**という。

### 静力学の変分原理

**静力学の変分原理**
> 系が安定状態にあるときに限り、幾何学的に可能な任意の仮想変位について、その仮想仕事の総和が0になる
$$
\delta W = \sum_i \mathbf{F}_i\cdot\delta \mathbf{r}_i = 0
$$

この原理は**仮想仕事の原理**とも呼ばれる。

### 動力学の変分原理

仮想仕事の原理と同様に、以下のダランベールの原理(d'Alembert's-principle)を導くことができる。[^proof-d'Alembert's-principle]

**ダランベールの原理 ( d'Alembert's principle )**

> 質点系の運動の軌道$\mathbf r_i(t)$は、すべての時刻$t$で各質点の任意の仮想変位$\delta \mathbf r_i(t)$に対して、
$$
\sum_i\left(\mathbf F_i(\mathbf r_i(t),t)-m_i\frac {d^2 \mathbf r_i(t)}{dt^2}\right)\cdot\delta \mathbf r_i(i)=0
$$を満たす。

$\mathbf F_i$が保存力であるとき、ダランベールの原理から次のハミルトンの原理が導かれる。[^proof-Hamilton's-principle]

**ハミルトンの原理 (Hamilton's principle)**
> 時刻$t\in [t_1,t_2]$で始点と終点が決められた失点系の軌道$\{\mathbf r_i(t)\}$の中で、端点で０となる任意の仮想変分$\{\delta \mathbf r_i(t)\}$に対して、作用積分が
$$
\delta I[\mathbf r]=\delta\left(\int_{t_1}^{t_2}{(T-U)dt}\right)=0
$$となる軌道が実際に起こる。

そこで、
$$
\mathcal L=T-U
$$

と定め、これを**ラグランジアン**と呼ぶことにする。ラグランジアン$\mathcal L$を用いれば、ハミルトンの原理は
$$
\delta \int_{t_1}^{t_2}\mathcal L(\mathbf r_1,\mathbf r_2,\cdots, \mathbf {\dot r}_1,\mathbf {\dot r}_2,\cdots,t)dt=0
$$と表現できる。

## ラグランジュの運動方程式

ハミルトンの原理は汎関数の停留値問題として記述された。そこで、汎関数の停留値問題の解法について考えよう。

> $\mathcal L=\mathcal L(x(t),\dot x(t),t)$

とおいて、$x(t)$の満たす条件を考える。

ハミルトンの原理より、
$$
\delta \int_{t_1}^{t_2}\mathcal L(x(t),\dot x(t),t)dt=0
$$
$$
\therefore \int_{t_1}^{t_2}\left(\mathcal L(x(t)+\delta x(t),\dot x(t) + \delta \dot x(t),t)-\mathcal L(x(t),\dot x(t),t)\right)dt=0
$$そこで、$\mathcal L$を一次近似すると
$$
\int_{t_1}^{t_2}\left(\frac{\partial \mathcal L}{\partial x}(x(t),\dot x(t),t)\delta x+\frac{\partial \mathcal L}{\partial \dot x}(x(t),\dot x(t),t)\delta \dot x\right)dt=0
$$ここで、第二項を部分積分すると
$$
\begin{aligned}
\int_{t_1}^{t_2}\left(\frac{\partial \mathcal L}{\partial \dot x}(x(t),\dot x(t),t)\delta \dot x\right)dt&=\left[\frac{\partial \mathcal L}{\partial \dot x}(x(t),\dot x(t),t)\ \delta x(t)\right]-\int_{t_1}^{t_2}\frac {d}{dt}\left(\frac{\partial \mathcal {L}}{\partial \dot x}\right)\delta xdt
\\\ &= -\int_{t_1}^{t_2}\frac {d}{dt}\left(\frac{\partial \mathcal {L}}{\partial \dot x}\right)\delta x\ dt
\end{aligned}
$$ただし、一行目から二行目の過程で境界条件　$\delta x(t_1)=\delta x(t_2)=0$　を用いた。以上から
$$
\int_{t_1}^{t_2}\left(\frac {\partial \mathcal L}{\partial x}-\frac {d}{dt}\left(\frac{\partial \mathcal {L}}{\partial \dot x}\right)\right)\delta x\ dt=0
$$任意の仮想変分について、これを満たすので

> $$\frac {\partial \mathcal L}{\partial x}-\frac {d}{dt}\left(\frac{\partial \mathcal {L}}{\partial \dot x}\right)$$

これを**オイラー・ラグランジュ方程式**という。
特に、$\mathcal L$がラグランジアンであるとき**ラグランジュ方程式**という。

## ラグランジュ方程式と一般化座標

オイラー・ラグランジュ方程式の利点の一つに、変数の取り方に依存しないことが挙げられる。
即ち、直交座標の適当な関数
$$
q_1=q_1(x,y,z,t)\ ,\ q_2=q_2(x,y,z,t)\ ,\ \cdots
$$を用いてラグランジアンを
$$
\mathcal L(\mathbf q,\mathbf {\dot q},t)=T(\mathbf q,\mathbf {\dot q},t)-U(\mathbf q,t)
$$と表せれば、ハミルトンの原理を以下のように表現できる。

**ハミルトンの原理 (Hamilton's principle)**
> 時刻$t\in [t_1,t_2]$で始点と終点が決められた失点系の軌道$\{\mathbf q_i(t)\}$の中で、端点で０となる任意の仮想変分$\{\delta \mathbf q_i(t)\}$に対して、作用積分が
$$
\delta I[\mathbf q]=\delta\left(\int_{t_1}^{t_2}{L(\mathbf q,\mathbf {\dot q},t)dt}\right)=0
$$となる軌道が実際に起こる。

さらに、停留条件から得られるラグランジュ方程式は、デカルト座標と同じく以下の形で表される。
$$\frac {\partial \mathcal L}{\partial q_i}-\frac {d}{dt}\left(\frac{\partial \mathcal {L}}{\partial \dot q_i}\right)$$

$q_i$を**一般化座標**といい、上のような座標間の変換を点変換という。
ここまでの議論では点変換が時間に依存してもよいことに注意。

## ラグランジュ方程式を用いた数値計算

例として、単振り子の運動について考察する。

問題設定は以下の通りである。

> 時刻$t$において支点まわりにトルク$\tau$が作用しているとする。また、振り子の角度を$\theta(t)$と表し、おもりの支点まわりの慣性モーメントを$I$とおく。さらに、トルクがなす仕事を$W$、おもりの位置エネルギーを$U$、運動エネルギーを$T$とおく。
このときの$\theta$の変化を数値計算により求める。


このとき、ラグランジアン$\mathcal{L}$は
$$
\begin{aligned}
\mathcal{L}(\theta,\dot{\theta},t) &= T-U+W\\\
&=\frac 1 2(ml^2){\dot\theta}^2+mgl(1-\cos\theta)+\tau\theta
\end{aligned}
$$
と書ける。これを用いると、ラグランジュの運動方程式は
$$
\frac{\partial\mathcal{L}}{\partial \theta}-\frac{d}{dt}\frac{\partial \mathcal{L}}{\partial \dot\theta}=0
$$
$$
\therefore mgl\sin\theta+\tau-(ml^2)\ddot\theta=0
$$
となる。
ここから、
$$
\frac {d}{dt}\begin{bmatrix}
\theta\\\ \dot\theta
\end{bmatrix}=
\begin{bmatrix}
\dot\theta\\\
\frac 1 {ml^2}(mgl\sin\theta+\tau)
\end{bmatrix}
$$
を導くことができる。
オイラー法により、逐一$\theta$、$\dot\theta$を数値計算することができる。

[^proof-d'Alembert's-principle]: **ダランベールの原理と運動量保存則の等価性** \
番号$i$の質点の運動方程式
$$
\mathbf F_i(t)-m_i\frac{d^2}{dt}\mathbf r_i(t)=\mathbf 0
$$が成立するとき、任意の仮想変分$\{\delta \mathbf r_i\}$に対し、
$$
(\mathbf F_i(t)-m_i\frac{d^2}{dt}\mathbf r_i(t))\cdot \delta \mathbf r_i(t)=0
$$が成立。逆にこの式が任意の仮想変分$\{\delta \mathbf r_i\}$に対し成立すれば、番号$i$の運動方程式が成り立つ。以上より、ニュートンの第二法則とダランベールの原理が等価であることが示された。

[^proof-Hamilton's-principle]: **ハミルトンの原理とダランベールの原理の等価性**\
I) ダランベールの原理 $\Rightarrow$ ハミルトンの原理\
ダランベールの原理の式の両辺を$t_1$から$t_2$で積分すると
$$
\int_{t_1}^{t_2}\sum_i\{(\mathbf F_i(t)-m_i\frac{d^2}{dt}\mathbf r_i(t))\cdot \delta \mathbf r_i(t)\}dt=0
$$ 
$$
\therefore \int_{t_1}^{t_2}\{\sum_i\mathbf F_i(t)\cdot \delta \mathbf r_i(t)\}dt -\int_{t_1}^{t_2}\sum_i\{m_i\frac{d^2}{dt^2}\mathbf r_i(t)\cdot \delta \mathbf r_i(t)\}dt=0
$$ここで、$\mathbf F_i$のポテンシャル$U_i$が存在すると仮定すれば、
$$
\begin{aligned}
\int_{t_1}^{t_2}\{\sum_i\mathbf F_i(t)\cdot \delta \mathbf r_i(t)\}dt&=-\int_{t_1}^{t_2}\{\sum_i\delta \mathbf r_i(t)\cdot \nabla_iU_i\}dt
\\\ &=-\int_{t_1}^{t_2}\{\sum_i\delta U_i(\mathbf r_i,t)\}dt
\\\ &=-\delta\int_{t_1}^{t_2}U(\mathbf r_1,\mathbf r_2,\cdots,t)dt
\end{aligned}
$$また、第2項に部分積分を適用すると、
$$
\begin{aligned}
\int_{t_1}^{t_2}\sum_i m_i\frac{d^2}{dt^2}\mathbf r_i(t)\cdot \delta \mathbf r_i(t)dt&=\left[\sum_i \frac{1}{2}m_i\mathbf v_i(t)\cdot\delta\mathbf r_i(t)\right]_{t_1}^{t_2}-\int _{t_1}^{t_2} \sum_i m_i \mathbf v_i \delta \mathbf v_i  dt
\\\ &= -\int _{t_1}^{t_2} \sum_i \delta \left(\frac 1 2 m_i \mathbf v_i \cdot \mathbf v_i \right) dt
\\\ &= -\delta \int _{t_1}^{t_2} T(\mathbf v_1,\mathbf v_2 \cdots , t)dt
\end{aligned}
$$以上よりハミルトンの原理が導かれる。\
II) ダランベールの原理 $\Leftarrow$ ハミルトンの原理\
I)の過程を逆に辿ることにより示すことができる。