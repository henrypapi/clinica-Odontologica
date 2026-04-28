package com.Clinica.Model;

import jakarta.persistence.*;
import java.sql.Date;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "persona")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_personas")
    private Integer id;

    @Column(name = "nombres")
    private String nombres;
    @Column(name= "apellidos")
    private String apellidos;

    @Column(name = "numero_documento")
    private String numeroDocumento;
    
    @Column(name = "tipo_documento")
    private String tipoDocumento;

    @Column (name = "email")
    private String email;

    @Column (name = "direccion")
    private String direccion;

    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;
    
    @Column (name = "sexo")
    private String sexo;
    
    @CreationTimestamp
    @Column(name = "fecha_creacion")
    private Date fechaCreacion;

    @Column (name = "telefono")
    private String telefono;



    public Persona(Integer id, String nombres, String apellidos, String numeroDocumento, String tipoDocumento, String email, String direccion, Date fechaNacimiento, String sexo, Date fechaCreacion, String telefono) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.numeroDocumento = numeroDocumento;
        this.tipoDocumento = tipoDocumento;
        this.email = email;
        this.direccion = direccion;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.fechaCreacion = fechaCreacion;
        this.telefono = telefono;
    }

    public Persona(){
        
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
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

    public String getTelefono(){
        return telefono;
    }

    public void setTelefono(String telefono){
        this.telefono = telefono;
    }

    public String getTipoDocumento(){
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento){
        this.tipoDocumento = tipoDocumento;
    }
    
}