import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/chat';

  constructor(private connHttp: HttpClient) {}

  // ! Chat section - List of chats
  getChats(id: number): Observable<object> {
    return this.connHttp.get(this.apiUrl + `/chats/${id}`);
  }

  // ? Chat - Chat user to user
}
