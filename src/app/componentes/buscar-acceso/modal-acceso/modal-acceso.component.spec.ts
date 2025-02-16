import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAccesoComponent } from './modal-acceso.component';

describe('ModalAccesoComponent', () => {
  let component: ModalAccesoComponent;
  let fixture: ComponentFixture<ModalAccesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAccesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
