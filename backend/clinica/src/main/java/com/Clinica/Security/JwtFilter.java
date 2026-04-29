package com.Clinica.Security;

import io.jsonwebtoken.ExpiredJwtException; // 🌟 IMPORTANTE: Agregamos esta importación
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

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil; 

    @Autowired
    private UserDetailsService userDetailsService; 

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 🌟 1. EL PASE LIBRE: Si Angular está intentando loguearse o refrescar el token, 
        // lo dejamos pasar directo sin revisar la "pulsera" vieja.
        String path = request.getRequestURI();
        if (path.contains("/auth/login") || path.contains("/auth/refresh") || path.contains("/api/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (ExpiredJwtException e) { 
                
                //System.out.println("El token ha expirado: " + e.getMessage());
                
                // Le enviamos a Angular el código 401 exacto y detenemos la petición aquí mismo.
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("El token de acceso ha expirado");
                return; 
                
            } catch (Exception e) {
                System.out.println("Error procesando el token: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}