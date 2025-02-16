import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerfilComponent } from './modal-perfil.component';

describe('ModalPerfilComponent', () => {
  let component: ModalPerfilComponent;
  let fixture: ComponentFixture<ModalPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
