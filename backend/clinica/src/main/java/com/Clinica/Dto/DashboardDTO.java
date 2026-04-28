package com.Clinica.Dto;

import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private Double ingresosMes;
    private Long citasHoy;
    private Long pacientesTotales;
    private Long odontologosActivos;
    private long StaffActivo;
    private List<AgendaDTO> agenda;
    private List<Double> ingresosGrafico;
    private List<String> serviciosLabels;
    private List<Integer> serviciosData;

    public DashboardDTO() {
        this.ingresosMes = 0.0;
        this.citasHoy = 0L;
        this.pacientesTotales = 0L;
        this.odontologosActivos = 0L;
        this.StaffActivo= 0L;
    }

    public Double getIngresosMes() { return ingresosMes; }
    public void setIngresosMes(Double ingresosMes) { this.ingresosMes = ingresosMes; }
    
    public Long getCitasHoy() { return citasHoy; }
    public void setCitasHoy(Long citasHoy) { this.citasHoy = citasHoy; }
    
    public Long getPacientesTotales() { return pacientesTotales; }
    public void setPacientesTotales(Long pacientesTotales) { this.pacientesTotales = pacientesTotales; }
    
    public Long getOdontologosActivos() { return odontologosActivos; }
    public void setOdontologosActivos(Long odontologosActivos) { this.odontologosActivos = odontologosActivos; }

    public long getStaffActivo() {
        return StaffActivo;
    }
    public void setStaffActivo(long StaffActivo) {
        this.StaffActivo = StaffActivo;
    }

    public List<AgendaDTO> getAgenda() {
        return agenda;
    }

    public void setAgenda(List<AgendaDTO> agenda) {
        this.agenda = agenda;
    }

    public List<Double> getIngresosGrafico() {
        return ingresosGrafico;
    }

    public void setIngresosGrafico(List<Double> ingresosGrafico) {
        this.ingresosGrafico = ingresosGrafico;
    }

    public List<String> getServiciosLabels() {
        return serviciosLabels;
    }

    public void setServiciosLabels(List<String> serviciosLabels) {
        this.serviciosLabels = serviciosLabels;
    }

    public List<Integer> getServiciosData() {
        return serviciosData;
    }

    public void setServiciosData(List<Integer> serviciosData) {
        this.serviciosData = serviciosData;
    }
    
    
    
}