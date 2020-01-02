import { TestBed } from '@angular/core/testing';

import { EventManagerService } from './event-manager.service';

describe('EventManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventManagerService = TestBed.get(EventManagerService);
    expect(service).toBeTruthy();
  });
});
