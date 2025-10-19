// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';


// https://astro.build/config
export default defineConfig({
  site: 'https://xsuz.github.io',
  integrations: [sitemap(), expressiveCode({
    defaultProps: {
      wrap: true,
      preserveIndent: true,
      themes: ['dracula', 'solarized-light'],
    },
  })],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});