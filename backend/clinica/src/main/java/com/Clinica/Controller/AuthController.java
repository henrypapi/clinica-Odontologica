package com.Clinica.Controller;

import com.Clinica.Model.JwtResponse;
import com.Clinica.Model.RefreshToken;
import com.Clinica.Model.Usuario;
import com.Clinica.Security.JwtUtil;
import com.Clinica.Service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://clinica-odontologica-hazel.vercel.app"})
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    // 🌟 CORRECCIÓN 1: Inyectamos el SERVICIO, no el Modelo/Entidad.
    @Autowired
    private RefreshTokenService refreshTokenService; 

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtUtil.generateAccessToken(userDetails);

        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());
        String rolUsuario = userDetails.getAuthorities().iterator().next().getAuthority();
        return ResponseEntity.ok(new JwtResponse(
                accessToken, 
                newRefreshToken.getToken(), 
                userDetails.getUsername(),
                rolUsuario
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refrescarToken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration) // Revisa si sigue vigente en la BD
                .map(refreshToken -> {
                    // Si todo está bien, sacamos al usuario de la relación
                    String username = refreshToken.getUsuario().getUsername();
                    
                    // Creamos un Access Token NUEVECITO de otros 15 minutos
                    String nuevoAccessToken = jwtUtil.generateAccessToken(userDetailsService.loadUserByUsername(username));
                    
                    // Se lo mandamos al Angular
                    return ResponseEntity.ok(new TokenRefreshResponse(nuevoAccessToken, requestRefreshToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token no encontrado en la base de datos o ha expirado."));
    }
}

class TokenRefreshRequest {
    private String refreshToken;
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}

class TokenRefreshResponse {
    private String accessToken;
    private String refreshToken;

    public TokenRefreshResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}

class LoginRequest {
    private String username;
    private String password;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

