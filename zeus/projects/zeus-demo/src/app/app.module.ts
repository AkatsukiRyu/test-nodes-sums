import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZeusSharedModule } from '../zeus-shared/zeus-shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ZeusSharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
