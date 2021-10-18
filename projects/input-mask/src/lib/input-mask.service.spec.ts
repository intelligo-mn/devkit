import { TestBed } from '@angular/core/testing';

import { InputMaskService } from './input-mask.service';

describe('InputMaskService', () => {
  let service: InputMaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputMaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
