import { TestBed } from '@angular/core/testing';

import { ChartsService } from './charts.service';

describe('ChartsService', () => {
  let service: ChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
