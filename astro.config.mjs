// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


// https://astro.build/config
export default defineConfig({
  site: 'https://xsuz.github.io',
  integrations: [mdx(), sitemap()],

  markdown: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
	},
});