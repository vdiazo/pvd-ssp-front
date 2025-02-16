import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGarantiasComponent } from './modal-garantias.component';

describe('ModalGarantiasComponent', () => {
  let component: ModalGarantiasComponent;
  let fixture: ComponentFixture<ModalGarantiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGarantiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGarantiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
