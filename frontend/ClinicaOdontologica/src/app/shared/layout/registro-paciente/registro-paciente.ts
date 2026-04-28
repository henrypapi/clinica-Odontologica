import { Component, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { PacientesService } from '../../../features/shared-pages/pacientes/pacientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-paciente.html',
  styleUrl: './registro-paciente.css',
})
export class RegistroPaciente {
  registroPacienteSeleccionado = false;
  @Output() pacienteCreado = new EventEmitter<any>();
  @Output() cancelarRegistro = new EventEmitter<void>();
  private router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  nuevoPaciente = {
    persona: {
      nombres: '',
      apellidos: '',
      numeroDocumento: '',
      tipoDocumento: 'dni', // Por defecto seleccionado
      email: '',
      direccion: '',
      fechaNacimiento: '', 
      sexo: 'Masculino',
      telefono: '',
    },
    grupoSanguineo: '',
    alergias: '',
    antecedentesMedicos: '',
    nombreContactoEmergencia: '',
    telefonoEmergencia: ''
    
  };

  docMaxLength: number = 8;
  docPattern: string = "[0-9]{8}";
  docPlaceholder: string = "Ingrese DNI (8 dígitos)";

  constructor(private pacientesService: PacientesService) {}

  RegistroPaciente() {
    this.registroPacienteSeleccionado = true;
    this.ocultarBotonRegistro(this.registroPacienteSeleccionado);
  }

  CancelarRegistroPaciente() {
    this.cancelarRegistro.emit();
  }

  ocultarBotonRegistro(registroPacienteSeleccionado: Boolean): void {
    const elemento = document.getElementById("registroBoton");
    if (elemento) {
      elemento.style.display = registroPacienteSeleccionado ? "none" : "block";
    }
  }

cambiarDocumento(): void {
    const tipo = this.nuevoPaciente.persona.tipoDocumento;

    this.nuevoPaciente.persona.numeroDocumento = '';

    if (tipo === "dni") {
      this.docMaxLength = 8;
      this.docPattern = "[0-9]{8}";
      this.docPlaceholder = "Ingrese DNI (8 dígitos)";
    } 
    else if (tipo === "ce") {
      this.docMaxLength = 9;
      this.docPattern = "[0-9]{9}";
      this.docPlaceholder = "Carnet de extranjería (9 dígitos)";
    } 
    else if (tipo === "pasaporte") {
      this.docMaxLength = 12;
      this.docPattern = "[A-Za-z0-9]{6,12}";
      this.docPlaceholder = "Pasaporte (6 a 12 caracteres)";
    }
  }

registroPacienteenDB() {
    if (!this.nuevoPaciente.persona.nombres || !this.nuevoPaciente.persona.numeroDocumento) {
      alert('⚠️ Por favor, ingrese al menos el nombre y el número de documento del paciente.');
      return; 
    }

    this.pacientesService.registrarPaciente(this.nuevoPaciente).subscribe({
      
      next: (respuestaServidor) => {
        alert('✅ ¡Paciente registrado con éxito en la Base de Datos!');
        this.pacienteCreado.emit(respuestaServidor);
        this.CancelarRegistroPaciente(); 
        setTimeout(() => {
          this.CancelarRegistroPaciente();
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (error) => {
        console.error('Error detallado:', error);
        alert('❌ Hubo un error al registrar el paciente. Revisa la consola (F12).');
      }
      
    });
  }
  vistaActual: string = 'pacientes'; 
  cambiarVista(nuevaVista: string) {
    this.vistaActual = nuevaVista;
    
  }

  mostrarModal: boolean = false;

  abrirModalConfirmacion() {
    if (!this.nuevoPaciente.persona.nombres || !this.nuevoPaciente.persona.numeroDocumento) {
      alert('⚠️ Por favor, ingrese al menos el nombre y el número de documento.');
      return; 
    }
    this.mostrarModal = true;
  }

  cerrarModalConfirmacion() {
    this.mostrarModal = false;
  }

  confirmarRegistro() {
    this.mostrarModal = false;
    this.registroPacienteenDB(); 
  }
}