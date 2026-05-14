import { Injectable } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';

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
  private projects = injectContentFiles<ProjectAttributes>((f) =>
    f.filename.startsWith('/src/content/_projects/')
  );
  private wikiPages = injectContentFiles<WikiAttributes>((f) =>
    f.filename.startsWith('/src/content/wiki/')
  );

  // domains.yml is the source of truth — currently mirrored here.
  // TODO (future): load via vite-plugin-yaml or build-time generator.
  private readonly domainCatalog: DomainEntry[] = [
    { id: 'frontend', name: 'Frontend', summary: 'UI 프레임워크, CSS, 브라우저' },
    { id: 'backend', name: 'Backend', summary: '서버 런타임, API' },
    { id: 'devops', name: 'DevOps', summary: '컨테이너, CI/CD, 인프라' },
    { id: 'tooling', name: 'Tooling', summary: '빌드 도구, 패키지 매니저, 에디터' },
    { id: 'language', name: 'Languages', summary: '프로그래밍 언어 자체' },
  ];

  listDomains(): Array<DomainEntry & { count: number }> {
    return this.domainCatalog.map((d) => {
      const projectSlugs = this.projects
        .filter((p) => p.attributes.domain === d.id)
        .map((p) => p.attributes.project);
      const count = this.wikiPages.filter((w) =>
        projectSlugs.includes(w.attributes.project)
      ).length;
      return { ...d, count };
    });
  }
}
