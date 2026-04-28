import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-odontograma',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odontograma.html',
  styleUrl: './odontograma.css'
})
export class Odontograma {
  
  // ¡LA VARIABLE MÁGICA! 
  // Si le pasamos true desde otra pantalla, será solo de historial.
  @Input() modoLectura: boolean = false; 

  // Arrays con los números de los dientes (Arcada de adulto)
  // Cuadrante 1 (Arriba Derecha del paciente) y Cuadrante 2 (Arriba Izquierda)
  dientesArriba = [
    18, 17, 16, 15, 14, 13, 12, 11,  // Derecha
    21, 22, 23, 24, 25, 26, 27, 28   // Izquierda
  ];

  // Cuadrante 4 (Abajo Derecha del paciente) y Cuadrante 3 (Abajo Izquierda)
  dientesAbajo = [
    48, 47, 46, 45, 44, 43, 42, 41,  // Derecha
    31, 32, 33, 34, 35, 36, 37, 38   // Izquierda
  ];

  // Función que se disparará al hacer clic en un diente
  seleccionarDiente(numeroDiente: number) {
    if (this.modoLectura) {
      console.log('Modo historial: Solo viendo el diente', numeroDiente);
      // Aquí podrías mostrar un pequeño globo (tooltip) con los detalles
      return;
    }
    
    console.log('Modo registro: Abriendo menú para editar el diente', numeroDiente);
    // Aquí abriremos el modal para decir "Tiene caries en la cara Oclusal"
  }
}