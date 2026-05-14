/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { shikiOptions } from './src/lib/shiki-config';

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
      tailwindcss(),
      analog({
        ssr: false,
        static: true,
        prerender: {
          routes: [],
        },
        // Path (a): AnalogJS natively integrates Shiki via content options.
        // No separate rehype plugin needed — shikiOptions flows through
        // AnalogJS's marked-shiki integration with dual theme support.
        content: {
          highlighter: 'shiki',
          shikiOptions,
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
