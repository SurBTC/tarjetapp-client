// Refs
// - https://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924
// - https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service

import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Quotation, User } from './models';

@Injectable()
export class ModelsService {
  private quotationSource = new BehaviorSubject<Quotation>({
  	sourceAmount: null,
  	destinationAmount: 10
  });

  private userSource = new BehaviorSubject<User>({
  	firstName: null,
  	lastName: null
  });

  quotationUpdates = this.quotationSource.asObservable();
  userUpdates = this.userSource.asObservable();

  updateQuotation(quotation:Quotation) {
    this.quotationSource.next(quotation);
  }

  patchQuotation(quotation:Quotation) {
  	let currentQuotation = this.quotationSource.getValue();
  	for (let prop in quotation) {
  		currentQuotation[prop] = quotation[prop];
  	}
  	this.updateQuotation(currentQuotation);
  }

  updateUser(user:User) {
  	this.userSource.next(user);
  }

  patchUser(user:User) {
  	let currentUser = this.userSource.getValue();
  	for (let prop in user) {
  		currentUser[prop] = user[prop];
  	}
  	this.updateUser(currentUser);
  }
}
