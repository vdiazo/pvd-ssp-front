import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAccesoComponent } from './buscar-acceso.component';

describe('BuscarAccesoComponent', () => {
  let component: BuscarAccesoComponent;
  let fixture: ComponentFixture<BuscarAccesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarAccesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
