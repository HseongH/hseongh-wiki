import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  standalone: true,
  template: `
    <article class="mx-auto max-w-(--container-article) px-(--spacing-grid-margin) py-16">
      <p class="label-sm text-outline mb-4">About</p>
      <h1 class="headline-xl text-primary mb-8">HseongH — 학습 위키</h1>
      <p class="body-lg drop-cap text-on-surface mb-8">
        IT 공식문서 한국어 번역을 모아두는 개인 학습 위키입니다. 본문은 충실한 번역으로 유지하며, 그
        위에 LLM 이 용어집·프로젝트 카드·로그를 자동으로 관리합니다.
      </p>

      <h2 class="font-display text-3xl font-semibold text-on-surface mt-16 mb-6">원칙</h2>
      <ul class="space-y-3 body-lg text-on-surface-variant">
        <li class="flex gap-3">
          <span class="text-primary mt-2">—</span>
          <span
            >본문은 의역·주석·재구성을 하지 않는
            <strong class="text-on-surface">충실한 번역</strong>.</span
          >
        </li>
        <li class="flex gap-3">
          <span class="text-primary mt-2">—</span>
          <span>새 용어는 즉시 용어집에 정리하고 첫 등장 시 원어 병기.</span>
        </li>
        <li class="flex gap-3">
          <span class="text-primary mt-2">—</span>
          <span>모든 본문은 톤 앤 매너(격식체, "여러분")를 따릅니다.</span>
        </li>
      </ul>

      <h2 class="font-display text-3xl font-semibold text-on-surface mt-16 mb-6">소스</h2>
      <p class="body-lg">
        <a
          href="https://github.com/HseongH/hseongh-wiki"
          target="_blank"
          rel="noopener"
          class="text-primary border-b border-primary-fixed-dim hover:border-primary transition-colors"
          >github.com/HseongH/hseongh-wiki</a
        >
      </p>
    </article>
  `,
})
export default class AboutPage {}
