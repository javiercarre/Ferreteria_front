import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  iniciarSesion(formularioLogin: any) {
    return this.http.post(`${environment.apiUrl}/login`, formularioLogin);
  }

  registrar(formularioRegistro: any){
    return this.http.post( `${environment.apiUrl}/registro`, formularioRegistro);
  }

  verificarUsuario(formularioOlvido: any){
    return this.http.post( `${environment.apiUrl}/login/olvido-pass`, formularioOlvido, {
      responseType: 'text'
    });
  }

}
