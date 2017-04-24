import { Component, OnDestroy, Input } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


import { QuotationService } from '../../shared/quotation.service';
import { CardService } from '../../shared/card.service';

import { Simulation, Quotation, User, Card } from '../../shared/models';

@Component({
  selector: 'deposit-confirm',
  templateUrl: './deposit-confirm.component.html',
  styleUrls: [
    './deposit-confirm.component.css',
    '../creation.component.css'
  ],
})
export class DepositConfirmComponent implements OnDestroy {

  private quotation: Observable<Quotation>;
  private simulation: Observable<Simulation>;
  private user: Observable<User>;
  private card: Observable<Card>;

  private creationTask: Observable<string>;

  private quotationState: string;
  private depositState: string;
  private timeLeft: number;

  private timeSubscription: Subscription;

  @Input() ngbModalRef: NgbModalRef;

  constructor(
    private quotationService: QuotationService,
    private cardService: CardService,
    private store: Store<any>) {

    this.creationTask = store.select<string>('creationTask');
    this.user = this.store.select<User>('user');
    this.quotation = this.store.select<Quotation>('quotation');
    this.simulation = this.store.select<Simulation>('simulation');
    this.card = this.store.select<Card>('card');

    this.depositState = 'UNKNOWN';

    // Subscribe to changes to creation state
    this.creationTask.subscribe(newState => {
      if (newState === 'GET_DEPOSIT') {
        // Set up everything
        let simulation: Simulation;
        let quotation: Quotation;
        let card: Card;

        this.simulation.take(1).subscribe(s => simulation = s);
        this.quotation.take(1).subscribe(q => quotation = q);

        if ((simulation.destinationAmount !== quotation.destinationAmount) || new Date() >= quotation.expiresAt) {
          this.store.take(1).subscribe(s => card = s.card);
          if (!card.uuid) {
            this.createQuotation();
          }
        } else {
          this.quotationState = 'CONFIRMED';
          this.timeLeft = quotation.expiresAt.getTime() - new Date().getTime();
        }
      }
    });

    // Subscribe timeLeft to a timer
    this.timeSubscription = Observable.timer(0, 1000)
      .subscribe(() => {
        this.timeLeft -= 1000;
        if (this.timeLeft <= 0 && this.quotationState !== 'API_ERROR') {
          this.quotationState = 'EXPIRED';
          this.depositState = 'UNKNOWN';
        }
      });

  }

  createQuotation() {
    // Quote card creation and top-up
    this.quotationState = 'CONFIRMING';
    this.depositState = 'UNKNOWN';
    this.quotationService.createQuotation()
      .catch(err => {
        this.quotationState = 'API_ERROR';
        return Observable.empty();
      })
      .subscribe((quotation: Quotation) => {
        this.quotationState = 'CONFIRMED';
        this.timeLeft = quotation.expiresAt.getTime() - new Date().getTime();
      });
  }

  submitForm() {
    this.depositState = 'UPDATING';
    this.cardService.getCreatedCard()
      .catch((response: Response) => {
        switch (response.status) {
          case 400:
            this.depositState = 'API_ERROR';
            break;
          case 404:
            this.depositState = 'API_ERROR';
            break;
          case 402:
            this.depositState = 'PAYMENT_REQUIRED';
            break;
          case 503:
            this.depositState = 'CREATING';
            break;
          default:
            this.depositState = 'API_ERROR';
        }
        return Observable.empty();
      })
      .subscribe((response: Response) => {
        this.depositState = 'OK';
        setTimeout(() => this.store.dispatch({ type: 'UPDATE_CREATION_TASK', payload: 'GET_CARD' }), 1000);
      });
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  closeModal() {
    this.ngbModalRef.close()
  }
}
