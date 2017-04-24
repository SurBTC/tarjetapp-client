import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { Quotation, Card } from './models';

import { environment } from '../../environments/environment';


const BASE_URL = `${environment.api.url}/cards`;

@Injectable()
export class CardService {
  public card: Observable<Card>;

  constructor(private http: Http, private store: Store<any>) {
    this.card = store.select<Card>('card');
  }

  private getCurrentQuotation(): Quotation {
    let quotation: Quotation;
    this.store.take(1).subscribe(s => quotation = s.quotation);
    return quotation;
  }

  public getCreatedCard() {
    let quotation: Quotation = this.getCurrentQuotation();

    return this.http.get(`${BASE_URL}?quotationUuid=${quotation.uuid}`)
      .timeout(environment.api.timeout)
      .map((response: Response) => response.json())
      .map(response => ({ type: 'UPDATE_CARD', payload: response.card }))
      .do(action => this.store.dispatch(action));
  }
}
