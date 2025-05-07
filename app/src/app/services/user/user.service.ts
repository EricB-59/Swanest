import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { API_URL } from '../../../config/const';
type Image = {
  id: number;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
};

interface ImagesToSend {
  id: number;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
}

export interface Gender {
  name: string;
}

export interface Province {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private PREFIX = 'user';
  constructor(private connHttp: HttpClient) {}

  delete(id: number): Observable<boolean> {
    return this.connHttp.delete<boolean>(API_URL + this.PREFIX + '/' + id, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  create(user: User): Observable<object> {
    return this.connHttp.post(API_URL + this.PREFIX, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  login(identifier: string, password: string): Observable<User> {
    const data = { identifier, password };
    return this.connHttp.post<User>(API_URL + this.PREFIX + '/login', data);
  }

  getImages(id: number): Observable<Image> {
    return this.connHttp.get<Image>(API_URL + 'images/' + id, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  uploadImages(
    userId: number,
    imagesToUpload: Map<string, File>,
  ): Observable<any> {
    const formData = new FormData();
    imagesToUpload.forEach((file, key) => formData.append(key, file));
    return this.connHttp.post(API_URL + 'images/' + userId, formData);
  }

  images(id: number, images: any) {
    const imagesWithId = { id: id, ...images };
    console.log(images);
    return this.connHttp.post<boolean>(
      API_URL + this.PREFIX + '/images',
      imagesWithId,
    );
  }

  preferences(
    user_id: number,
    province: Province,
    genre: Gender,
    birthdate: string,
  ) {
    const preferences = { user_id, province, genre, birthdate };
    return this.connHttp.post<boolean>(API_URL + 'preferences', preferences);
  }
}
