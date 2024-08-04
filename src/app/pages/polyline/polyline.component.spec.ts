import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolylineComponent } from './polyline.component';

describe('PolylineComponent', () => {
  let component: PolylineComponent;
  let fixture: ComponentFixture<PolylineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolylineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolylineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
