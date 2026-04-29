import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🔥 NECESARIO PARA EL [(ngModel)] DEL MODAL
import { PacientesService } from '../pacientes/pacientes.service';

@Component({
  selector: 'app-tratamientos-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule], // No olvides añadir FormsModule aquí
  templateUrl: './tratamientos-paciente.html',
  styleUrls: ['./tratamientos-paciente.css']
})
export class TratamientosPaciente implements OnInit {
  
  @Input() pacienteSeleccionado: any;

  listaTratamientos: any[] = [];
  cargando: boolean = true;
  mostrarModalNuevoTratamiento: boolean = false;
  nuevoTratamiento = {
    id_servicio: '',
    id_odontologo: '',
    observaciones: '',
    tipo_aplicacion: 'general',
    diente: ''                
  };

  listaServiciosCatalogo: any[] = []; 
  listaOdontologos: any[] = [];

  // 🌟 VARIABLES PARA EL MODAL DE PAGO
  mostrarModalPago: boolean = false;
  tratamientoSeleccionado: any = null;
  nuevoPago = {
    monto: 0,
    metodo_pago: 'efectivo'
  };
  

  constructor(
    private cdr: ChangeDetectorRef,
    private pacientesService: PacientesService
  ) {}

  ngOnInit() {
    if (this.pacienteSeleccionado) {
      this.cargarTratamientos();
    }
    this.cargarCatalogos();
  }

  cargarTratamientos() {
    this.cargando = true;
    const id = this.pacienteSeleccionado.idPaciente || this.pacienteSeleccionado.id_paciente;

    this.pacientesService.obtenerTratamientosPorPaciente(id).subscribe({
      next: (datosReales) => {
        this.listaTratamientos = datosReales;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al traer los tratamientos:', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  calcularDeuda(costoTotal: number, abonado: number): number {
    const costo = costoTotal || 0; 
    const pago = abonado || 0;
    return costo - pago;
  }

  obtenerEstadoPago(costoTotal: number, abonado: number): string {
    const costo = costoTotal || 0;
    const pago = abonado || 0;
    
    if (pago >= costo && costo > 0) return 'pagado';
    if (pago > 0 && pago < costo) return 'pendiente';
    if(costo==0) return 'sin costo';
    return 'deuda'; 
  }

  
abrirModalTratamiento() {
    this.nuevoTratamiento = { 
      id_servicio: '', 
      id_odontologo: '', 
      observaciones: '',
      tipo_aplicacion: 'general',
      diente: ''
    };
    this.mostrarModalNuevoTratamiento = true;
  }

  cerrarModalTratamiento() {
    this.mostrarModalNuevoTratamiento = false;
  }

guardarNuevoTratamiento() {
    const paqueteTratamiento = {
      ...this.nuevoTratamiento,
      id_servicio: parseInt(this.nuevoTratamiento.id_servicio) || null,
      id_odontologo: parseInt(this.nuevoTratamiento.id_odontologo) || null,
      id_paciente: this.pacienteSeleccionado.idPaciente || this.pacienteSeleccionado.id_paciente,
      diente: this.nuevoTratamiento.tipo_aplicacion === 'especifico' ? parseInt(this.nuevoTratamiento.diente) : null
    };

    this.pacientesService.registrarTratamiento(paqueteTratamiento).subscribe({
      next: (respuesta) => {
        alert("¡Tratamiento creado exitosamente!");
        
        this.cargarTratamientos(); 
        this.cerrarModalTratamiento();
      },
      error: (err) => {
        console.error("Error al guardar el tratamiento", err);
        alert("Hubo un error de comunicación con el servidor.");
      }
    });
  }

  prepararPago(tratamiento: any) {
    this.tratamientoSeleccionado = tratamiento;
    const deudaCalculada = this.calcularDeuda(tratamiento.catalogo?.precio_base, tratamiento.abonado);
    this.nuevoPago.monto = deudaCalculada;
    this.nuevoPago.metodo_pago = 'efectivo';
    
    this.mostrarModalPago = true;
  }

  guardarPago() {
    if (this.nuevoPago.monto <= 0) {
      alert("El monto debe ser mayor a 0.");
      return;
    }

    const deudaActual = this.calcularDeuda(this.tratamientoSeleccionado.catalogo?.precio_base, this.tratamientoSeleccionado.abonado);
    if (this.nuevoPago.monto > deudaActual) {
      alert("No puedes cobrar más de la deuda restante (S/ " + deudaActual + ").");
      return;
    }

    const paquetePago = {
      monto: this.nuevoPago.monto,
      metodo_pago: this.nuevoPago.metodo_pago,
      id_paciente: this.pacienteSeleccionado.idPaciente || this.pacienteSeleccionado.id_paciente,
      id_tratamiento: this.tratamientoSeleccionado.idTratamiento
    };

    
    this.pacientesService.registrarPago(paquetePago).subscribe({
      next: (respuesta) => {
        this.mostrarModalPago = false;
        this.cargarTratamientos(); 
      },
      error: (err) => console.error("Fallo al registrar pago", err)
    });
    this.mostrarModalPago = false;
  }

  cargarCatalogos() {
    this.pacientesService.obtenerCatalogoServicios().subscribe({
      next: (serviciosDb) => {
        this.listaServiciosCatalogo = serviciosDb;
      },
      error: (err) => console.error("Error al cargar servicios", err)
    });
    this.pacientesService.obtenerOdontologos().subscribe({
      next: (doctoresDb) => {
        this.listaOdontologos = doctoresDb;
      },
      error: (err) => console.error("Error al cargar odontólogos", err)
    });
  }
}