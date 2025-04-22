import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/profile';
  private provinceUrl = 'http://localhost:8000/provinces';
  private labelsUrl = 'http://localhost:8000/labels';

  constructor(private connHttp: HttpClient) {}

  create(profile: Profile): Observable<Profile> {
    console.log('gola');
    localStorage.clear();
    return this.connHttp.post<Profile>(this.apiUrl, profile);
  }

  update(profile: Profile): Observable<Profile> {
    return this.connHttp.put<Profile>(
      this.apiUrl + `${profile.user_id}`,
      profile,
    );
  }

  getProfile(id: number): Observable<Profile> {
    return this.connHttp.get<Profile>(this.apiUrl + `/${id}`);
  }

  getProvinces(): Observable<object> {
    return this.connHttp.get(this.provinceUrl);
  }

  getLabels(): Observable<object> {
    return this.connHttp.get(this.labelsUrl);
  }
}
