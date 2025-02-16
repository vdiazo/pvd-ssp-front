import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTramoComponent } from './modal-tramo.component';

describe('ModalTramoComponent', () => {
  let component: ModalTramoComponent;
  let fixture: ComponentFixture<ModalTramoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTramoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTramoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
