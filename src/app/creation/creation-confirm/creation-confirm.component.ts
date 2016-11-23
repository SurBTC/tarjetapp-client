import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';

import { Quotation } from '../../shared/models';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


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
  private mainProcessTask: Observable<any>;
  private quotation: Observable<Quotation>;

	constructor(
		private store:Store<any>,
    private modalService: NgbModal) {

    this.mainProcessTask = this.store.select('mainProcess');
    this.quotation = this.store.select<Quotation>('quotation');

	}

  closeModal()
  {

  }
}
