// @ts-check

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
      wrap: false,
      preserveIndent: true,
    },
    themes:['github-dark', 'github-light']
  })],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});