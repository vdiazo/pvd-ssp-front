import { TestBed, inject } from '@angular/core/testing';

import { AccionseguimientomonitoreoService } from './accionseguimientomonitoreo.service';

describe('AccionseguimientomonitoreoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccionseguimientomonitoreoService]
    });
  });

  it('should be created', inject([AccionseguimientomonitoreoService], (service: AccionseguimientomonitoreoService) => {
    expect(service).toBeTruthy();
  }));
});
