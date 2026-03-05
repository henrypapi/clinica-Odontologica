package com.Clinica.Controller;

import com.Clinica.Model.Usuario;
import com.Clinica.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200") // Permitimos que Angular se conecte

public class AuthController {

    @Autowired
    private com.Clinica.Repository.UsuarioRepository usuarioRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil; // Nuestra fábrica de tokens

    // Endpoint que escucha el POST de Angular
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        
        try {
            // 1. Spring Security intenta loguear al usuario comprobando la contraseña
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception e) {
            // Si la contraseña está mal, lanzamos un error 401 (No autorizado)
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }

        // 2. Si pasó la validación, buscamos sus datos completos
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // 3. ¡Fabricamos el Token JWT!
        final String jwt = jwtUtil.generateToken(userDetails);

        // EXTRAER EL ROL DINÁMICO:
        // Las autoridades vienen como una lista, así que tomamos la primera que tenga asignada.
        String rolUsuario = userDetails.getAuthorities().iterator().next().getAuthority();
        
        // (Opcional) Spring a veces le agrega el prefijo "ROLE_" (ej. "ROLE_ADMIN"). 
        // Si quieres quitarle ese prefijo para que a Angular le llegue limpio ("ADMIN"), descomenta esto:
        if (rolUsuario.startsWith("ROLE_")) {
           rolUsuario = rolUsuario.substring(5);
        }

        com.Clinica.Model.Usuario usuarioReal = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 4. Empaquetamos el token para enviárselo a Angular
        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", userDetails.getUsername());
        response.put("rol", rolUsuario); 
        response.put("idUsuario", String.valueOf(usuarioReal.getIdUsuario()));
        return ResponseEntity.ok(response);
    }
}

// Una pequeña clase auxiliar para recibir los datos de Angular
class LoginRequest {
    private String username;
    private String password;

    // Getters y Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}