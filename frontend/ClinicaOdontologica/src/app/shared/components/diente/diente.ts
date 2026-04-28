import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="diente-wrapper">
      <span class="numero" *ngIf="posicionNumero === 'arriba'">{{ numero }}</span>

      <svg viewBox="0 0 100 100" class="diente-svg">
        <defs>
          <clipPath [id]="'recorte-circulo-' + numero">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>

        <g [attr.clip-path]="'url(#recorte-circulo-' + numero + ')'">
          <polygon points="0,0 100,0 50,50" 
                   [attr.fill]="estado.arriba || 'white'" 
                   class="cara-clic" (click)="notificarClic('arriba')"/>
          
          <polygon points="100,0 100,100 50,50" 
                   [attr.fill]="estado.derecha || 'white'" 
                   class="cara-clic" (click)="notificarClic('derecha')"/>
          
          <polygon points="0,100 100,100 50,50" 
                   [attr.fill]="estado.abajo || 'white'" 
                   class="cara-clic" (click)="notificarClic('abajo')"/>
          
          <polygon points="0,0 0,100 50,50" 
                   [attr.fill]="estado.izquierda || 'white'" 
                   class="cara-clic" (click)="notificarClic('izquierda')"/>
        </g>

        <circle cx="50" cy="50" r="20" 
                [attr.fill]="estado.centro || 'white'" 
                class="cara-clic" (click)="notificarClic('centro')"/>

        <circle cx="50" cy="50" r="48" fill="none" stroke="#333" stroke-width="3" pointer-events="none"/>
        <line x1="15" y1="15" x2="85" y2="85" stroke="#333" stroke-width="2" pointer-events="none"/>
        <line x1="85" y1="15" x2="15" y2="85" stroke="#333" stroke-width="2" pointer-events="none"/>
      </svg>

      <span class="numero" *ngIf="posicionNumero === 'abajo'">{{ numero }}</span>
    </div>
  `,
  styles: [`
    .diente-wrapper { display: flex; flex-direction: column; alignItems: center; margin: 0 2px; }
    .numero { font-weight: bold; font-size: 14px; margin: 2px 0; color: #333; }
    .diente-svg { width: 40px; height: 40px; }
    .cara-clic { stroke: #333; stroke-width: 1; cursor: pointer; transition: opacity 0.2s; }
    .cara-clic:hover { opacity: 0.7; }
  `]
})
export class Diente {
  @Input() numero!: number; 
  @Input() posicionNumero: 'arriba' | 'abajo' = 'arriba';
  
  // AHORA RECIBIMOS EL ESTADO DESDE EL PADRE
  @Input() estado: any = { arriba: 'white', abajo: 'white', izquierda: 'white', derecha: 'white', centro: 'white' };

  // AVISAMOS AL PADRE CUANDO NOS TOCAN
  @Output() tocoCara = new EventEmitter<string>();

  notificarClic(cara: string) {
    this.tocoCara.emit(cara);
  }
}