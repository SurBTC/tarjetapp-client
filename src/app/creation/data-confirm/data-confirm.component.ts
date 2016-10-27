import { Component, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { NgbDatepickerConfig, NgbDateStruct, NgbTypeaheadConfig, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateES_CLParserFormatter } from '../../shared/es_CL-ngb-date-parser'
import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { RutValidator } from 'ng2-rut';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { cities } from '../../shared/CL-cities';

import { ModelsService } from '../../shared/models.service';
import { CreationStateService } from '../creation-state.service';

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
  private subscription: Subscription;
  @ViewChild('firstName') input: ElementRef;


  constructor (
    private fb:FormBuilder,
    private renderer:Renderer,
    private datePickerConfig:NgbDatepickerConfig,
    private rutValidator:RutValidator,
    private modelsService:ModelsService,
    private creationStateService:CreationStateService) {

    datePickerConfig.minDate = { year: 1910, month: 3, day: 1 };
    datePickerConfig.maxDate = { year: 1998, month: 11, day: 30 };

    let emailRegex = `([a-zA-Z0-9_.]{1}[a-zA-Z0-9_.]*)((@[a-zA-Z]{2}[a-zA-Z]*)[\\\.]([a-zA-Z]{2}|[a-zA-Z]{3}))`;
    let dateRegex = `^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$`;
    let zipCodeRegex = `[0-9]{6,8}`
    let phoneRegex = `[0-9]{8,10}`

    this.userForm = fb.group({
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', [Validators.required, Validators.minLength(2)]],
      'email': ['', [Validators.required, Validators.pattern(emailRegex)]],
      'birthDate': ['', [Validators.required]],
      'address': ['', [Validators.required, Validators.minLength(5)]],
      'city': ['', [Validators.required]],
      'zipCode': ['', [Validators.required, Validators.pattern(zipCodeRegex)]],
      'phone': ['', [Validators.required, Validators.pattern(phoneRegex)]],
      'country': [{value: 'Chile', disabled: true}, [Validators.required]],
      'rut': ['', [Validators.minLength(8), Validators.maxLength(9), rutValidator]]
    });

    // Subscribe to changes on user service
    this.subscription = this.modelsService.userUpdates.subscribe(user => {
      this.userForm.patchValue(user);
    });

    // Subscribe userService to changes on form controls:
    // subscribeServicetoChanges() {
    //   for (let fieldName in this.userForm.controls) {
    //     this.userForm.controls[fieldName]
    //     .valueChanges
    //     .subscribe(value => {
    //       this.modelsService.patchUser({[fieldName]: value})
    //     })
    //   }
    // }
  }

  ngAfterViewInit () {
    // Set focus on firstName on modal show. Requires a slight delay
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }, 500)
  }

  search (text: Observable<string>) {
    return text
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : cities.filter(v => new RegExp(term, 'gi').test(v)).splice(0, 5));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submitForm() {
    // Publish changes to models
    this.modelsService.patchUser(this.userForm.value);

    // Update creation process status
    this.creationStateService.updateState('deposit');
  }
}
