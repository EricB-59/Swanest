import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponentComponent } from './landing-info/welcome-component/welcome-component.component';
import { InfoComponentComponent } from './landing-info/info-component/info-component.component';
import { FooterComponentComponent } from './landing-info/footer-component/footer-component.component';
import { HeaderComponentComponent } from './landing-info/header-component/header-component.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponentComponent,
    InfoComponentComponent,
    FooterComponentComponent,
    HeaderComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent]
})
export class AppModule { }
