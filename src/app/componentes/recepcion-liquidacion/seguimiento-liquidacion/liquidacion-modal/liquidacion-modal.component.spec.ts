import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionModalComponent } from './liquidacion-modal.component';

describe('LiquidacionModalComponent', () => {
  let component: LiquidacionModalComponent;
  let fixture: ComponentFixture<LiquidacionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
