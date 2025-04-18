import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { API_URL } from '../../../config/const';
import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private PREFIX = 'chat';

  constructor(private connHttp: HttpClient) {}

  // ! Chat section - List of chats
  getChats(id: number): Observable<object> {
    return this.connHttp.get(API_URL + this.PREFIX + '/' + id);
  }

  // ? Chat - Chat user to user
  getMessagesByChatId(user1: number, user2: number): Observable<object> {
    return this.connHttp.get(
      API_URL + this.PREFIX + '/messages/' + user1 + '/' + user2,
    );
  }

  createMessage(message: Message): Observable<object> {
    return this.connHttp.post(API_URL + this.PREFIX, message);
  }
}
