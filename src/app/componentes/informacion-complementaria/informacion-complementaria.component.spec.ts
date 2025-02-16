import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionComplementariaComponent } from './informacion-complementaria.component';

describe('InformacionComplementariaComponent', () => {
  let component: InformacionComplementariaComponent;
  let fixture: ComponentFixture<InformacionComplementariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionComplementariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionComplementariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
