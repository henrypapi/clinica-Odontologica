package com.Clinica.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table( name= "citas")
public class Citas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_cita;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;
    
    @ManyToOne
    @JoinColumn(name = "id_odontologo", nullable = false)
    private Usuario odontologo;
    
    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
    
    @Column(name = "estado")
    private String estado;
    
    @Column(name = "motivo")
    private String motivo;
    
    @ManyToOne
    @JoinColumn(name = "id_catalogo_servicio", nullable = false)
    private Catalogo_servicios catalogo_servicios; 
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    public Integer getId_cita() {
        return id_cita;
    }

    public void setId_cita(Integer id_cita) {
        this.id_cita = id_cita;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Usuario getOdontologo() {
        return odontologo;
    }

    public void setOdontologo(Usuario odontologo) {
        this.odontologo = odontologo;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public Catalogo_servicios getCatalogo_servicios() {
        return catalogo_servicios;
    }

    public void setCatalogo_servicios(Catalogo_servicios catalogo_servicios) {
        this.catalogo_servicios = catalogo_servicios;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    
    
}
