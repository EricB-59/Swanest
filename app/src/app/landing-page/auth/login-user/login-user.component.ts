import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login-user',
  imports: [ReactiveFormsModule],
  template: `
    <section>
      <form
        [formGroup]="form"
        (submit)="login()"
        class="custom-form flex flex-col items-center gap-10 font-basereg"
      >
        <h1 class=" font-basebold text-3xl">LOGIN</h1>
        <input
          class="border-2 border-gray-400 rounded-2xl p-2"
          type="text"
          id="identifier"
          formControlName="identifier"
          placeholder="Usuario/Email"
        />
        <input
          class="border-2 border-gray-400 rounded-2xl p-2"
          type="password"
          id="password"
          formControlName="password"
          placeholder="Introduce tu contraseña"
        />
        <button
          class=" bg-black text-white rounded-xl p-3 pr-10 pl-10 cursor-pointer"
          type="submit"
        >
          LOGIN
        </button>
      </form>
    </section>
  `,
  styles: ``,
})
export class LoginUserComponent implements OnInit {
  constructor(private router: Router) {}
  exist: boolean = false;
  identifier: any = '';
  password: any = '';
  userService: UserService = inject(UserService);
  form = new FormGroup({
    identifier: new FormControl(''),
    password: new FormControl(''),
  });
  ngOnInit(): void {}
  login() {
    this.exist = false;
    this.identifier = this.form.value.identifier;
    this.password = this.form.value.password;
    this.userService.login(this.identifier, this.password).subscribe(
      (result) => {
        console.log(result);
        this.exist = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
