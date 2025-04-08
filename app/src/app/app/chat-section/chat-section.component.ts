import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-chat-section',
  imports: [],
  templateUrl: './chat-section.component.html',
  styles: ``,
})
export class ChatSectionComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  chats: any = [];

  ngOnInit(): void {
    this.chatService.getChats(6).subscribe({
      next: (result) => {
        this.chats = result;
      },
    });
  }
}
