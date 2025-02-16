import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionModalComponent } from './suspension-modal.component';

describe('SuspensionModalComponent', () => {
  let component: SuspensionModalComponent;
  let fixture: ComponentFixture<SuspensionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspensionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspensionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
