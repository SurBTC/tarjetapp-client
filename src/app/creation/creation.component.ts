import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Response } from '@angular/http';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';

import { UserService } from '../shared/user.service';
import { User, Card, Quotation } from '../shared/models';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css'],
  providers: []
})
export class CreationComponent implements AfterViewInit, OnInit {

  destinationAmount: number;
  sourceAmount: number;

  quotationConfirmed = false;

  private creationTask: Observable<string>;
  public ngbModalRef: NgbModalRef;

  @ViewChild('content') content: ElementRef;

  constructor(
    private store: Store<any>,
    private modalService: NgbModal,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService) {

    // Get first status and subscribe to changes on main process
    this.creationTask = store.select<string>('creationTask');
  }

  ngAfterViewInit(): void {
    this.ngbModalRef = this.modalService.open(this.content)

    this.ngbModalRef.result
      .then(
        result => {
          this.location.back();
        },
        reason => {
          this.location.back();
        }
      );
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        // Look for the user on the API and, if exists, load the data and update creation task
        let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (params !== undefined && params['userUuid'] && uuidRegex.test(params['userUuid'])) {
          this.userService.getUser(params['userUuid'])
          .catch((response: Response) => {
            if (response.status === 404) {
              // User doesn't exist
              console.error(`User ${params['userUuid']} not found`);
            }
            return Observable.empty();
          })
          .subscribe((user: User) => {
            // Ok, the user exists. Try to load his card:
            this.userService.getUserCard(params['userUuid'])
            .catch((response: Response) => {
              if (response.status === 404) {
                // User doesn't have a card
                console.log(`No card found for user ${params['userUuid']}`);
                // Do not create a new quotation but retrieve the active one
                this.userService.getActiveQuotation(params['userUuid'])
                .catch((response: Response) => {
                  console.log('No active quotation found');
                  this.store.dispatch({ type: 'UPDATE_CREATION_TASK', payload: 'GET_DEPOSIT' });
                  return Observable.empty();
                })
                .map((quotation: Quotation) => {
                  if (quotation) {
                    this.store.dispatch({ type: 'UPDATE_QUOTATION', payload: quotation });
                  }
                });
              }
              return Observable.empty();
            })
            .subscribe((card: Card) => {
              // A card already exists. Let's go to show it
              this.store.dispatch({ type: 'UPDATE_CREATION_TASK', payload: 'GET_CARD'});
            });
          });
        }
      });
  }
}
