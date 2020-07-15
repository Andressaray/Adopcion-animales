import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash-es';
// import { keys } from 'lodash-es';
@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css'],
})
export class PetsComponent {
  url: string = this.authService.AUTH_SERVER;
  pet: any;
  id: number = parseInt(localStorage.getItem('id'));
  listPets: any;
  raceReturn: any;
  constructor(private authService: AuthService, private router: Router) {
    this.pet = {
      id: this.id,
      name: '',
      race: '',
      species: '',
      gender: '',
      vaccines: '',
      vaccinesO: '',
    };
  }

  ngOnInit(): void {
    this.getJson();
    this.onShowPets();
  }
  getJson(): void {
    this.authService.getJson().subscribe(
      (res) => {
        return (this.listPets = { ...res });
        // console.log('this.lisPets', this.listPets);
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  onChangeRace(race) {
    this.raceReturn = this.listPets[race];
  }

  onCreatePets(): void {
    let condition = true;
    const mascota = {
      id: this.id,
      name: this.pet.name,
      race: this.pet.race,
      species: this.pet.species,
      gender: this.pet.gender,
      age: this.pet.age,
      vaccinesO: this.pet.vaccinesO,
      vaccines: this.pet.vaccines,
    };
    console.log('mascota', mascota);
    let vaccinesOption = '';
    _.forEach(mascota, (value, index) => {
      if (index == 'vaccinesO') {
        vaccinesOption = value;
      }
      if (vaccinesOption != '') {
        if (vaccinesOption == 'Si') {
          if (mascota.vaccines == '') {
            alert('Vacio el vaccines cuando debe estar lleno');
            Swal.fire({
              icon: 'info',
              title: 'Si tiene vacunas debes escribir cuales',
              showConfirmButton: true,
            });
            condition!!;
          }
        }
      }
      if (index != 'vaccines') {
        if (value == '') {
          Swal.fire({
            icon: 'info',
            title: 'Debes llenar todos los campos',
            showConfirmButton: true,
          });
          condition!!;
          return false;
        }
      }
    });
    if (condition) {
      this.authService.createPet(mascota).subscribe(
        (res) => {},

        (error) => {}
      );
    }
  }

  onShowPets(): void {
    this.authService.showPets().subscribe(
      (res) => {
        console.log('res', res);
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  showFormulary(): void {
    document.getElementById('card-deck').hidden = true;
    document.getElementById('createPet').hidden = true;
    document.getElementById('formulary').hidden = false;
  }
  close(): void {
    document.getElementById('formulary').hidden = true;
    document.getElementById('card-deck').hidden = false;
    document.getElementById('createPet').hidden = false;
  }
}
