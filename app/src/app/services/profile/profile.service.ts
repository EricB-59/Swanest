import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/profile';

  constructor(private connHttp: HttpClient) {}

  getProfile(id: number): Observable<object> {
    return this.connHttp.get(this.apiUrl + `/getProfile/${id}`);
  }

  getProvinces(): Observable<object> {
    return this.connHttp.get(this.apiUrl + '/provinces');
  }

  getLabels(): Observable<object> {
    return this.connHttp.get(this.apiUrl + '/labels');
  }
}
