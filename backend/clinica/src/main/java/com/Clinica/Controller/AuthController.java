package com.Clinica.Controller;

import com.Clinica.Model.Usuario;
import com.Clinica.dto.LoginRequest;
import com.Clinica.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// 1. Importamos el encriptador
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; 

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200") // Esto está bien dejarlo
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 2. Instanciamos el encriptador (La herramienta de comparación)
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(loginRequest.getUsername());

        if (usuarioOpt.isEmpty()) {
            // ESPÍA 2: Si entra aquí, el usuario no existe en la DB
            System.out.println("--> ¡ERROR! El usuario no existe en la Base de Datos.");
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            // ESPÍA 4: Si entra aquí, la contraseña no coincide con el hash
            System.out.println("--> ¡ERROR! El password no coincide con el hash.");
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }

        // Si llega aquí, todo está bien
        System.out.println("--> ¡ÉXITO! Login correcto.");
        
        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("mensaje", "Login exitoso");
        respuesta.put("usuario", usuario.getUsername());
        respuesta.put("nombre", usuario.getPersona().getNombres());
        respuesta.put("rol", usuario.getRol());
        
        return ResponseEntity.ok(respuesta);
    }
}