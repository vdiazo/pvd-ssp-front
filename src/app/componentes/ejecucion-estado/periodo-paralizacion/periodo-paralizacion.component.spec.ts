import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoParalizacionComponent } from './periodo-paralizacion.component';

describe('PeriodoParalizacionComponent', () => {
  let component: PeriodoParalizacionComponent;
  let fixture: ComponentFixture<PeriodoParalizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoParalizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoParalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
