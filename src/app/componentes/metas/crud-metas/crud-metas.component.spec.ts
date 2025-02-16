import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudMetasComponent } from './crud-metas.component';

describe('CrudMetasComponent', () => {
  let component: CrudMetasComponent;
  let fixture: ComponentFixture<CrudMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
