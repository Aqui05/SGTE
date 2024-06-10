import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAddComponent } from './transport-add.component';

describe('TransportAddComponent', () => {
  let component: TransportAddComponent;
  let fixture: ComponentFixture<TransportAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransportAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
