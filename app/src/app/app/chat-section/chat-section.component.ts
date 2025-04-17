import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-chat-section',
  imports: [ChatComponent],
  templateUrl: './chat-section.component.html',
  styles: ``,
})
export class ChatSectionComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  chatActive: boolean = false;

  // User data to open the chat to a user
  chatId: number = 0;
  userName: string = '';
  userImg: string = '';

  chats: any = [];

  ngOnInit(): void {
    let user = sessionStorage.getItem('user');
    if (user) {
      let userObject = JSON.parse(user);
      this.chatService.getChats(userObject.id).subscribe({
        next: (result) => {
          this.chats = result;
          console.log(this.chats);
        },
      });
    }
  }

  openChat(event: MouseEvent) {
    if (!event.currentTarget) {
      console.warn('El evento no tiene un currentTarget válido');
      return;
    }

    const BUTTON_ELEMENT = event.currentTarget as HTMLButtonElement;
    const CHAT_ID = BUTTON_ELEMENT.id;

    let USER_IMG: string | undefined;

    const imgElement = BUTTON_ELEMENT.querySelector('img');
    if (imgElement) {
      USER_IMG = imgElement.src;
    }

    const USER_NAME = BUTTON_ELEMENT.querySelector('h2')?.textContent || '';

    if (CHAT_ID) {
      this.chatId = +CHAT_ID;
    } else {
      console.warn('ID de usuario no válido');
      this.chatId = 0;
    }

    this.userName = USER_NAME;
    this.userImg = USER_IMG || '';
    this.chatActive = true;
  }
}
