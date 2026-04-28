package com.Clinica.Controller;

import com.Clinica.Model.Catalogo_servicios;
import com.Clinica.Repository.CatalogoServiciosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios") // La ruta exacta que pusimos en citas.service.ts
@CrossOrigin(origins = {"http://localhost:4200", "https://clinica-odontologica-hazel.vercel.app"})
public class CatalogoServiciosController {

    @Autowired
    private CatalogoServiciosRepository catalogoServiciosRepository;

    @GetMapping
    public ResponseEntity<List<Catalogo_servicios>> obtenerTodosLosServicios() {
        // Va a la base de datos, trae todos los servicios y los devuelve como JSON
        List<Catalogo_servicios> servicios = catalogoServiciosRepository.findAll();
        return ResponseEntity.ok(servicios);
    }
}