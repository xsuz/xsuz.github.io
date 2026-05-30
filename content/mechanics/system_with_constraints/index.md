---
title: 解析力学 2
description: 拘束系の力学
date: 2026-05-30
category: physics
tags: [physics, mechanics, geometric mechanics, lagrange multipliers]
draft: true
---

お久しぶりです．xsuzです．

[前回の記事](variational-principle)では，力学系を変分問題として定式化するところまで紹介しました．3年前なんですね....

今回は，拘束を伴う力学系について紹介します．何となくLagrange力学の良さが分かる気がしました．

---

## 拘束力と変分原理

前回の記事で扱った単振り子について考えてみます．ただし，今回は質点が$\mathbb{R}^3$空間を動くとします．

系の状態を表す座標として$q={x,y,z}$を選んだ場合を考えてみます．このとき，Lagrangianは次のように書けます：

$$
\mathcal{L}(q,\dot{q}) = \frac{1}{2}m(\dot{x}^2 + \dot{y}^2 + \dot{z}^2) - mgz
$$

ただし，この系には質点が糸に繋がれていて，糸の長さが$l$であるという拘束条件があります．この拘束条件は次のように書けます：

$$
g(q) = x^2 + y^2 + z^2 - l^2 = 0
$$

このとき，Lagrangianを用いると，Hamiltonの原理は次のように書けます：

> $$
> \delta \int_{t_1}^{t_2} \mathcal{L}(q,\dot{q}) dt = 0
> $$
> ただし，このときの変分$\delta q$は，拘束条件$g(q)=0$を満たすような変分をとる．

## Lagrangeの未定乗数法

このような拘束された変分を扱うための方法の一つが，**Lagrangeの未定乗数法**です．Lagrangeの未定乗数法では，拘束条件を満たすようにするための未定乗数$\lambda_i$を導入します．具体的には，次のような拡張されたLagrangianを考えます：

$$
\mathcal{L}'(q,\dot{q},\lambda) = \mathcal{L}(q,\dot{q}) + \sum_{i=1}^m
\lambda_i g_i(q)
$$

この拡張されたLagrangianを用いて表された変分原理は次のようになります：

$$
\delta \int_{t_1}^{t_2} \mathcal{L}'(q,\dot{q},\lambda) dt = 0
$$

このとき，変分$\delta q$は任意に選ぶことができます．この変分原理から得られる方程式は次のようになります：

$$
\begin{aligned}
\frac{d}{dt} \left( \frac{\partial \mathcal{L}}{\partial \dot{q_i}} \right) - \frac{\partial \mathcal{L}}{\partial q_i} &= \sum_{k=1}^m \lambda_k \frac{\partial g_k}{\partial q_i} \quad (i=1,2,\ldots,n) \\
g_k(q) &= 0 \quad (k=1,2,\ldots,m)
\end{aligned}
$$

運動法則を変分問題として定式化するモチベーションの一つとして，拘束条件を簡単に扱えるようになるというのがあるのかもしれませんね．

## 配位空間

単振り子の例では，拘束条件$g(q)=0$を課すことにより，質点の運動は$\mathbb{R}^3$空間の中の球面$S^2$上に制限されます．前回の記事の場合は，質点の運動は円周$S^1$上に制限されていました．一般に，拘束条件を課すことにより，質点の運動はある超曲面$N$に制限されます．この超曲面$N$を**配位空間**と呼びます．

未定乗数$\lambda_k$の物理的意味を考えると，系の運動空間を超空間$N$に制限するための力を表していると考えることができます．つまり，未定乗数$\lambda_k$は，**拘束力**の大きさを表していると考えることができます．

## まとめ

- 拘束条件を伴う力学系は，Lagrangeの未定乗数法を用いて定式化できる．
- 拘束条件を課すことにより，質点の運動はある超曲面$N$に制限される．この超曲面$N$を**配位空間**と呼ぶ．
- 未定乗数$\lambda_k$は，系の運動空間を超空間$N$に制限するための拘束力の大きさを表している．