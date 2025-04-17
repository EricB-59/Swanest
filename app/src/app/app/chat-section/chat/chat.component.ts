import { Component, Input, OnChanges } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-chat',
  imports: [MessageComponent],
  templateUrl: './chat.component.html',
  styles: ``,
})
export class ChatComponent implements OnChanges {
  @Input() userName: string = '';
  @Input() userImg: string = '';
  @Input() chatId: number = 0;

  messages: any = [];

  constructor(private chatService: ChatService) {}

  ngOnChanges(): void {
    this.chatService.getMessagesByChatId(this.chatId).subscribe({
      next: (result) => {
        this.messages = result;
        console.log(this.messages);
      },
    });
  }
}
