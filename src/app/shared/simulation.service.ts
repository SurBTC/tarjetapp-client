import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { Simulation } from '../shared/models';

const BASE_URL = 'http://localhost:3030/simulations';
// const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class SimulationService {
	public simulation:Observable<Simulation>;

	constructor(private http: Http, private store: Store<any>) {
		this.simulation = store.select<Simulation>('simulation');
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

	public updateSimulation(destinationAmount:number) {

		// Fetch for new values from API
		this.http.get(`${BASE_URL}/${destinationAmount}`)
			.timeout(10000)
			.catch((error:any) => {
				console.log(error)
				this.store.dispatch({type: 'SIMULATION_ERROR' });
				return Observable.empty();
			})
			.map(res => res.json())
			.map(res => Object.assign(res, { expiresAt: new Date(res.expiresAt) }))
			.map(res => Object.assign(res, { updatedAt: new Date() }))
			.map(payload => ({ type: 'UPDATE_SIMULATION', payload }))
			.subscribe(action => this.store.dispatch(action));
	}
}