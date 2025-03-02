import { Component } from '@angular/core';
import { ContactComponent } from './components/contact/contact.component';
import { NewsComponent } from './components/news/news.component';

@Component({
  selector: 'app-landing-page',
  imports: [NewsComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {}
