import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pacientes`;

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

  obtenerPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  registrarPaciente(datosPaciente: any) {
    return this.http.post(this.apiUrl, datosPaciente, { headers: this.getHeaders() });
  }

  obtenerCitasPorPaciente(idPaciente: number) {
    const url_citas_por_paciente = `${environment.apiUrl}/api/citas/paciente/${idPaciente}`;
    return this.http.get<any[]>(url_citas_por_paciente, { headers: this.getHeaders() });
  }

  obtenerTratamientosPorPaciente(idPaciente: number) {
    const url_tratamientos = `${environment.apiUrl}/api/tratamientos/paciente/${idPaciente}`;
    return this.http.get<any[]>(url_tratamientos, { headers: this.getHeaders() });
  }

  actualizarEstadoCita(idCita: number, nuevoEstado: string): Observable<any> {
    const url = `${environment.apiUrl}/api/citas/${idCita}/estado`;
    const payload = { estado: nuevoEstado };
    return this.http.put(url, payload, { headers: this.getHeaders() });
  }
  
  registrarPago(datosPago: any): Observable<any> {
    const url = `${environment.apiUrl}/api/pagos`;
    return this.http.post(url, datosPago, { headers: this.getHeaders() });
  }

  registrarTratamiento(datosTratamiento: any): Observable<any> {
    const url = `${environment.apiUrl}/api/tratamientos`;
    return this.http.post(url, datosTratamiento, { headers: this.getHeaders() });
  }

  obtenerCatalogoServicios(): Observable<any[]> {
    const url = `${environment.apiUrl}/api/servicios`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() }); 
  }

  obtenerOdontologos(): Observable<any[]> {
    const url = `${environment.apiUrl}/api/usuarios`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() }); 
  }
}