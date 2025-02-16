import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFileListadoComponent } from './input-file-listado.component';

describe('InputFileListadoComponent', () => {
  let component: InputFileListadoComponent;
  let fixture: ComponentFixture<InputFileListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFileListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFileListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
