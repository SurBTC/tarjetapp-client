import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'bank-form',
  templateUrl: './bank-form.component.html',
  styleUrls: ['./bank-form.component.css'],
})
export class BankFormComponent {
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
