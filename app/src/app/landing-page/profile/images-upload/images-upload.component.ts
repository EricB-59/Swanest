import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../../services/profile/profile.service';
import { Profile, UserLabels, Images } from '../../../models/profile';
import { User } from '../../../models/user';

export interface label {
  name: string;
}
export interface Gender {
  name: string;
}
export interface Province {
  name: string;
}

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
    private profileService: ProfileService,
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

  async blobUrlToBase64(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('Error al leer blob como base64');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async crearObjetoConBase64(blobUrls: string[]): Promise<Images> {
    // Filtrar URLs vacías y asegurarse que tenemos valores válidos
    const validUrls = blobUrls.filter((url) => url !== '');

    try {
      // Convertir solo las URLs válidas a base64
      const base64Values = await Promise.all(
        validUrls.map((url) => this.blobUrlToBase64(url)),
      );

      // Crear un array de longitud 5 con los valores base64 disponibles
      const allValues = [...base64Values];
      while (allValues.length < 5) {
        allValues.push('');
      }

      // Crear y retornar el objeto Images
      const resultado: Images = new Images(
        allValues[0],
        allValues[1],
        allValues[2],
        allValues[3],
        allValues[4],
      );

      return resultado;
    } catch (error) {
      console.error('Error al convertir a base64:', error);
      // En caso de error, retornar un objeto Images con valores vacíos
      return new Images('', '', '', '', '');
    }
  }

  submit() {
    const storagePersonal = localStorage.getItem('personal-info');
    const storageProfile = localStorage.getItem('profile-info');

    if (storagePersonal && storageProfile) {
      const personalInfo = JSON.parse(storagePersonal);
      const profileInfo = JSON.parse(storageProfile);

      const interests = profileInfo.interests;

      const firstLabel: label = interests[0];
      const secondLabel: label = interests[1];
      const thirdLabel: label = interests[2];
      const fourthLabel: label = interests[3];
      const fifthLabel: label = interests[4];

      const name = personalInfo.name;
      const surname = personalInfo.surname;
      const genre: Gender = personalInfo.genre;
      const birthDate = personalInfo.birthdate;

      const bio = profileInfo.bio;
      const userLabels = new UserLabels(
        firstLabel,
        secondLabel,
        thirdLabel,
        fourthLabel,
        fifthLabel,
      );
      const province: Province = profileInfo.province;

      const image1 = this.images[0];
      const image2 = this.images[1];
      const image3 = this.images[2];
      const image4 = this.images[3];
      const image5 = this.images[4];

      const user = sessionStorage.getItem('user');

      const urls = [image1, image2, image3, image4, image5].filter(
        (url) => url !== '',
      );

      this.crearObjetoConBase64(urls)
        .then((images) => {
          console.log('Images después de conversión:', images);

          if (user) {
            const userObject = JSON.parse(user);
            const userId = userObject.id;

            const profile: Profile = new Profile(
              name,
              surname,
              bio,
              birthDate,
              genre,
              province,
              userLabels,
              userId,
              images, // Ahora sí tendrá los valores correctos
            );

            // Ahora hacemos la llamada al servicio dentro del then
            this.profileService.create(profile).subscribe({
              next: () => this.closeModal(),
              error: (err) => console.error('Error al crear el perfil:', err),
            });
          }
        })
        .catch((error) => {
          console.error('Error al procesar las imágenes:', error);
        });
    }
  }

  closeModal() {
    this.matDialogRef.close();
  }
}
