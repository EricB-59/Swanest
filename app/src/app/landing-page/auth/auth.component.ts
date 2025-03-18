import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginUserComponent } from './login-user/login-user.component';
import { RegisterUserComponent } from './register-user/register-user.component';
@Component({
  selector: 'app-auth',
  imports: [LoginUserComponent, RegisterUserComponent],
  templateUrl: './auth.component.html',
  styles: ``
})
export class AuthComponent {
  constructor(public _matDialogRef: MatDialogRef<AuthComponent>) {

  }
}
