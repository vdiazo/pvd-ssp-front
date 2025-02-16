import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalColaboradorComponent } from './modal-colaborador.component';

describe('ModalColaboradorComponent', () => {
  let component: ModalColaboradorComponent;
  let fixture: ComponentFixture<ModalColaboradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalColaboradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
