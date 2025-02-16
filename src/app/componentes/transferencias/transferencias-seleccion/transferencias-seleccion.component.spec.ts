import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasSeleccionComponent } from './transferencias-seleccion.component';

describe('TransferenciasSeleccionComponent', () => {
  let component: TransferenciasSeleccionComponent;
  let fixture: ComponentFixture<TransferenciasSeleccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciasSeleccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciasSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
