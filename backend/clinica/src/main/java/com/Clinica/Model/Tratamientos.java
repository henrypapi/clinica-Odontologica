package com.Clinica.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Entity
@Table(name="tratamientos")
public class Tratamientos {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tratamiento")
    private Integer idTratamiento;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;
    
    @ManyToOne
    @JoinColumn(name = "id_odontologo", nullable = false)
    private Usuario odontologo;
    
    @OneToOne
    @JoinColumn(name = "id_servicio", nullable = false)
    private Catalogo_servicios catalogo;
    
    @Column(name = "estado")
    private String estado;
    
    @Column(name = "abonado")
    private double abonado;
    
    @Column(name = "observaciones")
    private String observaciones;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_finalizacion")
    private LocalDateTime fechaFinalizacion;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "id_detalle_odontograma", nullable = false)
    private DetalleOdontograma detalle_odontograma;
    
    @Column (name="diente")
    private Integer diente;

    public Tratamientos() {
    }
    
    public Integer getIdTratamiento() {
        return idTratamiento;
    }

    public void setIdTratamiento(Integer idTratamiento) {
        this.idTratamiento = idTratamiento;
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

    public Catalogo_servicios getCatalogo() {
        return catalogo;
    }

    public void setCatalogo(Catalogo_servicios catalogo) {
        this.catalogo = catalogo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public double getAbonado() {
        return abonado;
    }

    public void setAbonado(double abonado) {
        this.abonado = abonado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(LocalDateTime fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public DetalleOdontograma getDetalle_odontograma() {
        return detalle_odontograma;
    }

    public void setDetalle_odontograma(DetalleOdontograma detalle_odontograma) {
        this.detalle_odontograma = detalle_odontograma;
    }

    public Integer getDiente() {
        return diente;
    }

    public void setDiente(Integer diente) {
        this.diente = diente;
    }
    
    
    
    
}
