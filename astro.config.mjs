// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: set your real domain before deploying, e.g. 'https://nick.dev'
  site: 'https://example.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: false, // '/' = English, '/vi/' = Vietnamese
    },
  },
});
