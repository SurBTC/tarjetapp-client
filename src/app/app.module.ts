import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';

// NgBootstrap:
import { Ng2Rut } from 'ng2-rut';
import { NgbDateES_CLParserFormatter } from './shared/es_CL-ngb-date-parser';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

// Components:
import { AppComponent } from './app.component';
import { QuotationComponent } from './quotation/quotation.component';
import { CreationComponent } from './creation/creation.component';
import { DataConfirmComponent } from './creation/data-confirm/data-confirm.component';
import { DepositConfirmComponent } from './creation/deposit-confirm/deposit-confirm.component';
import { CreationConfirmComponent } from './creation/creation-confirm/creation-confirm.component';

// Services:
import { ApiService } from './shared/api.service';
import { ModelsService } from './shared/models.service'
import { SimulationService } from './shared/simulation.service';
import { UserService } from './shared/user.service';

// Reducers:
import { MainProcessReducer } from './creation/main-process.reducer';
import { simulation } from './shared/simulation.reducer';
import { simulationState } from './shared/simulation-state.reducer';
import { appView } from './shared/app-view.reducer';
import { user } from './shared/user.reducer';


@NgModule({
  declarations: [
    AppComponent,
    QuotationComponent,
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
    StoreModule.provideStore({
      mainProcess: MainProcessReducer,
      simulation,
      simulationState,
      appView,
      user
    })
  ],
  providers: [
    ApiService,
    ModelsService,
    SimulationService,
    UserService,
    {
      provide: NgbDateParserFormatter,
      useFactory: () => { return new NgbDateES_CLParserFormatter() }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
