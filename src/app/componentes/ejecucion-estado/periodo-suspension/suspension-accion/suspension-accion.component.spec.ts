import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionAccionComponent } from './suspension-accion.component';

describe('SuspensionAccionComponent', () => {
  let component: SuspensionAccionComponent;
  let fixture: ComponentFixture<SuspensionAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspensionAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspensionAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
