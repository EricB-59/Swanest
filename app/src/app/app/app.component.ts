import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatchSectionComponent } from './match-section/match-section.component';
import { ChatSectionComponent } from './chat-section/chat-section.component';

@Component({
  selector: 'app-app',
  imports: [MatchSectionComponent, ChatSectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
