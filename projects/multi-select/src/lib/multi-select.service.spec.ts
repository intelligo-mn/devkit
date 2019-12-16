import { TestBed } from '@angular/core/testing';

import { MultiSelectService } from './multi-select.service';

describe('MultiSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiSelectService = TestBed.get(MultiSelectService);
    expect(service).toBeTruthy();
  });
});
