import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranfmefseleccionComponent } from './tranfmefseleccion.component';

describe('TranfmefseleccionComponent', () => {
  let component: TranfmefseleccionComponent;
  let fixture: ComponentFixture<TranfmefseleccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranfmefseleccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranfmefseleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
