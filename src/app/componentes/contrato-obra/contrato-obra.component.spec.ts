import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoObraComponent } from './contrato-obra.component';

describe('ContratoObraComponent', () => {
  let component: ContratoObraComponent;
  let fixture: ComponentFixture<ContratoObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
