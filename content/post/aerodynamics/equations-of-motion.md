---
title: "飛行力学入門-1"
date: 2023-08-29T10:27:15+09:00
archives:
    - 2023-08
categories: [Aerodynamics]
tags:
    - Physics
    - Mathmatics
    - Aerodynamics
    - Control Theory
draft: false
---

今回からは飛行力学について解説していきます。

最初は、航空機の運動方程式を導出します。（今回の内容）

次回は微小擾乱理論に基づき、4つの連立方程式を線形化していきます。

そうすることで、伝達関数や状態方程式を用いた運動解析が可能となります。

---

# 1 航空機の非線形運動方程式

## 1.0. 座標変換
静止座標系$O_I-X_IY_IZ_I$と動座標系$O-XYZ$を考える。
まず、静止座標系における速度、角速度を以下のように成分表示することにする。
$$
\mathbf{\vec{v}_c}=\begin{bmatrix}\vec i&\vec j&\vec k\end{bmatrix}
\begin{bmatrix}U\\\ V\\\ W
\end{bmatrix}
$$
$$
\mathbf{\vec \omega}=\begin{bmatrix}\vec i&\vec j&\vec k\end{bmatrix}
\begin{bmatrix}P\\\ Q\\\ R
\end{bmatrix}
$$
このとき、$\mathbf U=\begin{bmatrix}\vec i&\vec j&\vec k\end{bmatrix}$を基準基底といい、各座標軸方向の単位ベクトルを並べたものである。
また、$\mathbf{\vec v_c}$、$\mathbf{\vec \omega}$を**幾何ベクトル**、$\begin{bmatrix}U&V&W\end{bmatrix}^T$や$\begin{bmatrix}U&V&W\end{bmatrix}^T$を**座標成分ベクトル**と区別する。(矢印の有無で書き分ける。)
このとき任意のベクトル$\mathbf r$について
$$
\frac d {dt} {\vec r}=\dot {\mathbf r}+\vec \omega \times \vec r
$$が成り立つ。ただし、
$$
\dot {\mathbf r}=\frac {dX}{dt}\vec i+\frac {dY}{dt}\vec j+\frac {dZ}{dt}\vec k
$$は動座標系から見た$\vec v_c$の時間変化率である。
更に、$\vec \omega$の外積をとることは
$$
\Omega=\begin{bmatrix}0& -R& -Q \\\ -R&0&-P \\\ -Q& -P&0\end{bmatrix}
$$の行列積を取ることと同義であり、この$\Omega$を**外積行列**という。

## 1.1. 動座標系で記述した運動方程式

Newtonの第二法則を動座標系で記述することを考える。

### 1.1.1. 機体重心の運動方程式

質点運動に関するNewtonの第二法則は運動量保存則
$$
m\frac{d \vec v_c}{dt}=\sum \vec F
$$で記述される。
機体に固定された動座標系で表現すると、
$$
m(\Omega\vec v_c +\dot {\vec v_c})=\vec{U}\sum \mathbf F
$$成分で書き下すと、以下の式を得る。
> $$
\begin{bmatrix}\dot U \\\ \dot V \\\ \dot W\end{bmatrix}
=\begin{bmatrix}0&-R&-Q \\\ -R&0&-P\\\ -Q&-P&0\end{bmatrix}
\begin{bmatrix}U\\\ V\\\ W\end{bmatrix}
+\frac 1 m \begin{bmatrix}F_X \\\ F_Y\\\ F_Z\end{bmatrix}
$$

($\Omega$は交代行列であることに注意)

### 1.1.2. 姿勢運動の方程式
回転運動に関するNewtonの第二法則は角運動量保存則
$$
\frac d {dt}\int_V\vec r\times \vec V dm=\vec M
$$
で記述される。
機体に固定された動座標系で表現すると、
$$
\vec U \mathbf J \mathbf{ \dot \omega}+ \vec U \mathbf \Omega \mathbf J\mathbf \omega = \vec U \mathbf M
$$ただし、$\mathbf J$は慣性テンソルである。
$\vec U^{-1}$を両辺にかけて以下の式を得る。
> $$
\mathbf{ \dot \omega}= -\mathbf J^{-1} \mathbf \Omega \mathbf J\mathbf \omega + \mathbf J^{-1} \mathbf M
$$ 

$\mathbf M=\begin{bmatrix}M&N&L\end{bmatrix}^T$とおけば、
> $$
\begin{bmatrix}\dot U\\\ \dot V\\\ \dot W\end{bmatrix}
=\begin{bmatrix}I_{xx}&-I_{xy}&-I_{xz}\\\ -I_{yx}&I_{yy}&-I_{yz}\\\ -I_{zx}&-I_{zy}&I_{zz}\end{bmatrix}^{-1}
\Big(
-\begin{bmatrix}0& -R & -Q \\\ -R & 0 & -P \\\ -Q & -P & 0 \end{bmatrix}
\begin{bmatrix}I_{xx}&-I_{xy}&-I_{xz} \\\ -I_{yx}&I_{yy}&-I_{yz} \\\ -I_{zx} & -I_{zy} & I_{zz} \end{bmatrix}
\begin{bmatrix}P \\\ Q \\\ R\end{bmatrix}
+\begin{bmatrix}M \\\ N \\\ L\end{bmatrix}
\Big)
$$

### 1.2. 座標系の種類と座標成分の変換

#### 1.2.1. 地面固定座標系

上で導いた二つの方程式を表現するために、一つ固定座標系を用意する必要がある。
そこで$Z軸$を下向きにとる地上に固定された座標系$X_EY_EZ_E$を導入する。
ここでは、$X_EY_EZ_E$の回転は無視できるとし、慣性系の一つとして考えることができるものとする。

#### 1.2.1. 機体軸系

座標原点を機体重心、$X_B$軸を機体の幾何学的基準線におき、$Z_B$軸を$X_B$と垂直な方向に機体の下方へとり、$Y_B$を右手直交系をなすように取った座標系を**機体軸系**という。
また、$X_B$、$Y_B$、$Z_B$の3軸のことをそれぞれ**roll軸**、**pitch軸**、**yaw軸**という。

#### 1.2.2. 安定軸系

機体軸系を$Y_B$軸まわりに迎え角$-\alpha$だけ回転させ、飛行速度を対称面に射影した方向に$X_S$軸を取る。この$X_SY_SZ_S$座標系を**安定軸系**という。
安定軸系では、常に$Z_S$成分の速度ベクトルは0となる。

#### 1.2.3. 風軸系

対気速度ベクトルが対称面から$\beta$だけずれているとする。
このとき、安定軸系を$Z_S$軸まわりに**横滑り角**$\beta$だけ回転させて、対気速度ベクトルの方向に$X_W$軸を取った座標系$X_WY_WZ_W$を**風軸系**という。
$\alpha$、$\beta$に関する次の式を用いて、計算をできるだけ簡単にしていく。
$$
\tan\alpha=\frac W U,\  \tan\beta=\frac{V}{\sqrt{U^2+W^2}}
$$

#### 1.2.4. 慣性主軸系

慣性テンソル$\mathbf J$は正対称行列だから、適当な座標軸を取ることにより対角行列にすることができる。
このときの座標系を**慣性主軸系**という。

### 1.3. 速度・角速度の座標変換

回転操作は線形変換であるため、ある行列$\mathbf R$の行列積をとることに置き換えることができる。
この$\mathbf R$を**回転行列**という。
ここでは、Euler角における姿勢表現から回転行列を求め、角速度成分の関係を表すキネマティック方程式を導く。

#### 1.3.1. Euler角による姿勢表現

Euler角で姿勢を表現するときは 座標軸の回転順序が重要であり、航空機の場合は321系、つまり$Z_1$軸→$Y_2$→$Z_3$の順に、それぞれ$\Psi$、$\Theta$、$\Phi$だけ回転させることで表現する。

#### 1.3.2. 速度ベクトルの座標変換

地上固定座標系での速度を$\mathbf v_e$、機体軸系での速度を$\mathbf v_c=\begin{bmatrix} U & V & W \end{bmatrix}^T$
すると、1.2.1.から地面固定座標系から機体軸系への速度の座標変換は
$$
\begin{aligned}
\mathbf v_e&=R_{X_3}(\Phi)(R_{Y_3}(\Theta)(R_{Z_3}(\Psi)v_c))\\\
&=\begin{bmatrix}\cos\Psi&\sin\Psi&0 \\\ -\sin\Psi&\cos\Psi&0 \\\ 0&0&1\end{bmatrix}
\begin{bmatrix}\cos\Theta&0&-\sin\Theta \\\ 0&1&0 \\\ \sin\Theta&0&\cos\Theta\end{bmatrix}
\begin{bmatrix}1&0&0 \\\ 0&\cos\Phi&\sin\Phi \\\ 0&-\sin\Phi&\cos\Phi\end{bmatrix}
\begin{bmatrix} U \\\ V \\\ W \end{bmatrix}\\\
&=\left[\begin{matrix}\cos{\left(\Psi \right)} \cos{\left(\Theta \right)} & \sin{\left(\Phi \right)} \sin{\left(\Theta \right)} \cos{\left(\Psi \right)} - \sin{\left(\Psi \right)} \cos{\left(\Phi \right)} & \sin{\left(\Phi \right)} \sin{\left(\Psi \right)} + \sin{\left(\Theta \right)} \cos{\left(\Phi \right)} \cos{\left(\Psi \right)}\\\sin{\left(\Psi \right)} \cos{\left(\Theta \right)} & \sin{\left(\Phi \right)} \sin{\left(\Psi \right)} \sin{\left(\Theta \right)} + \cos{\left(\Phi \right)} \cos{\left(\Psi \right)} & - \sin{\left(\Phi \right)} \cos{\left(\Psi \right)} + \sin{\left(\Psi \right)} \sin{\left(\Theta \right)} \cos{\left(\Phi \right)}\\\ - \sin{\left(\Theta \right)} & \sin{\left(\Phi \right)} \cos{\left(\Theta \right)} & \cos{\left(\Phi \right)} \cos{\left(\Theta \right)}\end{matrix}\right]\begin{bmatrix} U \\\ V \\\ W \end{bmatrix}
\end{aligned}
$$と表現される。これを**航法方程式**という。

#### 1.3.3. 角速度ベクトルの座標変換

$Z_1$軸周りの角速度をもつ角速度ベクトル$\mathbf {\dot\Psi}$を機体軸系の成分ベクトルに変換すると、1.3.1.より$R_{Z_1}(\Psi)$→$R_{Y_2}(\Theta)$→$R_{X_3}(\Phi)$の順に作用させたから、
$$
\mathbf {\dot\Psi_3}=R_{X_3}(\Phi)(R_{Y_3}(\Theta)(R_{Z_3}(\Psi)\mathbf {\dot\Psi}))
$$
$Y_2$軸周りの角速度をもつ角速度ベクトル$\mathbf {\dot\Theta}$を機体軸系の成分ベクトルに変換すると、1.3.1.より$R_{Y_2}(\Theta)$→$R_{X_3}(\Phi)$の順に作用させたから、
$$
\mathbf {\dot\Theta_3}=R_{X_3}(\Phi)(R_{Y_3}(\Theta)\mathbf {\dot\Theta})
$$ $X_3$軸周りの角速度をもつ角速度ベクトル$\mathbf {\dot\Phi}$を機体軸系の成分ベクトルに変換すると、1.3.1.より$R_{X_3}(\Phi)$を作用させたから、
$$
\mathbf {\dot\Phi_3}=R_{X_3}(\Phi)\mathbf {\dot\Psi}
$$以上から
$$
\mathbf \omega
=R_{X_3}(\Phi)(\mathbf {\dot\Psi}+R_{Y_3}(\Theta)(\mathbf {\dot\Theta}+R_{Z_3}(\Psi)\mathbf {\dot\Psi}))
$$が得られる。
しかし、実際にセンサーから得ることができるのは$\mathbf \omega$であるので、$\mathbf\omega$から$\left[\begin{matrix}\dot\Phi&\dot\Theta&\dot\Psi\end{matrix}\right]^T$を得る式を計算する。
上の式を成分表示すると、
$$
\begin{aligned}
\begin{bmatrix}P\\\ Q\\\ R\end{bmatrix}&=
\begin{bmatrix}1&0&0 \\\ 0&\cos\Phi&\sin\Phi \\\ 0&-\sin\Phi&\cos\Phi\end{bmatrix}(\begin{bmatrix}\dot\Phi\\\ 0\\\ 0\end{bmatrix}+\begin{bmatrix}\cos\Theta&0&-\sin\Theta \\\ 0&1&0 \\\ \sin\Theta&0&\cos\Theta\end{bmatrix}(\begin{bmatrix}0 \\\  \dot\Theta\\\ 0\end{bmatrix}+\begin{bmatrix}\cos\Psi&\sin\Psi&0 \\\ -\sin\Psi&\cos\Psi&0 \\\ 0&0&1\end{bmatrix}\begin{bmatrix}0\\\ 0\\\ \dot\Psi\end{bmatrix}))\\\
&=\begin{bmatrix}1&0&-\sin\Theta \\\ 0&\cos\Phi&\sin\Phi\cos\Theta \\\ 0&-\sin\Phi&\cos\Phi\cos\Theta\end{bmatrix}
\begin{bmatrix}\dot\Phi\\\ \dot\Theta\\\ \dot\Psi\end{bmatrix}
\end{aligned}
$$
よって逆行列をかけてやれば
$$
\begin{aligned}
\begin{bmatrix}\dot\Phi\\\ \dot\Theta\\\ \dot\Psi\end{bmatrix}&=
\begin{bmatrix}1&0&-\sin\Theta \\\ 0&\cos\Phi&\sin\Phi\cos\Theta \\\ 0&-\sin\Phi&\cos\Phi\cos\Theta\end{bmatrix}^{-1}
\begin{bmatrix}P\\ Q\\ R\end{bmatrix}\\\
&=\begin{bmatrix}1&\sin\Phi\tan\Theta&\cos\Phi\tan\Theta \\\ 0&\cos\Phi&-\sin\Phi \\\ 0&\sin\Phi/\cos\Theta&\cos\Phi/\cos\Theta\end{bmatrix}
\begin{bmatrix}P\\ Q\\ R\end{bmatrix}
\end{aligned}
$$
これは**Eulerのキネマティックス方程式**と呼ばれる。

## 1.4. まとめ

剛体の非線形運動方程式は以下の４つの連立方程式として表される。

$$
\begin{aligned}
\begin{bmatrix}\dot U\\\ \dot V\\\ \dot W\end{bmatrix}
&=\begin{bmatrix}0&-R&-Q\\\ -R&0&-P\\\ -Q&-P&0\end{bmatrix}
\begin{bmatrix}U\\\ V\\\ W\end{bmatrix}
+\frac 1 m \begin{bmatrix}F_X\\\ F_Y\\\ F_Z\end{bmatrix}
\\\
\begin{bmatrix}\dot P\\\ \dot Q\\\ \dot R\end{bmatrix}
&=\begin{bmatrix}I_{xx}&-I_{xy}&-I_{xz}\\\ -I_{yx}&I_{yy}&-I_{yz}\\\ -I_{zx}&-I_{zy}&I_{zz}\end{bmatrix}^{-1}
\Big(
-\begin{bmatrix}0&-R&-Q\\\ -R&0&-P\\\ -Q&-P&0\end{bmatrix}
\begin{bmatrix}I_{xx}&-I_{xy}&-I_{xz}\\\ -I_{yx}&I_{yy}&-I_{yz}\\\ -I_{zx}&-I_{zy}&I_{zz}\end{bmatrix}
\begin{bmatrix}P\\\ Q\\\ R\end{bmatrix}
+\begin{bmatrix}M\\\ N\\\ L\end{bmatrix}
\Big)
\\\
\begin{bmatrix} U_e \\\ V_e \\\ W_e \end{bmatrix}
&=\left[\begin{matrix}\cos{\left(\Psi \right)} \cos{\left(\Theta \right)} & \sin{\left(\Phi \right)} \sin{\left(\Theta \right)} \cos{\left(\Psi \right)} - \sin{\left(\Psi \right)} \cos{\left(\Phi \right)} & \sin{\left(\Phi \right)} \sin{\left(\Psi \right)} + \sin{\left(\Theta \right)} \cos{\left(\Phi \right)} \cos{\left(\Psi \right)}\\\sin{\left(\Psi \right)} \cos{\left(\Theta \right)} & \sin{\left(\Phi \right)} \sin{\left(\Psi \right)} \sin{\left(\Theta \right)} + \cos{\left(\Phi \right)} \cos{\left(\Psi \right)} & - \sin{\left(\Phi \right)} \cos{\left(\Psi \right)} + \sin{\left(\Psi \right)} \sin{\left(\Theta \right)} \cos{\left(\Phi \right)}\\\ -\sin{\left(\Theta \right)} & \sin{\left(\Phi \right)} \cos{\left(\Theta \right)} & \cos{\left(\Phi \right)} \cos{\left(\Theta \right)}\end{matrix}\right]\begin{bmatrix} U \\\ V \\\ W \end{bmatrix}
\\\
\begin{bmatrix}\dot\Phi\\\ \dot\Theta\\\ \dot\Psi\end{bmatrix}&=
\begin{bmatrix}1&\sin\Phi\tan\Theta&\cos\Phi\tan\Theta \\\ 0&\cos\Phi&-\sin\Phi \\\ 0&\sin\Phi/\cos\Theta&\cos\Phi/\cos\Theta\end{bmatrix}
\begin{bmatrix}P\\\ Q\\\ R\end{bmatrix}
\end{aligned}
$$