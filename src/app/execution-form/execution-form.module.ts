import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserFormComponent } from './user-form/user-form.component';
import { BankFormComponent } from './bank-form/bank-form.component';
import { DepositFormComponent } from './deposit-form/deposit-form.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
})
export class ExecutionFormModule { }
