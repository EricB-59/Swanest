import { Component } from '@angular/core';
import { LandingComponent } from './components/landing/landing.component';
import { ApplicationComponent } from './components/application/application.component';
import { NewsComponent } from './components/news/news.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuthComponent } from './auth/auth.component';
import { LoginUserComponent } from './auth/login-user/login-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-landing-page',
  imports: [
    LandingComponent,
    ApplicationComponent,
    NewsComponent,
    ContactComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {

}
