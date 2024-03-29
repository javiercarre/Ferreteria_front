import {Component, Input} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public enviado = false;

  public formularioLogin = this.fb.group({
    usuario: [null, [Validators.required]],
    contrasena: [null, [Validators.required]]
  });

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router
  ) {
  }

  iniciarSesion() {
    this.enviado = true;

    if (this.formularioLogin.valid) {
      this.authService.iniciarSesion(this.formularioLogin.value).subscribe((respuesta: any) => {

        if (respuesta) {
          this.router.navigate(['/informacion'])
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Usuario o contraseña incorrectos',
            icon: 'error'
          });
        }
      });
    }

  }

}
