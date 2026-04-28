import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { PerfilService } from '../perfil/perfil.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  cdr = inject(ChangeDetectorRef);
  private usuarioService = inject(PerfilService);
  private router = inject(Router);

  // 🪪 Variables para la Tarjeta de Identidad
  miPerfil: any = null;
  cargandoPerfil: boolean = true;
  edadCalculada: number = 0;

  // ✏️ NUEVO: Variables para el Modo Edición
  modoEdicion: boolean = false;
  cargandoEdicion: boolean = false;
  datosEdicion: any = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: ''
  };

  // 🔒 Variables para la Tarjeta de Seguridad
  passAnterior: string = '';
  passNueva: string = '';
  confirmarPassNueva: string = '';
  
  // 📢 Variables para mensajes de feedback
  mensajeExito: string = '';
  mensajeError: string = '';
  cargandoPassword: boolean = false;

  ngOnInit() {
    this.cargarMisDatos();
  }

  // --- 1. LÓGICA DE IDENTIDAD ---
  cargarMisDatos() {
    this.cargandoPerfil = true;
    this.cdr.detectChanges();
    
    this.usuarioService.obtenerMiPerfil().subscribe({
      next: (datosPersonales) => {
        this.miPerfil = datosPersonales;
        
        if (this.miPerfil.persona && this.miPerfil.persona.fechaNacimiento) {
          this.edadCalculada = this.calcularEdad(this.miPerfil.persona.fechaNacimiento);
        }
        
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el perfil', err);
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      }
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const diferenciaMeses = hoy.getMonth() - cumpleanos.getMonth();
    
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  }


  activarEdicion() {
    this.modoEdicion = true;
    this.datosEdicion = {
      nombres: this.miPerfil.persona.nombres,
      apellidos: this.miPerfil.persona.apellidos,
      email: this.miPerfil.persona.email,
      telefono: this.miPerfil.persona.telefono
    };
    this.cdr.detectChanges();
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.cdr.detectChanges();
  }

guardarCambiosPerfil() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    if (!this.datosEdicion.nombres || !this.datosEdicion.apellidos) {
      this.mensajeError = 'Los nombres y apellidos son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    const letrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!letrasRegex.test(this.datosEdicion.nombres) || !letrasRegex.test(this.datosEdicion.apellidos)) {
      this.mensajeError = 'Los nombres y apellidos solo pueden contener letras.';
      this.cdr.detectChanges();
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.datosEdicion.email && !emailRegex.test(this.datosEdicion.email)) {
      this.mensajeError = 'Ingresa un correo electrónico válido (ejemplo@correo.com).';
      this.cdr.detectChanges();
      return;
    }

    const telefonoRegex = /^[+0-9\s]{7,15}$/;
    if (this.datosEdicion.telefono && !telefonoRegex.test(this.datosEdicion.telefono)) {
      this.mensajeError = 'El teléfono debe contener solo números (mínimo 8 dígitos).';
      this.cdr.detectChanges();
      return;
    }

    this.cargandoEdicion = true;
    this.cdr.detectChanges();

    // Llamamos al servicio
    this.usuarioService.actualizarMisDatos(this.datosEdicion).subscribe({
      next: (respuesta) => {
        this.miPerfil.persona.nombres = this.datosEdicion.nombres;
        this.miPerfil.persona.apellidos = this.datosEdicion.apellidos;
        this.miPerfil.persona.email = this.datosEdicion.email;
        this.miPerfil.persona.telefono = this.datosEdicion.telefono;

        this.mensajeExito = '¡Datos actualizados! Volviendo al Dashboard...'; 
        this.modoEdicion = false; 
        this.cargandoEdicion = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/dashboard']); 
        }, 1500);
      },
      error: (err) => {
        this.mensajeError = 'Error al actualizar los datos.';
        this.cargandoEdicion = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarMiPassword() {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.cdr.detectChanges();

    if (!this.passAnterior || !this.passNueva || !this.confirmarPassNueva) {
      this.mensajeError = 'Por favor, llena todos los campos de seguridad.';
      this.cdr.detectChanges();
      return;
    }

    if (this.passNueva !== this.confirmarPassNueva) {
      this.mensajeError = 'La contraseña nueva no coincide con la confirmación.';
      this.cdr.detectChanges();
      return;
    }

    if (this.passNueva.length < 6) {
      this.mensajeError = 'La nueva contraseña debe tener al menos 6 caracteres.';
      this.cdr.detectChanges();
      return;
    }

    this.cargandoPassword = true;
    this.cdr.detectChanges();

    this.usuarioService.cambiarPassword(this.passAnterior, this.passNueva).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Contraseña actualizada! Volviendo al Dashboard...';
        this.cargandoPassword = false;
        this.passAnterior = '';
        this.passNueva = '';
        this.confirmarPassNueva = '';
        this.cdr.detectChanges();


        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (errorHttp) => {
        this.cargandoPassword = false;
        if (errorHttp.error && errorHttp.error.error) {
          this.mensajeError = errorHttp.error.error; 
        } else {
          this.mensajeError = 'Error al cambiar la contraseña. Verifica tus datos.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}