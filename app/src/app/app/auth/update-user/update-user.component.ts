import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { Profile } from '../../../models/profile';
import { ErrorFieldsDirective } from '../../../landing-page/directives/error-fields.directive';
interface Province {
  id: number;
  name: string;
}

interface Label {
  id: number;
  name: string;
}
@Component({
  selector: 'app-update-user',
  imports: [ErrorFieldsDirective],
  templateUrl: './update-user.component.html',
  styles: ``,
})
export class UpdateUserComponent {
  constructor(private profileService: ProfileService) {}

  profile: any;
  provinces: Province[] = [];
  provinceNames: string[] = [];
  labels: Label[] = [];
  selectedInterests: string[] = [];

  ngOnInit(): void {
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
}
