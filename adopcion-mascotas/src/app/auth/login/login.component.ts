import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { faQuestionCircle }   from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
// import { UserI }              from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // faQuestionCircle = faQuestionCircle;
  public user: any;
  constructor(private authService: AuthService, private router: Router) {
    this.user = {
      email: '',
      password: '',
    };
  }

  ngOnInit() {
    this.prevent();
  }
  prevent(): void {
    if (localStorage.getItem('Id')) {
      Swal.fire({
        icon: 'info',
        title: 'Ya tienes una sesión abierta',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigateByUrl('/auth/index');
    }
  }
  information(): void {
    Swal.fire({
      icon: 'info',
      title: 'Sabías que...',
      text: 'Puedes ingresar con tu número de cedula, en vez de tu correo',
      showConfirmButton: true,
    });
  }
  onLogin(): void {
    const user = this.user;
    this.authService.login(user).subscribe(
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
        if (error.error.message) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrio un error al enviar los datos al servidor',
            showConfirmButton: true,
          });
        }
      }
    );
  }
}
