import { Injectable } from '@angular/core';
import { Quotation } from './app.component'
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuotationService {

  headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  api_url: string = 'http://localhost:3030/quotations'

  constructor(private http: Http) {}

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

  getQuotation(amount: number): Promise<Quotation> {
    return this.http.post(this.api_url, {amount: amount}, { headers: this.headers })
    .toPromise()
    .then(response => this.checkForError(response))
    .then(response => {

      let data = response.json().quotation;
      console.log(data);
      let quotation = {
        id: data.id,
        sourceAmount: data.sourceAmount,
        sourceCurrency: data.sourceCurrency,
        destinationAmount: amount,
        destinationCurrency: 'USD',
        expiresAt: data.expiresAt
      };
      return quotation as Quotation;
    })
    .catch(this.handleError);
  }

}
