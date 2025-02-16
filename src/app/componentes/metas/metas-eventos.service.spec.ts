import { TestBed, inject } from '@angular/core/testing';

import { MetasEventosService } from './metas-eventos.service';

describe('MetasEventosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetasEventosService]
    });
  });

  it('should be created', inject([MetasEventosService], (service: MetasEventosService) => {
    expect(service).toBeTruthy();
  }));
});
