package com.Clinica.Model;

import jakarta.persistence.*;


@Entity
@Table (name="catalogo_servicios")
public class Catalogo_servicios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer id_catalogo_servicios;
    
    @Column (name="nombre")
    private String nombre;
    
    @Column(name="precio_base")
    private Double precio_base;
    
    @Column (name="descripcion")
    private String descripcion;
    
    @Column (name="duracion_minutos")
    private Double duracion_minutos;

    public Integer getId_catalogo_servicios() {
        return id_catalogo_servicios;
    }

    public void setId_catalogo_servicios(Integer id_catalogo_servicios) {
        this.id_catalogo_servicios = id_catalogo_servicios;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio_base() {
        return precio_base;
    }

    public void setPrecio_base(Double precio_base) {
        this.precio_base = precio_base;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getDuracion_minutos() {
        return duracion_minutos;
    }

    public void setDuracion_minutos(Double duracion_minutos) {
        this.duracion_minutos = duracion_minutos;
    }
}
