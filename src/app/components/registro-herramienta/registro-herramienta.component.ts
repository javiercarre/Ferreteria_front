import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
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
  public imagenSeleccionada: File | null = null;

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
  ) { }

  ngOnInit() {
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

      // Respuesta 1: marcas
      this.marcas = respuestas[0].data;

      // Respuesta 2: tipos de maquina
      this.tipos = respuestas[1].data;

      // Respuesta 3: estados maquina
      this.estados = respuestas[2].data;

      // Respuesta 4: empresas
      this.proveedores = respuestas[3].data;

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
        tipo: respuesta.id_tipo_maquina,
        estado: respuesta.id_estado,
        cantidad: respuesta.cantidad,
        proveedor: respuesta.id_proveedor,
        marca: respuesta.id_marca
      });
      this.id = respuesta.id;
    });
  }

  guardar() {
    this.enviado = true;
    if (this.registroMaquinariaForm.valid) {
      const formData = new FormData();
      formData.append('id', this.id || '');
      formData.append('nombre', this.registroMaquinariaForm.get('nombre')?.value || '');
      formData.append('tipo', this.registroMaquinariaForm.get('tipo')?.value || '');
      formData.append('estado', this.registroMaquinariaForm.get('estado')?.value || '');
      formData.append('cantidad', this.registroMaquinariaForm.get('cantidad')?.value || '');
      formData.append('proveedor', this.registroMaquinariaForm.get('proveedor')?.value || '');
      formData.append('marca', this.registroMaquinariaForm.get('marca')?.value || '');

      if(this.crear){
        this.registrarMaquina(formData);
      } else if (this.editar) {
        this.actualizarMaquina(formData);
      }
    }
  }

  actualizarMaquina(formData: FormData){
    this.registroMaquinariaService.actualizarMaquina(formData).subscribe(
      (respuesta: any) => {
        if (respuesta.success) {
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

  registrarMaquina(formData: FormData){
    this.registroMaquinariaService.registrarMaquina(formData).subscribe(
      (respuesta: any) => {
        if (respuesta.success) {
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
