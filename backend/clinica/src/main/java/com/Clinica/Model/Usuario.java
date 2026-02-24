package com.Clinica.Model;

import jakarta.persistence.*; // IMPORTANTE: Esto trae las herramientas de base de datos

@Entity
@Table(name = "usuario") 
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Es AUTO_INCREMENT
    @Column(name = "id_usuario")
    private int idUsuario;

    @OneToOne
    @JoinColumn(name = "id_persona", referencedColumnName = "id_personas")
    private Persona persona; 

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false) // En Java se llama password, en DB password_hash
    private String password;

    @Column(nullable = false)
    private String rol;

    @Column(name = "activo")
    private String activo; // Puede ser 'true' o 'false' como String

    // --- CONSTRUCTORES ---
    public Usuario() {
    }

    public Usuario(int idUsuario, String username, String password, String rol, String activo) {
        this.idUsuario = idUsuario;
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.activo = activo;
    }

    // --- GETTERS Y SETTERS ---
    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public Persona getPersona() { return persona; }
    public void setPersona(Persona persona) { this.persona = persona; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getActivo() { return activo; }
    public void setActivo(String activo) { this.activo = activo; }
}