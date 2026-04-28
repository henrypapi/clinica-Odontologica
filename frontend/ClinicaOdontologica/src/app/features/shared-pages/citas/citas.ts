import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../citas/citas.service';
import { PacientesService } from '../pacientes/pacientes.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  cdr = inject(ChangeDetectorRef);
  listaCitas: any[] = [];
  listaCitasFiltradas: any[] = [];
  fechaFiltro: string = '';
  listaPacientes: any[] = [];
  listaPacientesFiltrados: any[] = [];
  terminoBusquedaPaciente: string = '';
  listaServicios: any[]= [];
  listaOdontologos: any[] = [];
  horasDia: string[] = [];
  diasSemana: any[] = []; 
  fechaReferenciaCalendario: Date = new Date();

  nuevaCita = {
    paciente: { idPaciente: null },
    odontologo: { idUsuario: null },
    fechaHora: '',
    estado: 'programada',
    motivo: '',
    catalogo_servicios: { id_catalogo_servicios: null}
  };

  vistaActual: string = 'lista'; 
  fechaMinima: string = '';
  mostrarModalConfirmacion: boolean = false;
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  tipoToast: string = 'exito';
  lanzarAviso(mensaje: string, tipo: string = 'exito') {
    this.cdr.detectChanges(); 
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    this.cdr.detectChanges(); 

    setTimeout(() => {
      this.mostrarToast = false;
      this.cdr.detectChanges(); 
    }, 3500);
  }

  cambiarVista(nuevaVista: string) {
    this.vistaActual = nuevaVista;
    
    if(this.vistaActual === 'lista') {
      this.cargarCitas();
    }
  }

  constructor(
    private citasService: CitasService,
    private pacientesService: PacientesService
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarCitas();
    this.cargarOdontologos();
    this.cargarServicios();
    this.generarHorasCalendario();
    this.calcularSemanaActual(this.fechaReferenciaCalendario);
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    this.fechaFiltro = hoy.toISOString().split('T')[0];

    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    this.fechaMinima = ahora.toISOString().slice(0, 16);
  }


cargarPacientes() {
    this.pacientesService.obtenerPacientes().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        this.listaPacientesFiltrados = data;
      },
      error: (err) => console.error('Error cargando pacientes', err)
    });
  }

  filtrarPacientes() {
    const termino = this.terminoBusquedaPaciente.toLowerCase();
    
    this.listaPacientesFiltrados = this.listaPacientes.filter(pac => {
      const nombreCompleto = `${pac.persona.nombres} ${pac.persona.apellidos}`.toLowerCase();
      return nombreCompleto.includes(termino);
    });

    if (!this.listaPacientesFiltrados.find(p => p.idPaciente === this.nuevaCita.paciente.idPaciente)) {
      this.nuevaCita.paciente.idPaciente = null;
    }
  }

  cargarOdontologos() {
    this.citasService.obtenerOdontologos().subscribe({
      next: (data) => {
        this.listaOdontologos = data;
      },
      error: (err) => console.error('Error cargando odontólogos', err)
    });
  }

cargarCitas() {
    this.citasService.obtenerCitas().subscribe({
      next: (data) => {
        this.listaCitas = data;
        
        this.cdr.detectChanges();
        this.filtrarCitasPorFecha(); 
      },
      error: (err) => console.error('Error cargando citas', err)
    });
  }

  filtrarCitasPorFecha() {
    if (!this.fechaFiltro) {
      this.listaCitasFiltradas = this.listaCitas;
    } else {
      this.listaCitasFiltradas = this.listaCitas.filter(cita => 
        cita.fechaHora.startsWith(this.fechaFiltro)
      );
    }
    this.cdr.detectChanges();
  }

cargarServicios() {
    this.citasService.obtenerServicios().subscribe({
      next: (data) => this.listaServicios = data,
      error: (err) => console.error('Error cargando servicios', err)
    });
  }

intentarAgendar() {
  this.cdr.detectChanges();
    if (!this.nuevaCita.paciente.idPaciente || 
        !this.nuevaCita.odontologo.idUsuario || 
        !this.nuevaCita.catalogo_servicios.id_catalogo_servicios || 
        !this.nuevaCita.fechaHora) {
      this.lanzarAviso('⚠️ Complete todos los campos del formulario.', 'error');
      return;
    }

    const fechaSeleccionada = new Date(this.nuevaCita.fechaHora);
    const ahora = new Date();

    if (fechaSeleccionada < ahora) {
      this.lanzarAviso('⏳ No puedes agendar citas en una fecha u hora que ya pasó.', 'error');
      return; 
    }

    const diaSemana = fechaSeleccionada.getDay();
    const horaCita = fechaSeleccionada.getHours();
    const minutosCita = fechaSeleccionada.getMinutes();
    const citaEnMinutosTotales = (horaCita * 60) + minutosCita;

    const idDoctor = this.nuevaCita.odontologo.idUsuario || this.nuevaCita.odontologo.idUsuario;

    this.citasService.obtenerHorarioOdontologo(idDoctor, diaSemana).subscribe({
      next: (horarios) => {
        
        if (horarios.length === 0) {
          this.lanzarAviso('📅 El odontólogo seleccionado no atiende este día de la semana.', 'error');
          return;
        }

        let dentroDelHorario = false;
        for (let turno of horarios) {
          const inicioArr = turno.horaInicio.split(':');
          const finArr = turno.horaFin.split(':');

          const inicioMinutos = (parseInt(inicioArr[0]) * 60) + parseInt(inicioArr[1]);
          const finMinutos = (parseInt(finArr[0]) * 60) + parseInt(finArr[1]);

          if (citaEnMinutosTotales >= inicioMinutos && citaEnMinutosTotales < finMinutos) {
            dentroDelHorario = true;
            break;
          }
        }

        if (!dentroDelHorario) {
          this.lanzarAviso('🏪 La hora seleccionada está fuera del turno del doctor.', 'error');
          return;
        }

        const idServicio = this.nuevaCita.catalogo_servicios.id_catalogo_servicios;
        const servicioSeleccionado = this.listaServicios.find(s => 
          s.id_catalogo_servicios === idServicio || s.idCatalogoServicios === idServicio
        );
        
        const duracionNuevo = servicioSeleccionado?.duracion_minutos || servicioSeleccionado?.duracionMinutos || 30;
        
        const inicioNuevoMs = fechaSeleccionada.getTime();
        const finNuevoMs = inicioNuevoMs + (duracionNuevo * 60000);

        let hayCruce = false;

        for (let citaExistente of this.listaCitas) {
          const idDoctorExistente = citaExistente.odontologo.id_usuario || citaExistente.odontologo.idUsuario;
          
          if (idDoctorExistente === idDoctor && citaExistente.estado !== 'cancelada') {
            
            const inicioExistenteMs = new Date(citaExistente.fechaHora).getTime();
            const duracionExistente = citaExistente.catalogo_servicios?.duracion_minutos || citaExistente.catalogo_servicios?.duracionMinutos || 30;
            const finExistenteMs = inicioExistenteMs + (duracionExistente * 60000);

            if (inicioNuevoMs < finExistenteMs && finNuevoMs > inicioExistenteMs) {
              hayCruce = true;
              break;
            }
          }
        }

        if (hayCruce) {
          this.lanzarAviso('⚠️ El doctor ya tiene una cita programada que choca con este horario.', 'error');
          return;
        }

        this.mostrarModalConfirmacion = true;
        this.cdr.detectChanges(); 

      },
      error: (err) => {
        console.error("Error al obtener horario", err);
        this.lanzarAviso('❌ Error de conexión al verificar el horario.', 'error');
      }
    });
  }

confirmarGuardado() {
    this.mostrarModalConfirmacion = false;
    this.cdr.detectChanges(); 

    // 2. Enviamos los datos a Java
    this.citasService.registrarCita(this.nuevaCita).subscribe({
      next: (citaGuardada) => {
        
        this.nuevaCita = {
          paciente: { idPaciente: null },
          odontologo: { idUsuario: null },
          fechaHora: '',
          estado: 'programada',
          motivo: '',
          catalogo_servicios: { id_catalogo_servicios: null }
        };

        this.lanzarAviso('¡Cita agendada con éxito!', 'exito');
        this.cdr.detectChanges();

        setTimeout(() => {
          this.cambiarVista('lista'); 
          this.cdr.detectChanges();
        }, 2000);

      },
      error: (err) => {
        console.error('Error al agendar:', err);
        this.lanzarAviso('❌ Error al guardar la cita.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

cancelarGuardado() {
  this.mostrarModalConfirmacion = false;
}

  generarHorasCalendario() {
    this.horasDia = [];
    const horaInicio = 6; // 7 AM
    const horaFin = 22;   // 8 PM

    for (let i = horaInicio; i <= horaFin; i++) {
      this.horasDia.push(i.toString().padStart(2, '0') + ':00');
    }
  }

  calcularSemanaActual(fechaBase: Date) {
    this.diasSemana = [];
    
    const inicioSemana = new Date(fechaBase);
    
    const diaSemana = inicioSemana.getDay();
    const diferencia = inicioSemana.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    inicioSemana.setDate(diferencia);
    inicioSemana.setHours(0, 0, 0, 0);

    const hoyReal = new Date();
    hoyReal.setHours(0, 0, 0, 0);

    const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
      const fechaDelDia = new Date(inicioSemana);
      fechaDelDia.setDate(inicioSemana.getDate() + i);

      this.diasSemana.push({
        fechaOriginal: fechaDelDia, 
        nombre: nombresDias[i], 
        numero: fechaDelDia.getDate(),
        esHoy: fechaDelDia.getTime() === hoyReal.getTime()
      });
    }
  }

  navegarSemanas(direccion: number) {
    this.fechaReferenciaCalendario.setDate(this.fechaReferenciaCalendario.getDate() + (direccion * 7));
    this.calcularSemanaActual(this.fechaReferenciaCalendario);
    
  }

  volverAHoyCalendario() {
    this.fechaReferenciaCalendario = new Date();
    this.calcularSemanaActual(this.fechaReferenciaCalendario);
  }


obtenerCitasParaElDia(fechaColumna: Date): any[] {
    const citasDelDia = this.listaCitas.filter(cita => {
      const fechaCita = new Date(cita.fechaHora);
      return fechaCita.getDate() === fechaColumna.getDate() &&
             fechaCita.getMonth() === fechaColumna.getMonth() &&
             fechaCita.getFullYear() === fechaColumna.getFullYear();
    });

  
    return citasDelDia
      .filter(cita => {
        const horaCita = new Date(cita.fechaHora).getHours();
        return horaCita >= 6 && horaCita <= 22; 
      })
      .map(cita => {
        const fechaCita = new Date(cita.fechaHora);
        const horaInicioCalendario = 6; 

        const horasDesdeInicio = fechaCita.getHours() - horaInicioCalendario;
        const minutos = fechaCita.getMinutes();
        
        const topPx = (horasDesdeInicio * 60) + minutos + 15; 

        const duracionMins = cita.catalogo_servicios?.duracion_minutos || cita.catalogo_servicios?.duracionMinutos || 30;
        const heightPx = duracionMins;

        // C. Colores
        let colorFondo = '#d97706'; 
        if (cita.estado === 'completada') colorFondo = '#0f766e'; 
        if (cita.estado === 'cancelada') colorFondo = '#ef4444';  

        return {
          ...cita,
          estiloFondo: colorFondo,
          estiloTop: topPx + 'px',
          estiloHeight: heightPx + 'px'
        };
      });
  }

}