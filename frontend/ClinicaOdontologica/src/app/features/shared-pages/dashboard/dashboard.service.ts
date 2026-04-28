import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

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

  obtenerResumenDashboard(): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    return this.http.get<any>(`${this.apiUrl}/resumen`, { headers });
  }
}