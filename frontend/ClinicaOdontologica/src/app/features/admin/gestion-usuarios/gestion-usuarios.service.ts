import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor() { }

  obtenerTodosLosUsuarios(): Observable<any[]> {
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  actualizarPerfilUsuario(idUsuario: number, datosActualizados: any): Observable<any> {
    const url = `${this.apiUrl}/${idUsuario}`;
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.put(url, datosActualizados, { headers });
  }

  obtenerHorariosOdontologo(idUsuario: number): Observable<any[]> {
    const url = `${this.apiUrl}/${idUsuario}/horarios`;
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.get<any[]>(url, { headers });
  }

  actualizarHorariosOdontologo(idUsuario: number, nuevosHorarios: any[]): Observable<any> {
    const url = `${this.apiUrl}/${idUsuario}/horarios`;
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();

    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.put(url, nuevosHorarios, { headers });
  }


  private apiServiciosUrl = 'http://localhost:8080/api/servicios';

  obtenerCatalogoServicios(): Observable<any[]> {
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.get<any[]>(this.apiServiciosUrl, { headers });
  }

  actualizarServicio(idServicio: number, datosActualizados: any): Observable<any> {
    const url = `${this.apiServiciosUrl}/${idServicio}`;
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.put(url, datosActualizados, { headers });
  }

  registrarNuevoUsuario(nuevoUsuarioPaquete: any): Observable<any> {
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.post(this.apiUrl, nuevoUsuarioPaquete, { headers });
  }
  crearNuevoServicio(nuevoServicioPaquete: any): Observable<any> {
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.post(this.apiServiciosUrl, nuevoServicioPaquete, { headers });
  }

}