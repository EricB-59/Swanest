import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [],
  template: `
    <article class="font-family-regular flex flex-col justify-start p-5">
      <span class="p-1 text-lg">{{ this.hour }}</span>
      <div
        class="w-fit max-w-1/3 rounded-tr-2xl rounded-b-2xl bg-[#E8E8E8] p-3"
      >
        <h2 class="text-xl">{{ this.content }}</h2>
      </div>
    </article>
  `,
  styles: ``,
})
export class MessageComponent {
  @Input() content: string = '';
  @Input() hour: string = '';
}
