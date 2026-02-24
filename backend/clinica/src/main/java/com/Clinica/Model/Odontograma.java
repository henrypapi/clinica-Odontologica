package com.Clinica.Model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "odontograma")
public class Odontograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOdontograma;

    // Relación con el Paciente
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    // Relación con el Doctor (Usuario)
    @ManyToOne
    @JoinColumn(name = "id_odontologo", nullable = false)
    private Usuario odontologo;

    @Column(name = "fecha_evaluacion", insertable = false, updatable = false)
    private LocalDateTime fechaEvaluacion;

    private String tipo; // INICIAL o EVOLUCION
    private String observaciones;

    // Un odontograma tiene MUCHOS detalles (dientes afectados)
    @OneToMany(mappedBy = "odontograma", cascade = CascadeType.ALL)
    private List<DetalleOdontograma> detalles;

    // --- CONSTRUCTORES ---
    public Odontograma() {}

    // --- GETTERS Y SETTERS ---
    public Integer getIdOdontograma() { return idOdontograma; }
    public void setIdOdontograma(Integer idOdontograma) { this.idOdontograma = idOdontograma; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public Usuario getOdontologo() { return odontologo; }
    public void setOdontologo(Usuario odontologo) { this.odontologo = odontologo; }

    public LocalDateTime getFechaEvaluacion() { return fechaEvaluacion; }
    public void setFechaEvaluacion(LocalDateTime fechaEvaluacion) { this.fechaEvaluacion = fechaEvaluacion; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public List<DetalleOdontograma> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleOdontograma> detalles) { this.detalles = detalles; }
}
