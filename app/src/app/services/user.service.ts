import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'http://localhost:8000/';
  constructor(private http: HttpClient) {}

  test(): Observable<any> {
    return this.http.get(this.baseUrl + 'user/test');
  }
}
