import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { Quotation, User, Simulation } from './models';

import { environment } from '../../environments/environment';


const BASE_URL = `${environment.api.url}/quotations`;
const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class QuotationService {
  public quotation: Observable<Quotation>;

  constructor(private http: Http, private store: Store<any>) {
    this.quotation = store.select<Quotation>('quotation');
  }

  private checkForError(response: Response): Response {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error['response'] = response;
      console.error(error);
      throw error;
    }
  }

  private getCurrentUser(): User {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user);
    return user;
  }

  private getCurrentSimulation(): Simulation {
    let simulation: Simulation;
    this.store.take(1).subscribe(s => simulation = s.simulation);
    return simulation;
  }

  public createQuotation(): Observable<Quotation> {

    let simulation: Simulation = this.getCurrentSimulation();
    let user: User = this.getCurrentUser();

    let req = {
      quotation: { destinationAmount: simulation.destinationAmount },
      user: { uuid: user.uuid }
    };

    // Post new values from API
    return this.http.post(BASE_URL, req, HEADERS)
      .timeout(environment.api.timeout)
      .map(res => this.checkForError(res))
      .map(res => res.json())
      .map(res => Object.assign(res, { sourceAmount: parseFloat(res.sourceAmount) }))
      .map(res => Object.assign(res, { destinationAmount: parseFloat(res.destinationAmount) }))
      .map(res => Object.assign(res, { creationFeeAmount: parseFloat(res.creationFeeAmount) }))
      .map(res => Object.assign(res, { expiresAt: new Date(res.expiresAt)}))
      .map(res => Object.assign(res, { updatedAt: new Date() }))
      .do(quotation => this.store.dispatch({ type: 'UPDATE_QUOTATION', payload: quotation }));
  }
}
