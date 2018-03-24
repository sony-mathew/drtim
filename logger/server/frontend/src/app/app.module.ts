import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { 
  MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule,
  MatListModule, MatTableModule, MatProgressSpinnerModule, MatInputModule, MatSelectModule,
  MatDialogModule, MatSnackBarModule, MatTabsModule, MatSlideToggleModule, MatTooltipModule,
  MatExpansionModule
} from '@angular/material';

import { MainRoutingModule } from './routes/main-routing.module';

import { LogEntryComponent } from './components';
import { AppComponent } from './components/';
import { AllComponents } from './components/';

import { AllServices } from './services/';
import { AllPipes } from './pipes/';

@NgModule({
  declarations: [
    ...AllComponents, ...AllPipes,
    AppComponent
  ],
  imports: [
    BrowserModule,
    MainRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,

    /* angular material modules */
    MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule,
    MatListModule, MatTableModule, MatProgressSpinnerModule, MatInputModule, 
    MatSelectModule, MatDialogModule, MatSnackBarModule, MatTabsModule, MatSlideToggleModule,
    MatTooltipModule, MatExpansionModule
  ],
  providers: [
    ...AllServices,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [LogEntryComponent]
})
export class AppModule { }
