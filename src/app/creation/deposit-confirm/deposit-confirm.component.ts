import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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

  private changingMail: boolean = false;

  constructor(private creationStateService: CreationStateService) { }

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
