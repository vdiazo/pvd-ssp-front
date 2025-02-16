import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdelantoMaterialesComponent } from './modal-adelanto-materiales.component';

describe('ModalAdelantoMaterialesComponent', () => {
  let component: ModalAdelantoMaterialesComponent;
  let fixture: ComponentFixture<ModalAdelantoMaterialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdelantoMaterialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdelantoMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
