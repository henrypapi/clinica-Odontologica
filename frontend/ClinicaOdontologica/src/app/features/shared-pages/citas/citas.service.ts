import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  
  private http = inject(HttpClient);
  // La ruta exacta de tu CitasController en Spring Boot
  private apiUrl = 'http://localhost:8080/api/citas';

  // --- TRUCO ARQUITECTÓNICO ---
  // Función auxiliar que le pone la "pulsera de seguridad" (Token) al cartero
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

  // 1. Misión: Ir a Java y traer la lista de todas las citas (GET)
  obtenerCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 2. Misión: Llevar una cita nueva a Java para guardarla (POST)
  registrarCita(datosCita: any): Observable<any> {
    return this.http.post(this.apiUrl, datosCita, { headers: this.getHeaders() });
  }

  // 3. Misión: Traer la lista de Odontólogos/Usuarios de la BD
  obtenerOdontologos(): Observable<any[]> {
    const urlUsuarios = 'http://localhost:8080/api/usuarios';
    return this.http.get<any[]>(urlUsuarios, { headers: this.getHeaders() });
  }

  obtenerServicios(): Observable<any[]> {
    const urlServicios = 'http://localhost:8080/api/servicios'; // Ajusta esto si tu ruta en Java es diferente
    return this.http.get<any[]>(urlServicios, { headers: this.getHeaders() });
  }
  obtenerHorarioOdontologo(idOdontologo: number, diaSemana: number): Observable<any[]> {
    const urlHorarios = `http://localhost:8080/api/horarios/odontologo/${idOdontologo}/dia/${diaSemana}`;
    
    return this.http.get<any[]>(urlHorarios, { headers: this.getHeaders() });
  }

}