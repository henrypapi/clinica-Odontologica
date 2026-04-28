package com.Clinica.Service;

import com.Clinica.Model.Usuario;
import com.Clinica.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // El BCrypt que definiste en SecurityConfig

    // 1. Obtener datos del perfil
    public Optional<Usuario> obtenerPerfil(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // 2. Lógica para cambiar contraseña
    public boolean cambiarPassword(String username, String oldPass, String newPass) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // 🔥 VALIDACIÓN CRÍTICA:
            // BCrypt no "desencripta". Usa .matches() para ver si la clave escrita
            // coincide con el hash oscuro de la base de datos.
            if (passwordEncoder.matches(oldPass, usuario.getPassword())) {
                
                // Si coincide, encriptamos la NUEVA y guardamos
                usuario.setPassword(passwordEncoder.encode(newPass));
                usuarioRepository.save(usuario);
                return true;
            }
        }
        return false;
    }
    
    // 3. Lógica para actualizar datos personales
    public boolean actualizarDatosPersonales(String username, com.Clinica.Model.Persona datosNuevos) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            com.Clinica.Model.Persona personaDB = usuario.getPersona();

            // Si el usuario tiene una persona asociada, la actualizamos
            if (personaDB != null) {
                personaDB.setNombres(datosNuevos.getNombres());
                personaDB.setApellidos(datosNuevos.getApellidos());
                personaDB.setEmail(datosNuevos.getEmail());
                personaDB.setTelefono(datosNuevos.getTelefono());

                // Al guardar el usuario, por el @OneToOne, se actualiza también la Persona
                usuarioRepository.save(usuario);
                return true;
            }
        }
        return false;
    }
}