import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Login de usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  private endpointUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'my-google-api-key';
  private signUpEndpoint = 'signUp?key=';
  private signInWithPasswordEndpoint = 'signInWithPassword?key=';
  userToken: string;

  constructor( private http: HttpClient ) {
      this.leerToken();
   }

   logout() {
    localStorage.removeItem('token');
   }

   login( usuario: UsuarioModel ) {
    console.log('login');
    const authData = {
      // email: usuario.email,
      // password: usuario.password,
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.endpointUrl }${ this.signInWithPasswordEndpoint }${ this.apiKey }`,
      authData
    ).pipe(
      map( (resp: any) => {
        this.guardarToken( resp.idToken );
        return resp;
      })
    );
   }

   nuevoUsuario( usuario: UsuarioModel ){
    console.log('nuevoUsuario');
    const authData = {
      // email: usuario.email,
      // password: usuario.password,
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.endpointUrl }${ this.signUpEndpoint }${ this.apiKey }`,
      authData
    ).pipe(
      map( (resp: any) => {
        this.guardarToken( resp.idToken );
        return resp;
      })
    );
   }

   private guardarToken( idToken: string ){
      this.userToken = idToken;
      localStorage.setItem('token', idToken);
      const hoy = new Date();
      hoy.setSeconds(3600);
      localStorage.setItem('expiresIn', hoy.getTime().toString());
   }

   private leerToken(){
     if (localStorage.getItem('token')) {
       this.userToken = localStorage.getItem('token');
     } else {
       this.userToken = '';
     }
     return this.userToken;
   }

   estaAutenticado(): boolean {
      if (this.userToken.length < 2) {
        return false;
      }
      const expira = Number(localStorage.getItem('expiresIn'));
      const expiraDate = new Date();
      expiraDate.setTime(expira);
      return expiraDate > new Date();
   }
}
