import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardService } from './dashboard.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  cargandoDatos: boolean = true;
  generandoPDF: boolean = false;
  kpiIngresosMes: number = 0;
  kpiCitasHoy: number = 0;
  kpiNuevosPacientes: number = 0;
  kpiOdontologosActivos: number = 0;
  agendaHoy: any[] = []; 

  public serviciosChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Cargando...'], 
    datasets: [{
      data: [100], 
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      hoverOffset: 4
    }]
  };
  public serviciosChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };
  public ingresosChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mes -5', 'Mes -4', 'Mes -3', 'Mes -2', 'Mes -1', 'Mes Actual'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0], // Se llenará con los 6 meses de Java
      label: 'Ingresos Mensuales (S/)',
      fill: true,
      tension: 0.4,
      borderColor: '#0f766e',
      backgroundColor: 'rgba(15, 118, 110, 0.1)'
    }]
  };
  public ingresosChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  constructor() {}

  ngOnInit(): void {
    this.cargarDatosReales();
  }
  cargarDatosReales() {
    this.cargandoDatos = true;
    this.dashboardService.obtenerResumenDashboard().subscribe({
      next: (datos) => {
        this.kpiIngresosMes = datos.ingresosMes || 0;
        this.kpiCitasHoy = datos.citasHoy || 0;
        this.kpiNuevosPacientes = datos.pacientesTotales || 0; 
        this.kpiOdontologosActivos = datos.staffActivo || datos.odontologosActivos || 0;
        if (datos.agenda && datos.agenda.length > 0) {
            this.agendaHoy = datos.agenda;
        } else {
            this.agendaHoy = []; 
        }

        if (datos.ingresosGrafico && datos.ingresosGrafico.length > 0) {
            this.ingresosChartData.datasets[0].data = datos.ingresosGrafico;
            this.ingresosChartData = { ...this.ingresosChartData }; 
        }
        if (datos.serviciosLabels && datos.serviciosData) {
            this.serviciosChartData.labels = datos.serviciosLabels;
            this.serviciosChartData.datasets[0].data = datos.serviciosData;
            this.serviciosChartData = { ...this.serviciosChartData };
        }
        this.cargandoDatos = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar el dashboard:', err);
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      }
    });
  }
  exportarDashboardPDF() {
    this.generandoPDF = true;
    const elemento = document.getElementById('dashboard-clinica'); 
    
    if (elemento) {
      html2canvas(elemento, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Reporte_Gerencial_${new Date().getTime()}.pdf`);
        
        this.generandoPDF = false;
        this.cdr.detectChanges();
      }).catch(err => {
        console.error('Error al generar el PDF', err);
        this.generandoPDF = false;
        this.cdr.detectChanges();
      });
    } else {
      this.generandoPDF = false;
    }
  }
}