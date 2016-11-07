import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { CreationFee } from '../shared/models';

const BASE_URL = 'http://localhost:3030/creationFees/1';
// const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class CreationFeeService {
  public creationFee:Observable<CreationFee>;

  constructor(private http:Http, private store:Store<any>) {
    this.creationFee = store.select<CreationFee>('creationFee');
  }

    private checkForError(response: Response): Response {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText)
      error['response'] = response;
      console.error(error);
      throw error;
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  public updateCreationFee() {
    this.http.get(BASE_URL)
      .catch((error: any) => {
        console.log(error)
        this.store.dispatch({ type: 'SIMULATION_ERROR' });
        return Observable.empty();
      })
      .map(res => res.json())
      .map(res => Object.assign(res, {expiresAt: new Date(res.expiresAt)}))
      .map(payload => ({ type: 'UPDATE_CREATION_FEE', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}