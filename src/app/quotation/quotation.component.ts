import { Component, OnInit, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { CreationComponent } from '../creation/creation.component';

import { ModelsService } from '../shared/models.service';
import { ApiService }   from '../shared/api.service';

import { CreationFee, Simulation, Quotation, User, ApiResponse } from '../shared/models';



@Component({
  selector: 'quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
  providers: []
})
export class QuotationComponent implements OnInit, AfterViewInit {
  quotationForm: FormGroup;
  private loading: boolean;
  private error: boolean;
  private editable: boolean;
  private mainProcessTask;
  @ViewChild('userName') input: ElementRef;

  private subscriptions:Subscription[];

  constructor (
    private modelsService:ModelsService,
    private apiService:ApiService,
    private fb: FormBuilder,
    private renderer:Renderer,
    private store:Store<any>) {

    this.mainProcessTask = store.select('mainProcess')

    this.loading = false;
    this.error = false;

    this.subscriptions = [];

    this.quotationForm = fb.group({
      'sourceAmount': [{value: null, disabled: true}, []],
      'destinationAmount': [null, [Validators.required, this.validAmount]],
      'userName': ['', []],
      'hasAccount': [false, [this.hasAccount]]
    })

    // subscribe to changes on destinationAmount control
    this.quotationForm.controls['destinationAmount']
    .valueChanges
    .debounceTime(300)
    .subscribe(destinationAmount => {
      this.quotationForm.patchValue({ 'sourceAmount': null })
      if (this.quotationForm.controls['destinationAmount'].valid) {
        this.updateSourceAmount(destinationAmount)
      }
      else {
        this.error = false;
      }
    });

    // subscribe to changes on userName control
    this.quotationForm.controls['userName']
    .valueChanges
    .debounceTime(500)
    .subscribe(userName => {
      this.updateUserName(userName);
    })

    // // Subscribe to creation status
    // let creationStateSubscription = creationStateService.statusUpdates.subscribe(newState => {
    //   this.editable = (newState === 'data');
    // })

    // update quotation info on quotation changes
    let quotationSubscription = modelsService.quotationUpdates
    .subscribe(quotation => {
      this.quotationForm.controls['sourceAmount'].setValue(quotation.sourceAmount + modelsService.feeSource.getValue(), { emitEvent: false });
      this.quotationForm.controls['destinationAmount'].setValue(quotation.destinationAmount, { emitEvent: false })
    });

    // update userName on user changes
    let userSubscription = modelsService.userUpdates.subscribe(user => {
      this.quotationForm.patchValue({
        userName: `${user.firstName || ''}${(user.firstName || user.lastName)? ' ': ''}${user.lastName || ''}`
      })
    });

    // Add subscriptions to array for disposal
    this.subscriptions.push(quotationSubscription);
    this.subscriptions.push(userSubscription);
  }

  updateSourceAmount (destinationAmount:number): void {
    // Reset form status vars
    this.loading = true;
    this.error = false

    Promise.all([
      this.apiService.getCreationFee(),
      this.apiService.getSimulation(destinationAmount, 'USD')
    ])
    .then(result =>  {
      let creationFee = <CreationFee> result[0];
      let simulation = <Simulation> result[1];
      console.log('Updating simulation')
      console.log(result);

      // Patch quotation on modelsService
      this.modelsService.patchQuotation({
        sourceAmount: simulation.sourceAmount,
        destinationAmount: simulation.destinationAmount
      })

      this.modelsService.updateFee(creationFee.amount);

      // Update status vars
      this.error = false;
      this.loading = false;

    })
    .catch(err => {
      this.loading = false;
      this.error = true;
    });
  }

  updateUserName (userName: string):void {
    // User name parsing to divide first and last names
    let firstName = '';
    let lastName = '';

    let names = [];

    if (userName !== '') {
      for (let name of userName.split(' ')){
        if (name !== '') {
          names.push(name);
        }
      }
      if (names.length === 1) {
        firstName = names[0];
        lastName = '';
      }
      else {
        let splitPos = Math.floor(names.length / 2)
        firstName = names.slice(0, splitPos).join(' ');
        lastName = names.slice(splitPos, names.length).join(' ');
      }
    }

    this.modelsService.patchUser({
      firstName: firstName || null,
      lastName: lastName || null
    })
  }

  ngOnInit() {
    // Call getQuotation with default values
    this.updateSourceAmount(this.quotationForm.value.destinationAmount);
  }

  ngAfterViewInit() {
    // Set focus on userName input
    // FIXME!
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }, 1000)
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  toggleHasAccount() {
    this.quotationForm.controls['hasAccount'].setValue(!this.quotationForm.controls['hasAccount'].value);
  }

  validAmount(control: FormControl) {
    let value = control.value;
    if (isNaN(value) || (value <= 0) || (value >= 1000)) {
      return { invalidAmount: true }
    }
  }

  hasAccount(control: FormControl) {
    if (control.value !== true) {
      return { hasAccount: true }
    }
  }
}
