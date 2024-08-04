import { Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  titleChange: Observable<string> = this.titleSubject.asObservable();

  darkModeSignal = signal<string>('null') ;
  updateDarkMode() {
    this.darkModeSignal.update((value) => (value === 'dark' ? "null" : 'dark'));
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(event => {
      const pageTitle = event['title'];
      this.titleService.setTitle(pageTitle);
      this.titleSubject.next(pageTitle);
    });
  }

  getTitle(): string {
    return this.titleService.getTitle();
  }
}
