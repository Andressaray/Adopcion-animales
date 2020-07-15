import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';

import Swal                   from 'sweetalert2';

import { AuthService }        from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('name')){
      let id = parseInt(localStorage.getItem('id'));
      this.authService.logout({id}).subscribe(
        res => {
          Swal.fire({
            icon: 'success',
            title: 'Has cerrado sesión con exito',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'No se ha podido cerrar tu sesión',
            showConfirmButton: false,
            timer: 1500
          });
        }
      )
      this.router.navigateByUrl('/');
    }
    else{
      this.router.navigateByUrl('/');
    }
  }

}
