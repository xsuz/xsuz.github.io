---
title: "HugoからAstroへ移行した"
date: 2025-10-15T04:18+09:00
archives:
    - 2025
    - 2025-10
categories: [Aerodynamics]
tags:
    - Astro
    - Hugo
    - JavaScript
    - CSS
    - HTML
draft: false
---

今まではHugoを使ってブログを書いていましたが，Astroに移行しました．
そこで，HugoからAstroに移行した理由とAstroへの移行方法について解説します．

## HugoからAstroに移行した理由

HugoはGo言語で書かれた静的サイトジェネレータで，非常に高速に動作し，豊富なテーマが用意されているため，ブログを書くのに適しています．あまりブログシステムの構築に時間をかけたくなかったので，Hugoを選びました．

しかし，現在もHugoの仕様が変わり続けており，アップデートのたびにテーマが動かなくなったり，ビルドが通らなくなったりしていました．
また，ReactやVueなどのフレームワークだけでなくTailwind CSSを使うのも難しく，開発効率が悪いと感じていました．

久しぶりにブログを更新しようとしたところDeployが失敗し新規記事の投稿ができなくなったため，思い切って書き直すことにしました．

[この記事](https://siwl.dev/blog/articles/renewal-note/)や[この記事](https://blog.736b.moe/posts/migrate-to-astro)を見て，[Astro](https://astro.build/)に移行することに決めました．

## Astroへの移行方法

[公式ドキュメント](https://docs.astro.build/ja/guides/migrate-to-astro/from-hugo/)を参考に，Astroのプロジェクトを作成しました．

### 1. Astroのプロジェクトを作成

```bash
yarn create astro --template blog
```

### 2. Hugoのコンテンツを移行

Hugoの`content`フォルダ内のMarkdownファイルをAstroの`src/content`フォルダにコピーしました．

### 3. Content Collectionsの設定

Hugoのfrontmatterの項目名とAstroのデフォルトの項目名が異なるため，AstroのContent Collectionsの設定を変える必要があります．

そこで，`src/content.config.ts`の内容を書き換えました．`schema`の部分でfrontmatterの項目名を指定しています．

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Transform string to Date object
			date: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
```

項目名の変更に伴い，`src/components`や`src/pages`内のコードも修正しました．

### 4. デプロイ

[公式ドキュメント](https://docs.astro.build/ja/guides/deploy/github/)を参考に，GitHub Pagesにデプロイしました．

Astro側のドキュメントが充実していたので特に問題なく移行できました．

### 5. Tailwind CSSの設定

[ここ](https://docs.astro.build/en/guides/styling/#tailwind)を参考に，Tailwind CSSを導入しました．
他のブログだと，古いバージョンのTailwind CSSについて書かれていることが多いので，注意が必要です．

また，Markdownのスタイルにも影響が出てしまうため，`globals.css`でMarkdownに対して違うスタイルが適用されるようにしました．
(具体的にはMarkdownの中身に対して`#article-content`で囲い，`globals.css`で`#article-content > p`などのように指定しました．)

### 6. その他

Tagsのページを追加したり，SEO対策を行ったりしました．

## 最終的にできたもの

https://github.com/xsuz/xsuz.github.io

## 最後に

想像よりも簡単に移行できました．Hugoで構築したときは，何回もDeployが失敗して苦労しましたが，Astroでは特に問題なくできました．今後は，Astroでブログを書いていきたいと思います．