import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesEjecutorasComponent } from './unidades-ejecutoras.component';

describe('UnidadesEjecutorasComponent', () => {
  let component: UnidadesEjecutorasComponent;
  let fixture: ComponentFixture<UnidadesEjecutorasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadesEjecutorasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesEjecutorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
