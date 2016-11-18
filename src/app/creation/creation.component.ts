import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { ServiceState } from '../shared/models';

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

  public warningMins = 10;

  private closeResult: string;
  private mainProcessTask:Observable<any>;
  private simulationState: Observable<ServiceState>;

  constructor(
    private store: Store<any>,
    private modalService: NgbModal) {

    // Get first status and subscribe to changes on main process
    this.mainProcessTask = store.select('mainProcess');
    this.simulationState = this.store.select<ServiceState>('simulationState');
  }

  open(content) {
    this.modalService.open(content).result
      .then(
        result => this.closeResult = `Closed with: ${result}`,
        reason => this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      );
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
