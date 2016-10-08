import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'bank-form',
  templateUrl: './bank-form.component.html',
})
export class BankFormComponent {
  @Input() sourceAmount:number
}
