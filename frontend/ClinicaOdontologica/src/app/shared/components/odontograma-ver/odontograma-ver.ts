import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Diente } from '../diente/diente';
import { OdontogramaService } from './odontograma.service';
import { RegistroPaciente } from '../../layout/registro-paciente/registro-paciente'

@Component({
  selector: 'app-odontograma-ver',
  standalone: true,
  imports: [CommonModule, FormsModule, Diente, RegistroPaciente],
  templateUrl: './odontograma-ver.html',
  styleUrl: './odontograma-ver.css'
})
export class OdontogramaVer implements OnInit, OnChanges {

  odontogramaService = inject(OdontogramaService);
  cdr = inject(ChangeDetectorRef);
  
  // Recibimos el paciente desde el Dashboard
  @Input() pacienteSeleccionado: any = null; 

  historialOdontogramas: any[] = []; 

  traductorCaras: any = { 'arriba': 'VESTIBULAR', 'abajo': 'LINGUAL', 'izquierda': 'MESIAL', 'derecha': 'DISTAL', 'centro': 'OCLUSAL' };
  traductorCarasInverso: any = { 'VESTIBULAR': 'arriba', 'LINGUAL': 'abajo', 'MESIAL': 'izquierda', 'DISTAL': 'derecha', 'OCLUSAL': 'centro' };
  
  modoEdicion: boolean = true;
  tipoOdontograma: string = 'INICIAL';
  observacionGeneral: string = '';
  mapaNotas: any = {}; 
  notaModalActual: string = '';

  dientes18al11 = [18, 17, 16, 15, 14, 13, 12, 11];
  dientes21al28 = [21, 22, 23, 24, 25, 26, 27, 28];
  dientes55al51 = [55, 54, 53, 52, 51];
  dientes61al65 = [61, 62, 63, 64, 65];
  dientes85al81 = [85, 84, 83, 82, 81];
  dientes71al75 = [71, 72, 73, 74, 75];
  dientes48al41 = [48, 47, 46, 45, 44, 43, 42, 41];
  dientes31al38 = [31, 32, 33, 34, 35, 36, 37, 38];

  mapaDientes: any = {};
  modalAbierto = false;
  seleccionActual: { diente: number, cara: string } | null = null;

  constructor() {
    this.inicializarMapa();
  }

  // 1. Cuando el componente NACE (gracias al *ngIf)
  ngOnInit(): void {
    if (this.pacienteSeleccionado) {
      console.log('✅ OnInit: Odontograma despertó con el paciente:', this.pacienteSeleccionado);
      this.cargarHistorialPaciente();
    }
  }

  // 2. Cuando el paciente CAMBIA mientras el componente está vivo
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pacienteSeleccionado'] && !changes['pacienteSeleccionado'].firstChange) {
      console.log('🔄 OnChanges: El doctor cambió de paciente:', this.pacienteSeleccionado);
      this.cargarHistorialPaciente();
    }
  }

  cargarHistorialPaciente() {
    this.observacionGeneral = '';
    this.tipoOdontograma = 'INICIAL';
    this.modoEdicion = true;
    this.inicializarMapa();

    // Validamos cómo se llama el ID del paciente en tu BD (puede ser idPaciente o id_paciente)
    const idParaBuscar = this.pacienteSeleccionado.idPaciente || this.pacienteSeleccionado.id_paciente;

    this.odontogramaService.obtenerHistorialDePaciente(idParaBuscar).subscribe({
      next: (historial) => {
        this.historialOdontogramas = historial;
        console.log('📚 Historial descargado:', historial);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error al cargar el historial', err)
    });
  }

  verOdontogramaAntiguo(odontograma: any) {
    console.log('🔍 Cargando odontograma antiguo:', odontograma);
    this.inicializarMapa();

    // Verificamos si los detalles existen en 'detalles' o quizás Spring Boot los mandó como 'detalleOdontograma'
    const detallesDelRegistro = odontograma.detalles || odontograma.detalleOdontograma || odontograma.detallesOdontograma;

    if (detallesDelRegistro && detallesDelRegistro.length > 0) {
      detallesDelRegistro.forEach((detalle: any) => {
        const numDiente = detalle.diente;
        const caraVisual = this.traductorCarasInverso[detalle.cara];
        
        let colorPintar = 'blue'; 
        if (detalle.diagnostico === 'Caries') {
          colorPintar = 'red';
        }

        if (this.mapaDientes[numDiente] && caraVisual) {
          this.mapaDientes[numDiente][caraVisual] = colorPintar;
          if (detalle.notas) {
            const clave = `${numDiente}-${caraVisual}`;
            this.mapaNotas[clave] = detalle.notas;
          }
        }
      });
    } else {
      console.warn('⚠️ Este odontograma no tiene detalles registrados o la variable tiene otro nombre.');
    }

    this.modoEdicion = false; 
    this.observacionGeneral = odontograma.observaciones || 'Sin observaciones registradas.';
    this.tipoOdontograma = odontograma.tipo || 'INICIAL';
  }

  inicializarMapa() {
    const todos = [...this.dientes18al11, ...this.dientes21al28, ...this.dientes48al41, ...this.dientes31al38,...this.dientes55al51,...this.dientes61al65,...this.dientes71al75,...this.dientes85al81 ];
    this.mapaNotas = {};
    todos.forEach(num => {
      this.mapaDientes[num] = { arriba: 'white', abajo: 'white', izquierda: 'white', derecha: 'white', centro: 'white' };
    });
  }

  procesarClicDiente(numeroDiente: number, cara: string) {
    if (!this.modoEdicion) {
      const clave = `${numeroDiente}-${cara}`;
      const notaGuardada = this.mapaNotas[clave] ? `\nNota: ${this.mapaNotas[clave]}` : '';
      alert(`Modo Lectura: Diente ${numeroDiente}, cara ${cara}${notaGuardada}`);
      return;
    }

    this.seleccionActual = { diente: numeroDiente, cara: cara };
    const clave = `${numeroDiente}-${cara}`;
    this.notaModalActual = this.mapaNotas[clave] || ''; 
    this.modalAbierto = true;
  }

  aplicarTratamiento(color: string) {
    if (this.seleccionActual) {
      const { diente, cara } = this.seleccionActual;
      this.mapaDientes[diente][cara] = color;
      
      const clave = `${diente}-${cara}`;
      if (color === 'white') {
        delete this.mapaNotas[clave];
      } else {
        this.mapaNotas[clave] = this.notaModalActual;
      }
      this.cerrarModal();
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.seleccionActual = null;
  }

  guardarEnBaseDeDatos() {
    if (!this.pacienteSeleccionado) {
      alert('Error crítico: Paciente perdido.');
      return;
    }

    let idOdontologoActual = 1; 
    const userGuardado = localStorage.getItem('usuario_dental');
    if (userGuardado) {
      const usuario = JSON.parse(userGuardado);
      idOdontologoActual = usuario.idUsuario || usuario.id || 1;
    }

    const detallesParaGuardar: any[] = [];

    for (const numDiente in this.mapaDientes) {
      const carasDelDiente = this.mapaDientes[numDiente];
      for (const nombreCara in carasDelDiente) {
        const colorActual = carasDelDiente[nombreCara];
        if (colorActual !== 'white') {
          const diagnosticoReal = colorActual === 'red' ? 'Caries' : 'Curación / Tratamiento';
          const clave = `${numDiente}-${nombreCara}`;
          const notaEspecifica = this.mapaNotas[clave] || null;

          detallesParaGuardar.push({
            diente: parseInt(numDiente),
            cara: this.traductorCaras[nombreCara],
            diagnostico: diagnosticoReal,
            estadoActual: colorActual === 'red' ? 'POR_TRATAR' : 'BUENO',
            notas: notaEspecifica 
          });
        }
      }
    }

    if (detallesParaGuardar.length === 0) {
      alert('El odontograma está completamente sano, no hay nada que registrar.');
      return;
    }

    // Aseguramos enviar el ID correcto del paciente
    const idParaGuardar = this.pacienteSeleccionado.idPaciente || this.pacienteSeleccionado.id_paciente;

    const paqueteFinal = {
      paciente: { idPaciente: idParaGuardar }, 
      odontologo: { idUsuario: idOdontologoActual }, 
      tipo: this.tipoOdontograma,
      observaciones: this.observacionGeneral,
      detalles: detallesParaGuardar
    };

    console.log('🚀 Enviando esto a Spring Boot:', paqueteFinal);

    this.odontogramaService.guardarOdontograma(paqueteFinal).subscribe({
      next: (respuesta) => {
        alert('✅ ¡Odontograma guardado en la Base de Datos con éxito!');
        this.cargarHistorialPaciente(); // Recargamos para que aparezca en la lista
      },
      error: (error) => {
        alert('❌ Hubo un error al guardar. Revisa la consola.');
        console.error('Error del servidor:', error);
      }
    });
  }
}