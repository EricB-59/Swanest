import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { API_URL } from '../../../config/const';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private PREFIX = 'user';
  constructor(private connHttp: HttpClient) {}

  delete(id: number): Observable<boolean> {
    return this.connHttp.delete<boolean>(API_URL + this.PREFIX + '/' + id, {
      headers: new HttpHeaders({ 'Content Type': 'application/json' }),
    });
  }

  find(id: number): Observable<User> {
    return this.connHttp.get<User>(API_URL + this.PREFIX + '/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  create(user: User): Observable<object> {
    return this.connHttp.post(API_URL + this.PREFIX, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  login(identifier: string, password: string): Observable<User> {
    const data = { identifier, password };
    return this.connHttp.post<User>(API_URL + this.PREFIX + '/login', data);
  }
}
