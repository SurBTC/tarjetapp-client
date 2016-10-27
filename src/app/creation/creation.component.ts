import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { ModelsService } from '../shared/models.service';
import { CreationStateService } from './creation-state.service';

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
  private stateSubscription:Subscription;

  expirationDate:Date;
  timeLeft = {
    secs: null,
    mins: null
  };

  expired:boolean = false;

  quotationConfirmed = false;

  public greetings = ['Súper', 'Excelente', 'Bien']
  public currentGreet:string;
  public state:string;
  public warningMins = 10;

  constructor(private creationStateService:CreationStateService) {
    this.currentGreet = this.greetings[Math.floor(Math.random() * this.greetings.length)]

    // Get first status and subscribe to changes on creationStatusService
    this.state = creationStateService.getState();

    this.stateSubscription = this.creationStateService.statusUpdates.subscribe(state => {
      this.state = state;
    })

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
