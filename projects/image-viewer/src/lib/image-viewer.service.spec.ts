import { TestBed } from '@angular/core/testing';

import { ImageViewerService } from './image-viewer.service';

describe('ImageViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageViewerService = TestBed.get(ImageViewerService);
    expect(service).toBeTruthy();
  });
});
