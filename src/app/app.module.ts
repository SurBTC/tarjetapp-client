import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Rut } from 'ng2-rut';

import { AppComponent } from './app.component';
import { QuotationComponent } from './quotation/quotation.component';
import { CreationComponent } from './creation/creation.component';
import { DataConfirmComponent } from './creation/data-confirm/data-confirm.component';
import { DepositConfirmComponent } from './creation/deposit-confirm/deposit-confirm.component';

import { ApiService } from './shared/api.service';
import { ModelsService } from './shared/models.service'
import { CreationStateService } from './creation/creation-state.service';

import { NgbDateES_CLParserFormatter } from './shared/es_CL-ngb-date-parser';

// import { ExecutionFormComponent } from './execution-form/execution-form.component';
// import { ExecutionFormModule } from './execution-form/execution-form.module';


@NgModule({
  declarations: [
    AppComponent,
    QuotationComponent,
    CreationComponent,
    DataConfirmComponent,
    DepositConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2Rut
  ],
  providers: [
    ApiService,
    ModelsService,
    CreationStateService,
    {
      provide: NgbDateParserFormatter,
      useFactory: () => { return new NgbDateES_CLParserFormatter() }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
