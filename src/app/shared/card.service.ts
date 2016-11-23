import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { Quotation, User } from './models';


const BASE_URL = 'http://localhost:3030/cards';
const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class CardService {
	// public quotation:Observable<Quotation>;

	constructor(private http: Http, private store: Store<any>) {
		// this.quotation = store.select<Quotation>('quotation');
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

	private getCurrentUser(): User {
		let user: User;
		this.store.take(1).subscribe(s => user = s.user);
		return user;
	}

	private getCurrentQuotation(): Quotation {
		let quotation: Quotation;
		this.store.take(1).subscribe(s => quotation = s.quotation);
		return quotation;
	}

	public createCard() {

		let quotation: Quotation = this.getCurrentQuotation();

		let req = { quotation: { uuid: quotation.uuid } };

		console.log(req);

		// Post new values from API
		return this.http.post(BASE_URL, req, HEADERS)
			.timeout(60*1000)
			.map(res => this.checkForError(res))
			.map(res => res.json())
			.map(res => {console.log(res); return res})
			// .map(payload => ({ type: 'UPDATE_CARD', payload }))
			// .do(action => this.store.dispatch(action));
	}
}