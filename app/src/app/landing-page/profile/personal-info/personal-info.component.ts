import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-info',
  imports: [],
  template: `
    <main class="bg-slate-200 w-full h-full grid place-content-center">
      <section
        class="bg-white rounded-[64px] p-10 w-[553px] h-[642px] relative"
      >
        <div class="flex justify-center pb-6 items-center">
          <div
            class="flex w-10 h-10 bg-gray-200 rounded-full border-4 border-emerald-300 justify-center items-center"
          >
            1
          </div>
          <hr class="border-4 border-gray-200 w-[70px]" />
          <div
            class="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full"
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
        <h1 class="font-basebold text-4xl">Datos personales</h1>
        <p class="font-basereg">
          Introduce datos personales principales del perfil
        </p>
        <form action="" class="h-full flex flex-col">
          <label for="user-name">
            <h2 class="font-basereg text-lg pt-8">Nombre *</h2>
            <input
              type="text"
              name="name"
              class="h-12 font-basereg border-b-2 border-black w-full"
            />
          </label>
          <label for="user-surname">
            <h2 class="font-basereg text-lg pt-8">Primer apellido *</h2>
            <input
              type="text"
              name="name"
              class="h-12 font-basereg border-b-2 border-black w-full"
            />
          </label>
          <label for="user-bio">
            <h2 class="font-basereg text-lg pt-8">Cuentanos sobre ti *</h2>
            <textarea
              name=""
              class="h-24 font-basereg border-b-2 border-black w-full"
            ></textarea>
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
export class PersonalInfoComponent {}
