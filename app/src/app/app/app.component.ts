import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatchSectionComponent } from './match-section/match-section.component';

@Component({
  selector: 'app-app',
  imports: [MatchSectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
