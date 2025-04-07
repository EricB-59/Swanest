import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-images-upload',
  imports: [],
  template: `
    <main class="grid h-full w-full place-content-center bg-slate-200">
      <section
        class="flex h-[642px] w-[553px] flex-col rounded-[64px] bg-white p-10"
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

        <div class="flex w-90 flex-col">
          <h1 class="font-basebold flex text-3xl">Galería</h1>
          <p class="font-basereg flex text-sm">
            Las fotos son clave en tu perfil. Sube hasta 5 imágenes para mostrar
            tu mejor versión.
          </p>
        </div>

        <form action="" class="flex h-full flex-col justify-between pt-6">
          <div class="grid grid-cols-3 grid-rows-2 gap-4">
            <!--Input for add Images -->
            <div id="addImageContainer" class="relative w-32">
              <label
                for="image"
                class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              >
                <img src="assets/icons/add-image.svg" alt="" class="h-4 w-4" />
              </label>
              <label
                for="image"
                class="flex h-40 w-32 cursor-pointer items-center justify-center rounded-4xl border-1 border-black bg-neutral-100"
              >
                <img src="assets/icons/image-icon.svg" alt="" />
                <input id="image" type="file" class="hidden" />
              </label>
            </div>

            <!--Containers of img-->

            <!--Image1-->

            <div id="imageContainer1" class="relative w-32" hidden>
              <label
                class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              >
                <img
                  src="assets/icons/add-image.svg"
                  alt=""
                  class="h-4 w-4 rotate-45"
                />
              </label>
              <label
                class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
              >
                <img id="image1" class="h-full w-full" src="" alt="" />
              </label>
            </div>

            <!--Image2-->

            <div id="imageContainer2" class="relative w-32" hidden>
              <label
                class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              >
                <img
                  src="assets/icons/add-image.svg"
                  alt=""
                  class="h-4 w-4 rotate-45"
                />
              </label>
              <label
                class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
              >
                <img id="image2" class="h-full w-full" src="" alt="" />
              </label>
            </div>

            <!--Image3-->

            <div id="imageContainer3" class="relative w-32" hidden>
              <label
                class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              >
                <img
                  src="assets/icons/add-image.svg"
                  alt=""
                  class="h-4 w-4 rotate-45"
                />
              </label>
              <label
                class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
              >
                <img id="image3" class="h-full w-full" src="" alt="" />
              </label>
            </div>

            <!--Image4-->

            <div id="imageContainer4" class="relative w-32" hidden>
              <label
                class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              >
                <img
                  src="assets/icons/add-image.svg"
                  alt=""
                  class="h-4 w-4 rotate-45"
                />
              </label>
              <label
                class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
              >
                <img id="image4" class="h-full w-full" src="" alt="" />
              </label>
            </div>

            <!--Image5-->

            <div id="imageContainer5" class="relative w-32" hidden>
              <label
                class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              >
                <img
                  src="assets/icons/add-image.svg"
                  alt=""
                  class="h-4 w-4 rotate-45"
                />
              </label>
              <label
                class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
              >
                <img id="image5" class="h-full w-full" src="" alt="" />
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button
              class="font-basereg flex h-11 w-32 cursor-pointer items-center justify-center gap-2 rounded-4xl bg-black p-4 text-white"
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
export class ImagesUploadComponent implements AfterViewInit {
  images: string[] = Array(5).fill('');
  isMaxImagesReached: boolean = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const selectImage = document.getElementById('image') as HTMLInputElement;
    const addContainer = document.getElementById('addImageContainer');

    if (selectImage) {
      selectImage.addEventListener('change', (e: any) => {
        if (this.isMaxImagesReached) return;

        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        const index = this.images.findIndex((img) => img === '');

        if (index !== -1) {
          this.images[index] = objectUrl;
          const imageContainer = document.getElementById(
            `imageContainer${index + 1}`,
          );
          if (imageContainer) imageContainer.hidden = false;

          const imgElement = document.getElementById(
            `image${index + 1}`,
          ) as HTMLImageElement;
          if (imgElement) imgElement.src = objectUrl;

          this.createDeleteButton(index + 1);

          if (!this.images.includes('')) {
            this.isMaxImagesReached = true;
            if (addContainer)
              addContainer.classList.add('opacity-50', 'pointer-events-none');
          }
        }
      });
    }
  }

  createDeleteButton(index: number): void {
    let imageContainer = document.getElementById(`imageContainer${index}`);
    if (!imageContainer) return;

    let existingButton = document.getElementById(`deleteButton${index}`);
    if (existingButton) return;

    const deleteButton = document.createElement('button');
    deleteButton.id = `deleteButton${index}`;
    deleteButton.innerText = 'X';
    deleteButton.className =
      'absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6';
    deleteButton.addEventListener('click', () => this.removeImage(index - 1));

    imageContainer.appendChild(deleteButton);
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.images.push('');

    for (let i = 0; i < 5; i++) {
      const imageContainer = document.getElementById(`imageContainer${i + 1}`);
      const imgElement = document.getElementById(
        `image${i + 1}`,
      ) as HTMLImageElement;
      const deleteButton = document.getElementById(`deleteButton${i + 1}`);

      if (this.images[i] && this.images[i] !== '') {
        if (imageContainer) imageContainer.hidden = false;
        if (imgElement) imgElement.src = this.images[i];
        if (!deleteButton) this.createDeleteButton(i + 1);
      } else {
        if (imageContainer) imageContainer.hidden = true;
        if (imgElement) imgElement.src = '';
        if (deleteButton) deleteButton.remove();
      }
    }

    this.isMaxImagesReached =
      this.images.filter((img) => img !== '').length >= 5;
    const addContainer = document.getElementById('addImageContainer');
    if (addContainer) {
      addContainer.classList.toggle('opacity-50', this.isMaxImagesReached);
      addContainer.classList.toggle(
        'pointer-events-none',
        this.isMaxImagesReached,
      );
    }
  }
}
