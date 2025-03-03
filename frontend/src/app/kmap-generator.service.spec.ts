import { TestBed } from '@angular/core/testing';

import { KmapGeneratorService } from './kmap-generator.service';

describe('KmapGeneratorService', () => {
  let service: KmapGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmapGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
