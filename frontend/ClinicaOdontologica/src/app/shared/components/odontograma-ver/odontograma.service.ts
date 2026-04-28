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
    
    // 1. Buscamos la "pulsera" en el navegador
    const userGuardado = localStorage.getItem('usuario_dental');
    let headers = new HttpHeaders();

    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      
      // 2. Extraemos el token que nos mandó Spring Boot
      const token = usuario.token; 

      if (token) {
        // 3. Se lo pegamos a la cabecera (La forma estándar es poner "Bearer " antes del token)
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    } 

    // 4. Enviamos el paquete de datos Y las cabeceras
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

    // 2. Hacemos un GET a la ruta exacta que creamos en Spring Boot
    // Ejemplo: http://localhost:8080/api/odontogramas/paciente/1
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idPaciente}`, { headers });
  }
}