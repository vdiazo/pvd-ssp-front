import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerfilesComponent } from './modal-perfiles.component';

describe('ModalPerfilesComponent', () => {
  let component: ModalPerfilesComponent;
  let fixture: ComponentFixture<ModalPerfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
