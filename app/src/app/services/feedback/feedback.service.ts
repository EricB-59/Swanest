import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../../models/feedback';
import { API_URL } from '../../../config/const';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private PREFIX = 'feedback';
  constructor(private connHttp: HttpClient) {}

  create(feedback: Feedback): Observable<object> {
    return this.connHttp.post(API_URL + this.PREFIX, feedback);
  }
}
