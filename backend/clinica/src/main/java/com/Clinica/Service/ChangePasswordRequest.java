package com.Clinica.Service;

public class ChangePasswordRequest {
    private String passwordAnterior;
    private String passwordNueva;

    // Constructores, Getters y Setters
    public ChangePasswordRequest() {}

    public String getPasswordAnterior() { return passwordAnterior; }
    public void setPasswordAnterior(String passwordAnterior) { this.passwordAnterior = passwordAnterior; }

    public String getPasswordNueva() { return passwordNueva; }
    public void setPasswordNueva(String passwordNueva) { this.passwordNueva = passwordNueva; }
}
