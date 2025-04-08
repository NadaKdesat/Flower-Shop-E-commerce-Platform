import { TestBed } from '@angular/core/testing';

import { AdnanService } from './adnan.service';

describe('AdnanService', () => {
  let service: AdnanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdnanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
