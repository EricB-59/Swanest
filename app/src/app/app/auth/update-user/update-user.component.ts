import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { Images, Profile } from '../../../models/profile';
import { ErrorFieldsDirective } from '../../../landing-page/directives/error-fields.directive';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of } from 'rxjs';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
    private router: Router,
    private _matDialog: MatDialog
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
      
      // Upload user images
      this.userService.getImages(this.userId).subscribe({
        next: (result) => {
          if(result) {
            this.images = result;
          }
        },
        error: (error) => {
          console.error('Error al cargar imágenes', error);
          // Initialising empty images to avoid errors
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
      
      // Load user profile
      this.profileService.getProfile(this.userId).subscribe({
        next: (result) => {
          this.profile = result;
          
          // Pre-select interests based on the uploaded profile
          if (this.profile && this.profile.labels) {
            const labelKeys = ['first_label', 'second_label', 'third_label', 'fourth_label', 'fifth_label'];
            labelKeys.forEach(key => {
              if (this.profile.labels[key] && this.profile.labels[key].name) {
                this.selectedInterests.push(this.profile.labels[key].name);
              }
            });
            
            // Update the interest counter
            this.updateInterestCounter();
          }
        },
        error: (error) => {
          console.error('Error al cargar el perfil', error);
        }
      });
    }
    
    //Load provincies
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

    // Load labels
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
        // Save the base64 URL for the preview
        (this.images as any)[imageKey] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
    
    this.isLoading = true;
    
    // If there are new images, process them first
    if (this.imagesToUpload.size > 0) {
      // Convert images to Base64
      this.prepareImagesForUpload().then(base64Images => {
        // Prepare image object by combining existing and new ones
        const updatedImages = { ...this.images };
        
        // Update only images that have changed
        for (const [key, base64] of Object.entries(base64Images)) {
          (updatedImages as any)[key] = base64;
        }
        
        const updatedData = {
          bio: bioElement.value,
          gender: parseInt(selectedGender.value),  
          province: selectedProvince.id,           
          labels: userLabels,
          images: updatedImages,
          user_id: this.userId
        };
        
        // Send profile update
        this.updateProfileData(updatedData);
      }).catch(error => {
        console.error('Error al preparar las imágenes:', error);
        this.isLoading = false;
        alert('Error al procesar las imágenes');
      });
    } else {
      // If there are no new images, update the profile directly.
      const updatedData = {
        bio: bioElement.value,
        gender: parseInt(selectedGender.value),  
        province: selectedProvince.id,           
        labels: userLabels,
        images: this.images,
        user_id: this.userId
      };
      
      this.updateProfileData(updatedData);
    }
  }
  
  // Method for updating profile data
  private updateProfileData(data: any) {
    this.profileService.update(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (result) => {
          this._matDialog.open(InfoModalComponent, {
            data: { type: 'Perfil actualizado correctamente' },
            panelClass: 'transparent-modal',
            backdropClass: 'transparent-backdrop',
            hasBackdrop: true,
          });
        },
      });
  }
  
  // Method for uploading images in base64
  private async prepareImagesForUpload(): Promise<Record<string, string>> {
    const imageData: Record<string, string> = {};
    
    for (const [key, file] of this.imagesToUpload.entries()) {
      try {
        imageData[key] = await this.convertToBase64(file);
      } catch (error) {
        console.error(`Error al convertir imagen ${key} a Base64:`, error);
      }
    }
    
    return imageData;
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
          }
        });
    }
  }
}