import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-info',
  imports: [],
  template: `
    <main class="bg-slate-200 w-full h-full grid place-content-center">
      <section class="bg-white rounded-[64px] p-10 w-[553px] h-[642px]">
        <form
          action=""
          class="h-full flex flex-col [&>label>input]:bg-gray-200 [&>label>input]:w-full [&>label>input]:rounded-2xl"
        >
          <label for="user-name">
            <h2 class="font-basebold text-2xl pb-4">Nombre</h2>
            <input type="text" name="name" class="h-12 font-basereg p-2 pl-3" />
          </label>
          <label for="user-surname">
            <h2 class="font-basebold text-2xl pb-4">Primer apellido</h2>
            <input type="text" name="name" class="h-12" />
          </label>
          <label for="user-bio">
            <h2 class="font-basebold text-2xl pb-4">Cuentanos sobre ti</h2>
            <textarea
              name=""
              class="bg-gray-200 w-full h-full rounded-2xl"
            ></textarea>
          </label>
          <label class="" for="submit ">
            <input type="submit" value="Next" />
          </label>
        </form>
      </section>
    </main>
  `,
  styles: ``,
})
export class PersonalInfoComponent {}
