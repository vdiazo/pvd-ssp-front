import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProyectoModalComponent } from './buscar-proyecto-modal.component';

describe('BuscarProyectoModalComponent', () => {
  let component: BuscarProyectoModalComponent;
  let fixture: ComponentFixture<BuscarProyectoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarProyectoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarProyectoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
