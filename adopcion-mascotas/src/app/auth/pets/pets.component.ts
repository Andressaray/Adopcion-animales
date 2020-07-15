import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService }                from '../../services/auth.service';
// import * as $                 from 'jquery';
@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent  {
  url:          string = this.authService.AUTH_SERVER;
  pet: any;
  id: number = parseInt(localStorage.getItem('id'));
  listPets: any;
  constructor(private authService: AuthService, private router: Router) { 
    this.pet = {
      id:         this.id,
      name:       '',
      race:       '',
      species:    '',
      gender:     '',
      vaccines:   '',
      vaccinesO:  ''
    };
  }

  ngOnInit(): void {
    this.getJson();
  }
  getJson(): void {
    this.authService.getJson()
      .subscribe(
        res => {
          console.log('res', res);
          this.listPets = res;
      },
        error => {
          console.log('error', error);
      });
  }
}
