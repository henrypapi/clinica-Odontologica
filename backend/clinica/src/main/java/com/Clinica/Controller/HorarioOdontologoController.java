package com.Clinica.Controller;

import com.Clinica.Model.HorarioOdontologo;
import com.Clinica.Repository.HorarioOdontologoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioOdontologoController {

    @Autowired
    private HorarioOdontologoRepository horarioRepository;

    @GetMapping("/odontologo/{idOdontologo}/dia/{diaSemana}")
    public ResponseEntity<List<HorarioOdontologo>> obtenerHorarioDoctorPorDia(
            @PathVariable Integer idOdontologo,
            @PathVariable Integer diaSemana) {
        List<HorarioOdontologo> horarios = horarioRepository.findByOdontologo_IdUsuarioAndDiaSemana(idOdontologo, diaSemana);
        
        return ResponseEntity.ok(horarios);
    }
}