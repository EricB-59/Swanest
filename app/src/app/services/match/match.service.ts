import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile';
import { API_URL } from '../../../config/const';
import { MatchFilter } from '../../models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private PREFIX = 'match'
  constructor(private connHttp: HttpClient) { }

  getProfiles(id: number, filters: MatchFilter) {
    let params = new HttpParams()

    if (filters.gender) params = params.append('gender', filters.gender) 
    if (filters.maxAge) params = params.append('maxAge', filters.maxAge.toString()) 
    if (filters.minAge) params = params.append('minAge', filters.minAge.toString()) 
    if (filters.province) params = params.append('province', filters.province) 

    return this.connHttp.get<Profile[]>(API_URL + this.PREFIX + '/profiles/' + id, {
      headers: new HttpHeaders({ 'content-Type': 'application/json' }),
      params: params
    })
  }
}
