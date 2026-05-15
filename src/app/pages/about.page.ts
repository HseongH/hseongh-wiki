import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  standalone: true,
  template: `
    <section class="mx-auto max-w-(--container-article) px-6 py-12 body-md">
      <h1 class="headline-xl mb-6">HseongH — 학습 위키</h1>
      <p>
        IT 공식문서 한국어 번역을 모아두는 개인 학습 위키입니다. 본문은 충실한 번역으로 유지하며, 그
        위에 LLM 이 용어집·프로젝트 카드·로그를 자동으로 관리합니다.
      </p>
      <h2 class="headline-md mt-8 mb-3">원칙</h2>
      <ul class="list-disc pl-6 space-y-1">
        <li>본문은 의역·주석·재구성을 하지 않는 <strong>충실한 번역</strong>.</li>
        <li>새 용어는 즉시 용어집에 정리하고 첫 등장 시 원어 병기.</li>
        <li>모든 본문은 톤 앤 매너(격식체, "여러분")를 따릅니다.</li>
      </ul>
      <h2 class="headline-md mt-8 mb-3">소스</h2>
      <p>
        <a
          href="https://github.com/HseongH/hseongh-wiki"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline"
          >github.com/HseongH/hseongh-wiki</a
        >
      </p>
    </section>
  `,
})
export default class AboutPage {}
