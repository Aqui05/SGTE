import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMerchandiseComponent } from './payment-merchandise.component';

describe('PaymentMerchandiseComponent', () => {
  let component: PaymentMerchandiseComponent;
  let fixture: ComponentFixture<PaymentMerchandiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentMerchandiseComponent]
    });
    fixture = TestBed.createComponent(PaymentMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
