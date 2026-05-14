// AnalogJS injects two views of the content directory with inconsistent
// shapes:
//   - injectContentFiles()    → filename = "src/content/..."  (no leading /)
//   - injectContentFilesMap() → keys      = "/src/content/..." (with leading /)
// These helpers normalize to one canonical form ("/src/content/...") so the
// rest of the app can use either API without per-call-site special-casing.

const CONTENT_PREFIX = '/src/content/';

export function normalizeContentFilename(filename: string): string {
  return filename.startsWith('/') ? filename : `/${filename}`;
}

export function wikiPathFromFilename(filename: string): string {
  return normalizeContentFilename(filename)
    .replace(/^\/src\/content\/wiki\//, '')
    .replace(/\.md$/, '');
}

export function wikiHrefFromFilename(filename: string): string {
  return `/wiki/${wikiPathFromFilename(filename)}`;
}

export function isUnder(filename: string, subdir: string): boolean {
  const normalized = normalizeContentFilename(filename);
  return normalized.startsWith(`${CONTENT_PREFIX}${subdir}/`);
}
