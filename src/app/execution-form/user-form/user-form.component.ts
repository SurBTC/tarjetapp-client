import { Component, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: []
})
export class UserFormComponent implements AfterViewInit {
  public dt:Date = new Date();
  private userForm: FormGroup;
  @ViewChild('firstName') input: ElementRef;

  constructor (
    private fb:FormBuilder,
    private renderer:Renderer) {

    let emailRegex = `([a-zA-Z0-9_.]{1}[a-zA-Z0-9_.]*)((@[a-zA-Z]{2}[a-zA-Z]*)[\\\.]([a-zA-Z]{2}|[a-zA-Z]{3}))`;
    let dateRegex = `^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$`;

    this.userForm = fb.group({
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.pattern(emailRegex)]],
      'birthDate': ['', [Validators.required]],
      'address': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'zipCode': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
      'country': [{value: 'Chile', disabled: true}, [Validators.required]]
    });
  }

  ngAfterViewInit () {
    // Set focus on firstName on modal show
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }, 500)

  }
}
