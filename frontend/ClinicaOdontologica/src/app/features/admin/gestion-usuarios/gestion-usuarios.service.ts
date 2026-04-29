import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/api/usuarios`;
  private apiServiciosUrl = `${environment.apiUrl}/api/servicios`;

  constructor() { }

  obtenerTodosLosUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  actualizarPerfilUsuario(idUsuario: number, datosActualizados: any): Observable<any> {
    const url = `${this.apiUrl}/${idUsuario}`;
    return this.http.put(url, datosActualizados);
  }

  obtenerHorariosOdontologo(idUsuario: number): Observable<any[]> {
    const url = `${this.apiUrl}/${idUsuario}/horarios`;
    return this.http.get<any[]>(url);
  }

  actualizarHorariosOdontologo(idUsuario: number, nuevosHorarios: any[]): Observable<any> {
    const url = `${this.apiUrl}/${idUsuario}/horarios`;
    return this.http.put(url, nuevosHorarios);
  }

  obtenerCatalogoServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiServiciosUrl);
  }

  actualizarServicio(idServicio: number, datosActualizados: any): Observable<any> {
    const url = `${this.apiServiciosUrl}/${idServicio}`;
    return this.http.put(url, datosActualizados);
  }

  registrarNuevoUsuario(nuevoUsuarioPaquete: any): Observable<any> {
    return this.http.post(this.apiUrl, nuevoUsuarioPaquete);
  }
  
  crearNuevoServicio(nuevoServicioPaquete: any): Observable<any> {
    return this.http.post(this.apiServiciosUrl, nuevoServicioPaquete);
  }
}