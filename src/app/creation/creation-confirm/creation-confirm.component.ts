import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { ApiService } from '../../shared/api.service';


@Component({
  selector: 'creation-confirm',
  templateUrl: './creation-confirm.component.html',
  styleUrls: [
  	'./creation-confirm.component.css',
  	'../creation.component.css'
	],
  providers: []
})
export class CreationConfirmComponent {
  private creationStateSubscription: Subscription;
  private state:string = ''
  private title: string = 'Creando tu tarjeta';
  private description: string = 'Estamos creando tu tarjeta...';
  private mainProcessTask: Observable<any>;

	constructor(
		private store:Store<any>,
		private apiService:ApiService) {

    this.mainProcessTask = this.store.select('mainProcess');

		// Subscribe to changes to main process state

		this.creationStateSubscription = this.mainProcessTask.subscribe(newState => {
      if (newState === 'GET_CARD') {
        // Submit data for card creation
        this.state = 'creation';
        this.apiService.createCard()
        .then(result => {
        	this.state = 'success'
        	this.title = '¡Tarjeta creada!'
        	this.description = 'Tu tarjeta ha sido creada exitosamente'
        })
        .catch(err => {
        	console.log(err);
        	this.state = 'error'
        	this.title = 'Lo sentimos'
        	this.description = 'Hubo un problema al crear tu tarjeta'
        })
      }
    })
	}
}
