// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin. tatecarson.com 301s to the www host, so that is the one
  // that belongs in <link rel="canonical">, og:url and the sitemap. It is also
  // what makes the absolute og:image URL possible — a relative one is ignored
  // by every crawler that renders a share card.
  site: 'https://www.tatecarson.com',
  integrations: [
    sitemap({
      // 22 URLs, all equally current, none of them updated on a schedule.
      // Emitting invented changefreq/priority values would be noise.
      serialize: (item) => ({ url: item.url }),
    }),
  ],
});
