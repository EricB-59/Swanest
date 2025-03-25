import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-info',
  imports: [],
  template: `
    <main class="bg-slate-200 w-full h-full grid place-content-center">
      <section
        class="bg-white rounded-[64px] p-10 w-[553px] h-[642px] relative"
      >
        <div class="flex justify-center pb-6 items-center">
          <div
            class="flex justify-center items-center w-10 h-10 bg-emerald-300 rounded-full"
          >
            1
          </div>
          <hr class="border-4 border-emerald-300 w-[157px]" />
          <div
            class="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full border-4 border-emerald-300"
          >
            2
          </div>
          <hr class="border-4 border-gray-200 w-[70px]" />
          <div
            class="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full"
          >
            3
          </div>
        </div>
        <h1 class="font-basebold text-4xl">Datos del perfil</h1>
        <p class="font-basereg">Introduce datos para tu perfil</p>
        <form action="" class="h-full flex flex-col space-y-6 font-basereg">
          <label>
            <h2 class="font-basebold text-2xl pt-6 pb-5">Género</h2>
            <div class="flex flex-wrap gap-6 mt-2 ">
              <label class="flex items-center gap-2 text-zinc-600">
                <input
                  type="radio"
                  name="gender"
                  class="accent-emerald-300 w-5 h-5"
                  checked
                />
                Hombre
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  class="accent-emerald-300 w-5 h-5"
                />
                Mujer
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  class="accent-emerald-300 w-5 h-5"
                />
                No binario
              </label>
            </div>
          </label>

          <label>
            <h2 class="font-basebold text-2xl pt-2 pb-5">
              Fecha de nacimiento
            </h2>
            <input type="date" />
          </label>

          <label>
            <h2 class="font-basebold text-2xl pt-2 pb-5">Provincia</h2>
            <input
              type="text"
              class=" h-12 bg-gray-200 rounded-2xl px-4"
              placeholder="Provincia"
            />
          </label>

          <div class="flex justify-end">
            <button
              class="flex gap-2 text-lg text-white font-basereg mt-4 cursor-pointer bg-black p-4 rounded-4xl w-[182px] h-[58px] justify-center items-center"
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
  `,
  styles: ``,
})
export class ProfileInfoComponent {}
