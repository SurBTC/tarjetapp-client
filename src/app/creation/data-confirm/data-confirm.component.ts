import { Component, ViewChild, Renderer, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { NgbDatepickerConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateES_CLParserFormatter } from '../../shared/es_CL-ngb-date-parser';
import { RutValidator } from 'ng2-rut';

import { Observable } from 'rxjs/Observable';

import { localities } from '../../shared/CL-localities';
import { User } from '../../shared/models';
import { UserService } from '../../shared/user.service';


@Component({
  selector: 'data-confirm',
  templateUrl: './data-confirm.component.html',
  styleUrls: [
  '../creation.component.css',
  './data-confirm.component.css'
  ],
  providers: [NgbDateES_CLParserFormatter]
})
export class DataConfirmComponent implements AfterViewInit {

  private userForm: FormGroup;

  private user: Observable<User>;
  private creationTask: Observable<string>;
  private state: string;
  private apiError: boolean;
  private errorMsg: string;

  @Input() ngbModalRef: NgbModalRef;

  @ViewChild('firstName') firstNameInput: ElementRef;

  constructor (
    private fb: FormBuilder,
    private renderer: Renderer,
    private datePickerConfig: NgbDatepickerConfig,
    private rutValidator: RutValidator,
    private store: Store<any>,
    private userService: UserService) {

    this.user = store.select<User>('user');
    this.creationTask = store.select<string>('mainProcess');
    this.apiError = false;
    this.state = 'ACCEPTING_DATA';
    this.errorMsg = ';'

    let now = new Date()

    datePickerConfig.minDate = { year: 1910, month: 3, day: 1 };
    datePickerConfig.maxDate = { year: now.getFullYear() - 18, month: now.getMonth() + 1, day: now.getDate() };

    let emailRegex = `([a-zA-Z0-9_.]{1}[a-zA-Z0-9_.]*)((@[a-zA-Z]{2}[a-zA-Z]*)[\\\.]([a-zA-Z]{2}|[a-zA-Z]{3}))`;
    let dateRegex = `^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$`;
    let zipCodeRegex = `[0-9]{6,8}`;
    let phoneRegex = `[0-9]{8,10}`;

    this.userForm = fb.group({
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', [Validators.required, Validators.minLength(2)]],
      'email': ['', [Validators.required, Validators.pattern(emailRegex)]],
      'birthDate': ['', [Validators.required]],  // TODO: Add regex validation
      'address': ['', [Validators.required, Validators.minLength(5)]],
      'locality': ['', [Validators.required]],  // TODO: Check that locality exists
      'zipCode': ['', [Validators.required, Validators.pattern(zipCodeRegex)]],
      'phone': ['', [Validators.required, Validators.pattern(phoneRegex)]],
      'country': [{value: 'Chile', disabled: true}, [Validators.required]],
      'rut': ['', [Validators.minLength(8), Validators.maxLength(9), rutValidator]]
    });

    // Subscribe to changes on main process task
    this.creationTask
      .filter(newState => newState === 'GET_DATA')
      .subscribe(newState => {
        this.state = 'ACCEPTING_DATA';
      });

    // Subscribe to changes on user
    this.user
      .filter(user => user !== undefined)
      .map(user => {
        if(user.birthDate && user.birthDate.getFullYear) {
          // Convert from Date to datepicker date object:
          return Object.assign(user, {
            birthDate: {
              year: user.birthDate.getFullYear(),
              month: user.birthDate.getMonth() + 1,
              day: user.birthDate.getDate()
            }
          })
        } else {
          return user;
        }
      })
      .subscribe(user => {
        this.userForm.patchValue(user);
      });

    // Update user on form changes
    this.userForm
      .valueChanges
      .map(user => {
        if(this.userForm.value.birthDate && this.userForm.value.birthDate.year) {
          return Object.assign(this.userForm.value, {
          birthDate: new Date(`${this.userForm.value.birthDate.year}-${this.userForm.value.birthDate.month}-${this.userForm.value.birthDate.day}`)
          })
        } else {
          return user;
        }
      })
      .subscribe(user => {
        store.dispatch({ type: 'UPDATE_USER', payload: user });
      });
  }

  ngAfterViewInit(): void {
    // Set focus on firstName input:
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.firstNameInput.nativeElement, 'focus');
    }, 10);
  }

  search (text: Observable<string>) {
    return text
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : localities.filter(v => new RegExp(`^${term}`, 'gi').test(v)).splice(0, 5));
  }

  submitForm() {
    // Post user to API:
    this.state = 'SENDING_DATA';
    this.userService.postUser()
      .catch(err => {
        console.log(err);
        if (err.status === 400) {
          this.errorMsg = `El ${JSON.parse(err._body).errors[0].path} que ingresaste ya se encuentra registrado.`;
        } else {
          this.errorMsg = 'No hemos podido crear tu cuenta. Por favor reintenta más tarde.'
        }
        this.state = 'ACCEPTING_DATA';
        this.apiError = true;  // TODO: Give customer feedback about what went wrong
        return Observable.empty();
      })
      .subscribe(() => this.store.dispatch({ type: 'UPDATE_CREATION_TASK', payload: 'GET_DEPOSIT' }));
  }

  closeModal() {
    this.ngbModalRef.close()
  }
}
