import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasMefComponent } from './transferencias-mef.component';

describe('TransferenciasMefComponent', () => {
  let component: TransferenciasMefComponent;
  let fixture: ComponentFixture<TransferenciasMefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciasMefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciasMefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
