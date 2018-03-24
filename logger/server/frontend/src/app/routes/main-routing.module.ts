import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { 
  NotFoundComponent, DashboardComponent, LogEntryComponent
} from '../components/';

const routes: Routes = [
  /*
    route for dashboard
  */
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },

  /* 
    route for details log
  */

  { path: 'logs/:log_id', component: LogEntryComponent, data: { title: 'LogEntry Show' } },  
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
