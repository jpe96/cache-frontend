import { TestBed } from '@angular/core/testing';

import { DatenspeicherungService } from './datenspeicherung.service';

describe('DatenspeicherungService', () => {
  let service: DatenspeicherungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatenspeicherungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
