import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'deposit-confirm',
  templateUrl: './deposit-confirm.component.html',
  styleUrls: ['./deposit-confirm.component.css'],
})
export class DepositConfirmComponent {
  @Input() sourceAmount:number;
  @Input() emailAddress:string;

  private changingMail: boolean = false;

  toggleIntentMail() {
  	this.changingMail = !this.changingMail;
  }

  confirmChangeMail() {
  	this.changingMail = false;
  }

  resendMail() {
  	console.log("resending mail to...");
  }
}
