import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { Images, Profile } from '../../../models/profile';
import { ErrorFieldsDirective } from '../../../landing-page/directives/error-fields.directive';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
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
export class UpdateUserComponent {
  constructor(private profileService: ProfileService, private userService: UserService, private router: Router) {}

  profile: any;
  provinces: Province[] = [];
  provinceNames: string[] = [];
  labels: Label[] = [];
  selectedInterests: string[] = [];
  images: Image  = <Image>{};

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if(user) {
      const userObject = JSON.parse(user);
      const userId = userObject.id;
    this.userService.getImages(userId).subscribe({
      next: (result) => {
        if(result) {
          this.images = result;
        }
      },
    });
  }
    this.profileService.getProvinces().subscribe({
      next: (result) => {
        if (result && Array.isArray(result)) {
          this.provinces = result;
          this.provinceNames = this.provinces.map(p => p.name);
        }
      },
    });

    this.profileService.getLabels().subscribe({
      next: (result) => {
        this.labels = typeof result === 'string' ? JSON.parse(result) : result;
      },
    });

    this.profileService.getProfile(1).subscribe({
      next: (result) => {
        this.profile = result;
      },
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
  handleDelete() {
    const user = sessionStorage.getItem('user');
    if(user) {
      const userObject = JSON.parse(user);
      const userId = userObject.id;
      this.userService.delete(userId).subscribe({
        next: (result) => {
          if(result) {
            sessionStorage.clear;
          this.router.navigate(['/'])
          }
        }
      })
    }
  }
}
