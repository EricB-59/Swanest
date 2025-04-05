import { Component } from '@angular/core';

@Component({
  selector: 'app-images-upload',
  imports: [],
  template: `
    <main class="grid h-full w-full place-content-center bg-slate-200">
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
              class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-300"
            >
              2
            </div>
            <hr class="w-24 border-2 border-emerald-300" />
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-300 bg-gray-200"
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
      </section>
    </main>
  `,
  styles: ``,
})
export class ImagesUploadComponent {}
