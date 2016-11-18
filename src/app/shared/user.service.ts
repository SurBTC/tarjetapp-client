import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { User } from '../shared/models';

const BASE_URL = 'http://localhost:3030/users';
const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class UserService {
	public user:Observable<User>;

	constructor(private http: Http, private store: Store<any>) {
		this.user = store.select<User>('user');
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

	public getCurrentUser(): User {
		let user: User;
		this.store.take(1).subscribe(s => user = s.user);
		return user;
	}

	public postUser() {
		let currentUser = this.getCurrentUser();
		delete currentUser.uuid
		let req = JSON.stringify(currentUser);

		// Post new values from API
		return this.http.post(BASE_URL, req, HEADERS)
			.timeout(10000)
			.map(res => this.checkForError(res))
			.map(res => res.json())
			.map(payload => ({ type: 'UPDATE_USER', payload }))
			.do(action => this.store.dispatch(action));
	}
}