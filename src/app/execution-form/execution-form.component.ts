import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AmountService }   from '../amount.service';
import { Subscription } from 'rxjs/Subscription';
import { QuotationService } from '../quotation.service';

import { Observable } from 'rxjs/Rx';

// import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert/alert.module'


@Component({
  selector: 'execution-form',
  templateUrl: './execution-form.component.html',
  styleUrls: ['./execution-form.component.css'],
  providers: [QuotationService]
})
export class ExecutionFormComponent {

  destinationAmount:number;
  sourceAmount:number;
  subscription:Subscription;

  expirationDate:Date;
  expirationObj = {
    secs: null,
    mins: null
  };

  expired:boolean = false;

  quotationConfirmed = false;

  private greetings = ['Súper', 'Excelente', 'Bien']
  public currentGreet:string;
  public state = 'gettingData';

  constructor(
    private amountService:AmountService,
    private quotationService:QuotationService) {

    this.subscription = this.amountService.amountStream
       .subscribe((amount:number) => {
         // On change do:

         // Update component status
         this.quotationConfirmed = false;
         this.destinationAmount = amount;

         // Retrieve the quotation
         this.quotationService.getQuotation(amount)
         .then(quotation => {

           // Parse the quotation and check if is valid
           this.sourceAmount = quotation.sourceAmount;
           this.quotationConfirmed = true;
           this.expirationDate = new Date(quotation.expiresAt);
           this.expired = ((this.expirationDate.getTime() - new Date().getTime()) <= 0)
         })

         // Subscribe a timer to update component valid
         Observable.interval(1000)
         .subscribe(() => {
           let timeLeft = this.expirationDate.getTime() - new Date().getTime();
           this.expired = (timeLeft <= 0);
           if (!this.expired) {
             this.expirationObj.secs = Math.floor(timeLeft/1000);
             this.expirationObj.mins = Math.floor(this.expirationObj.secs/60);
           }
         });
       });
  }

  updateState() {
    if (this.state == 'gettingData') {
      this.state = 'confirming';
    } else if (this.state == 'confirming') {
      this.state = 'creating';
    } else if (this.state == 'creating') {
      this.state = 'gettingData';
    }
  }

  resetState() {
    this.state = 'gettingData';
  }

  ngOnInit() {
    this.currentGreet = this.greetings[Math.floor(Math.random() * this.greetings.length)]
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}
