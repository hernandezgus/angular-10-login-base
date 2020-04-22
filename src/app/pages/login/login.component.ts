import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }

  }

  loginUser( loginForm: NgForm ) {
    if (loginForm.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere ...',
      title: 'Modal title'
    });
    Swal.showLoading();

    this.auth.login( this.usuario ).subscribe( resp => {
      Swal.close();

      if (this.recordarme) {
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home');
    }, ( err ) => {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        text: err.error.error.message,
        title: 'Modal title'
      });
    });
  }
}
