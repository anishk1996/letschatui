import { TestBed } from '@angular/core/testing';

import { JwtUnInterceptorService } from './jwt-un-interceptor.service';

describe('JwtUnInterceptorService', () => {
  let service: JwtUnInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtUnInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
