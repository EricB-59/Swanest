import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../app/models/User';

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

  find(id: number): Observable<User> {
    let url = `${this.apiUrl}/find/${id}`;
    return this.connHttp.get<User>(url, {
      headers: new HttpHeaders({
        'Content-Type':'aplication/json' 
      })
    })
  }
}
