import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { CreationStateService } from '../creation-state.service';

@Component({
  selector: 'deposit-confirm',
  templateUrl: './deposit-confirm.component.html',
  styleUrls: [
    './deposit-confirm.component.css',
    '../creation.component.css'
  ],
})
export class DepositConfirmComponent {
  @Input() sourceAmount:number;
  @Input() emailAddress:string;

  private creationStateSubscription: Subscription;

  private changingMail: boolean = false;

  constructor(private creationStateService: CreationStateService) {
    // Subscribe to changes to creation state
    this.creationStateSubscription = creationStateService.statusUpdates.subscribe(newState => {
      if (newState === 'deposit') {
        console.log('Data was submitted. Now we should create the final quotation')
      }
    })

  }

  toggleIntentMail() {
  	this.changingMail = !this.changingMail;
  }

  confirmChangeMail() {
  	this.changingMail = false;
  }

  resendMail() {
  	console.log("resending mail to...");
  }

  submitForm() {
    this.creationStateService.updateState('creation');
  }
}
