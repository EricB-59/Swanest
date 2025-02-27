import { Component } from '@angular/core';
import { ApplicationComponent } from './components/application/application.component';

@Component({
  selector: 'app-landing-page',
  imports: [ApplicationComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {}
