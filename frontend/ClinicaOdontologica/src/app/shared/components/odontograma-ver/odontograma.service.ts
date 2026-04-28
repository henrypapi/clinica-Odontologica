import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdontogramaService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/odontogramas';

  guardarOdontograma(datosOdontograma: any): Observable<any> {
    
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();

    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      
      const token = usuario.token; 

      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    } 

    return this.http.post(`${this.apiUrl}/guardar`, datosOdontograma, { headers });
  }

  obtenerHistorialDePaciente(idPaciente: number): Observable<any[]> {
    
    // 1. Buscamos la pulsera de seguridad
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();

    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      if (usuario.token) {
        headers = headers.set('Authorization', `Bearer ${usuario.token}`);
      }
    }

    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idPaciente}`, { headers });
  }
}