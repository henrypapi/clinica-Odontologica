package com.Clinica.Controller;
import com.Clinica.Model.Odontograma;
import com.Clinica.Repository.OdontogramaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/odontogramas")
@CrossOrigin(origins = "http://localhost:4200")
public class OdontogramaController {

    // ¡AQUÍ DECLARAMOS (INYECTAMOS) LA INTERFAZ!
    // Spring le asignará la clase mágica que creó por detrás.
    @Autowired
    private OdontogramaRepository odontogramaRepository;

    // Endpoint para buscar todos los odontogramas de un paciente
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<Odontograma>> obtenerPorPaciente(@PathVariable Integer idPaciente) {
        // Usamos el método que definimos en la interfaz
        List<Odontograma> odontogramas = odontogramaRepository.findByPaciente_IdPaciente(idPaciente);
        return ResponseEntity.ok(odontogramas);
    }

    // Endpoint para guardar un nuevo odontograma con sus dientes pintados
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

        // Ahora sí, guardamos tranquilamente. El cascade hará el resto.
        Odontograma guardado = odontogramaRepository.save(nuevoOdontograma);
        return ResponseEntity.ok(guardado);
    }
}
