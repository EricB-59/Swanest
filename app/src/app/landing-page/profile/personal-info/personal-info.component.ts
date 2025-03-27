import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-info',
  imports: [],
  template: `
    <main class="bg-slate-200 w-full h-full grid place-content-center">
      <section
        class="bg-white rounded-[64px] p-10 w-[553px] h-[642px] relative"
      >
        <div
          class="flex flex-row justify-between items-center align-middle pb-4"
        >
          <div class="flex justify-start items-center">
            <div
              class="flex w-12 h-12 bg-gray-200 rounded-full border-4 border-emerald-300 justify-center items-center"
            >
              1
            </div>
            <hr class="border-2 border-gray-200 w-24" />
            <div
              class="flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full"
            >
              2
            </div>
            <hr class="border-2 border-gray-200 w-24" />
            <div
              class="flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full"
            >
              3
            </div>
          </div>
          <div
            class="rounded-full border-2 border-black h-15 w-15 flex justify-center items-center z-10"
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
        <div class="flex flex-col w-90">
          <h1 class="flex font-basebold text-3xl">Información personal</h1>
          <p class="flex font-basereg text-sm">
            Comparte algunos datos básicos para empezar y mejorar tu experiencia
            en la app.
          </p>
        </div>

        <form action="" class="h-full flex flex-col">
          <!--Input Nombre-->
          <label for="user-name">
            <h2 class="font-basereg pt-5">Nombre *</h2>
            <input
              type="text"
              name="name"
              class="h-8 font-basereg border-b-2 border-black w-full"
            />
          </label>

          <!--Input Apellidos-->
          <label for="user-surname">
            <h2 class="font-basereg pt-5">Apellidos *</h2>
            <input
              type="text"
              name="surname"
              class="h-8 font-basereg border-b-2 border-black w-full"
            />
          </label>

          <!--Input Fecha de nacimiento-->
          <label for="user-birthdate">
            <h2 class="font-basereg pt-5">Fecha de nacimiento *</h2>
            <input
              type="date"
              name="birthdate"
              class="h-8 font-basereg border-b-2 border-black w-full"
            />
          </label>

          <!--Check box genero-->
          <h2 class="font-basereg pt-5 pb-3">Género *</h2>
          <fieldset for="user-genre">
            <div class="flex flex-wrap gap-2">
              <div
                class="flex flex-row border-1 rounded-[32px] w-[130px] h-[44px]   justify-center items-center gap-5"
              >
                <label for="male" class="flex cursor-pointer">Hombre</label>
                <input
                  value= "1"
                  id="male"
                  name="genre"
                  type="radio"
                  class="flex cursor-pointer w-[23px] h-[23px] checked:accent-purple-500"
                />
              </div>
              <div
                class="flex flex-row border-1 rounded-[32px] w-[120px] h-[44px] justify-center items-center gap-6"
              >
                <label for="female" class="flex cursor-pointer">Mujer</label>
                <input
                  value= "2"
                  id="female"
                  name="genre"
                  type="radio"
                  class="flex cursor-pointer w-[23px] h-[23px] checked:accent-purple-500"
                />
              </div>
              <div
                class="flex flex-row border-1 rounded-[32px] w-[142px] h-[44px]   justify-center items-center gap-5"
              >
                <label for="non-binary" class="flex cursor-pointer"
                  >No binario</label
                >
                <input
                  value= "3"
                  id="non-binary"
                  name="genre"
                  type="radio"
                  class="flex cursor-pointer w-[23px] h-[23px] checked:accent-purple-500"
                />
              </div>
              <div
                class="flex flex-row border-1 rounded-[32px] w-[112px] h-[44px]   justify-center items-center gap-5"
              >
                <label for="other" class="flex cursor-pointer">Otros</label>
                <input
                  value="4"
                  id="other"
                  name="genre"
                  type="radio"
                  class="flex cursor-pointer w-[23px] h-[23px] checked:accent-purple-500"
                />
              </div>
              <div
                class="flex flex-row border-1 rounded-[32px] w-[220px] h-[44px]   justify-center items-center gap-5"
              >
                <label for="prefere-not-to-say" class="flex cursor-pointer"
                  >Prefiero no contestar</label
                >
                <input
                  value="5"
                  id="prefere-not-to-say"
                  name="genre"
                  type="radio"
                  class="flex cursor-pointer w-[23px] h-[23px] checked:accent-purple-500"
                />
              </div>
            </div>
          </fieldset>

          <div class="flex justify-end">
            <button
              class="flex gap-2 text-white font-basereg cursor-pointer bg-black p-4 rounded-4xl w-32 h-11 justify-center items-center"
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
