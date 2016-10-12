import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserFormComponent } from './user-form/user-form.component';
import { BankFormComponent } from './bank-form/bank-form.component';
import { DepositFormComponent } from './deposit-form/deposit-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateES_CLParserFormatter } from '../shared/es_CL-ngb-date-parser'
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    UserFormComponent,
    BankFormComponent,
    DepositFormComponent
  ],
  exports: [
    UserFormComponent,
    BankFormComponent,
    DepositFormComponent
  ],
  providers: [
    { 
      provide: NgbDateParserFormatter, 
      useFactory: () => { return new NgbDateES_CLParserFormatter() } 
    }
  ]

})
export class ExecutionFormModule { }
