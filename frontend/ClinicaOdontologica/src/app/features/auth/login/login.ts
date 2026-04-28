import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);       
  private cdr = inject(ChangeDetectorRef);

  mensajeError: string = ''; 

  miFormulario = this.fb.group({
    username: ['', Validators.required], 
    password: ['', Validators.required] 
  });

  alPresionarIngresar() {
    this.mensajeError = '';

    if (this.miFormulario.valid) {
      const datosLogin = this.miFormulario.value;
      
      this.authService.login(datosLogin).subscribe({
        next: (respuesta: any) => {
          alert('Bienvenido ' + respuesta.username); 
          this.authService.guardarSesion(respuesta);
          
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error("Error completo:", error);

          if (error.status === 403) {
            this.mensajeError = (typeof error.error === 'string') ? error.error : "Tu cuenta está bloqueada. Comunícate con el administrador.";
            
          } else if (error.status === 401) {
            this.mensajeError = "Usuario o contraseña incorrectos.";
            
          } else {
            this.mensajeError = "Error al intentar conectar con el sistema.";
          }

          this.cdr.detectChanges(); 
        } 
      });
    } else {
      this.mensajeError = 'Por favor llena todos los campos';
      this.cdr.detectChanges(); 
    }
  }
}