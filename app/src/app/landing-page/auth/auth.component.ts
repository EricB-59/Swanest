import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginUserComponent } from './login-user/login-user.component';
import { RegisterUserComponent } from './register-user/register-user.component';
@Component({
  selector: 'app-auth',
  imports: [LoginUserComponent, RegisterUserComponent],
  templateUrl: './auth.component.html',
  styles: ``,
})
export class AuthComponent {
  isRightSide = false;

  constructor(public _matDialogRef: MatDialogRef<AuthComponent>) {}

  close() {
    this._matDialogRef.close();
  }

  toggleSlide() {
    this.isRightSide = !this.isRightSide;
  }
}
