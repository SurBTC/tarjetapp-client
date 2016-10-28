import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { CreationStateService } from '../creation-state.service';
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

	constructor(
		private creationStateService:CreationStateService,
		private apiService:ApiService) {
		// Subscribe to changes on creation state

		this.creationStateSubscription = creationStateService.statusUpdates.subscribe(newState => {
      if (newState === 'creation') {
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
        })
      }
    })
	}
}
