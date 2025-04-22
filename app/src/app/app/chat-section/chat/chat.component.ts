import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { MessageComponent } from './message/message.component';
import { Message } from '../../../models/message';

import { interval, Subscription } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  imports: [MessageComponent],
  templateUrl: './chat.component.html',
  styles: ``,
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer: ElementRef | null =
    null;
  private shouldScrollToBottom = true;

  @Input() closeChat: () => void = () => {};

  @Input() userName: string = '';
  @Input() userImg: string = '';
  @Input() userId: number = 0;

  messages: any = [];

  USER_ID: number = 0;

  private intervalSub!: Subscription;
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.intervalSub = interval(2000)
      .pipe(
        filter(() => !!sessionStorage.getItem('user')),
        switchMap(() => {
          const userString = sessionStorage.getItem('user');
          const userObj = JSON.parse(userString!);
          this.USER_ID = userObj.id;
          return this.chatService.getMessagesByChatId(
            this.USER_ID,
            this.userId,
          );
        }),
      )
      .subscribe({
        next: (result) => {
          this.messages = result;
        },
        error: (err) => {
          console.error('Error fetching messages:', err);
        },
      });
  }

  // ngOnChanges(): void {
  //   console.log('on changes');
  //   const userString = sessionStorage.getItem('user');

  //   if (userString) {
  //     const userObj = JSON.parse(userString);
  //     this.USER_ID = userObj.id;
  //   }

  //   this.chatService.getMessagesByChatId(this.USER_ID, this.userId).subscribe({
  //     next: (result) => {
  //       this.messages = result;
  //     },
  //   });
  // }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  // Función para desplazar hacia abajo
  scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      } else {
        console.log('scroll null');
      }
    } catch (err) {}
  }

  // Llamar a esta función cuando se añaden nuevos mensajes
  onNewMessage() {
    this.shouldScrollToBottom = true;
  }

  // Si el usuario hace scroll manual, deja de hacer scroll automático
  onScroll() {
    if (this.scrollContainer) {
      const element = this.scrollContainer.nativeElement;
      const atBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight < 30;
      this.shouldScrollToBottom = atBottom;
    } else {
      console.log('scroll null');
    }
  }

  ngOnDestroy(): void {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
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
      next: () => {
        INPUT_MESSAGE.value = '';
      },
    });
  }
}
