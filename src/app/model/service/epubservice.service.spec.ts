import { TestBed } from '@angular/core/testing';

import { EpubserviceService } from './epubservice.service';

describe('EpubserviceService', () => {
  let service: EpubserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpubserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
