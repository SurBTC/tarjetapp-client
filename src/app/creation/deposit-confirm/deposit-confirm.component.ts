import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { QuotationService } from '../../shared/quotation.service';

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

  private state:string;

  constructor(
    private quotationService: QuotationService,
    private store: Store<any>) {

    this.mainProcessTask = store.select('mainProcess');
    this.user = this.store.select<User>('user');
    this.quotation = this.store.select<Quotation>('quotation');
    this.simulation = this.store.select<Simulation>('simulation');

    // Subscribe to changes to creation state
    this.mainProcessTask.subscribe(newState => {
      if (newState === 'GET_DEPOSIT') {
        this.state = 'CONFIRMING';

        // Quote card creation and top-up
        this.quotationService.createQuotation()
          .catch(err => {
            return Observable.empty();
          })
          .subscribe(quotation => this.state = 'CONFIRMED');
      }
    });
  }

  submitForm() {
    console.log(this.quotation)
    this.store.dispatch({ type: 'NEXT_PROCESS_TASK' });
  }
}
