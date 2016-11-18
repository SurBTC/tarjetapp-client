import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { ApiService } from '../../shared/api.service';
import { ModelsService } from '../../shared/models.service';

import { Simulation, CreationFee, Quotation, User } from '../../shared/models';

@Component({
  selector: 'deposit-confirm',
  templateUrl: './deposit-confirm.component.html',
  styleUrls: [
    './deposit-confirm.component.css',
    '../creation.component.css'
  ],
})
export class DepositConfirmComponent {
  @Input() sourceAmount:number;
  @Input() emailAddress:string;

  private creationStateSubscription: Subscription;
  private userSubscription: Subscription;
  private quotationSubscription: Subscription;

  private quotation: Quotation;
  private user: User;
  private fee:number;

  private mainProcessTask: Observable<any>;

  private state:string;

  constructor(
    private apiService: ApiService,
    private modelsService:ModelsService,
    private store: Store<any>) {

    this.mainProcessTask = store.select('mainProcess');
    this.quotation = modelsService.quotationSource.getValue();
    this.user = modelsService.userSource.getValue();


    // Subscribe to changes to creation state
    this.mainProcessTask.subscribe(newState => {
      if (newState === 'GET_DEPOSIT') {
        this.state = 'confirming';

        // Quote card creation and top-up
        Promise.all([
          this.apiService.getCreationFee(),
          this.apiService.getQuotation(this.quotation.destinationAmount, 'CLP')
          ])
        .then(result => {
          let creationFee = <CreationFee> result[0];
          let quotation = <Quotation> result[1];

          this.state = 'confirmed';
          console.log('Updating real quotation from api')
          modelsService.updateQuotation(quotation);
          this.fee = creationFee.amount;
        })
      }
    });

    // Subscribe to changes to quotation
    modelsService.quotationUpdates.subscribe(quotation => {
      this.quotation = quotation;
    });

    // Subscribe to changes to user
    modelsService.userUpdates.subscribe(user => {
      this.user = user;
    })

  }

  submitForm() {
    console.log(this.quotation)
    this.store.dispatch({ type: 'NEXT_PROCESS_TASK' });
  }

  stepBack() {
    this.store.dispatch({ type: 'PREVIOUS_PROCESS_TASK' });
  }
}
