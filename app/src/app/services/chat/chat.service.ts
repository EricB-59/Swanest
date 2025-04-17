import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { API_URL } from '../../../config/const';

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
  getMessagesByChatId(idChat: number): Observable<object> {
    return this.connHttp.get(API_URL + this.PREFIX + '/messages/' + idChat);
  }
}
