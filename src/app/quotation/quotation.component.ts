import { Component, OnInit, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { CreationComponent } from '../creation/creation.component';

import { ModelsService } from '../shared/models.service';
import { SimulationService } from '../shared/simulation.service';
import { CreationFeeService } from '../shared/creation-fee.service';

import { SimulationState } from '../shared/simulation-state.reducer';

import { CreationFee, Simulation, Quotation, User, ApiResponse } from '../shared/models';

@Component({
  selector: 'quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
  providers: []
})
export class QuotationComponent implements OnInit, AfterViewInit {

  quotationForm: FormGroup;

  private mainProcessTask;
  private simulation: Observable<Simulation>;
  private creationFee: Observable<CreationFee>;
  private simulationState: Observable<SimulationState>;

  private simulationSourceAmount: number;
  private creationFeeAmount: number;
  private creationFeeExpiresAt: Date;
  @ViewChild('userName') input: ElementRef;


  constructor (
    private modelsService: ModelsService,
    private simulationService: SimulationService,
    private creationFeeService: CreationFeeService,
    private fb: FormBuilder,
    private renderer:Renderer,
    private store: Store<any>) {

    this.mainProcessTask = store.select('mainProcess');
    this.simulation = store.select<Simulation>('simulation');
    this.creationFee = store.select<CreationFee>('creationFee');
    this.simulationState = store.select<SimulationState>('simulationState');


    this.quotationForm = fb.group({
      'sourceAmount': [{value: null, disabled: true}, []],
      'destinationAmount': [10, [Validators.required, this.validAmount]],
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
      });

    // Subscribe to changes on userName control
    this.quotationForm.controls['userName']
      .valueChanges
      .debounceTime(1000)
      .subscribe(userName => {
        this.updateUserName(userName);
      });

    // Subscribe to changes to simulation
    this.simulation
      .filter(res => res.destinationAmount !== null)
      .subscribe(simulation => {
        this.simulationSourceAmount = simulation.sourceAmount;
        if (this.creationFeeAmount !== undefined) {
          this.store.dispatch({ type: 'SIMULATION_LOADED' });
          this.quotationForm.controls['sourceAmount'].setValue((this.simulationSourceAmount + this.creationFeeAmount).toFixed(0), { emitEvent: false });
          this.quotationForm.controls['destinationAmount'].setValue(simulation.destinationAmount, { emitEvent: false })
        }
      });

    // Subscribe to changes on creationFee
    this.creationFee
      .filter(res => res !== undefined)
      .subscribe(creationFee => {
        this.creationFeeAmount = creationFee.amount;
        this.creationFeeExpiresAt = creationFee.expiresAt;
        if (this.simulationSourceAmount !== undefined) {
          this.store.dispatch({ type: 'SIMULATION_LOADED' });
          this.quotationForm.controls['sourceAmount'].setValue((this.simulationSourceAmount + this.creationFeeAmount).toFixed(0), { emitEvent: false });
        }
      });

    // update userName on user changes
    let userSubscription = modelsService.userUpdates.subscribe(user => {
      this.quotationForm.patchValue({
        userName: `${user.firstName || ''}${(user.firstName && user.lastName)? ' ': ''}${user.lastName || ''}`
      })
    });
  }

  updateSourceAmount (destinationAmount:number): void {
    // Reset form status vars
    this.store.dispatch({ type: 'SIMULATION_LOADING' });

    this.simulationSourceAmount = undefined;
    if (this.creationFeeAmount && this.creationFeeExpiresAt < new Date()) {
      this.creationFeeAmount = undefined;
    }

    this.simulationService.updateSimulation(destinationAmount);
    if (this.creationFeeAmount === undefined) {
      this.creationFeeService.updateCreationFee();
    }
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

  openCreateView() {
    this.store.dispatch({ type: 'CREATION_VIEW' });
  }

  ngOnInit() {
    // Update sourceAmount with default values (see FormGroup)
    this.updateSourceAmount(this.quotationForm.value.destinationAmount);
  }

  ngAfterViewInit() {
    // Set focus on userName input
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }, 500)
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
