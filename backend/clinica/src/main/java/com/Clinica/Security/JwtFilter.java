package com.Clinica.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// ¡Mira! Aquí también usamos @Component para que Spring Boot guarde a este guardia en su caja de herramientas
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil; // Nuestro fabricante de pulseras

    @Autowired
    private UserDetailsService userDetailsService; // El servicio de Spring que busca usuarios en la BD

    // Este es el método que intercepta TODAS las peticiones que llegan de Angular
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Angular siempre enviará el token en una cabecera llamada "Authorization"
        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // 2. Revisamos si el guardia encontró la cabecera y si empieza con "Bearer " (el estándar)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Cortamos la palabra "Bearer " para quedarnos solo con el código del token
            try {
                username = jwtUtil.extractUsername(jwt); // Usamos nuestra máquina para sacar el nombre del usuario
            } catch (Exception e) {
                System.out.println("El token es inválido o ha expirado");
            }
        }

        // 3. Si encontramos un usuario en el token y todavía no ha entrado al sistema...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Buscamos a este usuario en nuestra base de datos para ver si es real
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 4. Validamos que el token coincida y no esté vencido
            if (jwtUtil.validateToken(jwt, userDetails)) {
                
                // 5. ¡Todo está en orden! Le decimos a Spring Security que lo deje pasar
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. Continúa con el flujo normal (pasa a la siguiente puerta)
        filterChain.doFilter(request, response);
    }
}