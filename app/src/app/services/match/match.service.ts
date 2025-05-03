import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile';
import { API_URL } from '../../../config/const';
import { MatchFilter } from '../../models/match';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private PREFIX = 'match';
  constructor(private connHttp: HttpClient) {}

  getProfiles(id: number): Observable<Profile[]> {
    return this.connHttp.get<Profile[]>(
      API_URL + this.PREFIX + '/profiles/' + id,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      },
    );
  }

  addLike(liker_id: number, liked_id: number): Observable<string> {
    return this.connHttp.post<string>(API_URL + 'like/' + liker_id, {
      liked_id,
    });
  }

  addDislike(disliker_id: number, disliked_id: number): Observable<string> {
    return this.connHttp.post<string>(API_URL + 'dislike/' + disliker_id, {
      disliked_id,
    });
  }

  getMatchCounts(userId: number): Observable<number> {
    return this.connHttp.get<number>(API_URL + 'match/' + userId);
  }
}
