import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user';
import { ErrorFieldsDirective } from '../../directives/error-fields.directive';
import { MatDialog } from '@angular/material/dialog';
import { PersonalInfoComponent } from '../../profile/personal-info/personal-info.component';
import { ProfileInfoComponent } from '../../profile/profile-info/profile-info.component';
export function customEmailValidator(): (
  control: AbstractControl,
) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(control.value) ? null : { email: true };
  };
}

@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule, ErrorFieldsDirective],
  templateUrl: './register-user.component.html',
  styles: ``,
})
export class RegisterUserComponent {
  constructor(
    private userService: UserService,
    private _matDialog: MatDialog,
  ) {}

  registerForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', [Validators.required, customEmailValidator()]),
    password: new FormControl(''),
  });

  register() {
    let user = new User({
      username: this.registerForm.value.username as string,
      email: this.registerForm.value.email as string,
      password: this.registerForm.value.password as string,
    });

    this.userService.create(user).subscribe((result) => {
      sessionStorage.setItem('user', JSON.stringify(result));
      this._matDialog.open(PersonalInfoComponent);
    });
  }
}
