import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutadaLiquidadaComponent } from './ejecutada-liquidada.component';

describe('EjecutadaLiquidadaComponent', () => {
  let component: EjecutadaLiquidadaComponent;
  let fixture: ComponentFixture<EjecutadaLiquidadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjecutadaLiquidadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjecutadaLiquidadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
