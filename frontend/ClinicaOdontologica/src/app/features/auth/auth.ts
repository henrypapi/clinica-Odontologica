import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth/login`;

  currentUser = signal<any>(null);

  constructor() {
    const userGuardado = localStorage.getItem('usuario_dental');
    if (userGuardado) {
      this.currentUser.set(JSON.parse(userGuardado));
    }
  }

  login(credenciales: any) {
    return this.http.post(this.apiUrl, credenciales);
  }

  guardarSesion(datosUsuario: any) {
    this.currentUser.set(datosUsuario); 
    localStorage.setItem('usuario_dental', JSON.stringify(datosUsuario));
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