import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionObraModalComponent } from './recepcion-obra-modal.component';

describe('RecepcionObraModalComponent', () => {
  let component: RecepcionObraModalComponent;
  let fixture: ComponentFixture<RecepcionObraModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepcionObraModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionObraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
