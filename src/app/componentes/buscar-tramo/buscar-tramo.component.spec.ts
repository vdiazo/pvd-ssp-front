import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTramoComponent } from './buscar-tramo.component';

describe('BuscarTramoComponent', () => {
  let component: BuscarTramoComponent;
  let fixture: ComponentFixture<BuscarTramoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarTramoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarTramoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
