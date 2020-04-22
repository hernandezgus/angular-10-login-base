import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  onSubmit( regForm: NgForm ) {
    if ( regForm.invalid ) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere ...',
      title: 'Modal title'
    });
    Swal.showLoading();

    this.auth.nuevoUsuario( this.usuario ).subscribe( resp => {
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
