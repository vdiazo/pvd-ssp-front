import { TestBed, inject } from '@angular/core/testing';

import { PresupuestoService } from './presupuesto.service';

describe('PresupuestoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PresupuestoService]
    });
  });

  it('should be created', inject([PresupuestoService], (service: PresupuestoService) => {
    expect(service).toBeTruthy();
  }));
});
