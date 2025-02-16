import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranfmefrecursosComponent } from './tranfmefrecursos.component';

describe('TranfmefrecursosComponent', () => {
  let component: TranfmefrecursosComponent;
  let fixture: ComponentFixture<TranfmefrecursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranfmefrecursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranfmefrecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
