import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranfmefseleccionmodalComponent } from './tranfmefseleccionmodal.component';

describe('TranfmefseleccionmodalComponent', () => {
  let component: TranfmefseleccionmodalComponent;
  let fixture: ComponentFixture<TranfmefseleccionmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranfmefseleccionmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranfmefseleccionmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
