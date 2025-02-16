import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramadaSegunExpedienteComponent } from './programada-segun-expediente.component';

describe('ProgramadaSegunExpedienteComponent', () => {
  let component: ProgramadaSegunExpedienteComponent;
  let fixture: ComponentFixture<ProgramadaSegunExpedienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramadaSegunExpedienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramadaSegunExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
