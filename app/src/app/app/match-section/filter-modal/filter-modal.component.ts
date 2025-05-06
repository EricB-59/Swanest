import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-modal',
  imports: [],
  templateUrl: './filter-modal.component.html',
  styles: [`
    ::ng-deep .dark-backdrop {
      background-color: rgba(0, 0, 0, 0.5) !important;
    }
  `]
})
export class FilterModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
