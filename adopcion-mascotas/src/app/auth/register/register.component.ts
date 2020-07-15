import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { UserI } from '../../models/userI';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public user: any;
  constructor(private authService: AuthService, private router: Router) {
    this.user = {
      id: '',
      name: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
    };
  }

  ngOnInit() {
    this.prevent();
  }

  prevent(): void {
    if (localStorage.getItem('id')) {
      Swal.fire({
        icon: 'info',
        title: 'Ya tienes una sesión abierta',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigateByUrl('index');
    }
  }

  onRegister(): void {
    const userRegister = this.user;
    console.log(userRegister);
    this.authService.register(userRegister).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Iniciaste sesion',
          text: `Bienvenido ${localStorage.getItem('Name')}`,
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigateByUrl('/auth/index');
      },
      (error) => {
        console.log('error', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No pudiste registrarte',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }
}
