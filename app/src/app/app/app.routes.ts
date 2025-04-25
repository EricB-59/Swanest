import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';

export const APP_ROUTES: Routes = [
  { path: '', component: AppComponent },
  { path: 'modal', component: ErrorModalComponent },
];
