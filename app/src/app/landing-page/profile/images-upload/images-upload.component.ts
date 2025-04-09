import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-images-upload',
  imports: [],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black/0">
      <main class="grid h-full w-full place-content-center">
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
              Las fotos son clave en tu perfil. Sube hasta 5 imágenes para
              mostrar tu mejor versión.
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
                  <img
                    src="assets/icons/add-image.svg"
                    alt=""
                    class="h-4 w-4"
                  />
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
                  <button type="button" class="cursor-pointer" data-index="1">
                    <img
                      src="assets/icons/add-image.svg"
                      alt=""
                      class="h-4 w-4 rotate-45"
                    />
                  </button>
                </label>
                <label
                  class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
                >
                  <img
                    id="image1"
                    class="h-full w-full object-cover object-center"
                    src=""
                    alt=""
                  />
                </label>
              </div>

              <!--Image2-->

              <div id="imageContainer2" class="relative w-32" hidden>
                <label
                  class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
                >
                  <button type="button" class="cursor-pointer" data-index="2">
                    <img
                      src="assets/icons/add-image.svg"
                      alt=""
                      class="h-4 w-4 rotate-45"
                    />
                  </button>
                </label>
                <label
                  class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
                >
                  <img
                    id="image2"
                    class="h-full w-full object-cover object-center"
                    src=""
                    alt=""
                  />
                </label>
              </div>

              <!--Image3-->

              <div id="imageContainer3" class="relative w-32" hidden>
                <label
                  class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
                >
                  <button type="button" class="cursor-pointer" data-index="3">
                    <img
                      src="assets/icons/add-image.svg"
                      alt=""
                      class="h-4 w-4 rotate-45"
                    />
                  </button>
                </label>
                <label
                  class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
                >
                  <img
                    id="image3"
                    class="h-full w-full object-cover object-center"
                    src=""
                    alt=""
                  />
                </label>
              </div>

              <!--Image4-->

              <div id="imageContainer4" class="relative w-32" hidden>
                <label
                  class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
                >
                  <button type="button" class="cursor-pointer" data-index="4">
                    <img
                      src="assets/icons/add-image.svg"
                      alt=""
                      class="h-4 w-4 rotate-45"
                    />
                  </button>
                </label>
                <label
                  class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
                >
                  <img
                    id="image4"
                    class="h-full w-full object-cover object-center"
                    src=""
                    alt=""
                  />
                </label>
              </div>

              <!--Image5-->

              <div id="imageContainer5" class="relative w-32" hidden>
                <label
                  class="absolute right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
                >
                  <button type="button" class="cursor-pointer" data-index="5">
                    <img
                      src="assets/icons/add-image.svg"
                      alt=""
                      class="h-4 w-4 rotate-45"
                    />
                  </button>
                </label>
                <label
                  class="flex h-40 w-32 items-center justify-center overflow-hidden rounded-4xl border-1 border-black bg-neutral-100"
                >
                  <img
                    id="image5"
                    class="h-full w-full object-cover object-center"
                    src=""
                    alt=""
                  />
                </label>
              </div>
            </div>
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
export class ImagesUploadComponent implements AfterViewInit {
  images: string[] = Array(5).fill('');
  isMaxImagesReached: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    public matDialogRef: MatDialogRef<ImagesUploadComponent>,
  ) {}

  ngAfterViewInit(): void {
    const selectImage = document.getElementById('image') as HTMLInputElement;
    const addContainer = document.getElementById('addImageContainer');

    if (selectImage) {
      selectImage.addEventListener('change', (e: any) => {
        if (this.isMaxImagesReached) return; // Evita más selecciones si se alcanzó el límite

        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);

        const index = this.images.findIndex((img) => img === '');

        if (index !== -1) {
          this.images[index] = objectUrl;

          const imageContainer = document.getElementById(
            `imageContainer${index + 1}`,
          );
          if (imageContainer) {
            imageContainer.hidden = false;
          }

          const imgElement = document.getElementById(
            `image${index + 1}`,
          ) as HTMLImageElement;
          if (imgElement) {
            imgElement.src = objectUrl;
          }

          if (!this.images.includes('')) {
            this.isMaxImagesReached = true;
            if (addContainer) {
              addContainer.classList.add('opacity-50', 'pointer-events-none');
            }
          }
        }
      });
    }
    for (let i = 1; i <= 5; i++) {
      const deleteBtn = document.querySelector(`#imageContainer${i} button`);
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          this.removeImage(i - 1);
        });
      }
    }
  }
  removeImage(index: number) {
    this.images.splice(index, 1);
    this.images.push('');

    // update DOM
    for (let i = 0; i < 5; i++) {
      const imgEl = document.getElementById(
        `image${i + 1}`,
      ) as HTMLImageElement;
      const containerEl = document.getElementById(`imageContainer${i + 1}`);

      if (this.images[i] !== '') {
        if (imgEl) imgEl.src = this.images[i];
        if (containerEl) containerEl.hidden = false;
      } else {
        if (imgEl) imgEl.src = '';
        if (containerEl) containerEl.hidden = true;
      }
    }

    if (this.images.includes('')) {
      this.isMaxImagesReached = false;
      const addContainer = document.getElementById('addImageContainer');
      if (addContainer)
        addContainer.classList.remove('opacity-50', 'pointer-events-none');
    }
  }

  submit() {}

  closeModal() {
    this.matDialogRef.close();
  }
}
