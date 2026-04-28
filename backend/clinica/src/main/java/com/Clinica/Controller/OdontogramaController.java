package com.Clinica.Controller;
import com.Clinica.Model.Odontograma;
import com.Clinica.Repository.OdontogramaRepository;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/odontogramas")
@CrossOrigin(origins = "http://localhost:4200")
public class OdontogramaController {
    @Autowired
    private OdontogramaRepository odontogramaRepository;
    @PostMapping("/guardar")
    public ResponseEntity<Odontograma> guardarOdontograma(@RequestBody Odontograma nuevoOdontograma) {
        
        // --- EL TRUCO VITAL ---
        // Antes de guardar, recorremos todos los dientes (detalles) que envió Angular
        // y le decimos a cada uno: "Oye, tú perteneces a este odontograma".
        if (nuevoOdontograma.getDetalles() != null) {
            for (com.Clinica.Model.DetalleOdontograma detalle : nuevoOdontograma.getDetalles()) {
                detalle.setOdontograma(nuevoOdontograma);
            }
        }
        // -----------------------
        nuevoOdontograma.setFechaEvaluacion(LocalDateTime.now(ZoneId.of("America/Lima")));
            
            // (Opcional) Si la fecha también va en los detalles, puedes hacer un forEach aquí
            // if (odontograma.getDetalles() != null) {
            //    odontograma.getDetalles().forEach(detalle -> detalle.setOdontograma(odontograma));
            // }
        // Ahora sí, guardamos tranquilamente. El cascade hará el resto.
        Odontograma guardado = odontogramaRepository.save(nuevoOdontograma);
        return ResponseEntity.ok(guardado);
    }
    
    // Endpoint para buscar el historial por ID de paciente
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<Odontograma>> obtenerHistorialPorPaciente(@PathVariable Long idPaciente) {
        List<Odontograma> historial = odontogramaRepository.findByPaciente_IdPaciente(idPaciente);
        return ResponseEntity.ok(historial);
    }
}
