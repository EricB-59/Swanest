import { Component, OnInit } from '@angular/core';
import {UserService} from "./users/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this._userService.getUser().subscribe({
      next: (data) => console.log('User data:', data),
      error: (err) => console.error('Error:', err),
    });
  }
}
