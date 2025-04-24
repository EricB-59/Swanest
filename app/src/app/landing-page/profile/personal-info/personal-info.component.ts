import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ProfileInfoComponent } from '../profile-info/profile-info.component';
import { ErrorFieldsDirective } from '../../directives/error-fields.directive';

@Component({
  selector: 'app-personal-info',
  imports: [ErrorFieldsDirective],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black/50">
      <main class="grid h-full w-full place-content-center">
        <section
          class="flex h-[642px] w-[553px] flex-col justify-between rounded-[64px] bg-white p-10"
        >
          <div
            class="flex flex-row items-center justify-between pb-4 align-middle"
          >
            <div class="flex items-center justify-start">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-300 bg-gray-200"
              >
                1
              </div>
              <hr class="w-24 border-2 border-gray-200" />
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200"
              >
                2
              </div>
              <hr class="w-24 border-2 border-gray-200" />
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200"
              >
                3
              </div>
            </div>
            <div
              class="z-10 flex h-15 w-15 items-center justify-center rounded-full border-2 border-black"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 1L16.558 16.5547" stroke="black" />
                <path d="M16.5586 1L1.00061 16.5547" stroke="black" />
              </svg>
            </div>
          </div>
          <div class="flex w-90 flex-col">
            <h1 class="font-basebold flex text-3xl">Información personal</h1>
            <p class="font-basereg flex text-sm">
              Comparte algunos datos básicos para empezar y mejorar tu
              experiencia en la app.
            </p>
          </div>

          <form action="" class="flex h-full flex-col">
            <!--Input Nombre-->
            <label for="user-name">
              <h2 class="font-basereg pt-5">Nombre *</h2>
              <input
                type="text"
                name="name"
                id="name"
                class="font-basereg h-8 w-full border-b-2 border-black"
                [pattern]="'^[a-zA-Z]+$'"
                [minLength]="3"
                appErrorFields
                [required]="true"
              />
            </label>

            <!--Input Apellidos-->
            <label for="user-surname">
              <h2 class="font-basereg pt-5">Apellidos *</h2>
              <input
                type="text"
                name="surname"
                class="font-basereg h-8 w-full border-b-2 border-black"
                [required]="true"
                [minLength]="5"
                [pattern]="'^[A-Za-z ]+$'"
                [maxLength]="50"
                appErrorFields
              />
            </label>

            <!--Input Fecha de nacimiento-->
            <label for="user-birthdate">
              <h2 class="font-basereg pt-5">Fecha de nacimiento *</h2>
              <input
                type="date"
                name="birthdate"
                class="font-basereg h-8 w-full border-b-2 border-black"
                [required]="true"
                appErrorFields
              />
            </label>

            <!--Check box genero-->
            <h2 class="font-basereg pt-5 pb-3">Género *</h2>
            <fieldset for="user-genre">
              <div class="flex flex-wrap gap-2">
                <div
                  class="flex h-[44px] w-[130px] flex-row items-center justify-center gap-5 rounded-[32px] border-1"
                >
                  <label for="male" class="flex cursor-pointer">Hombre</label>
                  <input
                    value="1"
                    id="male"
                    name="genre"
                    type="radio"
                    class="flex h-[23px] w-[23px] cursor-pointer checked:accent-purple-500"
                  />
                </div>
                <div
                  class="flex h-[44px] w-[120px] flex-row items-center justify-center gap-6 rounded-[32px] border-1"
                >
                  <label for="female" class="flex cursor-pointer">Mujer</label>
                  <input
                    value="2"
                    id="female"
                    name="genre"
                    type="radio"
                    class="flex h-[23px] w-[23px] cursor-pointer checked:accent-purple-500"
                  />
                </div>
                <div
                  class="flex h-[44px] w-[142px] flex-row items-center justify-center gap-5 rounded-[32px] border-1"
                >
                  <label for="non-binary" class="flex cursor-pointer"
                    >No binario</label
                  >
                  <input
                    value="3"
                    id="non-binary"
                    name="genre"
                    type="radio"
                    class="flex h-[23px] w-[23px] cursor-pointer checked:accent-purple-500"
                  />
                </div>
                <div
                  class="flex h-[44px] w-[112px] flex-row items-center justify-center gap-5 rounded-[32px] border-1"
                >
                  <label for="other" class="flex cursor-pointer">Otros</label>
                  <input
                    value="4"
                    id="other"
                    name="genre"
                    type="radio"
                    class="flex h-[23px] w-[23px] cursor-pointer checked:accent-purple-500"
                  />
                </div>
                <div
                  class="flex h-[44px] w-[220px] flex-row items-center justify-center gap-5 rounded-[32px] border-1"
                >
                  <label for="prefere-not-to-say" class="flex cursor-pointer"
                    >Prefiero no contestar</label
                  >
                  <input
                    value="5"
                    id="prefere-not-to-say"
                    name="genre"
                    type="radio"
                    class="flex h-[23px] w-[23px] cursor-pointer checked:accent-purple-500"
                  />
                </div>
              </div>
            </fieldset>

            <div class="flex justify-end">
              <button
                type="button"
                class="font-basereg flex h-11 w-32 cursor-pointer items-center justify-center gap-2 rounded-4xl bg-black p-4 text-white"
                (click)="submit()"
              >
                Siguiente
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.9989 1C7.56708 2.03828 10.1618 2.20302 14.9989 1C14.4455 3.77251 14.6015 6.41903 14.9989 13"
                    stroke="white"
                  />
                  <path d="M14.9696 1.06836L1.00001 15.3342" stroke="white" />
                </svg>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  `,
  styles: ``,
})
export class PersonalInfoComponent {
  constructor(
    public matDialogRef: MatDialogRef<PersonalInfoComponent>,
    private _matDialog: MatDialog,
  ) {}

  submit() {
    const name = (
      document.querySelector('input[name="name"]') as HTMLInputElement
    )?.value;
    const surname = (
      document.querySelector('input[name="surname"]') as HTMLInputElement
    )?.value;
    const birthdate = (
      document.querySelector('input[name="birthdate"]') as HTMLInputElement
    )?.value;
    const genre = (
      document.querySelector('input[name="genre"]:checked') as HTMLInputElement
    )?.value;

    const profileData = {
      name,
      surname,
      birthdate,
      genre,
    };

    localStorage.setItem('personal-info', JSON.stringify(profileData));

    this._matDialog.open(ProfileInfoComponent, {
      disableClose: true,
      hasBackdrop: false, // o true si quieres que se mantenga el fondo oscuro
      panelClass: 'custom-dialog',
    });
  }
}
