import { NgModule }       from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreationComponent } from './creation/creation.component';

const routes: Routes = [
  { path: 'create', component: CreationComponent },
  { path: 'create/user/:userUuid', component: CreationComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
