import { Component, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateStruct, NgbTypeaheadConfig, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateES_CLParserFormatter } from '../../shared/es_CL-ngb-date-parser'
import { NgbDatepickerService } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const cities = [
  'Santiago',
  'Concepción',
  'Valparaíso',
  'La Serena',
  'Temuco',
  'Antofagasta',
  'Iquique',
  'Rancagua',
  'Puerto Montt',
  'Talca',
  'Arica',
  'Chillán',
  'Los Ángeles',
  'Copiapó',
  'Quillota',
  'Valdivia',
  'Osorno',
  'San Antonio',
  'Curicó',
  'Calama',
  'Punta Arenas',
  'Colina',
  'Melipilla',
  'Ovalle',
  'Linares',
  'Peñaflor',
  'Lampa',
  'Buin',
  'San Fernando',
  'San Felipe',
  'Paine',
  'Talagante',
  'Los Andes',
  'Coyhaique',
  'Rengo',
  'Vallenar',
  'Villarrica',
  'San Carlos',
  'Angol'
 ]


@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [
    NgbDateES_CLParserFormatter,
  ]
})
export class UserFormComponent implements AfterViewInit {
  public dt:Date = new Date();
  private userForm: FormGroup;
  @ViewChild('firstName') input: ElementRef;

  constructor (
    private fb:FormBuilder,
    private renderer:Renderer,
    private config:NgbDatepickerConfig) {

    config.startDate = {year: 1990, month: 3}

    let emailRegex = `([a-zA-Z0-9_.]{1}[a-zA-Z0-9_.]*)((@[a-zA-Z]{2}[a-zA-Z]*)[\\\.]([a-zA-Z]{2}|[a-zA-Z]{3}))`;
    let dateRegex = `^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$`;
    let zipCodeRegex = `[0-9]{6-8}`

    this.userForm = fb.group({
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.pattern(emailRegex)]],
      'birthDate': ['', [Validators.required, Validators.pattern(dateRegex)]],
      'address': ['', [Validators.required, Validators.minLength(5)]],
      'city': ['', [Validators.required]],
      'zipCode': ['', [Validators.required, Validators.pattern(zipCodeRegex)]],
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

  search (text: Observable<string>) {
    return text
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : cities.filter(v => new RegExp(term, 'gi').test(v)).splice(0, 10));
  }
}
