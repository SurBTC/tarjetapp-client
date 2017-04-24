import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { User, Card, Quotation } from '../shared/models';

import { environment } from '../../environments/environment';


const BASE_URL = `${environment.api.url}/users`;
const HEADERS = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class UserService {
  public user: Observable<User>;

  constructor(private http: Http, private store: Store<any>) {
    this.user = store.select<User>('user');
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

  public getCurrentUser(): User {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user);
    return user;
  }

  public postUser(): Observable<User> {
    let currentUser = this.getCurrentUser();
    delete currentUser.uuid;
    let req = JSON.stringify(currentUser);

    // Post new values from API
    return this.http.post(BASE_URL, req, HEADERS)
      .timeout(environment.api.timeout)
      .map((response: Response) => this.checkForError(response))
      .map((response: Response) => response.json())
      .do((user: User) => this.store.dispatch({ type: 'UPDATE_USER', payload: user }));
  }

  public getUser(userUuid): Observable<User> {
    return this.http.get(`${BASE_URL}/${userUuid}`, HEADERS)
      .timeout(environment.api.timeout)
      .map((response: Response) => this.checkForError(response))
      .map((response: Response) => response.json())
      .do((user: User) => this.store.dispatch({ type: 'UPDATE_USER', payload: user }));
  }

  public getUserCard(userUuid): Observable<Card> {
    return this.http.get(`${BASE_URL}/${userUuid}/card`, HEADERS)
      .timeout(environment.api.timeout)
      .map((response: Response) => this.checkForError(response))
      .map((response: Response) => response.json())
      .map((data: any) => data['card'])
      .do((card: Card) => this.store.dispatch({ type: 'UPDATE_CARD', payload: card }));
  }

  public getActiveQuotation(userUuid): Observable<Quotation> {
    return this.http.get(`${BASE_URL}/${userUuid}/active-quotation`, HEADERS)
      .timeout(environment.api.timeout)
      .map((response: Response) => this.checkForError(response))
      .map((response: Response) => response.json())
      .map((data: any) => data['quotation']);
  }
}
