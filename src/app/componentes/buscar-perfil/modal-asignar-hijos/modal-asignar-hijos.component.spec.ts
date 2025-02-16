import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarHijosComponent } from './modal-asignar-hijos.component';

describe('ModalAsignarHijosComponent', () => {
  let component: ModalAsignarHijosComponent;
  let fixture: ComponentFixture<ModalAsignarHijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignarHijosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignarHijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
