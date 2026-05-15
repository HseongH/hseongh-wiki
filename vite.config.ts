/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { shikiOptions } from './src/lib/shiki-config';
import { buildLookups } from './src/lib/build-lookups';
import { wikilinkExtension } from './src/lib/marked-wikilink';
import { wikiTitlesPlugin } from './src/lib/wiki-titles-plugin';

// Build wikilink lookups at startup so [[...]] refs resolve at build time.
const lookups = buildLookups();

// Enumerate every wiki/project/glossary/domain URL so AnalogJS can prerender
// the SPA shell into static HTML per route — better first paint and SEO than
// shipping an empty shell that hydrates client-side.
const prerenderRoutes: string[] = [
  '/',
  '/about',
  '/glossary',
  '/projects',
  ...Object.keys(lookups.glossaryLookup).map((s) => `/glossary/${s}`),
  ...Object.keys(lookups.projectLookup).map((s) => `/projects/${s}`),
  ...Object.keys(lookups.wikiLookup).map((p) => `/wiki/${p}`),
  ...lookups.domains.map((d) => `/domains/${d.id}`),
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: './node_modules/.vite',
    build: {
      outDir: './dist/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    plugins: [
      wikiTitlesPlugin(),
      tailwindcss(),
      analog({
        ssr: false,
        static: true,
        prerender: {
          routes: prerenderRoutes,
        },
        // Path (a): AnalogJS natively integrates Shiki via content options.
        // No separate rehype plugin needed — shikiOptions flows through
        // AnalogJS's marked-shiki integration with dual theme support.
        // Task 24: wire wikilink marked extension so [[target]] transforms at build time.
        content: {
          highlighter: 'shiki',
          shikiOptions,
          markedOptions: {
            extensions: [wikilinkExtension(lookups)],
          },
        },
      }),
      viteTsConfigPaths(),
    ],
    server: {
      fs: {
        allow: ['.'],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts', '**/*.test.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
