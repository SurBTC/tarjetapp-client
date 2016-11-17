import { Component, OnInit, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { CreationComponent } from '../creation/creation.component';

import { ModelsService } from '../shared/models.service';
import { SimulationService } from '../shared/simulation.service';

import { ServiceState } from '../shared/models';

import { CreationFee, Simulation, Quotation, User, ApiResponse } from '../shared/models';

@Component({
  selector: 'quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
  providers: []
})
export class QuotationComponent implements OnInit, AfterViewInit {

  private quotationForm: FormGroup;

  private mainProcessTask;
  private simulation: Observable<Simulation>;
  private simulationState: Observable<ServiceState>;
  private user: Observable<User>;

  private simulationSourceAmount: number;
  private creationFeeAmount: number;
  private creationFeeExpiresAt: Date;
  @ViewChild('userName') input: ElementRef;


  constructor (
    private modelsService: ModelsService,
    private simulationService: SimulationService,
    private fb: FormBuilder,
    private renderer:Renderer,
    private store: Store<any>) {

    this.mainProcessTask = store.select('mainProcess');
    this.simulation = store.select<Simulation>('simulation');
    this.simulationState = store.select<ServiceState>('simulationState');
    this.user = store.select<User>('user');

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
          this.updateSimulation(destinationAmount)
        }
      });

    // Subscribe to changes on userName control
    this.quotationForm.controls['userName']
      .valueChanges
      .debounceTime(1000)
      .map(userName => this.splitUserName(userName))
      .subscribe(userName => this.store.dispatch({ type: 'UPDATE_USER', payload: userName}));

    // Subscribe to changes to simulation
    this.simulation
      .filter(res => res.destinationAmount !== null)
      .subscribe(simulation => {
        this.simulationSourceAmount = simulation.sourceAmount;
        this.creationFeeAmount = simulation.creationFeeAmount;
        if (this.creationFeeAmount !== undefined) {
          this.store.dispatch({ type: 'SIMULATION_LOADED' });
          this.quotationForm.controls['sourceAmount'].setValue((this.simulationSourceAmount + this.creationFeeAmount).toFixed(0), { emitEvent: false });
          this.quotationForm.controls['destinationAmount'].setValue(simulation.destinationAmount, { emitEvent: false })
        }
      });

    // Subscribe to changes on the form to update validity
    this.quotationForm.valueChanges
      .distinct()
      .subscribe(() => {
        this.quotationForm.valid ?
          this.store.dispatch({ type: 'SIMULATION_VALID' }) :
          this.store.dispatch({ type: 'SIMULATION_INVALID' })
      });

    // update userName input on user changes
    this.user
      .map(user => user.firstName + (user.firstName && user.lastName ? ' ' : '') + user.lastName)
      .subscribe(userName => {
        console.log(userName);
        this.quotationForm.patchValue({ userName })
      });
  }

  updateSimulation (destinationAmount:number): void {
    // Reset form status vars
    this.store.dispatch({ type: 'SIMULATION_LOADING' });
    this.simulationSourceAmount = undefined;
    this.simulationService.updateSimulation(destinationAmount);
  }

  splitUserName (userName: string) {
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
    return { firstName, lastName }
  }

  openCreateView() {
    // this.store.dispatch({ type: 'CREATION_VIEW' });
  }

  ngOnInit() {
    // Update sourceAmount with default value
    this.updateSimulation(this.quotationForm.value.destinationAmount);
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
