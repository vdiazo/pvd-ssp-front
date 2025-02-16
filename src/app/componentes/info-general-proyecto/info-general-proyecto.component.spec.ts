import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGeneralProyectoComponent } from './info-general-proyecto.component';

describe('InfoGeneralProyectoComponent', () => {
  let component: InfoGeneralProyectoComponent;
  let fixture: ComponentFixture<InfoGeneralProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGeneralProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGeneralProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
