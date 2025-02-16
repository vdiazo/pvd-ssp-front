import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarComponenteComponent } from './modal-agregar-componente.component';

describe('ModalAgregarComponenteComponent', () => {
  let component: ModalAgregarComponenteComponent;
  let fixture: ComponentFixture<ModalAgregarComponenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAgregarComponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
