import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../../models/feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8000/feedback';

  constructor(private connHttp: HttpClient) {}

  create(feedback: Feedback): Observable<object> {
    return this.connHttp.post(this.apiUrl, feedback);
  }
}
