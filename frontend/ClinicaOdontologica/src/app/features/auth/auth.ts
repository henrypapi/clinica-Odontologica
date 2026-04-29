import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs'; // 🌟 Importante añadir esto para manejar el error

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.apiUrl; 

  currentUser = signal<any>(null);

  constructor() {
    const userGuardado = localStorage.getItem('usuario_dental');
    if (userGuardado) {
      this.currentUser.set(JSON.parse(userGuardado));
    }
  }

  login(credenciales: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, credenciales); 
  }

  guardarSesion(datosUsuario: any) {
    this.currentUser.set(datosUsuario); 
    localStorage.setItem('usuario_dental', JSON.stringify(datosUsuario));
  }

  refreshToken() {
    const userGuardado = localStorage.getItem('usuario_dental');
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      return this.http.post(`${this.baseUrl}/auth/refresh`, {
        refreshToken: usuario.refreshToken
      });
    }
    return throwError(() => new Error('No hay sesión activa para refrescar'));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('usuario_dental');
    this.router.navigate(['/login']);
  }
  
  estaLogueado() {
    return this.currentUser() !== null;
  }
}