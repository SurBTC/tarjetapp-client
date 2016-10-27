import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { ModelsService } from '../shared/models.service';

import { Observable } from 'rxjs/Rx';



@Component({
  selector: 'creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css'],
  providers: []
})
export class CreationComponent {

  destinationAmount:number;
  sourceAmount:number;
  subscription:Subscription;

  expirationDate:Date;
  timeLeft = {
    secs: null,
    mins: null
  };

  expired:boolean = false;

  quotationConfirmed = false;

  public greetings = ['Súper', 'Excelente', 'Bien']
  public currentGreet:string;
  public state = 'data';
  public warningMins = 10;

  constructor() {
    this.currentGreet = this.greetings[Math.floor(Math.random() * this.greetings.length)]

    // this.subscription = this.amountService.amountStream
    //    .subscribe((amount:number) => {
    //      // On change do:

    //      // Update component status
    //      this.quotationConfirmed = false;
    //      this.destinationAmount = amount;

    //      // Retrieve the quotation
    //      this.quotationService.getQuotation(amount)
    //      .then(quotation => {

    //        // Parse the quotation and check if is valid
    //        this.sourceAmount = quotation.sourceAmount;
    //        this.quotationConfirmed = true;
    //        this.expirationDate = new Date(quotation.expiresAt);
    //        this.expired = ((this.expirationDate.getTime() - new Date().getTime()) <= 0)
    //      })

    //      // Subscribe a timer to update component valid
    //      Observable.interval(1000)
    //      .subscribe(() => {
    //        let timeLeft = this.expirationDate.getTime() - new Date().getTime();
    //        this.expired = (timeLeft <= 0);
    //        if (!this.expired) {
    //          this.timeLeft.secs = Math.floor(timeLeft/1000);
    //          this.timeLeft.mins = Math.floor(this.timeLeft.secs/60);
    //          console.log(this.timeLeft);
    //        }
    //      });
    //    });
  }

  updateState() {
    if (this.state == 'data') {
      this.state = 'deposit';
    } else if (this.state == 'deposit') {
      this.state = 'creating';
    } else if (this.state == 'creating') {
      this.state = 'data';
    }
  }

  resetState() {
    this.state = 'data';
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    // this.subscription.unsubscribe();
  }
}
