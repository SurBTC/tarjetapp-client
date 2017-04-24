import { Component, OnInit, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { SimulationService } from '../shared/simulation.service';

import { ServiceState, Simulation, User } from '../shared/models';

const MAX_AMOUNT = 500;

@Component({
  selector: 'simulation-form',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css'],
  providers: []
})
export class SimulationComponent implements OnInit, AfterViewInit {

  private simulationForm: FormGroup;

  private mainProcessTask;
  private simulation: Observable<Simulation>;
  private simulationState: Observable<ServiceState>;
  private user: Observable<User>;

  private simulationSourceAmount: number;
  private creationFeeAmount: number;
  @ViewChild('userName') input: ElementRef;


  constructor (
    private simulationService: SimulationService,
    private fb: FormBuilder,
    private renderer: Renderer,
    private store: Store<any>) {

    this.mainProcessTask = store.select('mainProcess');
    this.simulation = store.select<Simulation>('simulation');
    this.simulationState = store.select<ServiceState>('simulationState');
    this.user = store.select<User>('user');

    this.simulationForm = fb.group({
      'sourceAmount': [{value: null, disabled: true}, []],
      'destinationAmount': [10, [Validators.required, this.validAmount]],
      'userName': ['', []],
      'hasAccount': [false, [this.hasAccount]]
    });

    // subscribe to changes on destinationAmount control
    this.simulationForm.controls['destinationAmount']
      .valueChanges
      .distinctUntilChanged()
      .do(destinationAmount => {
        destinationAmount > MAX_AMOUNT ?
          this.store.dispatch({ type: 'SIMULATION_EXCEEDS_MAX' }) :
          this.store.dispatch({ type: 'SIMULATION_BELOW_MAX' });
      })
      .debounceTime(500)
      .subscribe(destinationAmount => {
        this.simulationForm.patchValue({ 'sourceAmount': null });
        if (this.simulationForm.controls['destinationAmount'].valid) {
          this.updateSimulation(destinationAmount);
        }
      });

    // Subscribe to changes on userName control
    this.simulationForm.controls['userName']
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

          this.simulationForm.controls['sourceAmount']
            .setValue((this.simulationSourceAmount).toFixed(0), { emitEvent: false });

          this.simulationForm.controls['destinationAmount']
            .setValue(simulation.destinationAmount, { emitEvent: false });
        }
      });

    // Subscribe to changes on the form to update validity
    this.simulationForm.valueChanges
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.simulationForm.valid) {
          this.store.dispatch({ type: 'SIMULATION_INVALID' });
        } else if (this.simulationForm.valid &&
            this.simulationForm.controls['destinationAmount'].value <= MAX_AMOUNT) {
          this.store.dispatch({ type: 'SIMULATION_VALID' });
        }
      });

    // update userName input on user changes
    this.user
      .map(user => user.firstName + (user.firstName && user.lastName ? ' ' : '') + user.lastName)
      .subscribe(userName => {
        this.simulationForm.patchValue({ userName });
      });
  }

  updateSimulation (destinationAmount: number): void {
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
      } else {
        let splitPos = Math.floor(names.length / 2);
        firstName = names.slice(0, splitPos).join(' ');
        lastName = names.slice(splitPos, names.length).join(' ');
      }
    }
    return { firstName, lastName };
  }

  ngOnInit() {
    // Update sourceAmount with default value
    this.updateSimulation(this.simulationForm.value.destinationAmount);
  }

  ngAfterViewInit() {
    // Set focus on userName input
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }, 500);
  }

  toggleHasAccount() {
    this.simulationForm.controls['hasAccount'].setValue(!this.simulationForm.controls['hasAccount'].value);
  }

  validAmount(control: FormControl) {
    let value = control.value;
    if (isNaN(value) || (value <= 0)) {
      return { invalidAmount: true };
    }
  }

  hasAccount(control: FormControl) {
    if (control.value !== true) {
      return { hasAccount: true };
    }
  }
}
