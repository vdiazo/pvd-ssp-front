import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponentesComponent } from './modal-componentes.component';

describe('ModalComponentesComponent', () => {
  let component: ModalComponentesComponent;
  let fixture: ComponentFixture<ModalComponentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
