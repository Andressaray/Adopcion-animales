import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';

import { JwtResponseI }     from '../models/jwt-response';
import { UserI }            from '../models/userI';
import { UserD }            from '../models/userD';
import { JwtResponsePets }  from '../models/jwt-response-pets';
import { PetU }             from '../models/petU';
import { PetD }             from '../models/petD';

import Swal                 from 'sweetalert2';

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
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/logout`, id);
  }

  getJson(): any {
    return this.httpClient.get(this.url);
  }

  createPet(pet: any): Observable <JwtResponsePets> {
    console.log('pet', pet);
    
    return this.httpClient.post<JwtResponsePets>(`${this.AUTH_SERVER}/pets`,
      pet).pipe(tap(
        (res: JwtResponsePets) => {
          console.log('pets >>', res)
          Swal.fire({
            icon: 'success',
            title: 'Mascota creada con exito',
            showConfirmButton: false,
            timer: 1500
          });
        }, 
        (error) => {
          console.log('error', error);
          
          Swal.fire({
            icon: 'error',
            title: error.error.message,
            showConfirmButton: false,
            timer: 1500
          });
        })
      );
  }

  showPet(id: number){
    return this.httpClient.get<JwtResponsePets>(`${this.AUTH_SERVER}/showPets${id}`);
  }

  showPets(id?: number){
    return this.httpClient.post<JwtResponsePets[]>(`${this.AUTH_SERVER}/showPetsAll`, id);
  }


  deletePet(pet: PetD){
    return this.httpClient.delete(`${this.AUTH_SERVER}/deletePets${pet.id}/${pet.name}/${pet.imageUrl}`);
  }

  updatePet(pet: PetU): Observable <JwtResponsePets> {
    return this.httpClient.put<JwtResponsePets>(`${this.AUTH_SERVER}/updatePets`, pet);
  }


  private saveToken(
    token: string,
    expiresIn: string,
    name: string,
    id: number
  ): void {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('EXPIRES_IN', expiresIn);
    localStorage.setItem('name', name);
    localStorage.setItem('id', String(id));
    this.token = token;
  }
}
