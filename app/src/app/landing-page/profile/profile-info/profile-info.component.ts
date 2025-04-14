import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ImagesUploadComponent } from '../images-upload/images-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorFieldsDirective } from '../../directives/error-fields.directive';

interface Province {
  id: number;
  name: string;
}

interface Label {
  id: number;
  name: string;
}

@Component({
  selector: 'app-profile-info',
  imports: [ErrorFieldsDirective],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black/0">
      <main class="grid h-full w-full place-content-center">
        <section
          class="relative h-[642px] w-[553px] rounded-[64px] bg-white p-10"
        >
          <div
            class="flex flex-row items-center justify-between pb-4 align-middle"
          >
            <div class="flex items-center justify-start">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-300"
              >
                1
              </div>
              <hr class="w-24 border-2 border-emerald-300" />
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-300 bg-gray-200"
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
            <h1 class="font-basebold flex text-3xl">Sobre ti</h1>
            <p class="font-basereg flex text-sm">
              Cuéntanos un poco más sobre quién eres y qué te gusta. Esto
              ayudará a encontrar personas afines a ti.
            </p>
          </div>

          <form action="" class="flex h-full flex-col">
            <!--Input Bio-->
            <label for="user-bio">
              <h2 class="font-basereg pt-6">Preséntate *</h2>
              <textarea
                name="bio"
                id="bio"
                class="font-basereg h-18 w-full border-b-2 border-black"
                [minLength]="20"
                [required]="true"
                appErrorFields
              ></textarea>
            </label>

            <!--Datalist-->
            <label for="">
              <h2 class="font-basereg pt-6">Provincia</h2>
              <input
                list="provinces"
                id="province"
                class="font-basereg h-8 w-full border-b-2 border-black"
                [required]="true"
                  [validList]="provinceNames"
                appErrorFields
              />
              <datalist id="provinces">
              @for (province of this.provinces; track $index) {
                  <option value="{{ province.name }}"></option>
                } 
               </datalist>
            </label>

            <!--Labels-->
            <label for="" class="flex flex-row justify-between">
              <h2 class="font-basereg pt-6">Intereses</h2>
              <h2 id="counter" class="font-basereg pt-6 pr-6">
                {{ selectedInterests.length }}/5
              </h2>
            </label>
            <ul
              class="flex w-full flex-wrap items-center justify-start gap-1 pt-2 text-sm"
            >
              @for (label of this.labels; track $index) {
                <li
                  class="relative float-left flex h-8 w-22 list-outside list-none items-center justify-center p-2.5"
                >
                  <input
                    class="absolute h-8 w-22 cursor-pointer appearance-none rounded-4xl border-1 border-black bg-white checked:bg-emerald-300"
                    type="checkbox"
                    id="{{ label.name }}"
                    name="{{ label.name }}"
                    value="{{ label.id }}"
                    [checked]="selectedInterests.includes(label.name)"
                    (change)="toggleInterest(label.name, $event)"
                  />
                  <label
                    for="{{ label.name }}"
                    class="absolute inline-block cursor-pointer select-none"
                    >{{ label.name }}</label
                  >
                </li>
              }
            </ul>
            <div class="flex justify-between">
              <div class="flex pt-4">
                <button
                  type="button"
                  class="font-basereg flex h-11 w-32 cursor-pointer items-center justify-center gap-2 rounded-4xl bg-gray-300 p-4 text-black"
                  (click)="closeModal()"
                >
                  <svg
                    class="rotate-225"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.9989 1C7.56708 2.03828 10.1618 2.20302 14.9989 1C14.4455 3.77251 14.6015 6.41903 14.9989 13"
                      stroke="black"
                    />
                    <path d="M14.9696 1.06836L1.00001 15.3342" stroke="black" />
                  </svg>
                  Volver
                </button>
              </div>
              <div class="flex justify-end pt-4">
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
            </div>
          </form>
        </section>
      </main>
    </div>
  `,
  styles: ``,
})
export class ProfileInfoComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    public matDialogRef: MatDialogRef<ProfileInfoComponent>,
    private _matDialog: MatDialog,
  ) {}

  provinces: Province[] = [];
  provinceNames: string[] = [];
  labels: Label[] = [];
  selectedInterests: string[] = [];

  ngOnInit(): void {
    this.profileService.getProvinces().subscribe({
      next: (result) => {
        this.provinces = typeof result === 'string' ? JSON.parse(result) : result;
        this.provinceNames = this.provinces.map(p => p.name);
        console.log('provinceNames:', this.provinceNames);
      },
    });

    this.profileService.getLabels().subscribe({
      next: (result) => {
        this.labels = typeof result === 'string' ? JSON.parse(result) : result;
      },
    });
  }
  toggleInterest(interest: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      if (this.selectedInterests.length < 5) {
        this.selectedInterests.push(interest);
      } else {
        checkbox.checked = false;
      }
    } else {
      this.selectedInterests = this.selectedInterests.filter(
        (i) => i !== interest,
      );
    }
  }

  submit() {
    const bio = (
      document.querySelector('textarea[name="bio"]') as HTMLTextAreaElement
    )?.value;
    const provinceInput = (
      document.querySelector('input[list="provinces"]') as HTMLInputElement
    )?.value;

    const profileData = {
      bio,
      province: provinceInput,
      interests: this.selectedInterests,
    };

    localStorage.setItem('profile-info', JSON.stringify(profileData));

    this._matDialog.open(ImagesUploadComponent, {
      disableClose: true,
      hasBackdrop: false, // o true si quieres que se mantenga el fondo oscuro
      panelClass: 'custom-dialog',
    });
  }
  closeModal() {
    this.matDialogRef.close();
  }
}
