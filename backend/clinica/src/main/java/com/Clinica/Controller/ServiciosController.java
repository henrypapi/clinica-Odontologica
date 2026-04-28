package com.Clinica.Controller;

import com.Clinica.Model.Catalogo_servicios;
import com.Clinica.Repository.CatalogoServiciosRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "http://localhost:4200")
public class ServiciosController {
    @Autowired
    CatalogoServiciosRepository catalogoRepository;
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarServicio(@PathVariable Integer id, @RequestBody Catalogo_servicios servicioActualizado) {
        
        Optional<Catalogo_servicios> servicioOpt = catalogoRepository.findById(id);
        
        if (!servicioOpt.isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Servicio no encontrado\"}");
        }
        
        Catalogo_servicios servicio = servicioOpt.get();
        
        if (servicioActualizado.getNombre() != null) servicio.setNombre(servicioActualizado.getNombre());
        if (servicioActualizado.getDescripcion() != null) servicio.setDescripcion(servicioActualizado.getDescripcion());
        if (servicioActualizado.getPrecio_base()!= null) servicio.setPrecio_base(servicioActualizado.getPrecio_base());
        if (servicioActualizado.getDuracion_minutos() != null) servicio.setDuracion_minutos(servicioActualizado.getDuracion_minutos());
        
        catalogoRepository.save(servicio);
        
        return ResponseEntity.ok("{\"mensaje\": \"Servicio actualizado con éxito\"}");
    }
    @PostMapping
    public ResponseEntity<?> crearServicio(@RequestBody Catalogo_servicios nuevoServicio) {
        try {
            catalogoRepository.save(nuevoServicio);
            
            return ResponseEntity.ok("{\"mensaje\": \"Nuevo servicio agregado al catálogo con éxito\"}");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Error al guardar el servicio: " + e.getMessage() + "\"}");
        }
    }
}
