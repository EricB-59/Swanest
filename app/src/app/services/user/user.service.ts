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

  getTest(): Observable<object> {
    return this.connHttp.get(this.apiUrl + '/test', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  delete(id: number): Observable<boolean> {
    let url = this.apiUrl + `/delete/${id}`;
    return this.connHttp.delete<boolean>(url, {
      headers: new HttpHeaders({ 'Content Type': 'application/json' }),
    });
  }

  find(id: number): Observable<User> {
    let url = `${this.apiUrl}/find/${id}`;
    return this.connHttp.get<User>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  create(user: User): Observable<object> {
    return this.connHttp.post(this.apiUrl + '/create', user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
