import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { SimulationState } from '../shared/simulation-state.reducer';

import { ModelsService } from '../shared/models.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  private closeResult: string;
  private simulationState: Observable<SimulationState>;

  constructor(
    private store: Store<any>,
    private modalService: NgbModal) {
    this.currentGreet = this.greetings[Math.floor(Math.random() * this.greetings.length)];

    // Get first status and subscribe to changes on main process
    this.mainProcessTask = store.select('mainProcess');
    this.simulationState = this.store.select<SimulationState>('simulationState');
  }

  open(content) {
    this.modalService.open(content).result.then(result => {
      console.log(result);
    })
  }

  closeCreateView() {
    this.store.dispatch({ type: 'SIMULATION_VIEW' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
