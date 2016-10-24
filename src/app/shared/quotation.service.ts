// Refs
// - https://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924
// - https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service

import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs/ReplaySubject';

interface User {
	firstName: string,
	lastName: string,
	email: string,
	nationalId: string
	birthDate: Date,
	address: string,
	city: string,
	zipCode: string,
	phone: string,
}

interface Quotation {
	id: string,
	user: User
	sourceAmount: Number,
	destinationAmount: Number,
	expiresAt: Date
}

@Injectable()
export class QuotationService {
  private amountSource = new ReplaySubject();

  amountStream = this.amountSource.asObservable();

  changeAmount(amount) {
    this.amountSource.next(amount);
  }
}
