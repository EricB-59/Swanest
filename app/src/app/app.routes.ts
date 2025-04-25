import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'app',
    loadChildren: () =>
      import('./app/app.routes').then((m) => {
        // ! AUTH: Check if the user had profile
        if (!sessionStorage.getItem('user')) {
          return [{ path: '', component: LandingPageComponent }];
        }

        return m.APP_ROUTES;
      }),
  },
];
