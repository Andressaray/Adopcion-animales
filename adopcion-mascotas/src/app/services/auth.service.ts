import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { UserI } from '../models/userI';
import { JwtResponseI } from '../models/jwt-response';
import { UserD } from '../models/userD';

@Injectable()
export class AuthService {
  AUTH_SERVER: string = 'http://localhost:3000';
  url = '../../assets/listPets.json';
  authSubject = new BehaviorSubject(false);
  private token: string;
  constructor(private httpClient: HttpClient) {}

  register(user: UserI): Observable<JwtResponseI> {
    return this.httpClient
      .post<JwtResponseI>(`${this.AUTH_SERVER}/register`, user)
      .pipe(
        tap((res: JwtResponseI) => {
          if (res) {
            console.log('res', res);
            this.saveToken(
              res.dataUser.accessToken,
              res.dataUser.expiresIn,
              res.dataUser.name,
              res.dataUser.id
            );
          }
        })
      );
  }

  login(user: UserI): Observable<JwtResponseI> {
    try {
      return this.httpClient
        .post<JwtResponseI>(`${this.AUTH_SERVER}/login`, user)
        .pipe(
          tap((res: JwtResponseI) => {
            if (res) {
              // guardar token
              this.saveToken(
                res.dataUser.accessToken,
                res.dataUser.expiresIn,
                res.dataUser.name,
                res.dataUser.id
              );
            }
          })
        );
    } catch (error) {}
  }
  logout(id: UserD): Observable<JwtResponseI> {
    this.token = '';
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRES_IN');
    localStorage.removeItem('Name');
    localStorage.removeItem('Id');
    localStorage.removeItem('profile');
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/logout`, id);
  }

  getJson(): any {
    return this.httpClient.get(this.url);
  }

  private saveToken(
    token: string,
    expiresIn: string,
    name: string,
    id: number
  ): void {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('EXPIRES_IN', expiresIn);
    localStorage.setItem('Name', name);
    localStorage.setItem('Id', String(id));
    this.token = token;
  }
}
