import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  imports: [],
  template: `
    <article
      class="flex-rox absolute flex h-1/7 w-full justify-between gap-10 rounded-[50px] bg-white p-5 drop-shadow-xl lg:w-1/2"
    >
      <div class="flex items-center pb-3">
        <img
          src="assets/images/app/icons/warning-icon.svg"
          alt=""
          class="scale-60"
        />
        <h2 class="font-family-regular pt-2 text-sm lg:text-2xl">
          Ha ocurrido un incidente con: {{ error }}
        </h2>
      </div>
      <div>
        <button (click)="closeModal()" class="p-2">
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
  styles: ``,
})
export class ErrorModalComponent {
  @Input() error: string = '';

  closeModal() {}
}
