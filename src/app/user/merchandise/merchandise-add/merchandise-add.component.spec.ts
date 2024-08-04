import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseAddComponent } from './merchandise-add.component';

describe('MerchandiseAddComponent', () => {
  let component: MerchandiseAddComponent;
  let fixture: ComponentFixture<MerchandiseAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchandiseAddComponent]
    });
    fixture = TestBed.createComponent(MerchandiseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
