import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MaquinariaService {

  constructor(private http: HttpClient) { }

  obtenerMaquinas(){
    return this.http.get(`${environment.apiUrl}/herramientas/consultaTodos`);
  }

  obtenerMaquina(id?: number){
    return this.http.get(`${environment.apiUrl}/herramientas/consultaUna/${id}`);
  }

  registrarMaquina(formularioMaquina: any) {
    return this.http.post(`${environment.apiUrl}/herramientas/guardar`, formularioMaquina);
  }

  obtenerMarcas(){
    return this.http.get(`${environment.apiUrl}/listas/marcas`);
  }

  obtenerTiposMaquina(){
    return this.http.get(`${environment.apiUrl}/listas/tipos`);
  }

  obtenerEstadosMaquina(){
    return this.http.get(`${environment.apiUrl}/listas/estados`);
  }

  obtenerEmpresas(){
    return this.http.get(`${environment.apiUrl}/listas/proveedores`);
  }

  eliminarMaquina(id: number){
    return this.http.delete(`${environment.apiUrl}/herramientas/eliminar/${id}`);
  }

  actualizarMaquina(formularioMaquina: any, id: any){
    return this.http.put(`${environment.apiUrl}/herramientas/actualizar/${id}`, formularioMaquina);
  }
}
