/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuotationService } from './quotation.service';

describe('Service: Quotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationService]
    });
  });

  it('should ...', inject([QuotationService], (service: QuotationService) => {
    expect(service).toBeTruthy();
  }));
});
