import { TestBed } from '@angular/core/testing';

import { DebtCollectionManagementService } from './debt-collection-management.service';

describe('DebtCollectionManagementService', () => {
  let service: DebtCollectionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtCollectionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
