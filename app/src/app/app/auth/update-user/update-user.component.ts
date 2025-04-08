import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { Profile } from '../../../models/profile';

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
  imports: [],
  templateUrl: './update-user.component.html',
  styles: ``,
})
export class UpdateUserComponent {
  constructor(private profileService: ProfileService) {}

  profile: Profile = null;
  provinces: Province[] = [];
  labels: Label[] = [];
  selectedInterests: string[] = [];

  ngOnInit(): void {
    this.profileService.getProvinces().subscribe({
      next: (result) => {
        this.provinces =
          typeof result === 'string' ? JSON.parse(result) : result;
      },
    });

    this.profileService.getLabels().subscribe({
      next: (result) => {
        this.labels = typeof result === 'string' ? JSON.parse(result) : result;
        console.log(result);
      },
    });

    this.profileService.getProfile(1).subscribe({
      next: (result) => {
        console.log(result);
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
      }
    } else {
      this.selectedInterests = this.selectedInterests.filter(
        (i) => i !== interest,
      );
    }
  }
}
