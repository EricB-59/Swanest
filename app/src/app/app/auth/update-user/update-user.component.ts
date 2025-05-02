import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { Images, Profile } from '../../../models/profile';
import { ErrorFieldsDirective } from '../../../landing-page/directives/error-fields.directive';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of } from 'rxjs';

interface Province {
  id: number;
  name: string;
}

interface Label {
  id: number;
  name: string;
}

type Image = {
  id: number,
  image_1: string,
  image_2: string,
  image_3: string,
  image_4: string,
  image_5: string,
}

@Component({
  selector: 'app-update-user',
  imports: [ErrorFieldsDirective],
  templateUrl: './update-user.component.html',
  styles: ``,
})
export class UpdateUserComponent implements OnInit {
  constructor(
    private profileService: ProfileService, 
    private userService: UserService, 
    private router: Router
  ) {}

  profile: any;
  provinces: Province[] = [];
  provinceNames: string[] = [];
  labels: Label[] = [];
  selectedInterests: string[] = [];
  images: Image = {} as Image;
  imagesToUpload: Map<string, File> = new Map();
  isLoading: boolean = false;
  userId: number = 0;

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if(user) {
      const userObject = JSON.parse(user);
      this.userId = userObject.id;
      
      // Cargar imágenes del usuario
      this.userService.getImages(this.userId).subscribe({
        next: (result) => {
          if(result) {
            this.images = result;
          }
        },
        error: (error) => {
          console.error('Error al cargar imágenes', error);
          // Inicializar imágenes vacías para evitar errores
          this.images = {
            id: 0,
            image_1: '',
            image_2: '',
            image_3: '',
            image_4: '',
            image_5: ''
          };
        }
      });
      
      // Cargar el perfil del usuario
      this.profileService.getProfile(this.userId).subscribe({
        next: (result) => {
          this.profile = result;
          
          // Preseleccionar intereses basados en el perfil cargado
          if (this.profile && this.profile.labels) {
            const labelKeys = ['first_label', 'second_label', 'third_label', 'fourth_label', 'fifth_label'];
            labelKeys.forEach(key => {
              if (this.profile.labels[key] && this.profile.labels[key].name) {
                this.selectedInterests.push(this.profile.labels[key].name);
              }
            });
            
            // Actualizar el contador de intereses
            this.updateInterestCounter();
          }
        },
        error: (error) => {
          console.error('Error al cargar el perfil', error);
        }
      });
    }
    
    // Cargar provincias
    this.profileService.getProvinces().subscribe({
      next: (result) => {
        if (result && Array.isArray(result)) {
          this.provinces = result;
          this.provinceNames = this.provinces.map(p => p.name);
        }
      },
      error: (error) => {
        console.error('Error al cargar provincias', error);
      }
    });

    // Cargar etiquetas
    this.profileService.getLabels().subscribe({
      next: (result) => {
        this.labels = typeof result === 'string' ? JSON.parse(result) : result;
      },
      error: (error) => {
        console.error('Error al cargar etiquetas', error);
      }
    });
  }

  toggleInterest(interest: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      if (this.selectedInterests.length < 5) {
        this.selectedInterests.push(interest);
      } else {
        checkbox.checked = false;
        return;
      }
    } else {
      this.selectedInterests = this.selectedInterests.filter(
        (i) => i !== interest,
      );
    }
    
    this.updateInterestCounter();
  }
  
  updateInterestCounter() {
    // Update the counter
    const counterElement = document.getElementById('counter');
    if (counterElement) {
      counterElement.textContent = `${this.selectedInterests.length}/5`;
      
      // Update colour according to status
      if (this.selectedInterests.length === 5) {
        counterElement.style.color = '#34C759'; // Green
      } else if (this.selectedInterests.length > 0) {
        counterElement.style.color = '#FF3B30'; // Red
      } else {
        counterElement.style.color = 'black'; // Black
      }
    }
  }
  
  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onFileSelected(event: Event, imageKey: string) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    
    if (file) {
        // Verify that it is an image
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }
      
      // Save the file for later upload
      this.imagesToUpload.set(imageKey, file);
      
      // Show a preview of the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Refresh the preview
        (this.images as any)[imageKey] = e.target.result;      };
      reader.readAsDataURL(file);
    }
  }
  
  handleUpdate() {
    if (!this.userId) {
      return;
    }   
        // Get values from the form
    const bioElement = document.getElementById('bio') as HTMLTextAreaElement;
    const provinceElement = document.getElementById('province') as HTMLInputElement;
    
    // Validate that the required fields are complete
    if (!bioElement.value || bioElement.value.length < 20) {
      return;
    }
    
    // Get the selected gender
    const selectedGender = document.querySelector('input[name="genre"]:checked') as HTMLInputElement;
    if (!selectedGender) {
      alert('Debes seleccionar un género');
      return;
    }
    
    // Validate interests
    if (this.selectedInterests.length !== 5) {
      return;
    }
    
    // Find the selected province
    const selectedProvince = this.provinces.find(p => p.name === provinceElement.value);
    if (!provinceElement.value || !selectedProvince) {
      return;
    }
    
    
    
    // Find the IDs of the selected tags
    const selectedLabels = this.selectedInterests.map(interest => {
      const label = this.labels.find(l => l.name === interest);
      return label ? { id: label.id, name: interest } : null;
    });
    
    
    if (selectedLabels.some(label => label === null)) {
      return;
    }
    
    
    // Create objects for labels with ID and name
    const userLabels = {
      first_label: selectedLabels[0],
      second_label: selectedLabels[1],
      third_label: selectedLabels[2],
      fourth_label: selectedLabels[3],
      fifth_label: selectedLabels[4]
    };
    
    // Build object to update
    const updatedData = {
      bio: bioElement.value,
      gender: parseInt(selectedGender.value),  
      province: selectedProvince.id,           
      labels: userLabels,
      images: this.images,                   
      user_id: this.userId
    };
    
    
    this.isLoading = true;
    
    // First, if there are new images, upload them.
    if (this.imagesToUpload.size > 0) {
      this.uploadImages(this.userId)
        .pipe(
          catchError(error => {
            console.error('Error al subir las imágenes', error);
            alert('Ha ocurrido un error al subir las imágenes: ' + (error.error?.message || error.message || 'Error desconocido'));
            this.isLoading = false;
            return of(null); // Devolver observable con null para detener la cadena
          }),
          finalize(() => {
            if (this.isLoading) {
              // Solo llamar a updateProfileData si no hubo error (isLoading sigue siendo true)
              this.updateProfileData(updatedData);
            }
          })
        )
        .subscribe();
    } else {
      // Si no hay imágenes nuevas, actualizar directamente el perfil
      this.updateProfileData(updatedData);
    }
  }
  
  // Método para actualizar los datos del perfil
  private updateProfileData(data: any) {
    this.profileService.update(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (result) => {
          // Redirigir al perfil o a donde sea necesario
          alert('Se ha actualizado perfectamente')
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error al actualizar el perfil', error);
        }
      });
  }
  
  // Método para subir las imágenes
  private uploadImages(userId: number): Observable<any> {
    console.log('Subiendo imágenes para el usuario ID:', userId);
    console.log('Imágenes a subir:', Array.from(this.imagesToUpload.entries()));
    
    return this.userService.uploadImages(userId, this.imagesToUpload);
  }
  
  handleDelete() {
    
    if (this.userId) {
      this.isLoading = true;
      this.userService.delete(this.userId)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (result) => {
            if (result) {
              sessionStorage.clear();
              this.router.navigate(['/']);
            }
          },
          error: (error) => {

          }
        });
    }
  }
}