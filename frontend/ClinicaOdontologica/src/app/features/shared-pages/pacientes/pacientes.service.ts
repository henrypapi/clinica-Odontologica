import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pacientes`;


  obtenerPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarPaciente(datosPaciente: any) {
    return this.http.post(this.apiUrl, datosPaciente);
  }

  obtenerCitasPorPaciente(idPaciente: number) {
    const url_citas_por_paciente = `${environment.apiUrl}/api/citas/paciente/${idPaciente}`;
    return this.http.get<any[]>(url_citas_por_paciente);
  }

  obtenerTratamientosPorPaciente(idPaciente: number) {
    const url_tratamientos = `${environment.apiUrl}/api/tratamientos/paciente/${idPaciente}`;
    return this.http.get<any[]>(url_tratamientos);
  }

  actualizarEstadoCita(idCita: number, nuevoEstado: string): Observable<any> {
    const url = `${environment.apiUrl}/api/citas/${idCita}/estado`;
    const payload = { estado: nuevoEstado };
    return this.http.put(url, payload);
  }
  
  registrarPago(datosPago: any): Observable<any> {
    const url = `${environment.apiUrl}/api/pagos`;
    return this.http.post(url, datosPago);
  }

  registrarTratamiento(datosTratamiento: any): Observable<any> {
    const url = `${environment.apiUrl}/api/tratamientos`;
    return this.http.post(url, datosTratamiento);
  }

  obtenerCatalogoServicios(): Observable<any[]> {
    const url = `${environment.apiUrl}/api/servicios`;
    return this.http.get<any[]>(url); 
  }

  obtenerOdontologos(): Observable<any[]> {
    const url = `${environment.apiUrl}/api/usuarios`;
    return this.http.get<any[]>(url); 
  }
}