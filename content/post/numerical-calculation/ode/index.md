---
title: "常微分方程式の数値的解法"
date: 2023-01-07T23:33:39+09:00
archives:
    - 2023-01
draft: false
categories: [Computer Science]
tags:
    - Numerical Calculation
    - Mathmatics
    - Computer Science
    - python
toc: true
---

明けましておめでとうございます。今年もよろしくお願いいたします。
では早速、数値計算法の最も基本的で重要な常微分方程式についての記事です。

---

## 1. 常微分方程式の標準型

機械システムや電子回路などは微分方程式によってどんな風に動くかを表現できます。例えば、ロボットの機構なら運動方程式、電子回路なら回路方程式によって挙動を記述できます。ここでは、それらを数値計算しやすい形に変形すること（**モデル化**）について考えます。

ここでは、単振り子の運動をモデル化します。

おもりの質量を $ m $、糸の長さを $l$、振れ角を $\theta$ とすると 、運動方程式は、以下の微分方程式で表されます。
$$
 m l\ddot{\theta} = - mg\sin\theta
$$
　

これは二階微分方程式ですが、解きやすくするために一階連立微分方程式に変換します。角振動数 $\omega=\dot{\theta}$を導入することにより、次の一階微分方程式に変換できます。
$$
\begin{cases}
　\dot{\theta}=\omega \\\
　\dot{\omega}=-\frac{g\sin\theta}{l}
\end{cases}
$$

この形の微分方程式を**標準形**といいます。また、$\theta$、$\omega$を**状態変数**といいます。

標準形の微分方程式は、あとで説明するEuler法、Heun法、Runge-Kutta法などで数値的に解くことができます。

## 2. ホロノミック制約と非ホロノミック制約

数値計算で扱う問題は何らかの制約条件のもとでの微分方程式を解くことが多いです。ここでは、制約について説明します。

### 2.1. 単振り子の運動とホロノミック制約

単振り子の運動をデカルト座標で考えます。まず、支点Cの座標が$(0,l)$、最下点の座標を$(0,0)$とします。このとき、糸の長さが$l$で一定であるという条件から
$$
R(x,y):=(x^2+(y-l)^2)^\frac1 2-l=0
$$
という制約条件を導くことができます。

このとき、$\nabla{R}=(R_x,R_y)$は円$\text{R(x,y)}=0$の法線であり、大きさが1です。さらに、向きは張力と一致しているため、運動方程式は
$$
\begin{cases}
m\ddot{x}=\lambda R_x\\\
m\ddot{y}=\lambda R_y-mg
\end{cases}
$$
と表すことができます。ただし、$\lambda$は張力の大きさです。
以上のように、制約条件がx,yの等式により表されるものを**ホロノミック制約**といいます。ホロノミック制約下での微分方程式は比較的簡単に解くことができます。

### 2.2. 自動車の運動とパフィアン制約

自動車の運動をデカルト座標で考えます。自動車が剛体であると仮定すれば、その運動は平面上の位置$(x,y)$と向き$\theta$で表現できます。

まず、自動車の質量を$m$、慣性モーメントを$I$とします。ハンドル操作により、自動車には駆動力$\mathbf f=(f_x,f_y)$と駆動トルク$\tau$が働くとします。また、速度に比例する粘性力$b\mathbf{v}$、角速度$\omega$に比例する粘性トルク$B\omega$が働くとします。

このとき、自動車の運動方程式は以下のように表されます。
$$
\begin{cases}
m\ddot{x}&=f_x-b\dot{x}\\\
m\ddot{y}&=f_y-b\dot{y}\\\
I\dot{\omega}&=\tau-B\omega
\end{cases}
$$

自動車の運動には速度に関して制約条件があります。自動車の横の向きには移動できないことによる条件です。すなわち
$$
\text{Q}:= v_x\sin\theta-v_y\cos\theta=0
$$
を満たしながら運動します。この制約条件は、x,yの式では表すことができません。このような制約を**非ホロノミック制約**といいます。さらに、この制約は微分した値$\dot{x}$、$\dot{y}$によって表すことができます。このような制約を**パフィアン制約**といいます。

## 3. 常微分方程式の数値的解法

時刻tに依存する変数$x$に関する微分方程式
$$
\dot{x}=f(x,t)
$$
を数値的に解くことを考えます。

この形の常微分方程式の代表的な解法にEuler法、Heun法、Runge-Kutta法などがあります。

これらの解法は、ステップ幅dtで区切ることにより時間を離散化し$\{t_n\}$で表します。次に、時刻$t_n$と$t_n$におけるxの値$x_n$から$x_{n+1}$を計算する更新式を与えます。最後に、初期値$x_0$から$x_n$を$n=1,2,\cdots$と逐次求めます。

### 3.1. Euler法

**Euler法**は次の更新式で$x_{n+1}$を求めます。
$$
x_{n+1}=x_n+f(x,t)dt
$$
これは、xのtによる一次近似を行っています。Pythonで書くと以下のようになります。

```python
def euler(x_0,t,f):
    N=int(t/dt)
    x_n=x_0
    for n in range(N):
        x_n=x_n+dt*f(x_n,n*dt)
    return x_n
```

非常にシンプルですね。しかし、あとで述べるように精度はあまりよくありません。

### 3.2. Heun法

**Heun法**は次の更新式を用います。
$$
\begin{cases}
x_{n+1}=x_n+\frac{dt}2(k_1+k_2)\\\
k_1=f(x_n,t_n)\\\
k_2=f(x_n+k_1dt,t_n+dt)
\end{cases}
$$
Euler法が増分を矩形近似していたのに対し、Heun法では増分を台形近似しています。これにより、精度が向上されます。Pythonで書くと以下のようになります。
```python
def heun(x_0,t,f):
    N=int(t/dt)
    x_n=x_0
    for n in range(N):
        k1=f(x_n,dt*n)
        k2=f(x_n+k1*dt,dt*n+dt)
        x_n=x_n+dt*(k1+k2)/2
    return x_n
```

### 3.3. Runge-Kutta法

**Runge-Kutta法**は以下の更新式を用います。
$$
\begin{cases}
x_{n+1}=x_n+\frac {dt} 6 (k_1+2k_2+2k_3+k_4)\\\
k_1=f(x_n,t_n)\\\
k_2=f(x_n+\frac 1 2k_1dt,t_n+\frac 1 2 dt)\\\
k_3=f(x_n+\frac 1 2k_2dt,t_n+\frac 1 2 dt)\\\
k_4=f(x_n+k_3dt,t_n+dt)
\end{cases}
$$
この更新式では、tについて四次近似を行っています。Pythonで書くと以下のようになります。
```python
def runge_kutta(x_0,t,f):
    N=int(t/dt)
    x_n=x_0
    for n in range(N):
        k1=f(x_n,n*dt)
        k2=f(x_n+dt*k1/2,dt*n+dt/2)
        k3=f(x_n+dt*k2/2,dt*n+dt/2)
        k4=f(x_n+dt*k3,dt*n+dt)
        x_n=x_n+dt*(k1+2*k2+2*k3+k4)/6
    return x_n
```
常微分方程式の数値計算で実際によく使われるのは、このRunge-Kutta法です。他の二つよりも格段に性能が良いためです。

### 3.4. 連立常微分方程式の数値計算

Euler法、Heun法、Runge-Kutta法は$x$がベクトルの場合でも適用できます。（ここまで書いたPythonのコードもxがNumpyの行列であっても実行できるようになっています。）

ここでは、単振り子を運動を数値計算により求めたいと思います。

まず、$x$を状態変数を成分に持つベクトル
$$
\mathbf x=(\theta,\omega)
$$
とします。このとき、運動方程式の標準形から
$$
\dot{\mathbf x} = (\dot{\theta},\dot{\omega})=(\omega,-\frac g l\sin\theta)
$$
を得ます。したがって、
$$
\mathbf{ f }(\mathbf x,t)=(\omega,-\frac g l \sin\theta)
$$
としてEuler法や、Heun法、Runge-Kutta法を適用すればよいと分かります。

では、実際に数値計算をさせてみましょう。私は以下を実行させてみました。

```python
import numpy as np
from matplotlib import pyplot as plt

dt=0.01 # ステップ幅(s)
l=0.25 # 振り子の糸の長さ(m)
g=9.8 # 重力加速度(m/s^2)

# Euler法
def euler(x_0,t,f=lambda x,t:x/t):
    N=int(t//dt)
    x_n=x_0
    for n in range(N):
        x_n=x_n+dt*f(x_n,n*dt)
    return x_n

# Heun法
def heun(x_0,t,f):
    N=int(t/dt)
    x_n=x_0
    for n in range(N):
        k1=f(x_n,dt*n)
        k2=f(x_n+k1*dt,dt*n+dt)
        x_n=x_n+dt*(k1+k2)/2
    return x_n

# Runge-Kutta法
def runge_kutta(x_0,t,f=lambda x,t:x/t):
    N=int(t//dt)
    x_n=x_0
    for n in range(N):
        k1=f(x_n,n*dt)
        k2=f(x_n+dt*k1/2,n*dt+dt/2)
        k3=f(x_n+dt*k2/2,dt*n+dt/2)
        k4=f(x_n+dt*k3,dt*n+dt)
        x_n=x_n+dt*(k1+2*k2+2*k3+k4)/6
    return x_n

# 運動方程式の標準型
def pendum(x,t):
    theta,omega=x
    return np.array([omega,-g/l*np.sin(theta)])

T=10 # おもりの運動を解析する時間(s)
th1=np.zeros((int(T//dt)))
th2=np.zeros((int(T//dt)))
th3=np.zeros((int(T//dt)))
t=np.zeros((int(T//dt)))
for i in range(int(T//dt)):
    th1[i],_=euler(np.array([0.01,0]),dt*i,pendum)
    th2[i],_=heun(np.array([0.01,0]),dt*i,pendum)
    th3[i],_=runge_kutta(np.array([0.01,0]),dt*i,pendum)
    t[i]=dt*i

plt.plot(t,th1,label="euler")
plt.plot(t,th2,label="heun")
plt.plot(t,th3,label="runge_kutta")
plt.legend()
plt.show()

```

上のコードでは、長さ25cmの振り子の運動を解析しているため、周期が1sの単振動をするはずです。そのことを踏まえて実行した結果をみてみると、Euler法に比べて、Heun法やRunge-Kutta法がいかに優れているのかが分かります。

## 4. 制約条件下での数値的解法

3.では何も制約がない状態での数値計算を扱いました。4.では制約下での常微分方程式の数値的解法について考えたいと思います。

今までの、目標とする微分方程式を解くだけの方法では、制約条件を考慮することができません。そこで、制約条件を微分方程式に組み込むことを考えます。

### 4.1.制約安定化法

まずは、ホロノミック制約を微分方程式に組み込むことを考えます。この方法を**制約安定化法**といいます。

では、単振り子の運動をデカルト座標で解析してみましょう。まず、単振り子の運動方程式は
$$
\begin{cases}
m\ddot{x}=\lambda R_x\\\
m\ddot{y}=\lambda R_y-mg
\end{cases}
$$
とかけました。ただし、ホロノミック制約より
$$R(x,y)=(x^2+(y-l)^2)^\frac 1 2-l=0
$$
となるのでした。

この条件を微分方程式であらわすために、制約条件の臨界減衰を表す微分方程式
$$
\ddot{R}+\nu \dot{R}+\nu^2R=0
$$
を考えます。ただし、$\nu$は正の定数です。これを導入することにより、たとえ計算途中で制約条件を満たさない解が出たとしても、最終的には$R(x,y)$は0に収束します。

次に、この微分方程式を標準型に変換します。$\dot{R}$と$\ddot{R}$はそれぞれ、
$$
\begin{aligned}
\dot{R}&=\begin{bmatrix}R_x \\\ R_y \end{bmatrix}\begin{bmatrix}\dot x&\dot y \end{bmatrix}\\\
\ddot{R}&=\begin{bmatrix}R_x \\\ R_y \end{bmatrix}\begin{bmatrix}\ddot x&\ddot y \end{bmatrix}+\begin{bmatrix}\dot x&\dot y \end{bmatrix}\begin{bmatrix}R_{x x} & R_{xy} \\\ R_{yx}& R_{yy} \end{bmatrix}\begin{bmatrix}\dot x&\dot y \end{bmatrix}\\\
\end{aligned}
$$
と表されます。これらを臨界減衰を表す微分方程式に代入します。すると、
$$
-R_x\dot{v}_x-R_y\dot{v}_y=C(x,y,v_x,v_y)
$$
とかけます。ただし、$C(x,y,v_x,v_y)$は

$$
C(x,y,v_x,v_y)=R_{x x}(x,y) (v_x)^2+R_{y y}(x,y)(v_y)^2+2R_{xy}(x,y)v_xv_y+\nu(R_x(x,y)v_x+R_y(x,y)v_y)+\nu^2R(x,y)
$$
で定められます。これを方程式に組み込めば、微分方程式の解は制約条件を満たします。

ここで、$\dot x,\dot y,\dot v_x,\dot v_y,\lambda$に関する連立方程式

$$
\begin{cases}
\dot x =v_x \\\
\dot y = v_y \\\
m\dot{v_x}-\lambda R_x=0\\\
m\dot{v_y}-\lambda R_y=mg\\\
-R_x\dot{v}_x-R_y\dot{v}_y=C(x,y,v_x,v_y)
\end{cases}
$$
を考えます。これを解くと、

$$
\begin{array}{l}
\dot x=v_x\\\
\dot y=v_y\\\
\lambda=m{gR_y(x,y)-C(x,y,v_x,v_y)}\\\
\dot v_x=R_x{gR_y(x,y)-C(x,y,v_x,v_y)}\\\
\dot v_y=R_y{gR_y(x,y)-C(x,y,v_x,v_y)}-g\\\
\end{array}
$$
と標準型を得ることができます。この標準型の微分方程式をEuler法やRunge-Kutta法で解けば、制約条件下で目的の微分方程式を解くことができます。

### 4.2 パフィアン制約の安定化

次にパフィアン制約を微分方程式に組み込むことを考えます。ここで重要になるのが、制約安定化法での運動方程式で$\lambda R_x,\lambda R_y$の項に対する考え方です。

単振り子の場合、$(\lambda R_x,\lambda R_y)$に相当する力は物体が円運動に沿うように働きました。一般に、制約条件が$R(x,y)=0$で表されるとき、$\lambda\nabla R$の項を**制約安定化項**といいます。

では、自動車の運動を例にして考えてみましょう。まず、運動方程式は
$$
\begin{cases}
m\ddot{x}&=f_x-b\dot{x}\\\
m\ddot{y}&=f_y-b\dot{y}\\\
I\dot{\omega}&=\tau-B\omega
\end{cases}
$$
と表されるのでした。また、制約条件はパフィアン制約であり以下のように表されました。
$$
\text{Q}:= v_x\sin\theta-v_y\cos\theta=0
$$

この制約に対して、制約安定化項

$$
\begin{cases}
\lambda\frac {\partial Q}{\partial v_x}=-\lambda \sin \theta\\\
\lambda\frac {\partial Q}{\partial v_y}=\lambda \cos \theta\\\
\lambda\frac {\partial Q}{\partial\omega}=0
\end{cases}
$$
を加えることを考えます。このとき、運動方程式は
$$
\begin{cases}
m\dot v_x=-b v_x+f_x-\lambda sin \theta\\\
m\dot v_y=-b v_y+f_y-\lambda cos \theta\\\
I\dot \omega=b \omega+\tau
\end{cases}
$$
となります。

制約安定化法では、制約条件$R(x,y)=0$が減衰する微分方程式として、二階微分方程式を採用していました。しかし、パフィアン制約では、制約条件に状態変数の微分が入ってしまうため、一階微分方程式を用いる必要があります。そこで、

$$
\dot{ \text Q}+\gamma \text Q=0
$$
を用います。これを制約安定化項で書き直したものを方程式に加えて整理すると以下を得ます。
$$
\begin{cases}
\begin{bmatrix}
1&&&&&&\\\
&1&&&&&\\\
&&1&&&&\\\
&&&m&&&-\sin\theta\\\
&&&&m&&\cos\theta\\\
&&&&&I&\\\
&&&&\sin\theta&\cos\theta&
\end{bmatrix}
\begin{bmatrix}
\dot x\\\
\dot y\\\
\dot \theta\\\
\dot {v_x}\\\
\dot {v_y}\\\
\dot {\omega}\\\
\lambda
\end{bmatrix}=\begin{bmatrix}
v_x\\\
v_y\\\
\omega\\\
-bv_x+f_x\\\
-bv_y+f_y\\\
-B\omega+\tau\\\
C(\theta,v_x,v_y,\omega)
\end{bmatrix}
\end{cases}
$$
この連立方程式を解けば、$(x,y,\theta,v_x,v_y,\omega)$から$(\dot x,\dot y,\dot \theta,\dot {v_x},\dot {v_y},\dot {\omega},\lambda)$を計算することができます。つまり、標準型を導くことができるので、Euler法やRunge-Kutta法などで数値的に解くことができます。

## 5. 参考文献

* 機械システム学のための数値計算法　平井慎一