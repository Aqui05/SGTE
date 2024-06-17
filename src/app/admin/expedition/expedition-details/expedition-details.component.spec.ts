import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionDetailsComponent } from './expedition-details.component';

describe('ExpeditionDetailsComponent', () => {
  let component: ExpeditionDetailsComponent;
  let fixture: ComponentFixture<ExpeditionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionDetailsComponent]
    });
    fixture = TestBed.createComponent(ExpeditionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
