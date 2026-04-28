package com.Clinica.Controller;

import com.Clinica.Model.Citas;
import com.Clinica.Repository.CitasRepository;
import java.sql.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = {"http://localhost:4200", "https://clinica-odontologica-hazel.vercel.app"})
public class CitasController {

    @Autowired
    private CitasRepository citasRepository;

    @GetMapping
    public ResponseEntity<List<Citas>> obtenerTodasLasCitas() {
        List<Citas> citas = citasRepository.findAll();
        return ResponseEntity.ok(citas);
    }

    @PostMapping
    public ResponseEntity<Citas> registrarCita(@RequestBody Citas nuevaCita) {
        if (nuevaCita.getEstado() == null || nuevaCita.getEstado().isEmpty()) {
            nuevaCita.setEstado("programada");
        }
        
        Citas citaGuardada = citasRepository.save(nuevaCita);
        return ResponseEntity.ok(citaGuardada);
    }
    
@GetMapping("/paciente/{id}")
    public ResponseEntity<List<Citas>> obtenerCitasPorPaciente(@PathVariable("id") Integer idPaciente) {
        // Atrapamos el {id} de la URL y se lo pasamos al repositorio
        List<Citas> citas_por_paciente = citasRepository.findByPaciente_IdPaciente(idPaciente);
        return ResponseEntity.ok(citas_por_paciente);
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoCita(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        
        // 1. Extraemos el texto del JSON que envió Angular
        String nuevoEstado = payload.get("estado");
        
        if (nuevoEstado == null || nuevoEstado.isEmpty()) {
            return ResponseEntity.badRequest().body("El estado no puede estar vacío");
        }

        // 2. Buscamos la cita exacta en la base de datos
        Optional<Citas> citaOptional = citasRepository.findById(id);

        if (citaOptional.isPresent()) {
            Citas citas = citaOptional.get();
            
            // 3. Modificamos únicamente el estado
            citas.setEstado(nuevoEstado);
            
            // 4. Guardamos los cambios. JPA es inteligente y hará un UPDATE en vez de un INSERT
            citasRepository.save(citas);
            
            // 5. Le respondemos a Angular que todo salió "OK" (Código 200)
            return ResponseEntity.ok().body("{\"mensaje\": \"Estado actualizado correctamente\"}");
        } else {
            // Si el ID no existe, enviamos un error 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }
}