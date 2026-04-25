package com.Clinica.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter; // Llamamos a nuestro guardia

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Apagamos el escudo CSRF (necesario para usar Tokens)
            .csrf(csrf -> csrf.disable()) 
                
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Reglas de la puerta: Quién entra y quién no
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login","/error").permitAll() // La taquilla de login es pública
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated() // TODO lo demás (ej. odontogramas) exige token
            )
            
            // 3. VITAL: Le decimos a Spring Boot que NO guarde sesiones en memoria (STATELESS).
            // Cada vez que Angular pida algo, DEBE mostrar el token.
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Ponemos a nuestro guardia (JwtFilter) EXACTAMENTE ANTES del guardia por defecto de Spring
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Herramienta que usaremos en el Login para comparar la contraseña ingresada con la de la BD
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Como las contraseñas en tu tabla de usuarios tienen el formato de BCrypt 
    // (esos textos que empiezan con $2a$10$...), esta herramienta le dice a Java cómo leerlas.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }
    
    // --- MANUAL DE REGLAS CORS ---
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        
        // 1. ¿A quién dejamos pasar? A tu Angular
        configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:4200"));
        
        // 2. ¿Qué métodos permitimos? POST (guardar), GET (leer), OPTIONS (preflight), etc.
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 3. ¿Qué cabeceras especiales permitimos? Authorization (nuestro Token) y Content-Type (nuestro JSON)
        configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type"));

        configuration.setAllowedHeaders(java.util.Arrays.asList("*")); // <-- CAMBIA ESTO PARA EVITAR BLOQUEOS
        
        // Aplicamos estas reglas a TODAS las rutas de tu API ("/**")
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}