import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuotationFormComponent } from './quotation-form/quotation-form.component';
import { ExecutionFormComponent } from './execution-form/execution-form.component';
import { ExecutionFormModule } from './execution-form/execution-form.module';

@NgModule({
  declarations: [
    AppComponent,
    QuotationFormComponent,
    ExecutionFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule,
    ExecutionFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
