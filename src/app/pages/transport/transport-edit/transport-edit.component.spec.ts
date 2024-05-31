import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportEditComponent } from './transport-edit.component';

describe('TransportEditComponent', () => {
  let component: TransportEditComponent;
  let fixture: ComponentFixture<TransportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
