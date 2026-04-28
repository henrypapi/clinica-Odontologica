package com.Clinica.Controller;

import com.Clinica.Dto.NuevoTratamientoDTO;
import com.Clinica.Model.Catalogo_servicios;
import com.Clinica.Model.Paciente;
import com.Clinica.Model.Tratamientos;
import com.Clinica.Model.Usuario;
import com.Clinica.Repository.CatalogoServiciosRepository;
import com.Clinica.Repository.PacienteRepository;
import com.Clinica.Repository.TratamientosRepository;
import com.Clinica.Repository.UsuarioRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tratamientos")
@CrossOrigin(origins = "http://localhost:4200")
public class TratamientosController {

    @Autowired
    private TratamientosRepository tratamientosRepository;

    // 🔥 LA PUERTA PARA ANGULAR: Buscar los tratamientos de un paciente específico
    @GetMapping("/paciente/{id}")
    public ResponseEntity<List<Tratamientos>> obtenerTratamientosPorPaciente(@PathVariable("id") Integer idPaciente) {
        // Llamamos al método mágico que creaste en el repositorio
        List<Tratamientos> historialTratamientos = tratamientosRepository.findByPaciente_IdPaciente(idPaciente);
        return ResponseEntity.ok(historialTratamientos);
    }

    
    @Autowired private PacienteRepository pacienteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private CatalogoServiciosRepository catalogoRepository;
    
    @PostMapping
    public ResponseEntity<?> crearTratamiento(@RequestBody NuevoTratamientoDTO dto) {
        
        Tratamientos nuevoTratamiento = new Tratamientos();

        // 1. Buscamos las entidades en la BD
        // (En un entorno de producción, aquí validarías con isPresent() que existan)
        Paciente paciente = pacienteRepository.findById(dto.getId_paciente()).orElse(null);
        Usuario odontologo = usuarioRepository.findById(dto.getId_odontologo()).orElse(null);
        Catalogo_servicios servicio = catalogoRepository.findById(dto.getId_servicio()).orElse(null);

        if (paciente == null || odontologo == null || servicio == null) {
            return ResponseEntity.badRequest().body("Error: Paciente, Odontólogo o Servicio no encontrados.");
        }

        // 2. Llenamos el objeto con sus relaciones
        nuevoTratamiento.setPaciente(paciente);
        nuevoTratamiento.setOdontologo(odontologo);
        nuevoTratamiento.setCatalogo(servicio);

        // 3. Valores por defecto financieros
        nuevoTratamiento.setEstado("pendiente_pago");
        nuevoTratamiento.setAbonado(0.0);
        nuevoTratamiento.setFechaCreacion(LocalDateTime.now());
        nuevoTratamiento.setObservaciones(dto.getObservaciones());

        if ("especifico".equals(dto.getTipo_aplicacion())) {
            nuevoTratamiento.setDiente(dto.getDiente());
        } else {
            nuevoTratamiento.setDiente(null);
        }

        // 5. Guardamos en la base de datos
        tratamientosRepository.save(nuevoTratamiento);

        return ResponseEntity.ok("{\"mensaje\": \"Tratamiento registrado con éxito\"}");
    }
}