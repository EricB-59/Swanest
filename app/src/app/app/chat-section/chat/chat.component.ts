import { Component, Input, OnChanges } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { MessageComponent } from './message/message.component';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-chat',
  imports: [MessageComponent],
  templateUrl: './chat.component.html',
  styles: ``,
})
export class ChatComponent implements OnChanges {
  @Input() userName: string = '';
  @Input() userImg: string = '';
  @Input() userId: number = 0;

  messages: any = [];

  USER_ID: number = 0;

  constructor(private chatService: ChatService) {}

  ngOnChanges(): void {
    const userString = sessionStorage.getItem('user');

    if (userString) {
      const userObj = JSON.parse(userString);
      this.USER_ID = userObj.id;
    }

    this.chatService.getMessagesByChatId(this.USER_ID, this.userId).subscribe({
      next: (result) => {
        this.messages = result;
        console.log(this.messages);
      },
    });

    // const container = document.getElementById('scroll-container');
    // if (container) {
    //   container.scrollTop = container.scrollHeight;
    // }
  }

  sendMessage() {
    const INPUT_MESSAGE = document.getElementById(
      'content_message',
    ) as HTMLInputElement;

    if (!INPUT_MESSAGE) {
      console.error('Error taking the input');
      return;
    }

    const CONTENT_MESSAGE = INPUT_MESSAGE.value;

    if (CONTENT_MESSAGE.trim() === '') {
      console.error('Error input void');
      return;
    }

    let message = new Message(this.USER_ID, this.userId, CONTENT_MESSAGE);

    this.chatService.createMessage(message).subscribe({
      next: (r) => {
        console.log(r);
      },
    });
  }
}
