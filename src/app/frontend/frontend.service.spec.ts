import { TestBed } from '@angular/core/testing';

import { FrontendService } from './frontend.service';

describe('FrontendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrontendService = TestBed.get(FrontendService);
    expect(service).toBeTruthy();
  });
});
