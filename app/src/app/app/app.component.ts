import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatchSectionComponent } from './match-section/match-section.component';
import { UpdateUserComponent } from './auth/update-user/update-user.component';

@Component({
  selector: 'app-app',
  imports: [UpdateUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
