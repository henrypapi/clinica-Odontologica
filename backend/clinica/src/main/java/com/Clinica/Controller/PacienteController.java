package com.Clinica.Controller;

import com.Clinica.Model.Paciente;
import com.Clinica.Repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:4200") // Permiso para tu Angular
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;

    // Endpoint para obtener la lista completa de pacientes
    @GetMapping
    public ResponseEntity<List<Paciente>> obtenerTodosLosPacientes() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        return ResponseEntity.ok(pacientes);
    }
    @PostMapping
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente nuevoPaciente) {
        // Spring Data JPA tomará el JSON, lo convertirá a tu clase Paciente 
        // y lo guardará en la base de datos
        Paciente pacienteGuardado = pacienteRepository.save(nuevoPaciente);
        return ResponseEntity.ok(pacienteGuardado);
    }
}