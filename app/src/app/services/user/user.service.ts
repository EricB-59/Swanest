import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000/user';

  constructor(private connHttp: HttpClient) {}

  delete(id: number): Observable<boolean> {
    let url = this.apiUrl + `/${id}`;
    return this.connHttp.delete<boolean>(url, {
      headers: new HttpHeaders({ 'Content Type': 'application/json' }),
    });
  }

  find(id: number): Observable<User> {
    let url = `${this.apiUrl}/${id}`;
    return this.connHttp.get<User>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  create(user: User): Observable<object> {
    return this.connHttp.post(this.apiUrl, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  login(identifier: string, password: string): Observable<User> {
    const data = { identifier, password };
    let url = `${this.apiUrl}/login`;
    return this.connHttp.post<User>(url, data);
  }
}
