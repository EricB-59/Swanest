import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { PersonalInfoComponent } from '../../profile/personal-info/personal-info.component';
import { ProfileInfoComponent } from '../../profile/profile-info/profile-info.component';

@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule],
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
    email: new FormControl(''),
    password: new FormControl(''),
  });

  register() {
    let user = new User({
      username: this.registerForm.value.username as string,
      email: this.registerForm.value.email as string,
      password: this.registerForm.value.password as string,
    });

    this.userService.create(user).subscribe((result) => {
      this._matDialog.open(PersonalInfoComponent);
    });
  }
}
