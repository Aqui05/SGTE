import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionHistoryComponent } from './expedition-history.component';

describe('ExpeditionHistoryComponent', () => {
  let component: ExpeditionHistoryComponent;
  let fixture: ComponentFixture<ExpeditionHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionHistoryComponent]
    });
    fixture = TestBed.createComponent(ExpeditionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
