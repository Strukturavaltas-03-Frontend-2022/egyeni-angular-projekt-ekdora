import { TestBed } from '@angular/core/testing';

import { MovieHandlerService } from './movie-handler.service';

describe('MovieHandlerService', () => {
  let service: MovieHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
