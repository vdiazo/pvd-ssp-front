import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGatewayComponent } from './modal-gateway.component';

describe('ModalGatewayComponent', () => {
  let component: ModalGatewayComponent;
  let fixture: ComponentFixture<ModalGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
