declare module 'virtual:wiki-titles' {
  export const wikiTitles: Record<string, { title: string }>;
  export const projectNames: Record<string, { name: string }>;
  export const glossaryKorean: Record<string, { korean: string }>;
  export const domains: Array<{ id: string; name: string; summary: string }>;
}
