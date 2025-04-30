import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../../../services/profile/profile.service';
import { Profile, UserLabels, Images } from '../../../models/profile';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { switchMap, throwError } from 'rxjs';
import { InfoModalComponent } from '../../../app/components/info-modal/info-modal.component';

export interface label {
  name: string;
}
export interface Gender {
  name: string;
}
export interface Province {
  name: string;
}

class ImagesToSend {
  constructor(
    id: number,
    image_1: string,
    image_2: string,
    image_3: string,
    image_4: string,
    image_5: string,
  ) {}
}

@Component({
  selector: 'app-images-upload',
  imports: [],
  templateUrl: './images-upload.component.html',
  styles: ``,
})
export class ImagesUploadComponent implements AfterViewInit {
  images: string[] = Array(5).fill('');
  isMaxImagesReached: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    public matDialogRef: MatDialogRef<ImagesUploadComponent>,
    private profileService: ProfileService,
    private userService: UserService,
    private router: Router,
    private matDialog: MatDialog,
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

  async createObjectWithBase64(blobUrls: string[]): Promise<Images> {
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

      this.createObjectWithBase64(urls)
        .then((images) => {
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
            );

            // Creamos el perfil
            this.profileService
              .create(profile)
              .pipe(
                // Al terminar, subimos las imágenes
                switchMap(() => this.userService.images(userId, images)),
                // Después, actualizamos las preferencias
                switchMap((result) => {
                  if (result) {
                    return this.userService.preferences(
                      userId,
                      province,
                      genre,
                      birthDate,
                    );
                  }
                  return throwError(
                    () => new Error('No se pudo subir las imágenes'),
                  );
                }),
              )
              .subscribe({
                next: (result) => {
                  console.log(result);

                  // Guardamos un flag para mostrar el modal tras el reload
                  localStorage.setItem('showModal', 'true');

                  // Navegamos y recargamos
                  this.router.navigate(['/']).then(() => {
                    window.location.reload();
                  });
                },
                error: (err) => {
                  console.error('Error en el proceso:', err);
                },
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
