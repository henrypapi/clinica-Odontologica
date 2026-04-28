import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/api/citas`;


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

  obtenerCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  registrarCita(datosCita: any): Observable<any> {
    return this.http.post(this.apiUrl, datosCita, { headers: this.getHeaders() });
  }

  obtenerOdontologos(): Observable<any[]> {
    const urlUsuarios = `${environment.apiUrl}/api/usuarios`;
    return this.http.get<any[]>(urlUsuarios, { headers: this.getHeaders() });
  }

  obtenerServicios(): Observable<any[]> {
    const urlServicios = `${environment.apiUrl}/api/servicios`; 
    return this.http.get<any[]>(urlServicios, { headers: this.getHeaders() });
  }
  
  obtenerHorarioOdontologo(idOdontologo: number, diaSemana: number): Observable<any[]> {
    const urlHorarios = `${environment.apiUrl}/api/horarios/odontologo/${idOdontologo}/dia/${diaSemana}`;
    return this.http.get<any[]>(urlHorarios, { headers: this.getHeaders() });
  }

}