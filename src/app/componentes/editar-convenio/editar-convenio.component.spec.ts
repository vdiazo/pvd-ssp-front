import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarConvenioComponent } from './editar-convenio.component';

describe('EditarConvenioComponent', () => {
  let component: EditarConvenioComponent;
  let fixture: ComponentFixture<EditarConvenioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarConvenioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
