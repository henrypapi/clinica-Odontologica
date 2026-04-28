import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
// 🔥 IMPORTANTE: Asegúrate de que la ruta coincida con la ubicación de tu servicio
import { PacientesService } from '../pacientes/pacientes.service'; 

@Component({
  selector: 'app-historial-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-citas.html',
  styleUrls: ['./historial-citas.css']
})
export class HistorialCitas implements OnInit {
  
  @Input() pacienteSeleccionado: any;

  citasDelPaciente: any[] = [];
  cargando: boolean = true;

  // ⚡ Inyectamos el servicio de pacientes junto con el despertador
  constructor(
    private cdr: ChangeDetectorRef,
    private pacientesService: PacientesService
  ) {}

  ngOnInit() {
    // Cuando el componente nace, dispara la búsqueda real
    if (this.pacienteSeleccionado) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    this.cargando = true;
    
    // Obtenemos el ID del paciente (verifica si en tu BD se llama idPaciente o id_paciente)
    const id = this.pacienteSeleccionado.idPaciente; 

    // 🔥 Llamamos a Java a través del servicio
    this.pacientesService.obtenerCitasPorPaciente(id).subscribe({
      next: (datosReales) => {
        // Guardamos los datos que llegaron de la base de datos
        this.citasDelPaciente = datosReales;
        this.cargando = false;
        
        // ⚡ ¡PELLIZCO! Obligamos a Angular a dibujar la tabla con los datos reales
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Error al traer el historial de citas:', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  
  cambiarEstadoCita(cita: any, event: any) {
    // 1. Extraemos el texto que el usuario acaba de seleccionar (Ej: "Cancelado")
    const nuevoEstado = event.target.value;
    
    // 2. Guardamos el estado original en la memoria temporal por si Java falla
    const estadoAnterior = cita.estado;

    // 3. Actualización Optimista: Cambiamos el estado visualmente al instante
    cita.estado = nuevoEstado;
    this.cdr.detectChanges();

    // 4. Preparamos el ID de la cita. 
    // 🚨 VERIFICA: Revisa si en tu base de datos el ID de la cita se llama 'idCita' o solo 'id'
    const idDeLaCita = cita.id_cita; 

    // 5. Enviamos la orden al servicio (Este método nos dará error ahora, lo crearemos en el Paso 3)
    this.pacientesService.actualizarEstadoCita(idDeLaCita, nuevoEstado).subscribe({
      next: (respuesta) => {
        // Si Java responde "OK", no hacemos nada porque ya lo cambiamos visualmente
        console.log(`Cita ${idDeLaCita} actualizada a: ${nuevoEstado}`);
      },
      error: (err) => {
        // Si Java falla (ej. se cayó el servidor), revertimos la trampa visual
        console.error('Error al comunicarse con la Base de Datos', err);
        cita.estado = estadoAnterior; 
        
        // Opcional: Mostrar un mensaje al usuario
        alert('Hubo un error al guardar el estado. Inténtalo de nuevo.');
        
        // Volvemos a dibujar la pantalla con el estado viejo
        this.cdr.detectChanges();
      }
    });
  }
}