import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdelantoDirectoComponent } from './modal-adelanto-directo.component';

describe('ModalAdelantoDirectoComponent', () => {
  let component: ModalAdelantoDirectoComponent;
  let fixture: ComponentFixture<ModalAdelantoDirectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdelantoDirectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdelantoDirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
