import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute, Data} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MaquinariaService } from '../../services/maquinaria.service';

@Component({
  selector: 'app-registro-herramienta',
  templateUrl: './registro-herramienta.component.html',
  styleUrls: ['./registro-herramienta.component.css']
})
export class RegistroHerramientaComponent implements OnInit {

  private editar = false;
  private crear = false;
  public marcas: any = [];
  public tipos: any = [];
  public estados: any = [];
  public proveedores: any = [];
  public id = null; // Id del registro

  public enviado = false;

  public registroMaquinariaForm = this.fb.group({
    nombre: [null, [Validators.required]],
    tipo: [null, [Validators.required]],
    estado: [null, [Validators.required]],
    cantidad: [null, [Validators.required]],
    proveedor: [null, [Validators.required]],
    marca: [null, [Validators.required]],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private registroMaquinariaService: MaquinariaService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      // Ahora puedes usar this.id en tu componente
    });
    const obtenerMarcasPromise = this.registroMaquinariaService.obtenerMarcas().toPromise();
    const obtenerTiposMaquinaPromise = this.registroMaquinariaService.obtenerTiposMaquina().toPromise();
    const obtenerEstadosMaquinaPromise = this.registroMaquinariaService.obtenerEstadosMaquina().toPromise();
    const obtenerEmpresasPromise = this.registroMaquinariaService.obtenerEmpresas().toPromise();

    Promise.all([
      obtenerMarcasPromise,
      obtenerTiposMaquinaPromise,
      obtenerEstadosMaquinaPromise,
      obtenerEmpresasPromise
    ]).then((respuestas: any[]) => {

      this.marcas = respuestas[0];

      this.tipos = respuestas[1];

      this.estados = respuestas[2];

      this.proveedores = respuestas[3];

      // Obtener el ID desde la URL
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          // Cargar la información según el ID
          this.cargarInformacion(+id);
          this.editar = true; // si hay ID es porque estamos editando
        } else {
          this.crear = true; // Si no hay ID es porque estamos creando
        }
      });
    });

  }

  cargarInformacion(id: number) {
    this.registroMaquinariaService.obtenerMaquina(id).subscribe((respuesta: any) => {
      console.log(respuesta);
      // Asignar los valores a los controles del formulario
      this.registroMaquinariaForm.patchValue({
        nombre: respuesta.nombre,
        tipo: respuesta.idTipo.id,
        estado: respuesta.idEstado.id,
        cantidad: respuesta.cantidad,
        proveedor: respuesta.idProveedor.id,
        marca: respuesta.idMarca.id
      });
      this.id = respuesta.id;
    });
  }

  guardar() {
    this.enviado = true;
    if (this.registroMaquinariaForm.valid) {
      const data = {
        id: this.id || '',
        nombre: this.registroMaquinariaForm.get('nombre')?.value || '',
        tipo: this.registroMaquinariaForm.get('tipo')?.value || '',
        estado: this.registroMaquinariaForm.get('estado')?.value || '',
        cantidad: this.registroMaquinariaForm.get('cantidad')?.value || '',
        proveedor: this.registroMaquinariaForm.get('proveedor')?.value || '',
        marca: this.registroMaquinariaForm.get('marca')?.value || '',
      };

      if(this.crear){
        this.registrarMaquina(data);
      } else if (this.editar) {
        this.actualizarMaquina(data);
      }
    }
  }

  actualizarMaquina(data: Data){
    this.registroMaquinariaService.actualizarMaquina(data, this.id).subscribe(
      (respuesta: any) => {
        if (respuesta) {
          Swal.fire({
            title: 'Éxito',
            text: 'Herramienta actualizada correctamente',
            icon: 'success'
          }).then(res => {
            this.router.navigate(['informacion']);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: respuesta.message,
            icon: 'error'
          });
        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar la herramienta',
          icon: 'error'
        }).then(res => {
          this.router.navigate(['informacion']);
        });
      }
    );
  }

  registrarMaquina(data: Data){
    this.registroMaquinariaService.registrarMaquina(data).subscribe(
      (respuesta: any) => {
        if (respuesta) {
          Swal.fire({
            title: 'Éxito',
            text: 'Registro guardado con éxito',
            icon: 'success'
          }).then(res => {
            this.router.navigate(['informacion']);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: respuesta.message,
            icon: 'error'
          });
        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al guardar la herramienta',
          icon: 'error'
        }).then(res => {
          this.router.navigate(['informacion']);
        });
      }
    );
  }

}
