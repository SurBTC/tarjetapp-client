import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { QuotationComponent } from './quotation/quotation.component';

import { ApiService } from './shared/api.service';
import { QuotationService } from './shared/quotation.service'
// import { ExecutionFormComponent } from './execution-form/execution-form.component';
// import { ExecutionFormModule } from './execution-form/execution-form.module';


@NgModule({
  declarations: [
    AppComponent,
    QuotationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    ApiService,
    QuotationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
