package com.Clinica.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// ¡Esta anotación @Service es vital! Es como @Component, le dice a Spring que guarde este directorio.
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // 1. Inyectamos TU repositorio de base de datos
    // (Cambia 'UsuarioRepository' por el nombre real de tu interfaz que conecta con MySQL)
    @Autowired
    private com.Clinica.Repository.UsuarioRepository usuarioRepository; 

    // 2. Este es el método que Spring Security ejecutará automáticamente
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // 3. Buscamos al usuario en tu base de datos
        // (Asumo que tienes un método findByUsername en tu repositorio)
        com.Clinica.Model.Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado en la BD: " + username));

        // 4. Traducimos tu "Usuario" de MySQL al "UserDetails" que entiende Spring Security
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword()) // Asegúrate de usar el campo de tu contraseña encriptada
                .roles(usuario.getRol())
                .build();
    }
}