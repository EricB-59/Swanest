import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="flex w-full flex-row rounded-[50px] bg-white p-5 drop-shadow-xl"
    >
      <div class="flex items-center pb-3">
        <img
          src="assets/images/app/icons/warning-icon.svg"
          alt=""
          class="mr-3 scale-75"
        />
        <h2 class="font-family-regular pt-2 text-sm lg:text-2xl">
          Ha ocurrido un incidente con: {{ data.error }}
        </h2>
      </div>
      <div class="flex justify-end">
        <button (click)="close()" class="p-2">
          <svg
            width="30"
            height="30"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L16.558 16.5547" stroke="black" />
            <path d="M16.5586 1L1.00061 16.5547" stroke="black" />
          </svg>
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        background: transparent;
      }
    `,
  ],
})
export class ErrorModalComponent {
  constructor(
    public _matDialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { error: string },
  ) {}

  close() {
    this._matDialogRef.close();
  }
}
