import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OdontogramaService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/odontogramas`;

  guardarOdontograma(datosOdontograma: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar`, datosOdontograma);
  }

  obtenerHistorialDePaciente(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idPaciente}`);
  }
}