import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasModalComponent } from './transferencias-modal.component';

describe('TransferenciasModalComponent', () => {
  let component: TransferenciasModalComponent;
  let fixture: ComponentFixture<TransferenciasModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciasModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
