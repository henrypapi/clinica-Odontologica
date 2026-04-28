import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private http = inject(HttpClient);
  // La ruta base hacia el controlador que creamos en el Paso 2
  private apiUrl = 'http://localhost:8080/api/perfil';

  // 🛠️ FUNCIÓN AUXILIAR: Extrae el token de la mochila (localStorage) y lo pone en la cabecera
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

  // 🚪 PETICIÓN 1: Traer los datos del perfil
  obtenerMiPerfil(): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    // Angular hace el GET. Ojo: no mandamos ningún ID en la URL, Java lo descubre por el Token.
    return this.http.get<any>(this.apiUrl, { headers });
  }

  // 🚪 PETICIÓN 2: Cambiar la contraseña
  cambiarPassword(passwordAnterior: string, passwordNueva: string): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    const body = { 
      passwordAnterior: passwordAnterior, 
      passwordNueva: passwordNueva 
    };
    
    // Hacemos un PUT hacia la ruta exacta y enviamos el JSON (body) y el Token (headers)
    return this.http.put<any>(`${this.apiUrl}/cambiar-password`, body, { headers });
  }

  // 🌟 NUEVO - PETICIÓN 3: Actualizar datos personales (Nombres, Apellidos, Correo, Teléfono)
  actualizarMisDatos(datosActualizados: any): Observable<any> {
    const headers = this.obtenerCabecerasSeguras();
    // Hacemos un PUT hacia la ruta /actualizar, enviando los datos nuevos
    return this.http.put<any>(`${this.apiUrl}/actualizar`, datosActualizados, { headers });
  }
}