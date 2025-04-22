import { Component, OnInit } from '@angular/core';
import { ChatSectionComponent } from './chat-section/chat-section.component';
import { User } from '../models/user';

@Component({
  selector: 'app-app',
  imports: [ChatSectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  user: User | null = null;
  userLoadError = false;

  ngOnInit(): void {
    this.loadUserFromSession();
  }

  /**
   * Loads user information from sessionStorage
   * and handles possible errors
   */
  private loadUserFromSession(): void {
    try {
      const userString = sessionStorage.getItem('user');

      if (!userString) {
        this.handleUserNotFound();
        return;
      }

      this.user = JSON.parse(userString);

      // Basic validation to ensure user object is valid
      if (!this.isValidUser(this.user)) {
        this.handleInvalidUserData();
        return;
      }
    } catch (error) {
      this.handleParsingError(error);
    }
  }

  /**
   * Verifies that the user object has a valid structure
   */
  private isValidUser(user: any): boolean {
    return user && typeof user === 'object';
    // You can add more specific validations based on your User interface
  }

  /**
   * Handles the case where the user doesn't exist in sessionStorage
   */
  private handleUserNotFound(): void {
    console.error('User information not found in session');
    this.userLoadError = true;
    // Here you could redirect to login or display a message
  }

  /**
   * Handles the case where user data is invalid
   */
  private handleInvalidUserData(): void {
    console.error('User information is invalid');
    this.userLoadError = true;
    sessionStorage.removeItem('user'); // Clear invalid data
  }

  /**
   * Handles errors when parsing JSON
   */
  private handleParsingError(error: any): void {
    console.error('Error processing user data:', error);
    this.userLoadError = true;
    this.user = null;
    sessionStorage.removeItem('user'); // Clear invalid data
  }
}
