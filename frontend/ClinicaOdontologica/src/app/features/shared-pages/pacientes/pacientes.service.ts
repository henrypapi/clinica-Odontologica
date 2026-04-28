import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/pacientes';

  obtenerPacientes(): Observable<any[]> {
    
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

registrarPaciente(datosPaciente: any) {
    const urlBackend = 'http://localhost:8080/api/pacientes'; 
    
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();

    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }

    return this.http.post(urlBackend, datosPaciente, { headers });
  }

    obtenerCitasPorPaciente(idPaciente: number) {
    const url_citas_por_paciente =`http://localhost:8080/api/citas/paciente/${idPaciente}`
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    if(userGuardado){
      const usuario = JSON.parse(userGuardado);
      if(usuario.token){
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.get<any[]>(url_citas_por_paciente, { headers });
  }
  obtenerTratamientosPorPaciente(idPaciente: number) {
    const url_tratamientos = `http://localhost:8080/api/tratamientos/paciente/${idPaciente}`;
    
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    
    return this.http.get<any[]>(url_tratamientos, { headers });
  }

  actualizarEstadoCita(idCita: number, nuevoEstado: string): Observable<any> {
    const url = `http://localhost:8080/api/citas/${idCita}/estado`;
    
    const payload = { 
      estado: nuevoEstado 
    };
       const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();
    
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.put(url, payload, { headers });
  }
  
  registrarPago(datosPago: any): Observable<any> {
    const userGuardado = localStorage.getItem('usuario_dental');
    const url = `http://localhost:8080/api/pagos`;
    
    
    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.post(url, datosPago, { headers });
  }

  registrarTratamiento(datosTratamiento: any): Observable<any> {
    const url = `http://localhost:8080/api/tratamientos`;
    const userGuardado = localStorage.getItem('usuario_dental');

    let headers = new HttpHeaders();
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }
    return this.http.post(url, datosTratamiento, { headers });
  }

  obtenerCatalogoServicios(): Observable<any[]> {
    const url = `http://localhost:8080/api/servicios`
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

  obtenerOdontologos(): Observable<any[]> {
    const url = `http://localhost:8080/api/usuarios`
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
}