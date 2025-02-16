import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCronoOsceComponent } from './modal-crono-osce.component';

describe('ModalCronoOsceComponent', () => {
  let component: ModalCronoOsceComponent;
  let fixture: ComponentFixture<ModalCronoOsceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCronoOsceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCronoOsceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
