import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router'; // Necesitamos esto para sacar al usuario

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/auth/login';

  // 1. LA SEÑAL MÁGICA: Aquí guardamos al usuario actual
  // Si es null, nadie está logueado.
  currentUser = signal<any>(null);

  constructor() {
    // 2. AL INICIAR LA APP: Revisamos si ya había alguien guardado
    const userGuardado = localStorage.getItem('usuario_dental');
    if (userGuardado) {
      this.currentUser.set(JSON.parse(userGuardado));
    }
  }

  login(credenciales: any) {
    return this.http.post(this.apiUrl, credenciales);
  }

  // 3. MÉTODO PARA GUARDAR LA SESIÓN (Lo llamaremos desde el Login)
  guardarSesion(datosUsuario: any) {
    this.currentUser.set(datosUsuario); // Actualizamos la señal
    localStorage.setItem('usuario_dental', JSON.stringify(datosUsuario)); // Guardamos en el navegador
  }

  // 4. MÉTODO PARA CERRAR SESIÓN (Lo llamaremos desde el Navbar)
  logout() {
    this.currentUser.set(null); // Borramos la señal
    localStorage.removeItem('usuario_dental'); // Borramos del navegador
    this.router.navigate(['/login']); // Mandamos al login
  }
  
  // Helper para saber si está logueado (retorna true o false)
  estaLogueado() {
    return this.currentUser() !== null;
  }
}