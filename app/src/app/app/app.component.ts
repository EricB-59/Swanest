import { Component } from '@angular/core';
import { ChatSectionComponent } from './chat-section/chat-section.component';

@Component({
  selector: 'app-app',
  imports: [ChatSectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
