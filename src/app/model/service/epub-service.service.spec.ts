import { TestBed } from '@angular/core/testing';

import { EpubServiceService } from './epub-service.service';

describe('EpubServiceService', () => {
  let service: EpubServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpubServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
