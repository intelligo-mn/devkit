import { TestBed } from '@angular/core/testing';

import { DirectivesService } from './directives.service';

describe('DirectivesService', () => {
  let service: DirectivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
