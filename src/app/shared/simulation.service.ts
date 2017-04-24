import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { Simulation } from './models';

import { environment } from '../../environments/environment';


const BASE_URL = `${environment.api.url}/simulations`;
const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class SimulationService {
  public simulation: Observable<Simulation>;

  constructor(private http: Http, private store: Store<any>) {
    this.simulation = store.select<Simulation>('simulation');
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

  public updateSimulation(destinationAmount: number) {

    // Fetch for new values from API
    this.http.get(`${BASE_URL}/${destinationAmount}`, HEADERS)
      .timeout(environment.api.timeout)
      .map(res => this.checkForError(res))
      .catch((res: Response) => {
        if (res.status === 422) {
          this.store.dispatch({type: 'SIMULATION_EXCEEDS_MAX'});
          return Observable.empty();
        }
        this.store.dispatch({type: 'SIMULATION_ERROR' });
        return Observable.empty();
      })
      .map((res: Response) => res.json())
      .map(res => Object.assign(res, { expiresAt: new Date(res.expiresAt) }))
      .map(res => Object.assign(res, { updatedAt: new Date() }))
      .map(payload => ({ type: 'UPDATE_SIMULATION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}
