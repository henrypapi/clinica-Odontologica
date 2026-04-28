package com.Clinica.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "Q2xpbmljYU9kb250b2xvZ2ljYVNlY3JldEtleVBhcmFUb2tlbnNNdXlTZWd1cm9zMjAyNg==";

    // --- 1. MÉTODO PARA CREAR EL TOKEN ---
    // Recibe el usuario (del login) y fabrica un token que dura 10 horas.
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername()) // Guardamos el nombre de usuario
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de creación
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Expira en 10 horas
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Lo firmamos con nuestra clave secreta
                .compact();
    }

    // --- 2. MÉTODO PARA EXTRAER EL USUARIO DEL TOKEN ---
    // Cuando Angular nos mande el token, usamos esto para saber de quién es.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // --- 3. MÉTODO PARA VALIDAR EL TOKEN ---
    // Revisa que el token pertenezca al usuario que lo envía y que no esté caducado.
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // -- Métodos internos auxiliares --
    
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}