import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPrincipalComponent } from './info-principal.component';

describe('InfoPrincipalComponent', () => {
  let component: InfoPrincipalComponent;
  let fixture: ComponentFixture<InfoPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
