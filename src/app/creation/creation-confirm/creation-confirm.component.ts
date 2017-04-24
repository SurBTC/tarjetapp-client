import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Card, Quotation } from '../../shared/models';



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
  private card: Observable<Card>;
  private quotation: Observable<Quotation>;

  private pan: string;

  @Input() ngbModalRef: NgbModalRef;

  constructor(
    private store: Store<any>) {

    this.card = this.store.select<Card>('card');
    this.quotation = this.store.select<Quotation>('quotation');
    this.mainProcessTask = this.store.select('mainProcess');

    this.card.subscribe(card => {
      this.pan = card.pan.split(/(?=(?:....)*$)/).join('-');
    });

  }

  closeModal() {
    this.ngbModalRef.close()
  }
}
