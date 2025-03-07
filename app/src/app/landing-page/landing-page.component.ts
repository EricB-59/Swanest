import { Component } from '@angular/core';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-landing-page',
  imports: [ContactComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {}
