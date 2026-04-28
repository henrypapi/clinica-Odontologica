package com.Clinica.Controller;

import com.Clinica.Dto.ActualizarUsuarioDTO;
import com.Clinica.Dto.HorarioDTO;
import com.Clinica.Dto.RegistroUsuarioDTO;
import com.Clinica.Dto.UsuarioListadoDTO;
import com.Clinica.Model.HorarioOdontologo;
import com.Clinica.Model.Usuario;
import com.Clinica.Repository.UsuarioRepository;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Clinica.Model.Persona;
import com.Clinica.Repository.HorarioOdontologoRepository;
import com.Clinica.Repository.PersonaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private HorarioOdontologoRepository horarioRepository;  
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }
    
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> actualizarPerfilYAcceso(@PathVariable Integer id, @RequestBody ActualizarUsuarioDTO dto) {
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Usuario no encontrado\"}");
        }
        
        Usuario usuario = usuarioOpt.get();

        if (dto.getActivo() != null) {
            usuario.setActivo(dto.getActivo().toString());
        }

        Persona persona = usuario.getPersona();
        if (persona != null) {
            if (dto.getTelefono() != null) persona.setTelefono(dto.getTelefono());
            if (dto.getEmail() != null) persona.setEmail(dto.getEmail());
            if (dto.getDireccion() != null) persona.setDireccion(dto.getDireccion());
            
        }
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("{\"mensaje\": \"Perfil de usuario actualizado con éxito\"}");
    }
    
    @GetMapping("/{id}/horarios")
    public ResponseEntity<List<HorarioDTO>> obtenerHorariosPorDoctor(@PathVariable Integer id) {
        
        List<HorarioOdontologo> horariosBD = horarioRepository.findByOdontologoIdUsuario(id);
        
        List<HorarioDTO> horariosDTO = horariosBD.stream().map(h -> {
            HorarioDTO dto = new HorarioDTO();
            dto.setDia_semana(h.getDiaSemana());
            dto.setHora_inicio(h.getHoraInicio());
            dto.setHora_fin(h.getHoraFin());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(horariosDTO);
    }
    
    @PutMapping("/{id}/horarios")
    @Transactional
    public ResponseEntity<?> actualizarHorarios(@PathVariable Integer id, @RequestBody List<HorarioDTO> nuevosHorarios) {
        
        Optional<Usuario> odontologoOpt = usuarioRepository.findById(id);
        
        if (!odontologoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Odontólogo no encontrado\"}");
        }
        
        Usuario odontologo = odontologoOpt.get();

        // 1. Borramos la configuración de horarios anterior
        horarioRepository.deleteByOdontologoIdUsuario(id);

        // 2. Insertamos la nueva configuración recibida desde Angular
        for (HorarioDTO dto : nuevosHorarios) {
            HorarioOdontologo nuevoHorario = new HorarioOdontologo();
            nuevoHorario.setOdontologo(odontologo);
            nuevoHorario.setDiaSemana(dto.getDia_semana());
            nuevoHorario.setHoraInicio(dto.getHora_inicio());
            nuevoHorario.setHoraFin(dto.getHora_fin());
            
            horarioRepository.save(nuevoHorario);
        }

        return ResponseEntity.ok("{\"mensaje\": \"Horarios actualizados correctamente\"}");
    }
    
    @PostMapping
    @Transactional
    public ResponseEntity<?> registrarNuevoUsuario(@RequestBody RegistroUsuarioDTO dto) {
        try {
            // 1. Validar que el username no exista ya en la BD (opcional pero recomendado)
            if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("{\"error\": \"El nombre de usuario ya está en uso\"}");
            }

            // 2. Construir la entidad Persona
            Persona nuevaPersona = new Persona();
            nuevaPersona.setNombres(dto.getNombres());
            nuevaPersona.setApellidos(dto.getApellidos());
            nuevaPersona.setTipoDocumento(dto.getTipoDocumento());
            nuevaPersona.setNumeroDocumento(dto.getNumeroDocumento());
            nuevaPersona.setEmail(dto.getEmail());
            nuevaPersona.setTelefono(dto.getTelefono());
            nuevaPersona.setDireccion(dto.getDireccion());
            nuevaPersona.setSexo(dto.getSexo());
            nuevaPersona.setFechaNacimiento(dto.getFechaNacimiento());
            
            // Guardamos la persona primero en la BD para que MySQL le asigne un 'id_personas'
            Persona personaGuardada = personaRepository.save(nuevaPersona);

            // 3. Construir la entidad Usuario
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(dto.getUsername());
            
            // 🔒 MAGIA DE SEGURIDAD: Encriptamos la contraseña plana que viene de Angular
            nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));
            
            nuevoUsuario.setRol(dto.getRol());
            nuevoUsuario.setActivo("true"); // Por defecto, una cuenta nueva nace activa
            
            // Vinculamos la Persona guardada al nuevo Usuario
            nuevoUsuario.setPersona(personaGuardada);

            // 4. Guardamos el Usuario en la BD
            usuarioRepository.save(nuevoUsuario);

            return ResponseEntity.ok("{\"mensaje\": \"Personal registrado con éxito\"}");
            
        } catch (Exception e) {
            // Si algo falla (ej. base de datos caída), el @Transactional cancelará 
            // la creación de la persona para que no queden datos huérfanos.
            return ResponseEntity.badRequest().body("{\"error\": \"Error al registrar: " + e.getMessage() + "\"}");
        }
    }
    
}

