import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/api/perfil`;

  private obtenerCabecerasSeguras(): HttpHeaders {
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return headers;
  }

  obtenerMiPerfil(): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    return this.http.get<any>(this.apiUrl, { headers });
  }

  cambiarPassword(passwordAnterior: string, passwordNueva: string): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    const body = { 
      passwordAnterior: passwordAnterior, 
      passwordNueva: passwordNueva 
    };
    
    return this.http.put<any>(`${this.apiUrl}/cambiar-password`, body, { headers });
  }

  actualizarMisDatos(datosActualizados: any): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    return this.http.put<any>(`${this.apiUrl}/actualizar`, datosActualizados, { headers });
  }
}