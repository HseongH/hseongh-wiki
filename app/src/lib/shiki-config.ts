import type { BundledLanguage, BundledTheme } from 'shiki';

/**
 * Shiki highlighter options for AnalogJS content pipeline.
 *
 * Implementation note: Path (a) — AnalogJS natively integrates Shiki via
 * `content.highlighter: 'shiki'` and `content.shikiOptions` (no separate
 * rehype plugin needed). The `shikiOptions` object below is wired directly
 * into `analog({ content: { highlighter: 'shiki', shikiOptions } })` in
 * vite.config.ts.
 *
 * Dual-theme mode: github-light for light mode, github-dark for dark mode.
 * `defaultColor: false` emits CSS variables instead of inline colours.
 * Flip the active theme by toggling the `html.dark` class (or equivalent
 * CSS selector used by Tailwind's dark mode config).
 */
export const shikiOptions = {
  highlighter: {
    themes: ['github-light', 'github-dark'] as BundledTheme[],
    langs: [
      'typescript',
      'javascript',
      'tsx',
      'jsx',
      'html',
      'css',
      'json',
      'markdown',
      'bash',
      'shell',
      'python',
      'yaml',
      'toml',
    ] as BundledLanguage[],
  },
  highlight: {
    themes: {
      light: 'github-light' as BundledTheme,
      dark: 'github-dark' as BundledTheme,
    },
    defaultColor: false as const, // emit CSS variables; toggle via html.dark class
  },
};

export type ShikiConfigOptions = typeof shikiOptions;
