import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this._userService.getTest().subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
