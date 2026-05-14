import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PostCardComponent } from './post-card.component';

describe('PostCardComponent', () => {
  it('post 데이터의 title, excerpt, project 를 렌더한다', async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PostCardComponent);
    fixture.componentRef.setInput('post', {
      title: '테스트 제목',
      excerpt: '테스트 본문',
      project: 'pnpm',
      translatedAt: '2026-05-14',
      href: '/wiki/pnpm/README',
    });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('테스트 제목');
    expect(text).toContain('테스트 본문');
    expect(text).toContain('pnpm');
  });
});
