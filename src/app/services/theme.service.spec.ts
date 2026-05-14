import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  it('초기에 setTheme 으로 dark 적용 가능', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle 은 dark <-> light 를 전환한다', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('light');
    service.toggle();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.toggle();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme 은 localStorage 에 저장한다', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
