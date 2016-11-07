import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { ModelsService } from '../shared/models.service';


@Component({
  selector: 'creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css'],
  providers: []
})
export class CreationComponent {

  destinationAmount:number;
  sourceAmount:number;

  quotationConfirmed = false;

  public greetings = ['Súper', 'Excelente', 'Bien']
  public currentGreet:string;
  public mainProcessTask:Observable<any>;
  public warningMins = 10;

  constructor(private store: Store<any>) {
    this.currentGreet = this.greetings[Math.floor(Math.random() * this.greetings.length)];

    // Get first status and subscribe to changes on main process
    this.mainProcessTask = store.select('mainProcess');
  }

  closeCreateView() {
    this.store.dispatch({ type: 'SIMULATION_VIEW' });
  }
}
