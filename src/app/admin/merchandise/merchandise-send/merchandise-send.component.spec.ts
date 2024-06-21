import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseSendComponent } from './merchandise-send.component';

describe('MerchandiseSendComponent', () => {
  let component: MerchandiseSendComponent;
  let fixture: ComponentFixture<MerchandiseSendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchandiseSendComponent]
    });
    fixture = TestBed.createComponent(MerchandiseSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
