import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/api/perfil`;

  obtenerMiPerfil(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  cambiarPassword(passwordAnterior: string, passwordNueva: string): Observable<any> {
    const body = { 
      passwordAnterior: passwordAnterior, 
      passwordNueva: passwordNueva 
    };
    
    return this.http.put<any>(`${this.apiUrl}/cambiar-password`, body);
  }

  actualizarMisDatos(datosActualizados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar`, datosActualizados);
  }
}