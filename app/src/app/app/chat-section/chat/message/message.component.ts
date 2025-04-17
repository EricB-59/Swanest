import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [],
  template: ` <p>message works!</p> `,
  styles: ``,
})
export class MessageComponent {
  @Input() content: string = '';
  @Input() hour: string = '';
}
