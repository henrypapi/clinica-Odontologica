package com.Clinica.Controller;

import com.Clinica.Dto.AgendaDTO;
import com.Clinica.Dto.DashboardDTO;
import com.Clinica.Dto.DemandaServicioProjection;
import com.Clinica.Model.Citas;
import com.Clinica.Repository.CitasRepository;
import com.Clinica.Repository.PacienteRepository;
import com.Clinica.Repository.TratamientosRepository;
import com.Clinica.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:4200", "https://clinica-odontologica-hazel.vercel.app"})
public class DashboardController {

    @Autowired
    private TratamientosRepository tratamientosRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired private CitasRepository citasRepository;
    @Autowired private PacienteRepository pacienteRepository;
    
    

    @GetMapping("/resumen")
    public ResponseEntity<DashboardDTO> obtenerResumenGerencial() {
        DashboardDTO dashboard = new DashboardDTO();
        
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioDia = hoy.atStartOfDay(); 
        LocalDateTime finDia = hoy.atTime(23, 59, 59);
        int mesActual = hoy.getMonthValue();
        int anioActual = hoy.getYear();
        
        Double ingresos = tratamientosRepository.sumarIngresosDelMes(mesActual, anioActual);
        dashboard.setIngresosMes(ingresos);

        Long citasHoy = citasRepository.countByFechaHoraBetween(inicioDia, finDia);
        dashboard.setCitasHoy(citasHoy);
        dashboard.setPacientesTotales(120L); 
        
        List<String> rolesStaff = Arrays.asList("admin", "empleado");

        Long personalActivo = usuarioRepository.countByRolInAndActivo(rolesStaff, "true");
        
        dashboard.setOdontologosActivos(personalActivo); 
        dashboard.setStaffActivo(personalActivo);
        
        
        Long totalPacientes = pacienteRepository.count();
        dashboard.setPacientesTotales(totalPacientes);
        List<Double> historialIngresos = new ArrayList<>();
       
        for (int i = 5; i >= 0; i--) {
            LocalDate mesEvaluado = hoy.minusMonths(i);
            Double ingreso = tratamientosRepository.sumarIngresosDelMes(mesEvaluado.getMonthValue(), mesEvaluado.getYear());
            
            historialIngresos.add(ingreso != null ? ingreso : 0.0);
        }
        dashboard.setIngresosGrafico(historialIngresos);
        
        List<DemandaServicioProjection> demanda = tratamientosRepository.obtenerDemandaServicios();
        
        List<String> labelsServicios = new ArrayList<>();
        List<Integer> dataServicios = new ArrayList<>();
        int limite = Math.min(demanda.size(), 5); 
        for (int i = 0; i < limite; i++) {
            DemandaServicioProjection d = demanda.get(i);
            labelsServicios.add(d.getNombre());
            dataServicios.add(d.getCantidad().intValue());
        }
        
        // 🌟 1. Traemos las citas de hoy
        List<Citas> citasDeHoy = citasRepository.findByFechaHoraBetweenOrderByFechaHoraAsc(inicioDia, finDia);
        
        List<AgendaDTO> agendaFormateada = new ArrayList<>();
        DateTimeFormatter formatoHora = DateTimeFormatter.ofPattern("hh:mm a");

        // 🌟 2. Llenamos la lista usando el objeto AgendaDTO directamente
        for (Citas cita : citasDeHoy) {
            AgendaDTO fila = new AgendaDTO(); // 👈 Creamos el objeto real, NO un HashMap
            
            // Seteamos los valores usando los nombres de tus variables en AgendaDTO
            fila.setHora(cita.getFechaHora().format(formatoHora));
            
            // Paciente
            String nombreP = cita.getPaciente().getPersona().getNombres() + " " + cita.getPaciente().getPersona().getApellidos();
            fila.setPaciente(nombreP);
            
            // Doctor
            String nombreD = (cita.getOdontologo() != null) ? 
                             cita.getOdontologo().getPersona().getNombres() : "Sin asignar";
            fila.setDoctor(nombreD);
            
            // Servicio
            String nombreS = (cita.getCatalogo_servicios() != null) ? 
                             cita.getCatalogo_servicios().getNombre() : "Consulta General";
            fila.setServicio(nombreS);
            
            // Estado
            fila.setEstado(cita.getEstado());
            
            // Lo añadimos a la lista (ahora sí son del mismo tipo)
            agendaFormateada.add(fila);
        }

        dashboard.setAgenda(agendaFormateada);
        
        dashboard.setServiciosLabels(labelsServicios);
        dashboard.setServiciosData(dataServicios);
        return ResponseEntity.ok(dashboard);
        
    }
}