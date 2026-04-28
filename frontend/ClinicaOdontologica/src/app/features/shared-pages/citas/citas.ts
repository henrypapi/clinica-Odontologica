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
  listaCitasFiltradas: any[] = []; // Esta es la lista que realmente verá el HTML
  fechaFiltro: string = ''; // Guardará la fecha que el usuario seleccione en el calendario
  listaPacientes: any[] = [];
  listaPacientesFiltrados: any[] = []; // La lista que se mostrará y filtrará
  terminoBusquedaPaciente: string = ''; // Lo que el usuario escribe en el buscador
  listaServicios: any[]= [];
  listaOdontologos: any[] = []; // Aquí luego puedes llamar a tu UsuarioService si lo tienes
  horasDia: string[] = []; // Guardará ['07:00', '08:00', ..., '20:00']
  diasSemana: any[] = []; // Guardará los 7 días de la semana actual
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

    // Se oculta automáticamente después de 3.5 segundos
    setTimeout(() => {
      this.mostrarToast = false;
      // ⚡ Otro "pellizco" para que lo oculte visualmente
      this.cdr.detectChanges(); 
    }, 3500);
  }

  // NUEVO: Función para cambiar de pestaña al hacer clic
  cambiarVista(nuevaVista: string) {
    this.vistaActual = nuevaVista;
    
    // Si volvemos a la lista, actualizamos los datos por si acaso
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
    // Truco para ajustar la zona horaria local (porque JavaScript usa UTC por defecto)
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    // Cortamos la cadena para que quede en formato "YYYY-MM-DDThh:mm"
    this.fechaMinima = ahora.toISOString().slice(0, 16);
  }


cargarPacientes() {
    this.pacientesService.obtenerPacientes().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        this.listaPacientesFiltrados = data; // Al inicio, mostramos todos
      },
      error: (err) => console.error('Error cargando pacientes', err)
    });
  }

  filtrarPacientes() {
    const termino = this.terminoBusquedaPaciente.toLowerCase();
    
    // Filtramos la lista original buscando coincidencias en nombre o apellido
    this.listaPacientesFiltrados = this.listaPacientes.filter(pac => {
      const nombreCompleto = `${pac.persona.nombres} ${pac.persona.apellidos}`.toLowerCase();
      return nombreCompleto.includes(termino);
    });

    // Si al filtrar, el paciente que estaba seleccionado desaparece de la lista, limpiamos la selección
    if (!this.listaPacientesFiltrados.find(p => p.idPaciente === this.nuevaCita.paciente.idPaciente)) {
      this.nuevaCita.paciente.idPaciente = null;
    }
  }

  cargarOdontologos() {
    this.citasService.obtenerOdontologos().subscribe({
      next: (data) => {
        this.listaOdontologos = data;
        console.log("Odontólogos cargados:", data); // Para verificar en consola
      },
      error: (err) => console.error('Error cargando odontólogos', err)
    });
  }

cargarCitas() {
    this.citasService.obtenerCitas().subscribe({
      next: (data) => {
        this.listaCitas = data;
        
        // PASO CLAVE: En lugar de solo mostrar todo, pasamos la data por el filtro
        this.cdr.detectChanges();
        this.filtrarCitasPorFecha(); 
      },
      error: (err) => console.error('Error cargando citas', err)
    });
  }

  filtrarCitasPorFecha() {
    if (!this.fechaFiltro) {
      // Si por alguna razón borra la fecha, le mostramos todas
      this.listaCitasFiltradas = this.listaCitas;
    } else {
      // Filtramos: Solo nos quedamos con las citas cuya fecha empiece exactamente igual que el filtro
      this.listaCitasFiltradas = this.listaCitas.filter(cita => 
        cita.fechaHora.startsWith(this.fechaFiltro)
      );
    }
    this.cdr.detectChanges(); // Obligamos a Angular a repintar la pantalla
  }

cargarServicios() {
    this.citasService.obtenerServicios().subscribe({
      next: (data) => this.listaServicios = data,
      error: (err) => console.error('Error cargando servicios', err)
    });
  }

intentarAgendar() {
  this.cdr.detectChanges();
    // 🛡️ ESCUDO 1: Campos vacíos
    if (!this.nuevaCita.paciente.idPaciente || 
        !this.nuevaCita.odontologo.idUsuario || 
        !this.nuevaCita.catalogo_servicios.id_catalogo_servicios || 
        !this.nuevaCita.fechaHora) {
      this.lanzarAviso('⚠️ Complete todos los campos del formulario.', 'error');
      return;
    }

    const fechaSeleccionada = new Date(this.nuevaCita.fechaHora);
    const ahora = new Date();

    // 🛡️ ESCUDO 2: La Máquina del Tiempo (Evitar el pasado)
    if (fechaSeleccionada < ahora) {
      this.lanzarAviso('⏳ No puedes agendar citas en una fecha u hora que ya pasó.', 'error');
      return; 
    }

    const diaSemana = fechaSeleccionada.getDay(); // 0 = Dom, 1 = Lun...
    const horaCita = fechaSeleccionada.getHours();
    const minutosCita = fechaSeleccionada.getMinutes();
    const citaEnMinutosTotales = (horaCita * 60) + minutosCita;

    const idDoctor = this.nuevaCita.odontologo.idUsuario || this.nuevaCita.odontologo.idUsuario;

    // 🛡️ ESCUDO 3: Verificamos el horario del doctor en la base de datos
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

        // =======================================================
        // 🛡️ ESCUDO 4: ANTI-CRUCES (DOBLE RESERVA)
        // =======================================================
        
        // 1. Calculamos cuánto dura el NUEVO servicio
        const idServicio = this.nuevaCita.catalogo_servicios.id_catalogo_servicios;
        const servicioSeleccionado = this.listaServicios.find(s => 
          s.id_catalogo_servicios === idServicio || s.idCatalogoServicios === idServicio
        );
        
        // Atrapamos los minutos (si Java no lo manda, usamos 30 por defecto)
        const duracionNuevo = servicioSeleccionado?.duracion_minutos || servicioSeleccionado?.duracionMinutos || 30;
        
        const inicioNuevoMs = fechaSeleccionada.getTime();
        const finNuevoMs = inicioNuevoMs + (duracionNuevo * 60000); // 1 min = 60000 milisegundos

        // 2. Comparamos con las citas que YA EXISTEN en la tabla de Angular
        let hayCruce = false;

        for (let citaExistente of this.listaCitas) {
          const idDoctorExistente = citaExistente.odontologo.id_usuario || citaExistente.odontologo.idUsuario;
          
          // Solo revisamos si es el mismo doctor y si la cita no está cancelada
          if (idDoctorExistente === idDoctor && citaExistente.estado !== 'cancelada') {
            
            const inicioExistenteMs = new Date(citaExistente.fechaHora).getTime();
            const duracionExistente = citaExistente.catalogo_servicios?.duracion_minutos || citaExistente.catalogo_servicios?.duracionMinutos || 30;
            const finExistenteMs = inicioExistenteMs + (duracionExistente * 60000);

            // Fórmula universal de cruce de horarios: (InicioA < FinB) Y (FinA > InicioB)
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

        // =======================================================
        // 🎉 ¡TODOS LOS ESCUDOS SUPERADOS!
        // =======================================================
        this.mostrarModalConfirmacion = true;
        this.cdr.detectChanges(); 

      },
      error: (err) => {
        console.error("Error al obtener horario", err);
        this.lanzarAviso('❌ Error de conexión al verificar el horario.', 'error');
      }
    });
  }

// PASO B: Si el usuario presiona "Sí, guardar"
confirmarGuardado() {
    // 1. Ocultamos el cuadro oscuro
    this.mostrarModalConfirmacion = false;
    this.cdr.detectChanges(); 

    // 2. Enviamos los datos a Java
    this.citasService.registrarCita(this.nuevaCita).subscribe({
      next: (citaGuardada) => {
        
        // 3. Limpiamos el formulario
        this.nuevaCita = {
          paciente: { idPaciente: null },
          odontologo: { idUsuario: null },
          fechaHora: '',
          estado: 'programada',
          motivo: '',
          catalogo_servicios: { id_catalogo_servicios: null }
        };

        // 4. Lanzamos el aviso verde INMEDIATAMENTE en la pantalla actual (Nueva Cita)
        this.lanzarAviso('¡Cita agendada con éxito!', 'exito');
        this.cdr.detectChanges();

        // 5. Hacemos una pausa de 2 segundos y LUEGO te llevamos a la lista
        setTimeout(() => {
          this.cambiarVista('lista'); 
          this.cdr.detectChanges();
        }, 2000); // 2000 milisegundos = 2 segundos de espera

      },
      error: (err) => {
        console.error('Error al agendar:', err);
        this.lanzarAviso('❌ Error al guardar la cita.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

// PASO C: Si el usuario presiona "No, seguir editando"
cancelarGuardado() {
  // Solo ocultamos el modal. Los datos siguen intactos en el formulario.
  this.mostrarModalConfirmacion = false;
}

// ==========================================
  // 📅 MOTOR DEL CALENDARIO SEMANAL
  // ==========================================

  // 1. Genera las horas de la columna izquierda (Ej: De 7 AM a 8 PM)
  generarHorasCalendario() {
    this.horasDia = [];
    const horaInicio = 6; // 7 AM
    const horaFin = 22;   // 8 PM

    for (let i = horaInicio; i <= horaFin; i++) {
      // Formatea el número a texto (ej: "07:00", "08:00", "15:00")
      this.horasDia.push(i.toString().padStart(2, '0') + ':00');
    }
  }

  // 2. Calcula los 7 días exactos de la semana actual
  calcularSemanaActual(fechaBase: Date) {
    this.diasSemana = [];
    
    // Clonamos la fecha para no dañar la variable original
    const inicioSemana = new Date(fechaBase);
    
    // Matemática para encontrar el Lunes de esta semana
    const diaSemana = inicioSemana.getDay(); // 0=Dom, 1=Lun...
    // Si es domingo (0), retrocedemos 6 días. Si no, retrocedemos hasta el Lunes.
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