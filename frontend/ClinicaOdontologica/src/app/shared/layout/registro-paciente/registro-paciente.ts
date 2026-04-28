import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { PacientesService } from '../../../features/shared-pages/pacientes/pacientes.service';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-paciente.html',
  styleUrl: './registro-paciente.css',
})
export class RegistroPaciente {
  registroPacienteSeleccionado = false;
  @Output() pacienteCreado = new EventEmitter<any>();

  // --- PASO 1: EL MOLDE DE DATOS ---
  // Este objeto tiene la estructura exacta que Java espera para guardar ambos: Paciente y Persona
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
    this.registroPacienteSeleccionado = false;
    this.ocultarBotonRegistro(this.registroPacienteSeleccionado);
  }

  ocultarBotonRegistro(registroPacienteSeleccionado: Boolean): void {
    const elemento = document.getElementById("registroBoton");
    if (elemento) {
      elemento.style.display = registroPacienteSeleccionado ? "none" : "block";
    }
  }

cambiarDocumento(): void {
    // 1. Leemos el tipo directamente desde nuestro modelo, sin tocar el HTML
    const tipo = this.nuevoPaciente.persona.tipoDocumento;

    // 2. Limpiamos el número anterior por si el usuario se equivocó y cambió de opinión
    this.nuevoPaciente.persona.numeroDocumento = '';

    // 3. Actualizamos nuestras variables de control
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
    // 1. Validación rápida: obligar a que al menos ponga nombre y documento
    if (!this.nuevoPaciente.persona.nombres || !this.nuevoPaciente.persona.numeroDocumento) {
      alert('⚠️ Por favor, ingrese al menos el nombre y el número de documento del paciente.');
      return; 
    }

    // 2. Llamamos al servicio y le entregamos el molde lleno de datos
    this.pacientesService.registrarPaciente(this.nuevoPaciente).subscribe({
      
      // Si Java responde "Todo salió bien (Código 200 OK)":
      next: (respuestaServidor) => {
        alert('✅ ¡Paciente registrado con éxito en la Base de Datos!');
        this.pacienteCreado.emit(respuestaServidor);
        
        // Cerramos la cajita del formulario para limpiar la pantalla
        this.CancelarRegistroPaciente(); 
      },

      // Si Java responde "Hubo un error (ej. la base de datos está apagada)":
      error: (error) => {
        console.error('Error detallado:', error);
        alert('❌ Hubo un error al registrar el paciente. Revisa la consola (F12).');
      }
      
    });
  }
}