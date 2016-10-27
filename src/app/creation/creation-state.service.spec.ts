/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreationStateService } from './creation-state.service';

describe('Service: Creation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreationStateService]
    });
  });

  it('should ...', inject([CreationStateService], (service: CreationStateService) => {
    expect(service).toBeTruthy();
  }));
});
