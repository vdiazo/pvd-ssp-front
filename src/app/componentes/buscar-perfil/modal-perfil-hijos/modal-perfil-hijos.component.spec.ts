import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerfilHijosComponent } from './modal-perfil-hijos.component';

describe('ModalPerfilHijosComponent', () => {
  let component: ModalPerfilHijosComponent;
  let fixture: ComponentFixture<ModalPerfilHijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerfilHijosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerfilHijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
