import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PersonalInfoComponent } from './landing-page/profile/personal-info/personal-info.component';
import { ProfileInfoComponent } from './landing-page/profile/profile-info/profile-info.component';
import { ImagesUploadComponent } from './landing-page/profile/images-upload/images-upload.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'personal', component: PersonalInfoComponent },
  { path: 'profile', component: ProfileInfoComponent },
  { path: 'images', component: ImagesUploadComponent },
];
