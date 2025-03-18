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

  add(feedback: Feedback): Observable<object> {
    console.log(feedback);
    return this.connHttp.post(this.apiUrl + '/add', feedback, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
