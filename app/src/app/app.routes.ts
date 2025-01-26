import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ApplicationComponent } from './application/application.component';

export const routeConfig: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'app',
    component: ApplicationComponent,
    children: [
      //{ path: 'detail/:id', component: ProductDetailComponent }
    ],
  },
];
