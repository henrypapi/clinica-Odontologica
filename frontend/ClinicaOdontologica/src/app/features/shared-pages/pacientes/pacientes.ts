import { Component, OnInit, OnChanges,ChangeDetectorRef,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OdontogramaVer } from '../../../shared/components/odontograma-ver/odontograma-ver';
import { PacientesService } from '../pacientes/pacientes.service';
import { RegistroPaciente } from '../../../shared/layout/registro-paciente/registro-paciente'
import { HistorialCitas } from '../historial-citas/historial-citas';
import { TratamientosPaciente } from '../tratamientos-paciente/tratamientos-paciente';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, OdontogramaVer, RegistroPaciente,HistorialCitas,TratamientosPaciente],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css',
})

export class Pacientes implements OnInit {

  cdr = inject(ChangeDetectorRef);
  
  vistaActual: string = 'lista'; 
  
  listaPacientes: any[] = [];
  pacientesFiltrados: any[] = []; 
  textoBusqueda: string = '';
  pacienteSeleccionado: any = null;

  cargando: boolean = true; 
  timeoutBusqueda: any;

  constructor(private pacientesService: PacientesService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.cargando = true;
    this.cdr.detectChanges();
    this.pacientesService.obtenerPacientes().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        this.pacientesFiltrados = data; 
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pacientes', err);
        this.cargando = false; 
      }
    });
  }
  buscarPaciente() {
    this.cargando = true;
    
    if (this.timeoutBusqueda) {
      clearTimeout(this.timeoutBusqueda);
    }

    this.timeoutBusqueda = setTimeout(() => {
      
      if (!this.textoBusqueda) {
        this.pacientesFiltrados = this.listaPacientes;
      } else {
        const busqueda = this.textoBusqueda.toLowerCase();
        this.pacientesFiltrados = this.listaPacientes.filter(pac => 
          pac.persona.nombres.toLowerCase().includes(busqueda) ||
          pac.persona.apellidos.toLowerCase().includes(busqueda) ||
          (pac.persona.numeroDocumento && pac.persona.numeroDocumento.includes(busqueda))
        );
      }
      
      this.cargando = false;
      this.cdr.detectChanges();
      
    }, 300);
  }

  cambiarVista(nuevaVista: string, paciente?: any) {
    this.cdr.detectChanges();
    this.vistaActual = nuevaVista;
    if (paciente) {
      this.pacienteSeleccionado = paciente;
    }
    if (nuevaVista === 'lista') {
      this.pacienteSeleccionado = null;
      this.cargarPacientes();
    }
  }
}
