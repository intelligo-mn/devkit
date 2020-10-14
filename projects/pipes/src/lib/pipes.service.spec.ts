import { TestBed } from '@angular/core/testing';

import { PipesService } from './pipes.service';

describe('PipesService', () => {
  let service: PipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
