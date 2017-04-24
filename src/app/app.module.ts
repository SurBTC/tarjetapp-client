import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// NgBootstrap:
import { Ng2Rut } from 'ng2-rut';
import { esCLDateParserFormatterFactory } from './shared/es_CL-ngb-date-parser';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

// Components:
import { AppComponent } from './app.component';
import { SimulationComponent } from './simulation/simulation.component';
import { CreationComponent } from './creation/creation.component';
import { DataConfirmComponent } from './creation/data-confirm/data-confirm.component';
import { DepositConfirmComponent } from './creation/deposit-confirm/deposit-confirm.component';
import { CreationConfirmComponent } from './creation/creation-confirm/creation-confirm.component';

// Services:
import { SimulationService } from './shared/simulation.service';
import { UserService } from './shared/user.service';
import { QuotationService } from './shared/quotation.service';
import { CardService } from './shared/card.service';

// Reducers:
import { creationTask } from './creation/creation-task.reducer';
import { simulation } from './shared/simulation.reducer';
import { simulationState } from './shared/simulation-state.reducer';
import { user } from './shared/user.reducer';
import { quotation } from './shared/quotation.reducer';
import { card } from './shared/card.reducer';

// Routing:
import { AppRoutingModule } from './app-routing.module';

// Environment variables:
import { environment } from '../environments/environment';

let devImports = [];

// Include conditional import for dev environment
if (!environment.production) {
  devImports.push(StoreDevtoolsModule.instrumentOnlyWithExtension());
}

export const rootReducer = {
  creationTask,
  simulation,
  simulationState,
  user,
  quotation,
  card
};

@NgModule({
  declarations: [
    AppComponent,
    SimulationComponent,
    CreationComponent,
    DataConfirmComponent,
    DepositConfirmComponent,
    CreationConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2Rut,
    StoreModule.provideStore(rootReducer),
    AppRoutingModule,
    ...devImports
  ],
  providers: [
    SimulationService,
    UserService,
    {
      provide: NgbDateParserFormatter,
      useFactory: esCLDateParserFormatterFactory
    },
    QuotationService,
    CardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

