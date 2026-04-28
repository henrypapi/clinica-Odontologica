package com.Clinica.Dto;

import java.time.LocalTime;

public class HorarioDTO {
    private Integer dia_semana;
    private LocalTime hora_inicio;
    private LocalTime hora_fin;
    
    
    
    
    public Integer getDia_semana() { return dia_semana; }
    public void setDia_semana(Integer dia_semana) { this.dia_semana = dia_semana; }

    public LocalTime getHora_inicio() { return hora_inicio; }
    public void setHora_inicio(LocalTime hora_inicio) { this.hora_inicio = hora_inicio; }

    public LocalTime getHora_fin() { return hora_fin; }
    public void setHora_fin(LocalTime hora_fin) { this.hora_fin = hora_fin; }
}