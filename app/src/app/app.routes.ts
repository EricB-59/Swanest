import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PersonalInfoComponent } from './landing-page/profile/personal-info/personal-info.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'personal', component: PersonalInfoComponent },
];
