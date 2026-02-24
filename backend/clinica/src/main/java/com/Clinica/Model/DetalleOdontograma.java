package com.Clinica.Model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "detalle_odontograma")
public class DetalleOdontograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDetalle;

    // Relación de vuelta al Odontograma principal
    @ManyToOne
    @JoinColumn(name = "id_odontograma", nullable = false)
    @JsonIgnore // Evita un bucle infinito al convertir a JSON
    private Odontograma odontograma;

    private Integer diente;
    private String cara;
    private String diagnostico;
    
    @Column(name = "estado_actual")
    private String estadoActual;
    
    private String notas;

    // --- CONSTRUCTORES ---
    public DetalleOdontograma() {}

    // --- GETTERS Y SETTERS ---
    public Integer getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Integer idDetalle) { this.idDetalle = idDetalle; }

    public Odontograma getOdontograma() { return odontograma; }
    public void setOdontograma(Odontograma odontograma) { this.odontograma = odontograma; }

    public Integer getDiente() { return diente; }
    public void setDiente(Integer diente) { this.diente = diente; }

    public String getCara() { return cara; }
    public void setCara(String cara) { this.cara = cara; }

    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }

    public String getEstadoActual() { return estadoActual; }
    public void setEstadoActual(String estadoActual) { this.estadoActual = estadoActual; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}