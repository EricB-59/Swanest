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
  bioText: string = '';
  selectedProvince: string = '';
  selectedGender: number | null = null;

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if(user) {
      const userObject = JSON.parse(user);
      this.userId = userObject.id;
      
      // Load provinces and labels first
      this.loadProvinces();
      this.loadLabels();
      
      // Load user images
      this.loadUserImages();
      
      // Load user profile
      this.loadUserProfile();
    }
  }
  
  loadUserImages() {
    this.userService.getImages(this.userId).subscribe({
      next: (result) => {
        if(result) {
          this.images = result;
        }
      },
      error: (error) => {
        console.error('Error loading images', error);
        // Initialize empty images to avoid errors
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
  }
  
  loadUserProfile() {
    this.profileService.getProfile(this.userId).subscribe({
      next: (result) => {
        this.profile = result;
        
        // Set initial form values
        if (this.profile) {
          // Set the biography
          this.bioText = this.profile.bio || '';
          setTimeout(() => {
            const bioElement = document.getElementById('bio') as HTMLTextAreaElement;
            if (bioElement) {
              bioElement.value = this.bioText;
            }
          }, 0);
          
          // Set the province
          if (this.profile.province && this.profile.province.name) {
            this.selectedProvince = this.profile.province.name;
            setTimeout(() => {
              const provinceElement = document.getElementById('province') as HTMLInputElement;
              if (provinceElement) {
                provinceElement.value = this.selectedProvince;
              }
            }, 0);
          }
          
          // Set the gender
          if (this.profile.gender) {
            this.selectedGender = this.profile.gender;
            setTimeout(() => {
              const genderRadio = document.querySelector(`input[name="genre"][value="${this.selectedGender}"]`) as HTMLInputElement;
              if (genderRadio) {
                genderRadio.checked = true;
              }
            }, 0);
          }
          
          // Preselect interests based on loaded profile
          this.selectedInterests = []; // Clear selected interests
          if (this.profile.labels) {
            const labelKeys = ['first_label', 'second_label', 'third_label', 'fourth_label', 'fifth_label'];
            labelKeys.forEach(key => {
              if (this.profile.labels[key] && this.profile.labels[key].name) {
                this.selectedInterests.push(this.profile.labels[key].name);
              }
            });
            
            // Update interest counter
            this.updateInterestCounter();
          }
        }
      },
      error: (error) => {
        console.error('Error loading profile', error);
      }
    });
  }
  
  loadProvinces() {
    this.profileService.getProvinces().subscribe({
      next: (result) => {
        if (result && Array.isArray(result)) {
          this.provinces = result;
          this.provinceNames = this.provinces.map(p => p.name);
        }
      },
      error: (error) => {
        console.error('Error loading provinces', error);
      }
    });
  }
  
  loadLabels() {
    this.profileService.getLabels().subscribe({
      next: (result) => {
        this.labels = typeof result === 'string' ? JSON.parse(result) : result;
      },
      error: (error) => {
        console.error('Error loading labels', error);
      }
    });
  }

  toggleInterest(interest: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      if (this.selectedInterests.length < 5) {
        // Only add the interest if it's not already in the list
        if (!this.selectedInterests.includes(interest)) {
          this.selectedInterests.push(interest);
        }
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
      
      // Update color according to state
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
      
      // Display an image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Save the base64 URL for preview
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
    // Get form values
    const bioElement = document.getElementById('bio') as HTMLTextAreaElement;
    const provinceElement = document.getElementById('province') as HTMLInputElement;
    
    // Validate that required fields are complete
    if (!bioElement.value || bioElement.value.length < 20) {
      return;
    }
    
    // Get selected gender
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
    
    // Find the IDs of selected labels
    const selectedLabels = this.selectedInterests.map(interest => {
      const label = this.labels.find(l => l.name === interest);
      return label ? { id: label.id, name: interest } : null;
    });
    
    if (selectedLabels.some(label => label === null)) {
      alert('Error en la selección de intereses');
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
        // Prepare image object combining existing and new
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
        this.isLoading = false;
      });
    } else {
      // If there are no new images, update profile directly
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
  
  // Method to update profile data
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
        }
      });
  }
  
  // Method to upload images in base64
  private async prepareImagesForUpload(): Promise<Record<string, string>> {
    const imageData: Record<string, string> = {};
    
    for (const [key, file] of this.imagesToUpload.entries()) {
      try {
        imageData[key] = await this.convertToBase64(file);
      } catch (error) {
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
