import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private conexHttp:HttpClient) { }

  getUser():Observable<any> {
    let url = 'https://localhost:8000/user';
    return this.conexHttp.get(
      url, {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    );
  }
}
