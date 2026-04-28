import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // 🌟 Importamos la configuración global

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/api/usuarios`;
  private apiServiciosUrl = `${environment.apiUrl}/api/servicios`;

  constructor() { }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userGuardado = localStorage.getItem('usuario_dental');
    
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return headers;
  }

  obtenerTodosLosUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  actualizarPerfilUsuario(idUsuario: number, datosActualizados: any): Observable<any> {
    const url = `${this.apiUrl}/${idUsuario}`;
    return this.http.put(url, datosActualizados, { headers: this.getHeaders() });
  }

  obtenerHorariosOdontologo(idUsuario: number): Observable<any[]> {
    const url = `${this.apiUrl}/${idUsuario}/horarios`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  actualizarHorariosOdontologo(idUsuario: number, nuevosHorarios: any[]): Observable<any> {
    const url = `${this.apiUrl}/${idUsuario}/horarios`;
    return this.http.put(url, nuevosHorarios, { headers: this.getHeaders() });
  }

  obtenerCatalogoServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiServiciosUrl, { headers: this.getHeaders() });
  }

  actualizarServicio(idServicio: number, datosActualizados: any): Observable<any> {
    const url = `${this.apiServiciosUrl}/${idServicio}`;
    return this.http.put(url, datosActualizados, { headers: this.getHeaders() });
  }

  registrarNuevoUsuario(nuevoUsuarioPaquete: any): Observable<any> {
    return this.http.post(this.apiUrl, nuevoUsuarioPaquete, { headers: this.getHeaders() });
  }
  
  crearNuevoServicio(nuevoServicioPaquete: any): Observable<any> {
    return this.http.post(this.apiServiciosUrl, nuevoServicioPaquete, { headers: this.getHeaders() });
  }
}