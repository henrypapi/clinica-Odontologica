import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/api/citas`;

  obtenerCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarCita(datosCita: any): Observable<any> {
    return this.http.post(this.apiUrl, datosCita);
  }

  obtenerOdontologos(): Observable<any[]> {
    const urlUsuarios = `${environment.apiUrl}/api/usuarios`;
    return this.http.get<any[]>(urlUsuarios);
  }

  obtenerServicios(): Observable<any[]> {
    const urlServicios = `${environment.apiUrl}/api/servicios`; 
    return this.http.get<any[]>(urlServicios);
  }
  
  obtenerHorarioOdontologo(idOdontologo: number, diaSemana: number): Observable<any[]> {
    const urlHorarios = `${environment.apiUrl}/api/horarios/odontologo/${idOdontologo}/dia/${diaSemana}`;
    return this.http.get<any[]>(urlHorarios);
  }

}