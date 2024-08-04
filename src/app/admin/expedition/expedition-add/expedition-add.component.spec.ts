import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionAddComponent } from './expedition-add.component';

describe('ExpeditionAddComponent', () => {
  let component: ExpeditionAddComponent;
  let fixture: ComponentFixture<ExpeditionAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionAddComponent]
    });
    fixture = TestBed.createComponent(ExpeditionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
