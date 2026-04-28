import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🌟 Crucial para los inputs editables
import { GestionUsuariosService } from './gestion-usuarios.service';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuarios implements OnInit {

  private usuariosService = inject(GestionUsuariosService);
  private cdr = inject(ChangeDetectorRef);

  listaUsuarios: any[] = [];
  cargandoDatos: boolean = true;
  mostrarModalRegistro: boolean = false;
  mensajeExitoServicio: string = 'Servicio Registrado Correctamente';
  nuevoUsuarioBorrador: any = {
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    email: '',
    telefono: '',
    direccion: '',
    sexo: 'M', 
    fechaNacimiento: '',
    username: '',
    password: '',
    rol: 'empleado'
  };

  mostrarModalNuevoServicio: boolean = false;
  
  nuevoServicioBorrador: any = {
    nombre: '',
    descripcion: '',
    precio_base: 0,
    duracion_minutos: 30 
  };

  filtroRol: string = 'todos'; 
  listaServicios: any[] = [];
  cargandoServicios: boolean = true;
  
  mostrarModalServicio: boolean = false;
  servicioBorrador: any = {};

  mostrarModalAdministrar: boolean = false;
  usuarioEditando: any = null; 
  datosPerfilBorrador = {
    telefono: '',
    email: '',
    direccion: '',
    activo: true
  };

  horariosBorrador: any[] = [];
  cargandoHorarios: boolean = false;
  
  diasSemanaCatalogo = [
    { valor: 1, nombre: 'Lunes' },
    { valor: 2, nombre: 'Martes' },
    { valor: 3, nombre: 'Miércoles' },
    { valor: 4, nombre: 'Jueves' },
    { valor: 5, nombre: 'Viernes' },
    { valor: 6, nombre: 'Sábado' },
    { valor: 7, nombre: 'Domingo' }
  ];

  ngOnInit() {
    this.cargarTodosLosUsuarios();
    this.cargarServicios();
  }

  cargarTodosLosUsuarios() {
    this.cargandoDatos = true;
    this.usuariosService.obtenerTodosLosUsuarios().subscribe({
      next: (datos) => {
        this.listaUsuarios = datos;
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al cargar usuarios", err);
        this.cargandoDatos = false;
      }
    });
  }

  abrirPanelAdministracion(usuario: any) {
    this.usuarioEditando = usuario;
    
    this.datosPerfilBorrador = {
      telefono: usuario.telefono || '',
      email: usuario.email || '',
      direccion: usuario.direccion || '',
      activo: usuario.activo === true || usuario.activo === '1' || usuario.activo === 'true' // Ajusta según cómo venga de tu BD
    };

    this.mostrarModalAdministrar = true;

    if (usuario.rol === 'admin' || usuario.rol === 'empleado') {
      this.cargarHorariosDelOdontologo(usuario.idUsuario || usuario.id_usuario);
    }
  }

  cerrarPanelAdministracion() {
    this.mostrarModalAdministrar = false;
    this.usuarioEditando = null;
    this.horariosBorrador = [];
  }

  
  guardarCambiosPerfil() {
    const id = this.usuarioEditando.idUsuario || this.usuarioEditando.id_usuario;
    
    this.usuariosService.actualizarPerfilUsuario(id, this.datosPerfilBorrador).subscribe({
      next: (respuesta) => {
        alert("¡Perfil actualizado con éxito!");
        this.cargarTodosLosUsuarios();
      },
      error: (err) => console.error("Error guardando perfil", err)
    });
  }

  cargarHorariosDelOdontologo(id: number) {
    this.cargandoHorarios = true;
    this.usuariosService.obtenerHorariosOdontologo(id).subscribe({
      
      next: (horarios) => {
        this.horariosBorrador = horarios.map(h => ({
          ...h,
          dia_semana: parseInt(h.dia_semana) 
        }));
        this.cargandoHorarios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error cargando horarios", err);
        this.horariosBorrador = [];
        this.cargandoHorarios = false;
      }
    });
  }

  guardarCambiosHorarios() {
    const id = this.usuarioEditando.idUsuario || this.usuarioEditando.id_usuario;
    
    const invalidos = this.horariosBorrador.some(h => !h.hora_inicio || !h.hora_fin);
    if (invalidos) {
      alert("Por favor, completa todas las horas de inicio y fin.");
      return;
    }

    this.usuariosService.actualizarHorariosOdontologo(id, this.horariosBorrador).subscribe({
      next: (res) => {
        alert("🗓️ ¡Matriz de horarios actualizada con éxito!");
      },
      error: (err) => {
        console.error("Error al guardar horarios", err);
        alert("Error al guardar los horarios. Revisa la consola.");
      }
    });
  }

agregarDiaHorario() {
    const diasOcupados = this.horariosBorrador.map(h => Number(h.dia_semana));
    let diaSiguiente = 1;
    
    for (let i = 1; i <= 7; i++) {
      if (!diasOcupados.includes(i)) {
        diaSiguiente = i;
        break;
      }
    }

    this.horariosBorrador.push({ 
      dia_semana: diaSiguiente,
      hora_inicio: '08:00', 
      hora_fin: '20:00',
      esNuevo: true
    });
  }

  quitarDiaHorario(index: number) {
    this.horariosBorrador.splice(index, 1);
  }

  cargarServicios() {
    this.cargandoServicios = true;
    this.usuariosService.obtenerCatalogoServicios().subscribe({
      next: (datos) => {
        this.listaServicios = datos;
        this.cargandoServicios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al cargar servicios", err);
        this.cargandoServicios = false;
      }
    });
  }

  abrirPanelServicio(servicio: any) {
    this.servicioBorrador = {
      id_catalogo_servicios: servicio.id_catalogo_servicios,
      nombre: servicio.nombre,
      precio_base: servicio.precio_base || servicio.precioBase,
      descripcion: servicio.descripcion,
      duracion_minutos: servicio.duracion_minutos || servicio.duracionMinutos
    };
    this.mostrarModalServicio = true;
  }

  cerrarPanelServicio() {
    this.mostrarModalServicio = false;
    this.servicioBorrador = {};
  }

  guardarCambiosServicio() {
    const id = this.servicioBorrador.id_catalogo_servicios;

    const paquete = {
      nombre: this.servicioBorrador.nombre,
      descripcion: this.servicioBorrador.descripcion,
      precio_base: parseFloat(this.servicioBorrador.precio_base),
      duracion_minutos: parseInt(this.servicioBorrador.duracion_minutos)
    };

    this.usuariosService.actualizarServicio(id, paquete).subscribe({
      next: (res) => {
        alert("¡Servicio actualizado exitosamente!");
        this.cerrarPanelServicio();
        this.cargarServicios(); 
      },
      error: (err) => console.error("Error al actualizar servicio", err)
    });
  }

  abrirPanelRegistro() {
    
    this.nuevoUsuarioBorrador = {
      nombres: '', apellidos: '', tipoDocumento: 'DNI', numeroDocumento: '',
      email: '', telefono: '', direccion: '', sexo: 'M', fechaNacimiento: '',
      username: '', password: '', rol: 'empleado'
    };
    this.mostrarModalRegistro = true;
  }

  cerrarPanelRegistro() {
    this.mostrarModalRegistro = false;
  }

  guardarNuevoUsuario() {
    if (!this.nuevoUsuarioBorrador.nombres || !this.nuevoUsuarioBorrador.username || !this.nuevoUsuarioBorrador.password) {
      alert("Por favor, completa los campos obligatorios (Nombres, Usuario y Contraseña).");
      return;
    }

    this.usuariosService.registrarNuevoUsuario(this.nuevoUsuarioBorrador).subscribe({
      next: (res) => {
        alert("¡Nuevo personal registrado con éxito!");
        this.cerrarPanelRegistro();
        this.cargarTodosLosUsuarios();
      },
      error: (err) => {
        console.error("Error al registrar", err);
        alert("Ocurrió un error al registrar. Revisa que el nombre de usuario no esté repetido.");
      }
    });
  }
  abrirPanelNuevoServicio() {
    this.nuevoServicioBorrador = {
      nombre: '',
      descripcion: '',
      precio_base: 0,
      duracion_minutos: 30
    };
    this.mostrarModalNuevoServicio = true;
  }

  cerrarPanelNuevoServicio() {
    this.mostrarModalNuevoServicio = false;
  }

  guardarNuevoServicio() {
    if (!this.nuevoServicioBorrador.nombre || this.nuevoServicioBorrador.precio_base <= 0) {
      alert("Por favor, ingresa el nombre del servicio y un precio mayor a 0.");
      return;
    }

    const paquete = {
      nombre: this.nuevoServicioBorrador.nombre,
      descripcion: this.nuevoServicioBorrador.descripcion,
      precio_base: parseFloat(this.nuevoServicioBorrador.precio_base),
      duracion_minutos: parseInt(this.nuevoServicioBorrador.duracion_minutos)
    };

this.usuariosService.crearNuevoServicio(paquete).subscribe({
      next: (res) => {
        this.mensajeExitoServicio = "✨ ¡Servicio guardado con éxito!";
        this.cargarServicios(); 
        setTimeout(() => {
          this.cerrarPanelNuevoServicio();
          this.mensajeExitoServicio = ''; 
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        console.error("Error al crear servicio", err);
        alert("Ocurrió un error al guardar el servicio.");
      }
    });
  }
}