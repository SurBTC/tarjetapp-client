import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { CreationFee, Simulation, Quotation, User } from '../shared/models';

@Injectable()
export class ApiService {

  headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  apiUrl: string = 'http://localhost:3030/quotations'

  constructor(private http: Http) {}

  private post(data:any) {
    return this.http.post(this.apiUrl, data, { headers: this.headers })
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

  public getCreationFee() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          amount: 1000,
          currency: 'CLP'
        })
      }, 500)
    })
  }

  public getSimulation(destinationAmount, destinationCurrency):Promise<Simulation> {
    // TODO: implement
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let now = new Date();
        resolve({
          sourceAmount: destinationAmount * 670,
          sourceCurrency: 'CLP',
          destinationAmount: destinationAmount,
          destinationCurrency: destinationCurrency,
          updatedAt: now,
          expiresAt: new Date(now.getTime() + 15 * 60000)
        } as Simulation);
      }, 1000)
    });
  }

  public getQuotation(destinationAmount, destinationCurrency):Promise<Quotation> {
    // return this.post( { amount: destinationAmount })
    // .delay(10000)
    // .toPromise()
    // .then(response => this.checkForError(response))
    // .then(response => {

    //   let data = response.json();

    //   console.log(data);

    //   return {
    //     quotation: {
    //       id: data.quotation.id,
    //       sourceAmount: data.quotation.sourceAmount,
    //       sourceCurrency: data.quotation.sourceCurrency,
    //       destinationAmount: destinationAmount,
    //       destinationCurrency: 'USD',
    //       expiresAt: data.quotation.expiresAt
    //     },
    //     fee: data.fee
    //   }
    // })
    // .catch(this.handleError);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let now = new Date();
        resolve({
          uuid: Math.floor(Math.random()*1000).toString(),
          sourceAmount: destinationAmount * 675,
          sourceCurrency: 'CLP',
          destinationAmount: destinationAmount,
          destinationCurrency: destinationCurrency,
          updatedAt: now,
          expiresAt: new Date(now.getTime() + 15 * 60000)
        } as Quotation);
      }, 1000)
    });
  }

  public createCard() {
    return new Promise((resolve, reject) => {
      setTimeout(function(){
        resolve({
          success: true,
          msg: 'Card created successfully'
        })
      }, 1000);
    })
  }
}
