import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasListadoComponent } from './transferencias-listado.component';

describe('TransferenciasListadoComponent', () => {
  let component: TransferenciasListadoComponent;
  let fixture: ComponentFixture<TransferenciasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
