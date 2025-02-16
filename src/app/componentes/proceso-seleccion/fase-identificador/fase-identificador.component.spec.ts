import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaseIdentificadorComponent } from './fase-identificador.component';

describe('FaseIdentificadorComponent', () => {
  let component: FaseIdentificadorComponent;
  let fixture: ComponentFixture<FaseIdentificadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaseIdentificadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaseIdentificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
