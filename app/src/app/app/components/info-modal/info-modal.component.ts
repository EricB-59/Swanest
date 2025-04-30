import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="flex w-full flex-row rounded-[50px] bg-white p-5 drop-shadow-xl"
    >
      <div class="flex items-center pb-3">
        <img
          src="assets/images/app/icons/warning-icon.svg"
          alt=""
          class="mr-3 scale-75"
        />
        <h2 class="font-family-regular pt-2 text-sm lg:text-2xl">
          Nueva Notificación: {{ data.type }}: {{ data.number }}
        </h2>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        background: transparent;
      }
    `,
  ],
})
export class InfoModalComponent implements OnInit {
  constructor(
    public _matDialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; number: number },
  ) {}

  ngOnInit(): void {
    setTimeout(this.close, 3000);
  }

  close() {
    this._matDialogRef.close();
  }
}
