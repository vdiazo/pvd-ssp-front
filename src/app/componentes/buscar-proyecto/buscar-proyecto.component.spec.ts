import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProyectoComponent } from './buscar-proyecto.component';

describe('BuscarProyectoComponent', () => {
  let component: BuscarProyectoComponent;
  let fixture: ComponentFixture<BuscarProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
