import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile';
import { API_URL } from '../../../config/const';
import { differenceInYears } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private PREFIX = 'profile';
  private PREFIX_PROVINCES = 'provinces';
  private PREFIX_LABELS = 'labels';

  constructor(private connHttp: HttpClient) {}

  create(profile: Profile): Observable<Profile> {
    localStorage.clear();
    console.log(profile);
    return this.connHttp.post<Profile>(API_URL + this.PREFIX, profile);
  }

  update(profile: Profile): Observable<Profile> {
    return this.connHttp.put<Profile>(
      API_URL + this.PREFIX + '/' + profile.user_id,
      profile,
    );
  }

  getProfile(id: number): Observable<Profile> {
    return this.connHttp.get<Profile>(API_URL + this.PREFIX + '/' + id);
  }

  getProvinces(): Observable<object> {
    return this.connHttp.get(API_URL + this.PREFIX_PROVINCES);
  }

  getLabels(): Observable<object> {
    return this.connHttp.get(API_URL + this.PREFIX_LABELS);
  }
}
