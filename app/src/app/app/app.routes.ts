import { Routes } from '@angular/router';
import { MatchSectionComponent } from './match-section/match-section.component';
import { AppComponent } from './app.component';

export const APP_ROUTES: Routes = [
  { path: '', component: AppComponent },
  { path: 'match', component: MatchSectionComponent },
];
