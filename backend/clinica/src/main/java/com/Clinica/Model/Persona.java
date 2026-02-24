package com.Clinica.Model;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "persona")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_personas") // Ojo: en tu SQL dice 'id_personas' (plural)
    private int id;

    private String nombres;
    private String apellidos;

    @Column(name = "numero_documento")
    private int numeroDocumento;

    private String email;
    private String direccion;

    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;
    
    private String sexo;
    
    @Column(name = "fecha_creacion")
    private Date fechaCreacion;

    public Persona(int id, String nombres, String apellidos, int numeroDocumento, String email, String direccion, Date fechaNacimiento, String sexo, Date fechaCreacion) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.numeroDocumento = numeroDocumento;
        this.email = email;
        this.direccion = direccion;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.fechaCreacion = fechaCreacion;
    }

    public Persona(){
        
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public int getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(int numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    
}