import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { 
  NotFoundComponent, DashboardComponent
} from '../components/';

const routes: Routes = [
  /*
    route for dashboard
  */
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  
  /*
    not found route
  */
  { path: '**', component: NotFoundComponent, data: { title: '404' } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})

export class MainRoutingModule {}
