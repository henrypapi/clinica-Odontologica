package com.Clinica.Controller;

import com.Clinica.Model.Usuario;
import com.Clinica.Service.ChangePasswordRequest;
import com.Clinica.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = {"http://localhost:4200", "https://clinica-odontologica-hazel.vercel.app"})
public class PerfilController {

    @Autowired
    private UsuarioService usuarioService;

    // 🚪 PUERTA 1: Obtener los datos del usuario logueado
    @GetMapping
    public ResponseEntity<?> obtenerMiPerfil(Principal principal) {
        // 'principal' lee el Token. Si no hay token, rechazamos la petición.
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"No autorizado\"}");
        }

        // Sacamos el username que viene encriptado dentro del Token
        String username = principal.getName();
        Optional<Usuario> usuarioOpt = usuarioService.obtenerPerfil(username);

        if (usuarioOpt.isPresent()) {
            // Devolvemos el usuario (que ya trae a la 'Persona' anidada por tu @OneToOne)
            return ResponseEntity.ok(usuarioOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Usuario no encontrado\"}");
        }
    }

    // 🚪 PUERTA 2: Cambiar la contraseña
    @PutMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"No autorizado\"}");
        }

        String username = principal.getName();

        // Llamamos a la lógica de BCrypt que creamos en el Paso 1
        boolean cambiado = usuarioService.cambiarPassword(
                username,
                request.getPasswordAnterior(),
                request.getPasswordNueva()
        );

        if (cambiado) {
            // Respondemos con un JSON de éxito
            return ResponseEntity.ok("{\"mensaje\": \"Contraseña actualizada correctamente\"}");
        } else {
            // Si retorna falso, es porque la contraseña anterior no coincide con el Hash
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"La contraseña actual es incorrecta\"}");
        }
    }
    // 🚪 PUERTA 3: Actualizar datos personales
    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarPerfil(@RequestBody com.Clinica.Model.Persona datosNuevos, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"No autorizado\"}");
        }

        String username = principal.getName();
        boolean actualizado = usuarioService.actualizarDatosPersonales(username, datosNuevos);

        if (actualizado) {
            return ResponseEntity.ok("{\"mensaje\": \"Perfil actualizado correctamente\"}");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"No se pudo actualizar el perfil\"}");
        }
    }
}