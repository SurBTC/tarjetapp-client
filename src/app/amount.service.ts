// Ref: https://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924

import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class AmountService {
  // Observable navItem source
  private amountSource = new ReplaySubject();

  // Observable navItem stream
  amountStream = this.amountSource.asObservable();

  // service command
  changeAmount(amount) {
    this.amountSource.next(amount);
  }
}
