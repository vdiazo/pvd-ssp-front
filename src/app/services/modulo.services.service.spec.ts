import { TestBed, inject } from '@angular/core/testing';

import { Modulo.ServicesService } from './modulo.services.service';

describe('Modulo.ServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Modulo.ServicesService]
    });
  });

  it('should be created', inject([Modulo.ServicesService], (service: Modulo.ServicesService) => {
    expect(service).toBeTruthy();
  }));
});
