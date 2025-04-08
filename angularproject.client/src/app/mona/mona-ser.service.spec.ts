import { TestBed } from '@angular/core/testing';

import { MonaSerService } from './mona-ser.service';

describe('MonaSerService', () => {
  let service: MonaSerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonaSerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
