import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionEditComponent } from './expedition-edit.component';

describe('ExpeditionEditComponent', () => {
  let component: ExpeditionEditComponent;
  let fixture: ComponentFixture<ExpeditionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionEditComponent]
    });
    fixture = TestBed.createComponent(ExpeditionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
