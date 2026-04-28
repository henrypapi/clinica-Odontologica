package com.Clinica.Controller;

import com.Clinica.Dto.PagoDto;
import com.Clinica.Model.Pago;
import com.Clinica.Model.Tratamientos;
import com.Clinica.Repository.PagosRepository;
import com.Clinica.Repository.TratamientosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = {"http://localhost:4200", "https://clinica-odontologica-hazel.vercel.app"})
public class PagosController {

    @Autowired
    private PagosRepository pagosRepository;

    @Autowired
    private TratamientosRepository tratamientosRepository;

    // 🌟 El @Transactional garantiza que si algo falla, no se guarda nada a medias
    @PostMapping
    @Transactional
    public ResponseEntity<?> registrarNuevoPago(@RequestBody PagoDto pagoDto) {
        
        // 1. Buscamos el tratamiento al que le vamos a sumar dinero
        Optional<Tratamientos> tratOptional = tratamientosRepository.findById(pagoDto.getId_tratamiento());
        
        if (!tratOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Tratamiento no encontrado");
        }
        
        Tratamientos tratamiento = tratOptional.get();

        // 2. CREAMOS EL RECIBO DE PAGO (Asumiendo que tienes tu entidad Pago mapeada)
        Pago nuevoPago = new Pago();
        nuevoPago.setMonto(pagoDto.getMonto());
        
        // 🚨 OJO: Si en tu Entidad Pago tienes la relación como objeto (Ej: private Tratamientos tratamiento), 
        // debes hacer nuevoPago.setTratamiento(tratamiento). 
        // Si lo tienes como entero directo, usa el ID.
        nuevoPago.setTratamiento(tratamiento); 
        
        // Lo mismo aplica para Paciente. Asumiendo que tienes paciente en la entidad Pago:
        nuevoPago.setPaciente(tratamiento.getPaciente()); 
        
        nuevoPago.setMetodo_pago(pagoDto.getMetodo_pago());
        nuevoPago.setFecha_pago(LocalDateTime.now());
        
        pagosRepository.save(nuevoPago);

        // 3. ACTUALIZAMOS EL TRATAMIENTO (El acumulador)
        double nuevoAbonado = tratamiento.getAbonado() + pagoDto.getMonto();
        tratamiento.setAbonado(nuevoAbonado);

        // 4. LÓGICA DE NEGOCIO: ¿Ya terminó de pagar?
        double costoTotal = tratamiento.getCatalogo().getPrecio_base();
        if (nuevoAbonado >= costoTotal) {
            tratamiento.setEstado("pagado");
        } else {
            tratamiento.setEstado("pendiente_pago");
        }

        tratamientosRepository.save(tratamiento);

        // 5. Respondemos éxito
        return ResponseEntity.ok("{\"mensaje\": \"Pago registrado y tratamiento actualizado con éxito\"}");
    }
}