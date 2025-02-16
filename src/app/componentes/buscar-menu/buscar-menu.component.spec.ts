import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarMenuComponent } from './buscar-menu.component';

describe('BuscarMenuComponent', () => {
  let component: BuscarMenuComponent;
  let fixture: ComponentFixture<BuscarMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
