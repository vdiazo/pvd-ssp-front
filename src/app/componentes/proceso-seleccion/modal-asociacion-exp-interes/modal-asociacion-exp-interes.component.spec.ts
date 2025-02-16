import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsociacionExpInteresComponent } from './modal-asociacion-exp-interes.component';

describe('ModalAsociacionExpInteresComponent', () => {
  let component: ModalAsociacionExpInteresComponent;
  let fixture: ComponentFixture<ModalAsociacionExpInteresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsociacionExpInteresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsociacionExpInteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
