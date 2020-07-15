import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal                 from 'sweetalert2';
// import * as _ from 'lodash-es';
import * as _ from 'lodash';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css'],
})
export class PetsComponent {
  url: string = this.authService.AUTH_SERVER;
  pet: any;
  petsAdopted: any;
  myPetsForAdopted: any;
  petsNotHome: any;
  id: number = parseInt(localStorage.getItem('id'));
  listPets: any;
  raceReturn: any;
  afuConfig;
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
    this.uploadPhoto('');
  }
  getJson(): void {
    this.authService.getJson().subscribe(
      (res) => {
        return this.listPets = { ...res };
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
        this.petsAdopted = res;

        console.log('res', res);
        // this.petsNotHome = 
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  showFormulary(): void {
    document.getElementById('disable-pets').hidden = true;
    document.getElementById('createPet').hidden = true;
    document.getElementById('formulary').hidden = false;
  }

  close(): void {
    document.getElementById('formulary').hidden = true;
    document.getElementById('disable-pets').hidden = false;
    document.getElementById('createPet').hidden = false;
  }

  onAdopted(pet): void{
    const petU = {
      id:     parseInt(pet.id),
      name:   pet.name
    };
    this.authService.adoptedPet(petU).subscribe(
    (res) => {
      Swal.fire({
        icon: 'success',
        title: 'Felicitaciones',
        text: `Nos alegra saber que ${petU.name} tendra un hogar que lo cuidará`
      });
    },
    (error) => {
      console.log('error', error);
    })
  }

  uploadPhoto(name) {
    const datos = {
      id:     this.pet.id,
      name:   name
    };
    console.log(datos);
    return this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.png,.jpeg",
      maxSize: "20",
      uploadAPI: {
        url: `${this.authService.AUTH_SERVER}/uploadImage${datos.name}/${datos.id}`,
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        params: {
          'page': '1',
        },
        responseType: "blob",
      },
        theme: "attachPin",
        hideProgressBar: true,
        hideResetBtn: true,
        hideSelectBtn: false,
        fileNameIndex: true,
        replaceTexts: {
        selectFileBtn: "Select Files",
        resetBtn: "Reset",
        uploadBtn: "Upload",
        dragNDropBox: "Drag N Drop",
        attachPinBtn: "Imagen de tu mascota",
        afterUploadMsg_success: "Successfully Uploaded !",
        afterUploadMsg_error: "Upload Failed !",
        sizeLimit: "Size Limit",
      },
    };
  }

  uploadImageResponse(data): void{
    Swal.fire({
      icon: 'success',
      text: 'Imagen actualizada con exito',
      showConfirmButton: false,
      timer:3000
    });
    setTimeout(() => {
      this.onShowPets();
    }, 3000);
  }

  getImage(nameFile){
    console.log('nameFile', nameFile);
    if(nameFile){
      this.authService.getImagePet(nameFile).subscribe(
        response => {
          console.log('exito');
        },
        error => {
          console.log('error');
        }
      )
      }
    }
}