import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Signal, ViewChild, computed, inject, signal } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';
import { Province } from '../../../models/profile';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-filter-modal',
  imports: [NgxSliderModule],
  templateUrl: './filter-modal.component.html',
  styles: [`
    ::ng-deep .dark-backdrop {
      background-color: rgba(0, 0, 0, 0.5) !important;
    }
    ::ng-deep .ngx-slider {
      margin-top: 20px !important;
    }
    ::ng-deep .ngx-slider .ngx-slider-bubble {
      display: none !important;
    }
    ::ng-deep .ngx-slider .ngx-slider-selection {
      background: #7948ff !important;
    }
    ::ng-deep .ngx-slider .ngx-slider-pointer {
      width: 21px !important;
      height: 21px !important;
      background-color: #7948ff !important; 
      border-radius: 50% !important;
      top: -7px !important; 
    }
    ::ng-deep .ngx-slider .ngx-slider-pointer:after {
      display: none !important;
    }
    ::ng-deep .ngx-slider-bar {
      background-color: #99A1AF !important;
    }
  `]
})
export class FilterModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<void>();

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  profileService: ProfileService = inject(ProfileService);
  userService: UserService = inject(UserService);
  provinces: Province[] = [];
  provinceNames: string[] = [];
  showDropdown = signal(false);
  selectedGenre = signal('');
  searchQuery = signal('');
  selectedProvince = signal('');

  minValue = signal(18);
  maxValue = signal(90);

  options: Options = {
    floor: 18,
    ceil: 90,
    step: 1,
    minRange: 0,
    noSwitching: true,
    showTicks: false,
    showTicksValues: false,
    hideLimitLabels: true,
    hidePointerLabels: true
  };

  closeModal() {
    this.close.emit();
  }

  ngOnInit(): void {
    this.profileService.getProvinces().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.provinces = data;
          this.provinceNames = this.provinces.map(p => p.name);
          console.log(this.provinces)
        }
      },
      error: (error) => {
        console.error(error);
      }
    })

    const user = sessionStorage.getItem('user');
    if (user) {
      const userObject = JSON.parse(user);
      const userId = userObject.id;
      this.userService.getPreferences(userId).subscribe({
        next: (data) => {
          this.minValue.set(data.age_min);
          this.maxValue.set(data.age_max);
          this.selectedGenre.set(data.gender.name)
          this.selectedProvince.set(data.province.name)
        },
        error: (error) => {
          console.error(error)
        }
      })
    }
  }

  toggleDropdown() {
    this.showDropdown.update(v => !v);
  }

  filteredProvinces: Signal<{ name: string }[]> = computed(() =>
    this.provinces.filter(p =>
      p.name.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  selectProvince(name: string) {
    this.selectedProvince.set(name);
    this.searchQuery.set('');
    this.showDropdown.set(false);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.showDropdown.set(false);
    }
  }

  applyPreferences() {
    const user = sessionStorage.getItem('user');
    if (user) {
      const userObject = JSON.parse(user);
      const userId = userObject.id;
      const preferences = {
        minAge: this.minValue(),
        maxAge: this.maxValue(),
        gender: this.selectedGenre(),
        province: this.selectedProvince(),
      }
      this.userService.updatePreferences(userId, preferences).subscribe({
        next: (data) => {
          console.log(data)
          this.applyFilters.emit();
        },
        error: (error) => {
          console.error(error)
        }
      })
    }
  }
}