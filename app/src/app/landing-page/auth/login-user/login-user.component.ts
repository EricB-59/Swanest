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
        class="custom-form flex flex-col items-center  font-basereg"
      >
        <div class="w-full">
          <h1 class="font-basemedium text-5xl whitespace-nowrap">
            Iniciar Sesión
          </h1>
        </div>
        <div class=" w-full mt-10 flex flex-col gap-6">
          <label class=" text-lg flex flex-col">
            <div class="flex">
              <span>Correo electrónico / Nombre usuario</span>
              <span class=" text-[#9272E8] font-basesemibold">*</span>
            </div>
            <input
              class="border-b-2 border-black outline-none w-full h-10"
              type="text"
              id="identifier"
              name="identifier"
              formControlName="identifier"
            />
          </label>
          <label class=" text-lg flex flex-col">
            <div class="flex">
              <span>Contraseña</span>
              <span class=" text-[#9272E8] font-basesemibold">*</span>
            </div>
            <input
              class="border-b-2 border-black outline-none w-full h-10"
              type="password"
              id="password"
              name="password"
              formControlName="password"
            />
          </label>
        </div>
        <span class="flex justify-end w-full underline"
          >Olvidé mi contraseña</span
        >
        <div class="flex justify-end w-full mt-5 items-center">
          <button
            class=" bg-black text-white text-[1rem] flex rounded-full p-2 pr-2 pl-6 cursor-pointer items-center"
            type="submit"
          >
            <span>Iniciar sesion</span>
            <div
              class="bg-white h-10.5 w-10.5 rounded-full flex items-center ml-6 justify-center"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.99878 1C7.56695 2.03828 10.1617 2.20302 14.9988 1C13.7677 5.6902 13.8282 8.30395 14.9988 13"
                  stroke="black"
                />
                <path d="M14.9695 1.06836L0.999885 15.3342" stroke="black" />
              </svg>
            </div>
          </button>
        </div>
        <button
          class="rounded-full bg-[#E8E8E8] flex items-center mt-4 p-3 w-75 justify-center gap-3"
        >
          <div>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.44 13.2708C24.44 12.4258 24.3642 11.6133 24.2233 10.8333H13V15.4483H19.4133C19.1317 16.9324 18.2867 18.1891 17.0192 19.0341V22.0349H20.8867C23.14 19.9549 24.44 16.8999 24.44 13.2708Z"
                fill="#4285F4"
              />
              <path
                d="M12.9999 24.9166C16.2174 24.9166 18.9149 23.8549 20.8866 22.0349L17.0191 19.0341C15.9574 19.7491 14.6032 20.1824 12.9999 20.1824C9.90157 20.1824 7.26907 18.0916 6.32657 15.2749H2.36157V18.3516C4.32241 22.2407 8.34157 24.9166 12.9999 24.9166Z"
                fill="#34A853"
              />
              <path
                d="M6.32659 15.2642C6.08825 14.5492 5.94742 13.7908 5.94742 13C5.94742 12.2092 6.08825 11.4508 6.32659 10.7358V7.65918H2.36159C1.54909 9.26251 1.08325 11.0717 1.08325 13C1.08325 14.9283 1.54909 16.7375 2.36159 18.3408L5.44909 15.9358L6.32659 15.2642Z"
                fill="#FBBC05"
              />
              <path
                d="M12.9999 5.82825C14.7549 5.82825 16.3149 6.43492 17.5607 7.60492L20.9732 4.19242C18.9041 2.26409 16.2174 1.08325 12.9999 1.08325C8.34157 1.08325 4.32241 3.75909 2.36157 7.65909L6.32657 10.7358C7.26907 7.91909 9.90157 5.82825 12.9999 5.82825Z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span class="text-[1rem]">Iniciar sesión con google</span>
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
      },
    );
  }
}
