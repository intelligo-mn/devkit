import { TestBed } from '@angular/core/testing';

import { StepperService } from './stepper.service';

describe('StepperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StepperService = TestBed.get(StepperService);
    expect(service).toBeTruthy();
  });
});
