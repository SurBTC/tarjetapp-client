import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { QuotationService } from '../../shared/quotation.service';
import { CardService } from '../../shared/card.service';

import { Simulation, Quotation, User } from '../../shared/models';

@Component({
  selector: 'deposit-confirm',
  templateUrl: './deposit-confirm.component.html',
  styleUrls: [
    './deposit-confirm.component.css',
    '../creation.component.css'
  ],
})
export class DepositConfirmComponent {

  private quotation: Observable<Quotation>;
  private simulation: Observable<Simulation>;
  private user: Observable<User>;

  private mainProcessTask: Observable<any>;

  private quotationState: string;
  private depositState: string;

  constructor(
    private quotationService: QuotationService,
    private cardService: CardService,
    private store: Store<any>) {

    this.mainProcessTask = store.select('mainProcess');
    this.user = this.store.select<User>('user');
    this.quotation = this.store.select<Quotation>('quotation');
    this.simulation = this.store.select<Simulation>('simulation');

    this.depositState = 'UNKNOWN';

    // Subscribe to changes to creation state
    this.mainProcessTask.subscribe(newState => {
      if (newState === 'GET_DEPOSIT') {
        this.createQuotation();
      }
    });
  }

  createQuotation() {
    // Quote card creation and top-up
    this.quotationState = 'CONFIRMING';
    this.quotationService.createQuotation()
      .catch(err => {
        this.quotationState = 'API_ERROR';
        return Observable.empty();
      })
      .subscribe(quotation => this.quotationState = 'CONFIRMED');
  }

  submitForm() {
    this.depositState = 'UPDATING';
    this.cardService.createCard()
      .subscribe(
        (res:Response) => {
          this.depositState = 'OK'
          this.store.dispatch({ type: 'NEXT_PROCESS_TASK' })
        },
        (res:Response) => {
          (res.status === 402) ? (this.depositState = 'PENDING'): (this.depositState = 'API_ERROR');
          return Observable.empty();
        }
      );
  }
}
