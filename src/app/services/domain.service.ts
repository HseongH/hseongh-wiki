import { Injectable } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { domains as domainCatalog } from 'virtual:wiki-titles';
import { isUnder } from '../../lib/content-paths';

export interface DomainEntry {
  id: string;
  name: string;
  summary: string;
}

export interface ProjectAttributes {
  project: string;
  name: string;
  summary?: string;
  domain: string;
}

export interface WikiAttributes {
  project: string;
  translated_at: string;
}

@Injectable({ providedIn: 'root' })
export class DomainService {
  private projects = injectContentFiles<ProjectAttributes>((f) => isUnder(f.filename, '_projects'));
  private wikiPages = injectContentFiles<WikiAttributes>((f) => isUnder(f.filename, '_wiki'));

  listDomains(): Array<DomainEntry & { count: number }> {
    return domainCatalog.map((d) => {
      const projectSlugs = this.projects
        .filter((p) => p.attributes.domain === d.id)
        .map((p) => p.attributes.project);
      const count = this.wikiPages.filter((w) =>
        projectSlugs.includes(w.attributes.project),
      ).length;
      return { ...d, count };
    });
  }
}
