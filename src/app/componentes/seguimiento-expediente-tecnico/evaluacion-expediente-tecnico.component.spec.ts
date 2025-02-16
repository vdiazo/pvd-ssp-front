import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoExpedienteTecnicoComponent } from './seguimiento-expediente-tecnico.component';

describe('EvaluacionExpedienteTecnicoComponent', () => {
  let component: SeguimientoExpedienteTecnicoComponent;
  let fixture: ComponentFixture<SeguimientoExpedienteTecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoExpedienteTecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoExpedienteTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
