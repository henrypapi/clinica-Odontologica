package com.Clinica.Dto;
public class NuevoTratamientoDTO {
    private Integer id_paciente;
    private Integer id_odontologo;
    private Integer id_servicio;
    private String observaciones;
    private String tipo_aplicacion;
    private Integer diente;

    public Integer getId_paciente() {
        return id_paciente;
    }

    public void setId_paciente(Integer id_paciente) {
        this.id_paciente = id_paciente;
    }

    public Integer getId_odontologo() {
        return id_odontologo;
    }

    public void setId_odontologo(Integer id_odontologo) {
        this.id_odontologo = id_odontologo;
    }

    public Integer getId_servicio() {
        return id_servicio;
    }

    public void setId_servicio(Integer id_servicio) {
        this.id_servicio = id_servicio;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getTipo_aplicacion() {
        return tipo_aplicacion;
    }

    public void setTipo_aplicacion(String tipo_aplicacion) {
        this.tipo_aplicacion = tipo_aplicacion;
    }

    public Integer getDiente() {
        return diente;
    }

    public void setDiente(Integer diente) {
        this.diente = diente;
    }
    
    
}
