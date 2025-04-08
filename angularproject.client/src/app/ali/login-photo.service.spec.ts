import { TestBed } from '@angular/core/testing';

import { LoginPhotoService } from './login-photo.service';

describe('LoginPhotoService', () => {
  let service: LoginPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
