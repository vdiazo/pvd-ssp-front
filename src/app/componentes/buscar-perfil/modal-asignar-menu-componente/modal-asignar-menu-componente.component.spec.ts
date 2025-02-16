import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarMenuComponenteComponent } from './modal-asignar-menu-componente.component';

describe('ModalAsignarMenuComponenteComponent', () => {
  let component: ModalAsignarMenuComponenteComponent;
  let fixture: ComponentFixture<ModalAsignarMenuComponenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignarMenuComponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignarMenuComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
